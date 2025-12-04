import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Use jsdom for browser-like environment
        environment: 'jsdom',

        // Test file patterns
        include: ['tests/**/*.test.js'],

        // Global test setup
        globals: true,

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['js/modules/**/*.js'],
            exclude: [
                'js/modules/dom.js', // Requires full DOM
                'js/modules/engine.js', // Complex integration, will be tested separately
                'js/modules/network.js', // Requires WebRTC APIs
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 70,
                statements: 70,
            },
        },

        // Test timeout
        testTimeout: 5000,
    },

    // Resolve aliases to match project structure
    resolve: {
        alias: {
            '@': '/js',
        },
    },
});
