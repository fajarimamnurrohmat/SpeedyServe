<template>
  <div v-if="level === 1">
    <h2 style="color: red">maaf bukan hak akses anda untuk halaman ini !</h2>
    <p>
      silahkan keluar & masuk sebagai admin atau kasir untuk bisa masuk ke
      halaman ini
    </p>
  </div>
  <div v-if="(level === 2) | (level === 3)">
    <h2 class="name_order" style="color: green; margin-top: 30px">
      Halaman Pesanan
    </h2>
    <div class="container">
      <div class="p-1 mx-auto pb-32">
        <!-- Form Pemesan -->
        <div class="form-row mb-6">
          <div class="form-group w-full md:w-1/3">
            <label class="form-label">Nama Pemesan</label>
            <input
              v-model="nama_pemesan"
              type="text"
              class="input-style"
              placeholder="Masukkan nama"
            />
          </div>
          <div class="form-group w-full md:w-1/3">
            <label class="form-label">No HP</label>
            <input
              v-model="no_hp"
              type="text"
              class="input-style"
              placeholder="Masukkan nomor HP (opsional)"
            />
          </div>
          <div class="form-group w-full md:w-1/3">
            <label class="form-label">Opsi Pesanan</label>
            <select v-model="opsi_pesanan" class="input-style">
              <option value="Take Away">Take Away</option>
              <option value="Dine In">Dine In</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="container-2">
      <h2 class="section-title">Detail Pesanan</h2>
      <div
        v-for="(item, index) in detail_pesanan"
        :key="index"
        class="item-row"
      >
        <select v-model="item.id_menu" class="input-style">
          <option disabled value="">Pilih Menu</option>
          <option
            v-for="menu in menus"
            :key="menu.id_menu"
            :value="menu.id_menu"
          >
            {{ menu.nama_menu }}
          </option>
        </select>
        <input
          v-model.number="item.jumlah"
          type="number"
          min="1"
          class="input-style w-24"
          placeholder="Jumlah"
        />
        <button @click="hapusItem(index)" type="button" class="btn btn-danger">
          Hapus
        </button>
      </div>
      <button @click="tambahItem" type="button" class="btn btn-add">
        + Tambah Menu
      </button>
    </div>
    <div class="container-3">
      <div class="mb-4 text-start">
        <label class="form-label">Keterangan</label>
        <textarea
          v-model="keterangan"
          class="input-style"
          rows="3"
          placeholder="Tambahkan keterangan (opsional)"
        ></textarea>
      </div>

      <div class="text-start">
        <label class="form-label">Jumlah Bayar</label>
        <input
          v-model="formattedJumlahBayar"
          type="text"
          class="input-style"
          placeholder="Masukkan jumlah bayar"
          @input="formatJumlahBayar"
        />
      </div>
    </div>

    <!-- Footer Button -->
    <div class="form-row items-center justify-between w-full">
      <div class="text-left">
        <div class="total-text mb-1">
          Total: Rp{{ totalHarga.toLocaleString("id-ID") }}
        </div>
        <div class="change-text" v-if="jumlah_bayar > 0">
          Kembalian: Rp{{ (jumlah_bayar - totalHarga).toLocaleString("id-ID") }}
        </div>
      </div>
      <button @click="kirimPesanan" class="btn btn-submit w-40">
        Kirim Pesanan
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "OrderPage",
  data() {
    return {
      menus: [],
      nama_pemesan: "",
      no_hp: "",
      opsi_pesanan: "Take Away",
      jumlah_bayar: 0,
      keterangan: "",
      level: null,
      detail_pesanan: [{ id_menu: "", jumlah: 1 }],
    };
  },
  computed: {
    totalHarga() {
      return this.detail_pesanan.reduce((total, item) => {
        const menu = this.menus.find((m) => m.id_menu === item.id_menu);
        if (menu) {
          return total + menu.harga_menu * item.jumlah;
        }
        return total;
      }, 0);
    },
    formattedJumlahBayar: {
      get() {
        return this.jumlah_bayar
          ? this.jumlah_bayar.toLocaleString("id-ID")
          : "";
      },
      set(value) {
        // Menghapus semua karakter non-angka
        const cleanValue = value.replace(/[^0-9]/g, "");
        this.jumlah_bayar = cleanValue ? parseInt(cleanValue, 10) : 0;
      },
    },
  },
  mounted() {
    this.fetchMenu();
    const savedLevel = localStorage.getItem("userLevel");
    if (savedLevel) this.level = parseInt(savedLevel);
  },
  methods: {
    async fetchMenu() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://speedyservebe-production.up.railway.app/available_menu",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.menus = res.data.data.menu;
      } catch (err) {
        console.error("Gagal ambil data menu:", err);
      }
    },
    tambahItem() {
      this.detail_pesanan.push({ id_menu: "", jumlah: 1 });
    },
    hapusItem(index) {
      this.detail_pesanan.splice(index, 1);
    },
    async kirimPesanan() {
      if (!this.nama_pemesan) {
        Swal.fire("Peringatan", "Nama pemesan tidak boleh kosong", "warning");
        return;
      }
      if (this.jumlah_bayar < this.totalHarga) {
        Swal.fire("Peringatan", "Nominal yang anda berikan salah", "warning");
        return;
      }
      if (this.detail_pesanan.length === 0) {
        Swal.fire(
          "Peringatan",
          "Detail pesanan tidak boleh kosong.",
          "warning"
        );
        return;
      }
      const validItems = this.detail_pesanan.filter(
        (item) => item.id_menu && item.jumlah > 0
      );
      if (validItems.length !== this.detail_pesanan.length) {
        Swal.fire(
          "Peringatan",
          "Pastikan semua menu dipilih dan jumlah lebih dari 0.",
          "warning"
        );
        return;
      }

      const confirmSubmit = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin menambahkan pesanan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      });

      if (!confirmSubmit.isConfirmed) {
        return; // Batalkan jika pengguna memilih "Batal"
      }

      const payload = {
        nama_pemesan: this.nama_pemesan,
        no_hp: this.no_hp,
        opsi_pesanan: this.opsi_pesanan,
        jumlah_bayar: this.jumlah_bayar,
        keterangan: this.keterangan,
        detail_pesanan: validItems,
      };

      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.post(
          "https://speedyservebe-production.up.railway.app/order",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Konfirmasi cetak resi
        const printConfirm = await Swal.fire({
          title: "Cetak Resi",
          text: "Apakah Anda ingin mencetak resi?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
        });

        if (printConfirm.isConfirmed) {
          this.printReceipt();
        }

        if (!printConfirm.isConfirmed) {
          Swal.fire("Berhasil", "Pesanan berhasil dikirim!", "success");
        }

        // Reset form
        this.nama_pemesan = "";
        this.no_hp = "";
        this.opsi_pesanan = "Take Away";
        this.jumlah_bayar = 0;
        this.keterangan = "";
        this.detail_pesanan = [{ id_menu: "", jumlah: 1 }];
      } catch (err) {
        console.error("Gagal kirim pesanan:", err);
        Swal.fire("Error", "Terjadi kesalahan saat mengirim pesanan.", "error");
      }
    },
    printReceipt() {
      const printContent = `
        <div style="font-family: Arial, sans-serif; font-size: 12px; width: 58mm; margin: 0 auto; padding: 10px;">
          <h2>NOTA</h2>
          <h3>Nasgor Mbk Indah</h3>
          <p>-----------------------------</p>
          <p>Nama   : ${this.nama_pemesan}</p>
          <p>No Hp  : ${this.no_hp || "-"}</p>
          <p>Waktu  : ${new Date().toLocaleDateString(
            "id-ID"
          )} ${new Date().toLocaleTimeString("id-ID")}</p>
          <p>Opsi   : ${this.opsi_pesanan}</p>
          <p>Pesanan:</p>
          <ul style="list-style: none; padding-left: 0;">
            ${this.detail_pesanan
              .map((item) => {
                const menu = this.menus.find((m) => m.id_menu === item.id_menu);
                return `<li> - ${menu?.nama_menu || "Unknown"} x${
                  item.jumlah
                }</li>`;
              })
              .join("")}
          </ul>
          <p>Ket    : ${this.keterangan || "-"}</p>
          <p>Total  : Rp${this.totalHarga.toLocaleString("id-ID")}</p>
          <p>Bayar  : Rp${this.jumlah_bayar.toLocaleString("id-ID")}</p>
          <p>-----------------------------</p>
          <p>Kembali: Rp${(this.jumlah_bayar - this.totalHarga).toLocaleString(
            "id-ID"
          )}</p>
          <p>-----------------------------</p>
          <p>        TERIMA KASIH!        </p>
          <p>-----------------------------</p>
          <p style="text-align: center;">pemesanan</p>
          <p style="text-align: center;">Wa.0895367354421</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>By:SpeedyServe</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </div>
      `;

      // Buat elemen sementara
      const printWindow = window.open("", "", "width=300,height=400");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cetak Resi</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { margin: 0; }
              .page-break { display: block; page-break-before: always; }
            }
          </style>
        </head>
        <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();

      // Tunggu sebentar agar konten dimuat, lalu cetak
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        Swal.fire("Sukses", "Pesanan terkirim & resi berhasil di cetak", "success");
      }, 500);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  margin-top: 20px;
  background: #fefefe;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.container-2 {
  padding: 20px;
  margin-top: 20px;
  background: #fafffc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.container-3 {
  padding: 20px;
  margin-top: 20px;
  background: #fefefe;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 50px;
}

.name_order {
  font-family: "Poppins", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: left;
}

.p-1 {
  padding: 0.25rem;
}

.pb-32 {
  padding-bottom: 8rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  display: block;
  text-align: left;
}

.input-style {
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f9fafb;
  color: #1f2937;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
}

.input-style:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.w-24 {
  width: 6rem;
}

.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border: 0;
  height: 1px;
  background: #e5e7eb;
}

.section-title {
  font-family: "Inter", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: green;
  margin-bottom: 1rem;
  text-align: left;
}

.item-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.item-row:hover {
  background: #eafff5;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-add {
  background: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
}

.btn-add:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
  padding: 0.5rem 0.75rem;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-submit {
  background: #10b981;
  color: #ffffff;
  width: 100%;
  padding: 0.5rem;
}

.btn-submit:hover {
  background: #059669;
  transform: translateY(-1px);
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-start {
  text-align: left;
}

.total-text {
  font-family: "Inter", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  margin-bottom: 0.5rem;
}

.w-full {
  width: 100%;
}

.change-text {
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.total-text {
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .form-group {
    width: 100% !important;
  }

  .item-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-style.w-24 {
    width: 100%;
  }
}
</style>
