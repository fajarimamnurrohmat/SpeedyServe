<template>
    <div class="container">
      <h2 class="name_order">Halaman Order</h2>
      <div class="p-1 mx-auto pb-24">
        <!-- Form Pemesan -->
        <div class="form-row">
          <div class="form-group">
            <label class="d-block mb-1 font-semibold">Nama Pemesan</label>
            <input v-model="nama_pemesan" type="text" class="border px-3 py-2 w-full rounded" />
          </div>
          <div class="form-group">
            <label class="d-block mb-1 font-semibold">No HP</label>
            <input v-model="no_hp" type="text" class="border px-3 py-2 w-full rounded" />
          </div>
          <div class="mb-1 text-start">
            <label class="d-block mb-1 font-semibold">Opsi Pesanan</label>
            <select v-model="opsi_pesanan" class="border px-3 py-2 w-full rounded">
              <option value="Take Away">Take Away</option>
              <option value="Dine In">Dine In</option>
            </select>
          </div>
        </div>
  
        <div class="mb-1 text-start">
          <label class="d-block mb-1 font-semibold">Jumlah Bayar</label>
          <input v-model.number="jumlah_bayar" type="number" class="border px-3 py-2 w-full rounded" />
        </div>
  
        <div class="mb-1 text-start">
          <label class="d-block mb-1 font-semibold">Keterangan</label>
          <textarea v-model="keterangan" class="border px-3 py-2 w-full rounded"></textarea>
        </div>
  
        <hr class="my-6" />
        <h2 class="text-xl font-semibold mb-2">Detail Pesanan</h2>
  
        <div v-for="(item, index) in detail_pesanan" :key="index" class="mb-4 flex flex-wrap gap-2 items-center">
          <select v-model="item.id_menu" class="border px-3 py-2 rounded">
            <option disabled value="">Pilih Menu</option>
            <option v-for="menu in menus" :key="menu.id_menu" :value="menu.id_menu">
              {{ menu.nama_menu }}
            </option>
          </select>
  
          <input v-model.number="item.jumlah" type="number" min="1" class="border px-3 py-2 w-20 rounded" />
  
          <button @click="hapusItem(index)" type="button" class="btn-danger text-white px-3 py-1 rounded">
            X
          </button>
        </div>
  
        <button @click="tambahItem" type="button" class="btn-primary text-white px-4 py-2 rounded mb-4">
          + Tambah Menu
        </button>
      </div>
  
      <!-- Footer Button -->
      <div class="footer-button">
        <div class="form-row">
            <div class="text-right font-semibold text-lg mb-1 pr-2">
          Total: Rp{{ totalHarga.toLocaleString("id-ID") }}
        </div>
        <button @click="kirimPesanan" class="btn-success text-white w-full rounded">
          Kirim Pesanan
        </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
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
    },
    mounted() {
      this.fetchMenu();
    },
    methods: {
      async fetchMenu() {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get("http://localhost:3000/menu", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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
        if (!this.nama_pemesan || !this.no_hp || this.jumlah_bayar <= 0) {
          alert("Mohon isi semua data pemesan dengan benar.");
          return;
        }
  
        if (this.detail_pesanan.length === 0) {
          alert("Detail pesanan tidak boleh kosong.");
          return;
        }
  
        const validItems = this.detail_pesanan.filter(
          (item) => item.id_menu && item.jumlah > 0
        );
  
        if (validItems.length !== this.detail_pesanan.length) {
          alert("Pastikan semua menu dipilih dan jumlah lebih dari 0.");
          return;
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
          const res = await axios.post("http://localhost:3000/order", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          alert("Pesanan berhasil dikirim!");
          console.log(res.data);
  
          this.nama_pemesan = "";
          this.no_hp = "";
          this.opsi_pesanan = "Take Away";
          this.jumlah_bayar = 0;
          this.keterangan = "";
          this.detail_pesanan = [{ id_menu: "", jumlah: 1 }];
        } catch (err) {
          console.error("Gagal kirim pesanan:", err);
          alert("Terjadi kesalahan saat mengirim pesanan.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    margin-top: 20px;
  }
  
  .name_order {
    font-family: "Poppins", sans-serif;
    margin-bottom: 20px;
    text-align: left;
    font-weight: bold;
  }
  
  .form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    text-align: left;
    gap: 20px;
  }
  
  .footer-button {
    position: fixed;
    bottom: 0;
    left: 250px; /* Sesuaikan dengan lebar sidebar kamu */
    right: 0;
    background-color: #ffffff;
    padding: 5px 10px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  </style>
  