<template>
    <div class="container_all border border-2 p-3">
      <h2 class="name_category">Tambah Kategori</h2>
      <div class="add_category_name">
        <label for="id_category" class="form-label">Nama Kategori</label>
        <input type="text" class="form-control" id="id_category" />
      </div>
      <button class="btn_add_category" id="btn_add_category">
        <i class="fas fa-plus"></i> Tambah
      </button>
  
      <div class="table_controls">
        <label for="rows_per_page">Tampilkan baris:</label>
        <select v-model="rowsPerPage" id="rows_per_page" class="form-select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
  
      <div class="table-responsive">
        <table class="table table-striped mt-4">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Nama Kategori</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in paginatedCategories" :key="index">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>
                <button class="btn_action btn_delete">Hapus</button>
                <button class="btn_action btn_edit">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: [
          { id: 101, name: 'Makanan' },
          { id: 102, name: 'Minuman' },
          { id: 103, name: 'Camilan' },
          { id: 104, name: 'Bumbu' },
          { id: 105, name: 'Sayuran' },
          { id: 106, name: 'Buah' },
          { id: 107, name: 'Daging' },
          { id: 108, name: 'Ikan' },
          { id: 109, name: 'Susu' },
          { id: 110, name: 'Telur' },
          { id: 111, name: 'Roti' },
          { id: 112, name: 'Kue' }
        ],
        currentPage: 1,
        rowsPerPage: 5
      };
    },
    computed: {
      paginatedCategories() {
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        return this.categories.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.categories.length / this.rowsPerPage);
      }
    }
  };
  </script>
  
  <style scoped>
  .container_all {
    padding: 20px;
    border: 2px solid #000;
    margin-top: 50px;
  }
  
  .name_category {
    font-family: "Poppins", sans-serif;
    margin-bottom: 20px;
  }
  
  .add_category_name {
    text-align: left;
    margin-bottom: 20px;
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
    background-color: #f4f4f4;
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
  