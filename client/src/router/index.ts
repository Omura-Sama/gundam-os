import { createRouter, createWebHistory } from 'vue-router';
// Import views lazily
const HomeView = () => import('../views/HomeView.vue');
const LoginView = () => import('../views/LoginView.vue');

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        }
    ]
});

// Simple Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('gundam_jwt');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.name === 'login' && token) {
        next('/');
    } else {
        next();
    }
});

export default router;
