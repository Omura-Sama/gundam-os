import { createRouter, createWebHistory } from 'vue-router';
// Import views lazily
const DashboardLayout = () => import('../layouts/DashboardLayout.vue');
const HomeView = () => import('../views/HomeView.vue');
const LoginView = () => import('../views/LoginView.vue');
const PilotRosterView = () => import('../views/modules/PilotRosterView.vue');
const SalesProcurementView = () => import('../views/modules/SalesProcurementView.vue');

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
            component: DashboardLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'module/pilot-roster',
                    name: 'pilot-roster',
                    component: PilotRosterView
                },
                {
                    path: 'module/sales-procurement',
                    name: 'sales-procurement',
                    component: SalesProcurementView
                },
                {
                    path: 'module/:id',
                    name: 'module-dynamic',
                    component: () => import('../views/modules/ModuleTemplateView.vue')
                }
            ]
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
