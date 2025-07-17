"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Something went wrong. Please try again later.',
    });
};
