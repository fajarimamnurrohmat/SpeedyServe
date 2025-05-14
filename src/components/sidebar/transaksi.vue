<template>
  <div class="container mt-4">
    <h2 class="mb-4">Halaman Penjualan / Transaksi</h2>

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
            <th>ID Transaksi</th>
            <th>Nama Pemesan</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Total Harga</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in filteredTransactions" :key="tx.id_transaksi">
            <td>{{ tx.id_transaksi }}</td>
            <td>{{ tx.nama_pemesan }}</td>
            <td>{{ formatDate(tx.waktu) }}</td>
            <td>{{ formatTime(tx.waktu) }}</td>
            <td>Rp{{ tx.total_harga.toLocaleString("id-ID") }}</td>
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

    <!-- Modal Detail Order -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Detail Order: {{ orderDetail.id_order }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="orderDetail">
              <p>
                <strong>Nama Pemesan:</strong> {{ orderDetail.nama_pemesan }}
              </p>
              <p>
                <strong>Opsi Pemesan:</strong> {{ orderDetail.opsi_pesanan }}
              </p>
              <p><strong>Keterangan:</strong> {{ orderDetail.keterangan }}</p>
              <p>
                <strong>Total Harga:</strong> Rp{{
                  orderDetail.total_harga?.toLocaleString("id-ID")
                }}
              </p>
              <p>
                <strong>Kembalian:</strong> Rp{{
                  orderDetail.kembalian?.toLocaleString("id-ID")
                }}
              </p>
              <ul
                v-if="
                  orderDetail.detail_pesanan &&
                  orderDetail.detail_pesanan.length
                "
              >
                <li
                  v-for="(item, index) in orderDetail.detail_pesanan"
                  :key="index"
                >
                  {{ item.nama_menu }} - {{ item.jumlah }} x Rp{{
                    item.subtotal?.toLocaleString("id-ID")
                  }}
                </li>
              </ul>
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
  },
  methods: {
    async fetchTransactions() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/transaksi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.transactions = response.data.data.transactions;
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        alert("Gagal mengambil data transaksi.");
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date)) {
        return "Tanggal Tidak Valid"; // Pesan untuk tanggal tidak valid
      }
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    formatTime(dateStr) {
      const utcDate = new Date(dateStr);
      if (isNaN(utcDate)) {
        return "Jam Tidak Valid";
      }
      // Menggunakan `toLocaleString` dengan zona waktu Asia/Jakarta
      return utcDate.toLocaleTimeString("id-ID", {
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
        console.log("Membuka detail modal untuk ID Order:", id_order);
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:3000/order/${id_order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response dari API:", response.data); // Memastikan response sudah sesuai

        if (response.data.status === "success" && response.data.data.order) {
          this.orderDetail = response.data.data.order; // Menyimpan data order ke dalam orderDetail
          this.showModal = true; // Menampilkan modal setelah data diterima
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
      this.orderDetail = null; // Mengosongkan data saat modal ditutup
    },
  },
  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
.modal {
  display: block;
}
.table-head {
  background: linear-gradient(135deg, #318407, #0b1e02);
  color: white;
}
</style>
