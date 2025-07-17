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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = 'redis://localhost:6379';
        const client = (0, redis_1.createClient)({ url });
        client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
        yield client.connect();
        console.log('Redis Connected');
        return client;
    }
    catch (e) {
        console.error('Redis Connection failed', e);
        process.exit(1);
    }
});
exports.connectRedis = connectRedis;
