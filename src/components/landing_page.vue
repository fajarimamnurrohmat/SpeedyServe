<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="name_welcome">Selamat Datang</div>
        <div class="name_brand" style="margin-bottom: 30px">SpeedyServe</div>
      </div>
    </div>
    <div class="card" >
      <div class="name_welcome2" style="margin-bottom: 15px">Masuk Sebagai</div>
      <div class="row">
        <div class="col">
          <router-link to="/login">
            <div class="bg">
              <div class="card-body">
                <div class="kasir p-3">
                  <i class="fas fa-cash-register fa-3x mb-2" style="color: #fbfbfb;"></i>
                  <p class="name_login" style="color: #fbfbfb;">Pelayan</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col">
          <router-link to="/login">
            <div class="bg">
              <div class="card-body">
                <div class="koki p-3">
                  <i class="fas fa-utensils fa-3x mb-2" style="color: #fbfbfb;"></i>
                  <p class="name_login" style="color: #fbfbfb;">Koki</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col">
          <router-link to="/login">
            <div class="bg">
              <div class="card-body">
                <div class="administrator p-3">
                  <i class="fas fa-user-cog fa-3x mb-2" style="color: #fbfbfb;"></i>
                  <p class="name_login" style="color: #fbfbfb;">Admin</p>
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
  color: #C6BF0C;
}

.name_welcome2 {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #fbfbfb;
}

.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  font-weight: bold;
  color: #C6BF0C;
  margin-top: 8px;
}

.card {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 40px;
  transition: transform 0.2s ease;
  background: linear-gradient(135deg, #318407, #0B1E02);
  display: flex;
}

.bg{
  background-color: #C6BF0C;
  border-radius: 40px;
  height: 200px;
  display: flex;
  gap: 20px;
}

.bg:hover {
  transform: translateY(-10px);
  background-color: #E6DF1D;
}

.card:hover {
  transform: translateY(-2.5px);
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.koki,
.kasir,
.administrator {
  text-align: center;
}

.name_login {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
}

.name_login,
.fa-utensils,
.fa-cash-register,
.fa-user-cog {
  color: #555;
}
</style>
