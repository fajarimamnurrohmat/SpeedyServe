<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="name_welcome">Selamat Datang</div>
        <div class="name_brand" style="margin-bottom: 30px">SpeedyServe</div>
      </div>
    </div>
    <div class="card" style="background-color: gainsboro">
      <div class="name_welcome" style="margin-bottom: 15px">Masuk Sebagai</div>
      <div class="row">
        <div class="col">
          <router-link to="/login">
            <div class="card" style="height: 200px">
              <div class="card-body">
                <div class="kasir p-3">
                  <i class="fas fa-cash-register fa-3x mb-2"></i>
                  <p class="name_login">Pelayan</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col">
          <router-link to="/login">
            <div class="card" style="height: 200px">
              <div class="card-body">
                <div class="administrator p-3">
                  <i class="fas fa-user-cog fa-3x mb-2"></i>
                  <p class="name_login">Koki</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col">
          <router-link to="/login">
            <div class="card" style="height: 200px">
              <div class="card-body">
                <div class="administrator p-3">
                  <i class="fas fa-user-cog fa-3x mb-2"></i>
                  <p class="name_login">Admin</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.name_welcome {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: black;
}

.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: black;
  margin-top: 8px;
}

.card {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 40px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.kasir,
.administrator {
  text-align: center;
}

.name_login {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
}

.fa-cash-register,
.fa-user-cog {
  color: #555;
}
</style>
