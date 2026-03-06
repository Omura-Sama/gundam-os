"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kernel_1 = require("./core/kernel");
const kernel = new kernel_1.GundamKernel();
// API Root endpoint
kernel.app.get('/', (req, res) => {
    res.json({
        system: 'Gundam-OS',
        status: 'online',
        version: '1.0.0'
    });
});
kernel.boot(3000);
