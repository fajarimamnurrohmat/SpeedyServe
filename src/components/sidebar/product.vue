<template>
  <div class="container_all">
    <h2 class="name_menu" style="color: green">Data Menu Makanan & Minuman</h2>
    <button @click="showModal = true" class="btn_add_menu" v-if="level === 3">
      <i class="fas fa-plus"></i> Tambah Menu
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <span
          class="close-modal"
          @click="closeModal"
          style="color: red; text-align: right"
        >
          ×
        </span>
        <h4 class="header-modal">
          {{ editIndex !== null ? "Edit Data Menu" : "Input Data Menu" }}
        </h4>

        <div class="form-row">
          <div class="form-group">
            <label for="kategori">Kategori</label>
            <p>Pilih nama Kategori</p>
            <select
              id="kategori"
              class="form-controll"
              v-model="selectedCategory"
            >
              <option disabled value="">Pilih kategori</option>
              <option
                v-for="item in kategori"
                :key="item.id_category"
                :value="item.id_category"
              >
                {{ item.nama_category }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="name_menu">Nama Menu</label>
            <p>Masukkan nama Menu</p>
            <input
              type="text"
              id="name_menu"
              class="form-control"
              v-model="productName"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="Harga">Harga</label>
            <p>Masukkan Harga Menu</p>
            <input
              type="text"
              id="Harga"
              class="form-controll"
              v-model="formattedProductPrice"
              placeholder="Masukkan harga menu"
            />
          </div>
        </div>

        <div style="margin-top: 10px; text-align: left">
          <button
            @click="editIndex !== null ? updateProduct() : addProduct()"
            class="btn-add-bengkel"
          >
            {{ editIndex !== null ? "Update Data" : "Simpan Data" }}
          </button>
        </div>
      </div>
    </div>
    <!-- End of Modal -->

    <hr
      style="border: 1px solid black; margin-top: 25px; margin-bottom: 25px"
    />

    <div class="info-page">
      <div class="tampil-baris" style="text-align: left">
        Tampilkan:
        <select v-model="rowsPerPage" class="select-rows">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </select>
        baris
      </div>

      <div class="search-bar-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          class="search-input"
          placeholder="Cari data..."
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered mt-4">
        <thead class="table-head">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Nama Menu</th>
            <th scope="col">Kategori</th>
            <th scope="col">Harga</th>
            <th scope="col">status</th>
            <th scope="col" v-if="level === 3">Aksi</th>
            <th scope="col" v-if="level === 1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in paginatedProducts"
            :key="product.id_menu"
          >
            <td>{{ (currentPage - 1) * rowsPerPage + index + 1 }}</td>
            <td>{{ product.nama_menu }}</td>
            <td>{{ product.nama_category }}</td>
            <td>
              Rp{{
                Number(product.harga_menu).toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
            </td>
            <td>{{ product.tersedia ? "Tersedia" : "Habis" }}</td>
            <td v-if="level === 3">
              <button
                class="btn_action btn_delete"
                @click="deleteProduct(product.id_menu)"
              >
                Hapus
              </button>
              <button
                class="btn_action btn_edit"
                @click="editProduct(index, product)"
              >
                Edit
              </button>
            </td>
            <td v-if="level === 1">
              <button
                :class="product.tersedia ? 'btn-unavailable' : 'btn-available'"
                @click="toggleAvailability(product)"
              >
                {{ product.tersedia ? "Habis" : "Tersedia" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      showModal: false,
      editIndex: null,
      products: [],
      kategori: [],
      productName: "",
      productPrice: "",
      tersedia: "true",
      selectedCategory: "",
      currentPage: 1,
      rowsPerPage: 5,
      searchQuery: "",
      level: null,
    };
  },
  computed: {
    paginatedProducts() {
      const filtered = this.products.filter((item) =>
        item.nama_menu.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.rowsPerPage);
    },
    formattedProductPrice: {
      get() {
        return this.productPrice
          ? Number(this.productPrice).toLocaleString("id-ID")
          : "";
      },
      set(value) {
        const cleanValue = value.replace(/[^0-9]/g, "");
        this.productPrice = cleanValue ? parseInt(cleanValue, 10) : "";
      },
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.productName = "";
      this.productPrice = "";
      this.selectedCategory = "";
      this.editIndex = null;
    },
    async fetchMenu() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("https://speedyservebe-production.up.railway.app/menu", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Urutkan berdasarkan input awal (asumsi data awal lebih dahulu berada di array awal)
        this.products = response.data.data.menu.reverse();
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      }
    },
    async fetchKategori() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("https://speedyservebe-production.up.railway.app/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.kategori = response.data.data.category.rows;
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      }
    },
    async addProduct() {
      if (!this.productName || !this.productPrice || !this.selectedCategory) {
        Swal.fire("Gagal", "Harap lengkapi semua field!", "warning");
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          "https://speedyservebe-production.up.railway.app/menu",
          {
            id_category: this.selectedCategory,
            nama_menu: this.productName,
            harga_menu: this.productPrice,
            tersedia: this.tersedia,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.fetchMenu();
        this.closeModal();
        Swal.fire("Berhasil!", "Menu berhasil ditambahkan.", "success");
      } catch (error) {
        console.error("Gagal menambahkan menu:", error);
        Swal.fire("Gagal", "Gagal menambahkan menu!", "error");
      }
    },
    async editProduct(index, product) {
      this.editIndex = index;
      this.productName = product.nama_menu;
      this.productPrice = product.harga_menu;
      this.selectedCategory = product.id_category;
      this.tersedia = product.tersedia;
      this.showModal = true;
    },
    async updateProduct() {
      if (!this.productName || !this.productPrice || !this.selectedCategory) {
        Swal.fire("Gagal", "Harap lengkapi semua field!", "warning");
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        const product = this.products[this.editIndex];
        await axios.put(
          `https://speedyservebe-production.up.railway.app/menu/${product.id_menu}`,
          {
            id_category: this.selectedCategory,
            nama_menu: this.productName,
            harga_menu: this.productPrice,
            tersedia: this.tersedia,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.fetchMenu();
        this.closeModal();
        Swal.fire("Berhasil!", "Menu berhasil diperbarui.", "success");
      } catch (error) {
        console.error("Gagal mengupdate menu:", error);
        Swal.fire("Gagal", "Gagal mengupdate menu!", "error");
      }
    },
    async toggleAvailability(product) {
      try {
        const token = localStorage.getItem("accessToken");
        const newAvailability = product.tersedia === true ? false : true;

        const result = await Swal.fire({
          title: "Ubah Status?",
          text: `Yakin ingin mengubah status menu "${
            product.nama_menu
          }" menjadi ${newAvailability ? "Tersedia" : "Habis"}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, Ubah",
          cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        await axios.put(
          `https://speedyservebe-production.up.railway.app/menu_availability/${product.id_menu}`,
          { tersedia: newAvailability },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update langsung pada produk yang ditemukan berdasarkan id_menu
        const index = this.products.findIndex(
          (p) => p.id_menu === product.id_menu
        );
        if (index !== -1) {
          this.products[index].tersedia = newAvailability;
        }

        Swal.fire("Berhasil", "Status ketersediaan diperbarui", "success");
      } catch (error) {
        console.error("Gagal memperbarui status:", error);
        Swal.fire("Gagal", "Gagal memperbarui status ketersediaan!", "error");
      }
    },
    async deleteProduct(id_menu) {
      const result = await Swal.fire({
        title: "Yakin ingin menghapus menu ini?",
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;

      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`https://speedyservebe-production.up.railway.app/menu/${id_menu}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchMenu();
        Swal.fire("Terhapus!", "Menu berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal menghapus menu:", error);
        Swal.fire("Gagal", "Gagal menghapus menu!", "error");
      }
    },
  },
  mounted() {
    this.fetchMenu();
    this.fetchKategori();
    const savedLevel = localStorage.getItem("userLevel");
    if (savedLevel) this.level = parseInt(savedLevel);
  },
};
</script>

<style scoped>
.container_all {
  padding: 20px;
  margin-top: 50px;
}

.name_menu {
  font-family: "Poppins", sans-serif;
  margin-bottom: 20px;
  text-align: left;
  font-weight: bold;
}

.btn_add_menu {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.btn_add_menu:hover {
  background-color: #0056b3;
}

.table_controls {
  margin-bottom: 20px;
}

.table-controls label {
  margin-right: 10px;
}

.form-select {
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

.table th {
  font-weight: bold;
}

.table-head {
  background: linear-gradient(135deg, #318407, #0b1e02);
  color: white;
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

.info-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tampil-baris {
  width: 100%;
  text-align: left;
}

.select-rows {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: black;
}

.search-bar-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
}

.search-icon {
  color: #888;
  margin-right: 5px;
}

.search-input {
  border: none;
  outline: none;
  text-align: left;
  padding: 5px;
  width: 200px;
  background-color: #fff;
  color: black;
}

.header-modal {
  color: #e6df1d;
  text-align: left;
  margin-bottom: 1.5rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #225b07;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.close-modal {
  font-size: 24px;
  cursor: pointer;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  text-align: left;
}

.form-group label,
.form-group p {
  color: white;
}

.form-group p {
  margin-top: -4px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 400;
}

.form-group {
  width: 100%;
}

.form-controll {
  color: black;
  width: 16rem;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.btn-add-bengkel {
  background-color: #007bff;
}

.btn-add-bengkel:hover {
  background-color: #035cba;
  transform: translateY(-2px);
}

.btn-available {
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
}

.btn-unavailable {
  background-color: #f44336;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
}

/* Additional mobile styles */
@media (max-width: 576px) {
  .container_all {
    padding: 10px;
  }
  .btn_add_category {
    font-size: 14px;
  }
  .form-select {
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
