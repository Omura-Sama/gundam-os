import { GundamKernel } from './core/kernel';

const kernel = new GundamKernel();

// API Root endpoint
kernel.app.get('/', (req, res) => {
    res.json({
        system: 'Gundam-OS',
        status: 'online',
        version: '1.0.0'
    });
});

kernel.boot(3000);
