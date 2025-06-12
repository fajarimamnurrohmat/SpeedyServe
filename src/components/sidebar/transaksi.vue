<template>
  <div v-if="(level === 1) | (level === 2)">
    <h2 style="color: red">maaf bukan hak akses anda untuk halaman ini !</h2>
    <p>
      silahkan keluar & masuk sebagai admin untuk bisa masuk ke halaman ini
    </p>
  </div>

  <div class="container mt-4" v-if="level === 3">
    <h2 class="name-transaksi mb-4" style="color: green">
      Halaman Penjualan / Transaksi
    </h2>

    <!-- Filter -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="startDate">Tanggal Awal:</label>
        <input
          type="date"
          v-model="startDate"
          class="form-control"
          id="startDate"
        />
      </div>
      <div class="col-md-3">
        <label for="endDate">Tanggal Akhir:</label>
        <input
          type="date"
          v-model="endDate"
          class="form-control"
          id="endDate"
        />
      </div>
      <div class="col-md-3">
        <label for="selectedMonth">Pilih Bulan:</label>
        <select v-model="selectedMonth" class="form-select" id="selectedMonth">
          <option value="">Semua Bulan</option>
          <option
            v-for="(month, index) in months"
            :key="index"
            :value="index + 1"
          >
            {{ month }}
          </option>
        </select>
      </div>
      <div class="col-md-3 d-flex align-items-end">
        <button class="btn btn-secondary w-100" @click="resetFilter">
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Tabel Transaksi -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-head">
          <tr>
            <th>No.</th>
            <th>Nama Pemesan</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Total Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr
            v-for="(tx, index) in filteredTransactions"
            :key="tx.id_transaksi"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ tx.nama_pemesan }}</td>
            <td>{{ formatDate(tx.waktu) }}</td>
            <td>{{ formatTime(tx.waktu) }}</td>
            <td>
              Rp{{
                tx.total_harga.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
            <td>
              <button
                class="btn btn-primary btn-sm"
                @click="openDetailModal(tx.id_order)"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredTransactions.length === 0" class="text-center mt-3">
        <em>Tidak ada data transaksi untuk filter ini.</em>
      </div>
    </div>

    <!-- Total Penghasilan -->
    <div class="mt-3 text-start fs-5" v-if="filteredTransactions.length" style="color: grey;">
      Penghasilan Total:
      <span style="color: green; font-weight: bold;">
        Rp{{ totalPenghasilan.toLocaleString("id-ID", { minimumFractionDigits: 2 }) }}
      </span>
    </div>

    <!-- Modal Detail Order -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Detail Order: {{ orderDetail?.nama_pemesan }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="orderDetail">
              <div class="order-details-grid">
                <div class="detail-item">
                  <strong>Opsi Pemesan:</strong>
                  <span>{{ orderDetail.opsi_pesanan }}</span>
                </div>
                <div class="detail-item">
                  <strong>Total Harga:</strong>
                  <span>Rp{{ orderDetail.total_harga?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="detail-item">
                  <strong>Uang Bayar:</strong>
                  <span>Rp{{ orderDetail.jumlah_bayar?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="detail-item">
                  <strong>Kembalian:</strong>
                  <span>Rp{{ orderDetail.kembalian?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                </div>
                <div class="detail-item full-width">
                  <strong>Keterangan:</strong>
                  <span>{{ orderDetail.keterangan }}</span>
                </div>
              </div>
              <h6 class="mt-3">Detail Pesanan:</h6>
              <table class="table">
                <thead>
                  <tr>
                    <th>Nama Menu</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderDetail.detail_pesanan" :key="index">
                    <td>{{ item.nama_menu }}</td>
                    <td>{{ item.jumlah }}</td>
                    <td>Rp{{ item.subtotal?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <em>Memuat data...</em>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Tutup</button>
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
      transactions: [],
      startDate: "",
      endDate: "",
      selectedMonth: "",
      showModal: false,
      orderDetail: null,
      level: null,
      months: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
    };
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter((tx) => {
        const txDate = new Date(tx.waktu);
        const txMonth = txDate.getMonth() + 1;

        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;

        const matchDate =
          (!start || txDate >= start) && (!end || txDate <= end);

        const matchMonth =
          !this.selectedMonth || txMonth === Number(this.selectedMonth);

        return matchDate && matchMonth;
      });
    },
    totalPenghasilan() {
      return this.filteredTransactions.reduce(
        (total, tx) => total + tx.total_harga,
        0
      );
    },
  },
  methods: {
    async fetchTransactions() {
      const userLevel = localStorage.getItem("userLevel");
      if (userLevel !== "3") {
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("https://speedyservebe-production.up.railway.app/transaksi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.transactions = response.data.data.transactions;
      } catch (error) {
        // console.error("Gagal mengambil data transaksi:", error);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return isNaN(date)
        ? "Tanggal Tidak Valid"
        : date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
    },
    formatTime(dateStr) {
      const utcDate = new Date(dateStr);
      return isNaN(utcDate)
        ? "Jam Tidak Valid"
        : utcDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Jakarta",
          });
    },
    resetFilter() {
      this.startDate = "";
      this.endDate = "";
      this.selectedMonth = "";
    },
    async openDetailModal(id_order) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://speedyservebe-production.up.railway.app/order/${id_order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success" && response.data.data.order) {
          this.orderDetail = response.data.data.order;
          this.showModal = true;
        } else {
          alert("Data order tidak ditemukan.");
        }
      } catch (error) {
        console.error("Gagal mengambil detail order:", error);
        alert("Gagal mengambil detail order.");
      }
    },
    closeModal() {
      this.showModal = false;
      this.orderDetail = null;
    },
  },
  mounted() {
    this.fetchTransactions();
    const savedLevel = localStorage.getItem("userLevel");
    if (savedLevel) this.level = parseInt(savedLevel);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.name-transaksi {
  font-family: "Poppins", sans-serif;
  margin-bottom: 20px;
  text-align: left;
  font-weight: bold;
}
.container {
  max-width: 1000px;
}
.modal {
  display: block;
}
.table-head {
  background: linear-gradient(135deg, #318407, #0b1e02);
  color: white;
  text-align: left;
}
.table-body {
  text-align: left;
}

.modal-dialog {
  max-width: 550px;
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

.btn-secondary {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 10px;
  padding: 8px 16px;
  border: none;
  background: linear-gradient(90deg, #6c757d, #5a6268);
  color: #fff;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary:hover {
  background: linear-gradient(90deg, #5a6268, #6c757d);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
  transform: translateY(-2px);
}

.btn-primary {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 10px;
  padding: 8px 16px;
  border: none;
  background: linear-gradient(90deg, #318407, #0b1e02);
  color: #E6DF1D;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #0b1e02, #318407);
  box-shadow: 0 4px 12px rgba(49, 132, 7, 0.4);
  transform: translateY(-2px);
}
</style>