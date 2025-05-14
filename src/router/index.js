import { createWebHistory, createRouter } from "vue-router";
import axios from "axios"; // Untuk refresh token

import LandingPage from "../components/landing_page.vue";
import Login from "../components/login.vue";
import MainSidebar from "../components/sidebar/main.vue";
import Category from "../components/sidebar/category.vue";
import Product from "../components/sidebar/product.vue";
import Order from "../components/sidebar/order.vue";
import Detailorder from "../components/sidebar/detail_order.vue";
import Transaksi from "../components/sidebar/transaksi.vue";
import Dashboard from "../components/sidebar/dashboard.vue"

// Flag agar interval token tidak dijalankan berulang
let tokenRefreshStarted = false;

// Fungsi untuk memulai interval refresh token
function startTokenRefresh() {
  const tokenAge = 50; // waktu hidup token (detik)
  const refreshTime = (tokenAge - 10) * 1000; // milidetik

  console.log("Starting token refresh interval...");

  setInterval(async () => {
    try {
      console.log("Refreshing access token...");
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.put(
        "http://localhost:3000/authentications",
        { refreshToken }
      );

      if (response.data.status === "success") {
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        console.log("Access token updated:", accessToken);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }, refreshTime);
}

const routes = [
  {
    path: "/",
    component: LandingPage,
  },
  {
    path: "/login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        next("/mainsidebar"); // Sudah login, redirect ke mainsidebar
      } else {
        next(); // Belum login, tetap ke login
      }
    },
  },
  {
    path: "/mainsidebar",
    component: MainSidebar,
    beforeEnter: (to, from, next) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        if (!tokenRefreshStarted) {
          tokenRefreshStarted = true;
          startTokenRefresh(); // Mulai refresh token jika belum jalan
        }
        next();
      } else {
        next({ path: "/login" }); // Jika tidak ada token, kembali ke login
      }
    },
    children: [
      {
        path: "dashboard",
        component: Dashboard,
      },
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
