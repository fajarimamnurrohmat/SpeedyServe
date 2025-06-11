<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Dashboard</h2>
      <p class="text-gray-500">Selamat datang di sistem pencatatan penjualan</p>
    </div>

    <!-- Notifikasi Progres -->
    <div
      class="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg mb-6 shadow-sm"
    >
      <p class="text-yellow-800 font-semibold">
        ⚠️ Halaman dashboard ini masih dalam proses pengerjaan.
      </p>
    </div>

    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stat-card">
        <p class="text-gray-500">Total Menu</p>
        <p class="text-2xl font-bold text-gray-800">{{ totalMenu }}</p>
      </div>

      <div class="stat-card">
        <p class="text-gray-500">Menu Tersedia</p>
        <p class="text-2xl font-bold text-gray-800">{{ menuTersedia }}</p>
      </div>

      <div class="stat-card">
        <p class="text-gray-500">Total Order Hari Ini</p>
        <p class="text-2xl font-bold text-gray-800">{{ totalOrder }}</p>
      </div>
    </div>

    <!-- Grafik Placeholder -->
    <div class="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Grafik Penjualan Mingguan
      </h3>
      <div
        class="h-48 flex items-center justify-center text-gray-400 border border-dashed rounded-lg"
      >
        Grafik segera hadir...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      totalMenu: "--", // Ganti dengan data real dari API nanti
      menuTersedia: "--",
      totalOrder: "--",
    };
  },
  mounted() {
    // Nanti fetch data dari API di sini
    // Contoh dummy:
    this.totalMenu = 23;
    this.menuTersedia = 18;
    this.totalOrder = 9;
  },
};
</script>

<style scoped>
.stat-card {
  @apply bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition;
}
</style>
