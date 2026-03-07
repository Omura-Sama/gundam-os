import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const gundamDarkTheme = {
    dark: true,
    colors: {
        background: '#0B1116', // Deep Dark Slate
        surface: '#121C22',
        primary: '#00E88F', // Neon Green (Online)
        secondary: '#00D1FF', // Cyan
        error: '#FF2A2A',
        info: '#1A73E8',
        success: '#00E88F',
        warning: '#F5B041'
    }
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'gundamDarkTheme',
        themes: {
            gundamDarkTheme
        }
    }
});
