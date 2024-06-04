import { createWebHistory, createRouter } from "vue-router";
import LandingPage from "../components/landing_page.vue";
import Login from "../components/login.vue";
import MainSidebar from "../components/sidebar/main.vue";
import Category from "../components/sidebar/category.vue";
import Product from "../components/sidebar/product.vue";
import Order from "../components/sidebar/order.vue";
import Detailorder from "../components/sidebar/detail_order.vue";
import Transaksi from "../components/sidebar/transaksi.vue"

const routes = [
    {
        path: "/",
        component: LandingPage
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/mainsidebar",
        component: MainSidebar,
        children: [
            {
                path: "order",
                component: Order,
            },
            {
                path: "detailorder",
                component: Detailorder,
            },
            {
                path: "category",
                component: Category,
            },
            {
                path: "produk",
                component: Product,
            },
            {
                path: "transaksi",
                component: Transaksi,
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
