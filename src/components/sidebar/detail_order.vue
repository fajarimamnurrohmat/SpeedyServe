<template>
  <div class="container_all">
    <h2 class="name_order" style="color: green;">Daftar Pesanan</h2>

    <div class="d-flex justify-content-between mb-3">
      <div class="table_controls">
        <label for="rows_per_page">Tampilkan baris:</label>
        <select v-model.number="rowsPerPage" id="rows_per_page" class="form-select">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
      <div class="search_controls">
        <label for="search">Cari:</label>
        <input
          type="text"
          v-model="searchQuery"
          id="search"
          class="form-control"
          placeholder="Cari nama pemesan..."
        />
      </div>
    </div>

    <div class="table-responsive" style="text-align: left;">
      <table class="table table-bordered table-striped mt-4">
        <thead class="table-head">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Nama Pemesan</th>
            <th scope="col">Opsi Pesanan</th>
            <th scope="col">Total</th>
            <th scope="col">Aksi</th>
            <th scope="col">Waktu</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in paginatedOrders" :key="order.id_order">
            <td>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
            <td>{{ order.nama_pemesan }}</td>
            <td>{{ order.opsi_pesanan }}</td>
            <td>Rp{{ order.total_harga.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="showDetail(order)">Detail</button>
            </td>
            <td>{{ formatTimeOnly(order.waktu) }}</td>
            <td>{{ order.status_order }}</td>
          </tr>
          <tr v-if="paginatedOrders.length === 0">
            <td colspan="7" class="text-center">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        Menampilkan {{ (currentPage - 1) * rowsPerPage + 1 }} -
        {{ Math.min(currentPage * rowsPerPage, totalFiltered) }} dari {{ totalFiltered }} pesanan
      </div>
      <div>
        <button
          class="btn btn-secondary btn-sm me-2"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Sebelumnya
        </button>
        <button
          class="btn btn-secondary btn-sm"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedOrder"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Pesanan - {{ selectedOrder.nama_pemesan }}</h5>
            <button type="button" class="btn-close" @click="selectedOrder = null"></button>
          </div>
          <div class="modal-body">
            <p><strong>No HP:</strong> {{ selectedOrder.no_hp }}</p>
            <p><strong>Opsi Pesanan:</strong> {{ selectedOrder.opsi_pesanan }}</p>
            <p><strong>Total Harga:</strong> Rp{{ selectedOrder.total_harga }}</p>
            <p><strong>Jumlah Bayar:</strong> Rp{{ selectedOrder.jumlah_bayar }}</p>
            <p><strong>Kembalian:</strong> Rp{{ selectedOrder.kembalian }}</p>
            <p><strong>Keterangan:</strong> {{ selectedOrder.keterangan }}</p>

            <h6 class="mt-3">Detail Menu:</h6>
            <table class="table">
              <thead>
                <tr>
                  <th>Nama Menu</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in selectedOrder.detail_pesanan" :key="idx">
                  <td>{{ item.nama_menu }}</td>
                  <td>{{ item.jumlah }}</td>
                  <td>Rp{{ item.subtotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <!-- Tombol hanya untuk level 1 -->
            <button
              v-if="level === 1"
              class="btn btn-primary"
              @click="updateStatus('Sedang Diproses')"
            >
              Sedang Diproses
            </button>
            <button
              v-if="level === 1"
              class="btn btn-success"
              @click="updateStatus('Selesai')"
            >
              Selesai
            </button>

            <!-- Tombol hapus untuk semua level -->
            <button class="btn btn-danger" @click="deleteOrder(selectedOrder.id_order)">Hapus</button>
            <button class="btn btn-secondary" @click="selectedOrder = null">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      rowsPerPage: 10,
      searchQuery: "",
      selectedOrder: null,
      totalFiltered: 0,
      level: 1, // contoh, bisa diganti sesuai login user (ambil dari localStorage atau Vuex)
    };
  },
  computed: {
    sortedOrders() {
      const beforeSeven = [];
      const afterSeven = [];

      this.products.forEach(order => {
        const dt = new Date(order.waktu);
        const totalMinutes = dt.getHours() * 60 + dt.getMinutes();
        const limit = 19 * 60; // jam 19:00

        if (totalMinutes < limit) {
          beforeSeven.push(order);
        } else {
          afterSeven.push(order);
        }
      });

      const sortByTime = (a, b) => new Date(a.waktu) - new Date(b.waktu);
      beforeSeven.sort(sortByTime);
      afterSeven.sort(sortByTime);

      return beforeSeven.concat(afterSeven);
    },

    paginatedOrders() {
      const filtered = this.sortedOrders.filter(order =>
        order.nama_pemesan.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      this.totalFiltered = filtered.length;

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }

      return filtered.slice(
        (this.currentPage - 1) * this.rowsPerPage,
        this.currentPage * this.rowsPerPage
      );
    },

    totalPages() {
      return Math.ceil(this.totalFiltered / this.rowsPerPage);
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.products = response.data.data.orders;
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal mengambil data. Pastikan token valid.");
      }
    },
    showDetail(order) {
      this.selectedOrder = order;
    },
    async postTransaksi(id_order) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          "http://localhost:3000/transaksi",
          { id_order },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Gagal membuat transaksi:", error);
        alert("Gagal membuat transaksi.");
      }
    },
    async updateStatus(newStatus) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.put(
          `http://localhost:3000/status_order/${this.selectedOrder.id_order}`,
          { status_order: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (newStatus === "Selesai") {
          await this.postTransaksi(this.selectedOrder.id_order);
        }

        alert(`Status berhasil diubah menjadi "${newStatus}"`);
        this.selectedOrder = null;
        this.fetchOrders();
      } catch (error) {
        console.error("Gagal mengubah status:", error);
        alert("Gagal mengubah status. Coba lagi.");
      }
    },
    async deleteOrder(id_order) {
      if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`http://localhost:3000/order/${id_order}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.selectedOrder = null;
        this.fetchOrders();
        alert("Pesanan berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus pesanan:", error);
        alert("Gagal menghapus pesanan. Cek koneksi atau token.");
      }
    },
    formatTimeOnly(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('id-ID', { hour12: false });
    },
  },
  watch: {
    rowsPerPage() {
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchOrders();

    // Contoh ambil level user dari localStorage jika ada
    const savedLevel = localStorage.getItem("userLevel");
    if (savedLevel) this.level = parseInt(savedLevel);
  },
};
</script>

<style scoped>
.name_order {
  font-family: "Poppins", sans-serif;
  margin-bottom: 20px;
  text-align: left;
  font-weight: bold;
}

.container_all {
  padding: 20px;
  margin-top: 50px;
}

.table_controls,
.search_controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-controls label,
.search-controls label {
  font-weight: 600;
}

.table-head {
  background: linear-gradient(135deg, #318407, #0b1e02);
  color: white;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1040;
}
</style>
