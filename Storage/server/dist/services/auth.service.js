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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
class AuthService {
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.create({ name, email, password });
            user.password = '';
            return user;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({ email });
            if (!user) {
                throw { status: 401, message: 'User not found' };
            }
            if (password !== user.password) {
                throw { status: 400, message: 'Password is incorrect' };
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, '1234', { expiresIn: '1m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, '1234', { expiresIn: '30d' });
            user.refreshToken = refreshToken;
            yield user.save();
            return {
                msg: 'Login successful',
                accessToken,
                refreshToken,
                id: user._id,
            };
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw { status: 401, message: 'Refresh token missing' };
            }
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(refreshToken, '1234', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject({ status: 403, message: 'Invalid refresh token' });
                    }
                    const user = yield user_model_1.User.findById(decoded.id);
                    if (!user || user.refreshToken !== refreshToken) {
                        return reject({ status: 403, message: 'Unauthorized' });
                    }
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: user._id }, '1234', { expiresIn: '1m' });
                    resolve(newAccessToken);
                }));
            });
        });
    }
}
exports.default = AuthService;
