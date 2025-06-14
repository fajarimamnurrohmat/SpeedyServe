<template>
  <div class="container">
    <div class="header">
      <h2 class="title">Dashboard</h2>
      <p class="subtitle">Selamat datang di sistem pencatatan penjualan</p>
    </div>

    <!-- Notifikasi Progres -->
    <div class="notification">
      <p class="notification-text">
        📊 Dashboard live! Data penjualan kini tersaji.
      </p>
    </div>

    <!-- Statistik Cards -->
    <div class="stat-cards">
      <div class="stat-card">
        <h3 class="chart-title">Grafik Pesanan</h3>
        <canvas id="orderStatusChart"></canvas>
        <p class="chart-description">Total pesanan: {{ totalOrder }}</p>
      </div>
      <div class="stat-card">
        <h3 class="chart-title">Grafik Menu</h3>
        <canvas id="menuPieChart"></canvas>
        <p class="chart-description">Total menu: {{ totalMenu }}</p>
      </div>
    </div>

    <!-- Grafik Penjualan Bulanan sebagai Card Kecil -->
    <div class="chart-card">
      <h3 class="chart-title">Grafik Pendapatan Bulanan</h3>
      <div class="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "Dashboard",
  data() {
    return {
      totalMenu: 0,
      menuTersedia: 0,
      totalOrder: 0,
      transactions: [],
      menuChart: null,
      orderStatusChart: null,
      salesChart: null,
      products: [],
      orders: [],
      orderStatus: {}, // Inisialisasi sebagai objek kosong
    };
  },
  methods: {
    async fetchTransactions() {
      const userLevel = localStorage.getItem("userLevel");
      if (userLevel !== "3") {
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://speedyservebe-production.up.railway.app/transaksi",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.transactions = response.data.data.transactions || [];
        console.log("Data Transactions:", this.transactions);
        this.updateSalesChart();
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
      }
    },
    async fetchMenu() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://speedyservebe-production.up.railway.app/menu",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.products = response.data.data.menu.reverse() || [];
        console.log("Data Menu:", this.products);
        this.calculateMenuStats();
        this.updateMenuChart();
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      }
    },
    async fetchOrders() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://speedyservebe-production.up.railway.app/order",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.orders = response.data.data.orders || [];
        console.log("Data Orders:", this.orders);
        this.calculateOrderStats();
        this.updateOrderStatusChart();
      } catch (error) {
        console.error("Gagal mengambil data order:", error);
      }
    },
    calculateMenuStats() {
      this.totalMenu = this.products.length;
      this.menuTersedia = this.products.filter(
        (product) => product.tersedia
      ).length;
    },
    calculateOrderStats() {
      this.totalOrder = this.orders.length;
      this.orderStatus = {}; // Reset orderStatus setiap kali dihitung
      this.orders.forEach((order) => {
        const status = order.status_order || "Tidak Diketahui"; // Handle jika status null/undefined
        if (!this.orderStatus[status]) {
          this.orderStatus[status] = 0;
        }
        this.orderStatus[status]++;
      });
      console.log("Order Status:", this.orderStatus); // Debug
    },
    processMonthlyData() {
      const monthlyData = {};
      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.waktu);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += transaction.total_harga || 0;
      });

      const sortedMonths = Object.keys(monthlyData).sort();
      const labels = sortedMonths.map((monthYear) => {
        const [year, month] = monthYear.split("-");
        return new Date(year, month - 1).toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        });
      });
      const data = sortedMonths.map((monthYear) => monthlyData[monthYear]);

      return { labels, data };
    },
    updateMenuChart() {
      const ctx = document.getElementById("menuPieChart").getContext("2d");
      if (this.menuChart) {
        this.menuChart.destroy();
      }

      if (this.totalMenu === 0) {
        this.menuChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Tidak Ada Data"],
            datasets: [
              {
                data: [1],
                backgroundColor: ["#D1D5DB"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          },
        });
        return;
      }

      this.menuChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Menu Tersedia", "Menu Habis"],
          datasets: [
            {
              data: [this.menuTersedia, this.totalMenu - this.menuTersedia],
              backgroundColor: ["#10B981", "#EF4444"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 12,
                },
                color: "#4B5563",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  let value = context.parsed || 0;
                  return `${label}: ${value} (${(
                    (value / this.totalMenu) *
                    100
                  ).toFixed(1)}%)`;
                }.bind(this),
              },
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
            },
          },
        },
      });
    },
    updateOrderStatusChart() {
      const ctx = document.getElementById("orderStatusChart").getContext("2d");
      if (this.orderStatusChart) {
        this.orderStatusChart.destroy();
      }

      if (this.totalOrder === 0) {
        this.orderStatusChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Tidak Ada Data"],
            datasets: [
              {
                data: [1],
                backgroundColor: ["#D1D5DB"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          },
        });
        return;
      }

      const orderLabels = Object.keys(this.orderStatus);
      const orderData = orderLabels.map((status) => this.orderStatus[status]);

      this.orderStatusChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: orderLabels,
          datasets: [
            {
              data: orderData,
              backgroundColor: ["#059669", "#FACC15"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 12,
                },
                color: "#4B5563",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  let value = context.parsed || 0;
                  return `${label}: ${value} (${(
                    (value / this.totalOrder) *
                    100
                  ).toFixed(1)}%)`;
                }.bind(this),
              },
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
            },
          },
        },
      });
    },
    updateSalesChart() {
      const { labels, data } = this.processMonthlyData();
      const ctx = document.getElementById("salesChart").getContext("2d");

      if (this.salesChart) {
        this.salesChart.destroy();
      }

      this.salesChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels.length > 0 ? labels : ["Tidak Ada Data"],
          datasets: [
            {
              label: "Pendapatan (Rp)",
              data: data.length > 0 ? data : [0],
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Pendapatan (Rp)",
                font: {
                  size: 12,
                },
              },
              ticks: {
                callback: function (value) {
                  const ranges = [
                    0, 5000000, 10000000, 20000000, 40000000, 60000000,
                  ];
                  const labels = [
                    "0 jt",
                    "5 jt",
                    "10 jt",
                    "20 jt",
                    "40 jt",
                    "60 jt",
                  ];
                  const closest = ranges.reduce((prev, curr) =>
                    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
                  );
                  const index = ranges.indexOf(closest);
                  return labels[index] || "Rp " + value.toLocaleString("id-ID");
                },
                min: 0,
                max: 60000000,
                font: {
                  size: 10,
                },
              },
              suggestedMax: 60000000,
            },
            x: {
              title: {
                display: true,
                text: "Bulan",
                font: {
                  size: 12,
                },
              },
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (context) {
                  return `Rp ${context.parsed.y.toLocaleString("id-ID")}`;
                },
              },
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.fetchTransactions();
    this.fetchMenu();
    this.fetchOrders();
  },
};
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.header {
  margin-bottom: 1.5rem;
}

.title {
  color: green;
  font-size: 1.875rem;
  font-weight: bold;
  text-align: left;
  font-family: "Poppins", sans-serif;
}

.subtitle {
  color: #6b7280;
  text-align: left;
  font-family: "Poppins", sans-serif;
}

.notification {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.notification-text {
  color: #92400e;
  font-weight: 600;
}

.stat-cards {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Dua kolom untuk menu dan order status pie chart */
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s;
  height: 300px; /* Tingkatkan tinggi untuk memberikan ruang lebih */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.stat-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b5563;
}

.chart-card {
  margin-top: 2rem;
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.chart-container {
  position: relative;
  height: 15rem;
  width: 100%;
}

.chart-description {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  margin-top: 0.5rem;
  font-family: "Poppins", sans-serif;
}

#salesChart {
  width: 100%;
  height: 100%;
}

#menuPieChart {
  max-height: 180px;
  max-width: 100%;
  flex-grow: 1;
}

#orderStatusChart {
  max-height: 180px;
  max-width: 100%;
  flex-grow: 1;
}
</style>