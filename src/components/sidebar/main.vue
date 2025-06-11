<template>
  <header>
    <!-- Navbar -->
    <nav id="main-navbar" class="navbar fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">
          <div class="name_brand">SpeedyServe</div>
          <div class="name_desc">NaSgOr MbK InDaH</div>
        </a>
        <i
          class="fas fa-bars"
          style="color: #e6df1d"
          @click="toggleSidebar"
        ></i>
      </div>
    </nav>

    <!-- Sidebar -->
    <nav id="sidebarMenu" :class="{ show: sidebarOpen }" class="sidebar">
      <div class="sidebar-content">
        <router-link
          to="/mainsidebar/dashboard"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link
          to="/mainsidebar/order"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-shopping-cart"></i>
          <span>Pesanan</span>
        </router-link>
        <router-link
          to="/mainsidebar/detailorder"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-clipboard-list"></i>
          <span>Daftar Pesanan</span>
        </router-link>
        <router-link
          to="/mainsidebar/category"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-th"></i>
          <span>Kategori</span>
        </router-link>
        <router-link
          to="/mainsidebar/produk"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-utensils"></i>
          <span>Menu</span>
        </router-link>
        <router-link
          to="/mainsidebar/transaksi"
          class="sidebar-item"
          @click="closeSidebar"
        >
          <i class="fas fa-chart-line"></i>
          <span>Data Penjualan</span>
        </router-link>
      </div>

      <div class="logout-section">
        <a class="logout" href="#" @click.prevent="handleLogout">
          <i class="fas fa-sign-out-alt" style="color: red"></i>
          <span style="color: red">Keluar</span>
        </a>
      </div>
    </nav>
  </header>

  <main :style="{ marginLeft: sidebarOpen ? '250px' : '0' }">
    <div class="container pt-4">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      sidebarOpen: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      if (window.innerWidth <= 991.98) {
        this.sidebarOpen = false;
      }
    },
    async handleLogout() {
      // Konfirmasi Logout menggunakan SweetAlert2
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari akun!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, keluar!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            // Kirim permintaan DELETE untuk logout dari backend
            await axios.delete("http://localhost:3000/authentications", {
              data: {
                refreshToken: refreshToken,
              },
            });

            // Setelah berhasil, hapus token dari localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Tampilkan pesan sukses
            Swal.fire({
              title: "Logout Berhasil!",
              text: "Anda telah keluar.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              // Redirect ke halaman login setelah SweetAlert ditutup
              this.$router.push("/");
            });
          } catch (error) {
            console.error("Logout gagal:", error);

            // Tampilkan pesan error
            Swal.fire({
              title: "Logout Gagal",
              text: "Terjadi kesalahan saat logout.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        } else {
          // Jika tidak ada refresh token, langsung logout
          this.$router.push("/");
        }
      }
    },
  },
};
</script>

<style>
.navbar {
  background: linear-gradient(135deg, #318407, #0b1e02);
}
.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #e6df1d;
}
.name_desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.6rem;
  color: #fbfbfb;
}

.sidebar {
  background: linear-gradient(135deg, #318407, #0b1e02);
  position: fixed;
  top: 0;
  bottom: 0;
  left: -300px;
  width: 250px;
  padding: 70px 15px 20px;
  transition: left 0.3s ease;
}
.sidebar.show {
  left: 0;
}
.sidebar-content {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  text-decoration: none;
  padding: 10px 15px;
  transition: 0.3s;
}

.sidebar-item i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar-item:hover {
  color: #e6df1d;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.logout-section {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
.logout {
  color: red;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
}
</style>
