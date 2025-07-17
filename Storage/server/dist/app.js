"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = require("./config/db.config");
const redis_config_1 = require("./config/redis.config");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:8081' }));
// Routes
app.use('/auth', auth_route_1.default);
// Error handling middleware
app.use(error_middleware_1.default);
// Initialize services
const initializeServices = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([(0, db_config_1.connectDB)(), (0, redis_config_1.connectRedis)()]);
        console.log('Services connected successfully');
        // Start server
        app.listen(3000, '0.0.0.0', () => {
            console.log('Server started at http://localhost:3000');
        });
    }
    catch (error) {
        console.error('Failed to initialize services:', error);
        process.exit(1);
    }
});
initializeServices();
