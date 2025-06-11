<template>
  <div class="hero-container">
    <div class="text-center animate-fade-slide">
      <div class="name_welcome">
        <i class="fas fa-utensils icon"></i> Selamat Datang di
      </div>
      <div class="name_brand">
        <i class="fas fa-bolt icon"></i> SpeedyServe
      </div>
      <p class="description">
        SpeedyServe adalah sistem pencatatan makanan untuk warung <strong style="color: green;">Nasgor Mbk Indah</strong>
        yang mempermudah dalam proses pencatatan pesanan dan pengelolaan transaksi harian secara efisien dan cepat.
      </p>
      <router-link to="/login">
        <button class="btn-login">
          <i class="fas fa-sign-in-alt"></i> Masuk
        </button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  padding: 60px 20px;
  animation: bgPulse 10s ease-in-out infinite;
}

/* Background bundar dinamis */
.hero-container::before,
.hero-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  opacity: 0.3;
  animation: float 8s ease-in-out infinite alternate;
}

.hero-container::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, #318407, #0b1e02);
  top: -200px;
  left: -200px;
}

.hero-container::after {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #318407, #0b1e02);
  bottom: -150px;
  right: -150px;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(20px);
  }
}

@keyframes bgPulse {
  0%,
  100% {
    background-color: #f4f4f4;
  }
  50% {
    background-color: #fdfdf5;
  }
}

.animate-fade-slide {
  animation: fadeSlideIn 1.5s ease;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-center {
  text-align: center;
  z-index: 1;
  position: relative;
  max-width: 700px;
  background-color: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.name_welcome {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: #296d09;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 2.7rem;
  font-weight: bold;
  color: #296d09;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.description {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: #333;
  max-width: 600px;
  margin: 0 auto 30px;
  line-height: 1.6;
}

.btn-login {
  background-color: #296d09;
  color: white;
  font-weight: bold;
  padding: 12px 30px;
  font-size: 1rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-login:hover {
  background-color: #45b710;
  transform: scale(1.05);
}

.icon {
  font-size: 1.2rem;
}
</style>
