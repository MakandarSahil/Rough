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
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const user = yield this.authService.register(name, email, password);
                res.status(201).json({ msg: 'User Registered Successfully', data: user });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Internal server error' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.authService.login(email, password);
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                res.status(error.status || 500).json({ msg: error.message || 'Internal server error' });
            }
        });
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ msg: 'Unauthorized' });
                }
                res.status(200).json({
                    msg: 'User fetched successfully',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Internal server error' });
            }
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const accessToken = yield this.authService.refreshToken(refreshToken);
                res.status(200).json({
                    msg: 'New access token issued',
                    accessToken,
                });
            }
            catch (error) {
                console.error(error);
                res.status(error.status || 500).json({ msg: error.message || 'Internal server error' });
            }
        });
        this.authService = new auth_service_1.default();
    }
}
exports.default = AuthController;
