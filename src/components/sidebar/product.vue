<template>
    <div class="container_all border border-2 p-3">
      <h2 class="name_category">Tambah Barang</h2>
      <div class="row" style="margin-bottom: 20px;">
        <div class="col add_produk_name">
          <label for="id_produk" class="form-label">Nama Barang</label>
          <input type="text" class="form-control" id="id_produk" v-model="productName" />
        </div>
        <div class="col add_produk_price">
          <label for="id_produk_price" class="form-label">Harga Barang</label>
          <input type="text" class="form-control" id="id_produk_price" v-model="productPrice" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="id_produk_kategori" class="form-label">Kategori Barang</label>
          <select id="id_produk_kategori" v-model="selectedCategory">
            <option value="makanan">Makanan</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>
        <div class="col">
          <button class="btn_add_category" id="btn_add_category" @click="addProduct">
            <i class="fas fa-plus"></i> Tambah
          </button>
        </div>
      </div>
  
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
              <th scope="col">Nama Barang</th>
              <th scope="col">Kategori</th>
              <th scope="col">Harga</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in paginatedProducts" :key="index">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price }}</td>
              <td>
                <button class="btn_action btn_delete" @click="deleteProduct(index)">Hapus</button>
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
        products: [
        { id: 1, name: "Nasi Goreng", category: "makanan", price: 13000 },
        { id: 2, name: "Es teh", category: "minuman", price: 4000 },
        { id: 3, name: "Nasi Mawut", category: "makanan", price: 13000 },
        { id: 4, name: "Es Jeruk", category: "minuman", price: 4000 },
        { id: 5, name: "Mie Goreng", category: "makanan", price: 13000 },
        { id: 7, name: "Bakso", category: "makanan", price: 18000 },
        { id: 8, name: "Es Kelapa Muda", category: "minuman", price: 12000 },
        { id: 9, name: "Soto Ayam", category: "makanan", price: 22000 },
        { id: 10, name: "Es Cincau", category: "minuman", price: 9000 },
      ],
        productName: '',
        productPrice: '',
        selectedCategory: 'makanan',
        currentPage: 1,
        rowsPerPage: 5,
        productIdCounter: 1
      };
    },
    computed: {
      paginatedProducts() {
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        return this.products.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.products.length / this.rowsPerPage);
      },
    },
    methods: {
      addProduct() {
        this.products.push({
          id: this.productIdCounter++,
          name: this.productName,
          category: this.selectedCategory,
          price: this.productPrice
        });
        // Reset input fields
        this.productName = '';
        this.productPrice = '';
      },
      deleteProduct(index) {
        this.products.splice(index, 1);
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
  