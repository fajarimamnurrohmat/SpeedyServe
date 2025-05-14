<template>
  <div class="container_all ">
    <h2 class="name_order">Daftar Pesanan</h2>

    <div class="d-flex justify-content-between mb-3">
      <div class="table_controls">
        <label for="rows_per_page">Tampilkan baris:</label>
        <select v-model="rowsPerPage" id="rows_per_page" class="form-select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
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

    <div class="table-responsive">
      <table class="table table-bordered table-striped mt-4">
        <thead class="table-head">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nama Pemesan</th>
            <th scope="col">Meja/T.away</th>
            <th scope="col">Total</th>
            <th scope="col">Action</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in filteredOrders" :key="index">
            <td>{{ order.id_order }}</td>
            <td>{{ order.nama_pemesan }}</td>
            <td>{{ order.opsi_pesanan }}</td>
            <td>Rp{{ order.total_harga }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="showDetail(order)">
                Detail
              </button>
            </td>
            <td>{{ order.status_order }}</td>
          </tr>
        </tbody>
      </table>
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
            <h5 class="modal-title">
              Detail Pesanan - {{ selectedOrder.nama_pemesan }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="selectedOrder = null"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>No HP:</strong> {{ selectedOrder.no_hp }}</p>
            <p>
              <strong>Opsi Pesanan:</strong> {{ selectedOrder.opsi_pesanan }}
            </p>
            <p>
              <strong>Total Harga:</strong> Rp{{ selectedOrder.total_harga }}
            </p>
            <p>
              <strong>Jumlah Bayar:</strong> Rp{{ selectedOrder.jumlah_bayar }}
            </p>
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
                <tr
                  v-for="(item, idx) in selectedOrder.detail_pesanan"
                  :key="idx"
                >
                  <td>{{ item.nama_menu }}</td>
                  <td>{{ item.jumlah }}</td>
                  <td>Rp{{ item.subtotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-primary"
              @click="updateStatus('Sedang Diproses')"
            >
              Sedang Diproses
            </button>
            <button class="btn btn-success" @click="updateStatus('Selesai')">
              Selesai
            </button>
            <button
              class="btn btn-danger"
              @click="deleteOrder(selectedOrder.id_order)"
            >
              Hapus
            </button>
            <button class="btn btn-secondary" @click="selectedOrder = null">
              Tutup
            </button>
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
    };
  },
  computed: {
    filteredOrders() {
      return this.products
        .filter((order) =>
          order.nama_pemesan
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
        .slice(
          (this.currentPage - 1) * this.rowsPerPage,
          this.currentPage * this.rowsPerPage
        );
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
        console.log("Transaksi berhasil dibuat.");
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

        // Jika status "Selesai", kirim POST transaksi
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
      const konfirmasi = confirm("Yakin ingin menghapus pesanan ini?");
      if (!konfirmasi) return;

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
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.name_order {
  font-family: "Poppins", sans-serif;
  margin-bottom: 20px;
}

.container_all {
  padding: 20px;
  margin-top: 50px;
}

.table_controls,
.search_controls {
  display: flex;
  align-items: center;
}

.table_controls label,
.search_controls label {
  margin-right: 10px;
}

.form-select,
.form-control {
  padding: 5px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table-head {
  background: linear-gradient(135deg, #318407, #0b1e02);
}
.table th {
  color: white;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.btn_action {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
}

.btn_delete {
  background-color: #dc3545;
  color: white;
}

.btn_edit {
  background-color: #ffc107;
  color: white;
}

.btn_delete:hover {
  background-color: #c82333;
}

.btn_edit:hover {
  background-color: #e0a800;
}

@media (max-width: 576px) {
  .container_all {
    padding: 10px;
  }
  .form-select,
  .form-control {
    font-size: 12px;
  }
  .table th,
  .table td {
    font-size: 12px;
    padding: 8px;
  }
  .btn_action {
    font-size: 12px;
    padding: 3px 6px;
  }
}
</style>
