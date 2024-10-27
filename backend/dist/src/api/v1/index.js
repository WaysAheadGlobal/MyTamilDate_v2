"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./admin"));
const auth_1 = __importDefault(require("./auth/auth"));
const customer_1 = __importDefault(require("./customer"));
const media_1 = __importDefault(require("./media"));
const v1 = (0, express_1.Router)();
v1.use('/admin', (0, express_1.json)({ limit: '15mb' }), admin_1.default);
v1.use('/user', (0, express_1.json)({ limit: '15mb' }), auth_1.default);
v1.use('/customer', customer_1.default);
v1.use('/media', (0, express_1.json)({ limit: '15mb' }), media_1.default);
exports.default = v1;
