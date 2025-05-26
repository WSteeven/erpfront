import {RouteRecordRaw} from 'vue-router';

const rutasAppenate: RouteRecordRaw[] = [
    {
        path: '/progresivas',
        name: 'progresivas',
        component: () =>
            import('pages/appenate/telconet/progresivas/view/ProgresivaPage.vue'),
        meta: { requiresAuth: true }
    },
]


export default rutasAppenate