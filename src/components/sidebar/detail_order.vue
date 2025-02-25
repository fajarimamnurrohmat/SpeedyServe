<template>
  <div class="container_all border border-2 p-3">
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
          placeholder="Cari data..."
        />
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped mt-4">
        <thead>
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
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.T_away }}</td>
            <td>{{ order.price }}</td>
            <td>
              <router-link>
                <button class="btn_action" style="color: yellow;">Detail</button>
              </router-link>
            </td>
            <td>
              {{ order.status }}
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
        { id: 1, customer: "Rindi", T_away: "3", price: 64000, status: "Proses" },
        { id: 2, customer: "Sandi", T_away: "1", price: 74000, status: "Proses" },
        { id: 3, customer: "Dika", T_away: "take away", price: 93000, status: "Dalam antrian" },
        { id: 4, customer: "Ayus", T_away: "take away", price: 140000, status: "Dalam antrian" },
        { id: 5, customer: "Suprih", T_away: "take away", price: 103000, status: "Dalam antrian" },
        { id: 7, customer: "Laila", T_away: "1", price: 180000, status: "Dalam antrian" },
        { id: 8, customer: "Gilang", T_away: "take away", price: 120000, status: "Dalam antrian" },
        { id: 9, customer: "Parto", T_away: "take away", price: 22000, status: "Dalam antrian" },
        { id: 10, customer: "Nani", T_away: "4", price: 13000, status: "Dalam antrian" },
      ],
      currentPage: 1,
      rowsPerPage: 10,
      searchQuery: "",
    };
  },
  computed: {
    filteredOrders() {
      return this.products
        .filter((order) =>
          order.customer.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .slice(
          (this.currentPage - 1) * this.rowsPerPage,
          this.currentPage * this.rowsPerPage
        );
    },
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
  border: 2px solid #000;
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
