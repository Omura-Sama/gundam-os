"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GundamKernel = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
class GundamKernel {
    app;
    modules = new Map();
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
    }
    registerModule(module) {
        if (this.modules.has(module.name)) {
            console.warn(`Module ${module.name} is already registered.`);
            return;
        }
        module.init(this.app, db_1.default);
        this.modules.set(module.name, module);
        console.log(`[kernel] Striker Pack loaded: ${module.name} (v${module.version})`);
    }
    boot(port = 3000) {
        this.app.listen(port, () => {
            console.log(`[kernel] Gundam-OS launched. Listening on port ${port}`);
        });
    }
}
exports.GundamKernel = GundamKernel;
