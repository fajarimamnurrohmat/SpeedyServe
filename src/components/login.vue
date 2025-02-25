<template>
  <div class="col d-flex align-items-center justify-content-center">
    <div class="form-container">
      <div class="mb-5 mt-2">
        <div class="name_login">Log In</div>
        <div class="name_brand">SpeedyServe</div>
        <div class="name_desc">NaSgOr MbK InDaH</div>
      </div>
      <form style="text-align: left; margin-bottom: 70px">
        <div class="mb-4">
          <label for="exampleInputEmail1" class="form-label">Username</label>
          <input
            style="border-radius: 20px;"
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div class="mb-4">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input
            style="border-radius: 20px;"
            type="password"
            class="form-control"
            id="exampleInputPassword1"
          />
        </div>
      </form>
      <router-link to="/mainsidebar">
        <button
          type="submit"
          class="btn btn-custom mb-4"
          style="border-radius: 20px;"
        >
          Masuk
        </button>
      </router-link>
    </div>
  </div>
</template>

<style>
.form-container {
  border: 1px solid gainsboro; /* Border solid dengan warna abu-abu */
  padding: 30px;
  height: 450px;
  width: 380px;
  border-radius: 30px;
  background: linear-gradient(135deg, #318407, #0B1E02);
}

.name_login {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #E6DF1D;
}

.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #E6DF1D;
  margin-top: -5px;
}

.form-label{
  color: #fbfbfb;
}

.btn:hover {
  transform: translateY(-2px);
  background-color: #E6DF1D;
  color: #fbfbfb;
}

.btn-custom{
  background-color: #fbfbfb;
  color: #E6DF1D;
  font-weight: bold;
}
</style>
