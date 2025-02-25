<template>
  <header>
    <!-- Navbar -->
    <nav id="main-navbar" class="navbar  fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">
          <div class="name_brand">SpeedyServe</div>
          <div class="name_desc">NaSgOr MbK InDaH</div>
        </a>
        <i class="fas fa-bars" style="color: #E6DF1D;" @click="toggleSidebar"></i>
      </div>
    </nav>
    
    <!-- Sidebar -->
    <nav id="sidebarMenu" :class="{ show: sidebarOpen }" class="sidebar">
      <div class="sidebar-content">
        <router-link to="/mainsidebar/order" class="sidebar-item" @click="closeSidebar">
          <i class="fas fa-money-bill"></i>
          <span>Pesanan</span>
        </router-link>
        <router-link to="/mainsidebar/detailorder" class="sidebar-item" @click="closeSidebar">
          <i class="fas fa-list"></i>
          <span>Daftar Pesanan</span>
        </router-link>
        <router-link to="/mainsidebar/category" class="sidebar-item" @click="closeSidebar">
          <i class="fas fa-th-large"></i>
          <span>Kategori</span>
        </router-link>
        <router-link to="/mainsidebar/produk" class="sidebar-item" @click="closeSidebar">
          <i class="fas fa-utensils"></i>
          <span>Menu</span>
        </router-link>
        <router-link to="/mainsidebar/transaksi" class="sidebar-item" @click="closeSidebar">
          <i class="fas fa-chart-line"></i>
          <span>Penjualan</span>
        </router-link>
      </div>
      <div class="logout-section">
        <a class="logout" href="#">
          <i class="fas fa-sign-out-alt" style="color: red;"></i>
          <span style="color: red;">Logout</span>
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
  },
};
</script>

<style>

.navbar {
  background: linear-gradient(135deg, #318407, #0B1E02);
}
.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #E6DF1D;
}
.name_desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.6rem;
  color: #fbfbfb;
}

.sidebar {
  background: linear-gradient(135deg, #318407, #0B1E02);
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
  color: #E6DF1D;
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
