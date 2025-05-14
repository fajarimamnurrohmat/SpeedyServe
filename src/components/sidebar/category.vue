<template>
  <div class="container">
    <h2 class="name_category">Data Kategori</h2>
    <button @click="showModal = true" class="btn_add_category">
      <i class="fas fa-plus"></i> Tambah kategori
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <span
          class="close-modal"
          @click="closeModal"
          style="color: red; text-align: right"
        >
          &times;
        </span>
        <h4 class="header-modal">
          {{ editIndex !== null ? 'Edit Data Kategori' : 'Input Data Kategori' }}
        </h4>
        <div class="form-row">
          <div class="form-group">
            <label for="kategori">Nama Kategori</label>
            <p>Masukkan nama Kategori</p>
            <input
              type="text"
              id="kategori"
              class="form-controll"
              v-model="kategoriInput"
            />
          </div>
        </div>
        <div style="margin-top: 10px; text-align: left">
          <button @click="addOrUpdateKategori" class="btn-add-bengkel">
            {{ editIndex !== null ? "Update Data" : "Simpan Data" }}
          </button>
        </div>
      </div>
    </div>
    <!-- End of Modal -->

    <hr style="border: 1px solid black; margin-top: 25px; margin-bottom: 25px" />

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
            <th scope="col">Id</th>
            <th scope="col">Nama Kategori</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in paginatedCategories" :key="category.id_category">
            <td>{{ category.id_category }}</td>
            <td>{{ category.nama_category }}</td>
            <td>
              <button class="btn_action btn_delete" @click="deleteCategory(category.id_category)">
                Hapus
              </button>
              <button class="btn_action btn_edit" @click="editCategory(index)">
                Edit
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
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  data() {
    return {
      showModal: false,
      editIndex: null,
      kategoriInput: "",
      categories: [],
      currentPage: 1,
      rowsPerPage: 5,
      searchQuery: "",
    };
  },
  computed: {
    filteredCategories() {
      if (!Array.isArray(this.categories)) {
        return [];
      }

      if (!this.searchQuery) return this.categories;

      return this.categories.filter((cat) =>
        cat.nama_category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedCategories() {
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;

      return Array.isArray(this.filteredCategories)
        ? this.filteredCategories.slice(startIndex, endIndex)
        : [];
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.rowsPerPage);
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.categories = response.data.data.category.rows;
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      }
    },
    async addOrUpdateKategori() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let response;
        if (this.editIndex !== null) {
          const id = this.categories[this.editIndex].id_category;
          response = await axios.put(
            `http://localhost:3000/category/${id}`,
            {
              nama_category: this.kategoriInput,
            },
            { headers }
          );
          Swal.fire("Berhasil", "Data kategori berhasil diperbarui", "success"); // SweetAlert2 for update success
        } else {
          response = await axios.post(
            "http://localhost:3000/category",
            {
              nama_category: this.kategoriInput,
            },
            { headers }
          );
          Swal.fire("Berhasil", "Data kategori berhasil disimpan", "success"); // SweetAlert2 for add success
        }

        this.fetchCategories();
        this.closeModal();
      } catch (error) {
        console.error("Gagal menyimpan atau mengupdate kategori:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error"); // SweetAlert2 for error
      }
    },

    async deleteCategory(id) {
  try {
    // Tampilkan konfirmasi SweetAlert2 sebelum menghapus
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus kategori ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true, // Membalik posisi tombol
    });

    // Jika pengguna mengklik "Ya, Hapus"
    if (result.isConfirmed) {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:3000/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("Berhasil", "Data kategori berhasil dihapus", "success"); // SweetAlert2 for delete success
      this.fetchCategories();
    } else {
      // Jika pengguna mengklik "Batal"
      Swal.fire("Dibatalkan", "Penghapusan kategori dibatalkan", "info"); // SweetAlert2 for cancel action
    }
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    Swal.fire("Gagal", "Terjadi kesalahan saat menghapus kategori", "error"); // SweetAlert2 for delete error
  }
},
    editCategory(index) {
      const kategori = this.paginatedCategories[index];
      this.kategoriInput = kategori.nama_category;
      const originalIndex = this.categories.findIndex(
        (cat) => cat.id_category === kategori.id_category
      );
      this.editIndex = originalIndex;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.kategoriInput = "";
      this.editIndex = null;
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  margin-top: 20px;
}

.name_category {
  font-family: "Poppins", sans-serif;
  margin-bottom: 20px;
  text-align: left;
  font-weight: bold;
}

.btn_add_category {
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

.btn_add_category i {
  margin-right: 8px;
}

.btn_add_category:hover {
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
  background-color: #fbf9f9;
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
  width: 500px;
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
/* Additional mobile styles */
@media (max-width: 576px) {
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
  .tampil-baris {
    font-size: 12px;
  }
  .search-bar-container {
    font-size: 12px;
  }
}
</style>
