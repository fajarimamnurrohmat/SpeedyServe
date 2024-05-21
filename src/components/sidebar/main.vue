<template>
    <!--Main Navigation-->
    <header>
      <!-- Navbar -->
      <nav
        id="main-navbar"
        class="navbar navbar-expand-lg navbar-light bg-white fixed-top"
      >
        <!-- Container wrapper -->
        <div class="container-fluid">
          <!-- Brand -->
          <a class="navbar-brand" href="#">
            <div class="name_brand">SpeedyServe</div>
            <div class="name_desc">NaSgOr MbK InDaH</div>
          </a>
          <!-- Toggle button -->
          <button @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        <!-- Container wrapper -->
      </nav>
      <!-- Navbar -->
      <!-- Sidebar -->
      <nav
        id="sidebarMenu"
        :class="{ show: sidebarOpen }"
        class="collapse d-lg-block sidebar collapse bg-white"
      >
        <div class="position-sticky">
          <div class="list-group list-group-flush mx-3 mt-5">
            <router-link
              to="/mainsidebar/pesanan"
              class="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i class="fas fa-money-bill fa-fw me-3"></i><span>Pesanan</span>
            </router-link>
            <router-link
              to="/mainsidebar/detailpesanan"
              class="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i class="fas fa-chart-line fa-fw me-3"></i
              ><span>Detail Pesanan</span>
            </router-link>
            <router-link
              to="/mainsidebar/kategori"
              class="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i class="fas fa-chart-bar fa-fw me-3"></i><span>Kategori</span>
            </router-link>
  
            <router-link
              to="/mainsidebar/barang"
              class="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i class="fas fa-chart-bar fa-fw me-3"></i
              ><span>Barang</span>
            </router-link>
            <router-link
              to="/mainsidebar/penjualan"
              class="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
            >
              <i class="fas fa-tachometer-alt fa-fw me-3"></i
              ><span>Penjualan</span>
            </router-link>
          </div>
        </div>
        <div class="logout-section">
          <a class="logout" href="#">
            <div class="name_logout" style="color: red;">Logout</div>
          </a>
        </div>
      </nav>
      <!-- Sidebar -->
    </header>
    <!--Main Navigation-->
  
    <!--Main layout-->
    <main :style="{ marginTop: sidebarOpen ? '58px' : '0' }">
      <div class="container pt-4">
        <router-view></router-view>
      </div>
    </main>
    <!--Main layout-->
  </template>
  
  <script>
  import { RouterView } from "vue-router";
  
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
    },
  };
  </script>
  
  <style>
  .name_brand {
    font-family: "Poppins", sans-serif;
    font-size: 1.2rem;
    font-weight: bold;
    color: black;
  }
  .name_desc {
    font-family: "Poppins", sans-serif;
    font-size: 0.6rem;
    color: black;
  }
  
  body {
    background-color: #fbfbfb;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    padding: 58px 0 0; /* Height of navbar */
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
    width: 270px;
    z-index: 600;
    transition: left 0.3s ease; /* Animasi saat toggler diklik */
    left: -300px; /* Sidebar secara default tersembunyi */
  }
  
  .sidebar.show {
    left: 0; /* Tampilkan sidebar saat kelas 'show' ditambahkan */
  }
  
  @media (max-width: 991.98px) {
    .sidebar {
      width: 100%;
    }
  }
  .sidebar .active {
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  }
  
  .sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: 0.5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }
  
  .list-group-item {
    margin-bottom: 40px;
  }
  
  .navbar {
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
    height: 70px;
  }
  
  .logout-section {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
  }
  
  .logout {
    display: block;
    padding: 10px 0;
    text-decoration: none;
  }
  
  @media (min-width: 991.98px) {
    main {
      padding-left: 240px;
    }
  }
  </style>
  