"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.default();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth_middleware_1.authenticate, authController.getMe);
router.post('/refresh', authController.refreshToken);
exports.default = router;
