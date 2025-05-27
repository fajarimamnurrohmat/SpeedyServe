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
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Pesanan - {{ selectedOrder.nama_pemesan }}</h5>
            <button type="button" class="btn-close" @click="selectedOrder = null"></button>
          </div>
          <div class="modal-body">
            <div class="order-details-grid">
              <div class="detail-item">
                <strong>No HP:</strong>
                <span>{{ selectedOrder.no_hp }}</span>
              </div>
              <div class="detail-item">
                <strong>Opsi Pesanan:</strong>
                <span>{{ selectedOrder.opsi_pesanan }}</span>
              </div>
              <div class="detail-item">
                <strong>Total Harga:</strong>
                <span>Rp{{ selectedOrder.total_harga.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="detail-item">
                <strong>Jumlah Bayar:</strong>
                <span>Rp{{ selectedOrder.jumlah_bayar.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="detail-item">
                <strong>Kembalian:</strong>
                <span>Rp{{ selectedOrder.kembalian.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
              </div>
              <div class="detail-item full-width">
                <strong>Keterangan:</strong>
                <span>{{ selectedOrder.keterangan }}</span>
              </div>
            </div>

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
                  <td>Rp{{ item.subtotal.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
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
            <button v-if="level === 2" class="btn btn-danger" @click="deleteOrder(selectedOrder.id_order)">Hapus</button>
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

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
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal-dialog {
  max-width: 600px;
  margin: 1.75rem auto;
}

.modal-content {
  border: none;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-content:hover {
  transform: translateY(-5px);
}

.modal-header {
  background: linear-gradient(90deg, #318407, #0b1e02);
  color: #E6DF1D;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-family: "Poppins", sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.btn-close {
  background: none;
  color: #E6DF1D;
  font-size: 1.2rem;
  opacity: 0.8;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.btn-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.modal-body {
  padding: 20px;
  font-family: "Poppins", sans-serif;
  color: #333;
  background: rgba(255, 255, 255, 0.95);
}

.order-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.detail-item.full-width {
  grid-column: span 2;
}

.detail-item strong {
  color: #318407;
  font-weight: 600;
  margin-bottom: 2px;
}

.detail-item span {
  color: #333;
  line-height: 1.4;
}

.modal-body h6 {
  font-family: "Poppins", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #318407;
  margin-top: 15px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-body .table {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-body .table thead {
  background: linear-gradient(90deg, #E6DF1D, #d4cc17);
  color: #1a1a1a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-body .table th,
.modal-body .table td {
  padding: 10px;
  font-size: 0.85rem;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-body .table tbody tr {
  transition: background 0.2s ease;
}

.modal-body .table tbody tr:hover {
  background: rgba(230, 223, 29, 0.15);
}

.modal-footer {
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-primary,
.btn-success,
.btn-danger,
.btn-secondary {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 10px;
  padding: 8px 16px;
  border: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(90deg, #318407, #0b1e02);
  color: #E6DF1D;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #0b1e02, #318407);
  box-shadow: 0 4px 12px rgba(49, 132, 7, 0.4);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(90deg, #28a745, #1e7e34);
  color: #fff;
}

.btn-success:hover {
  background: linear-gradient(90deg, #1e7e34, #28a745);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(90deg, #dc3545, #c82333);
  color: #fff;
}

.btn-danger:hover {
  background: linear-gradient(90deg, #c82333, #dc3545);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: linear-gradient(90deg, #6c757d, #5a6268);
  color: #fff;
}

.btn-secondary:hover {
  background: linear-gradient(90deg, #5a6268, #6c757d);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
  transform: translateY(-2px);
}
</style>
