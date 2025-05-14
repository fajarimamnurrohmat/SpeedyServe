<template>
  <div class="col d-flex align-items-center justify-content-center">
    <div class="form-container">
      <div class="mb-5 mt-2 text-center">
        <div class="name_login">Log In</div>
        <div class="name_brand">SpeedyServe</div>
        <div class="name_desc">NaSgOr MbK InDaH</div>
      </div>

      <form @submit.prevent="handleLogin" style="text-align: left; margin-bottom: 70px">
        <div class="mb-4 input-icon-wrapper">
          <label for="username" class="form-label">Username</label>
          <div class="input-group-custom">
            <i class="fas fa-user icon-left"></i>
            <input
              type="text"
              class="form-control input-with-icon"
              id="username"
              v-model="username"
              required
            />
          </div>
        </div>

        <div class="mb-4 input-icon-wrapper">
          <label for="password" class="form-label">Password</label>
          <div class="input-group-custom">
            <i class="fas fa-lock icon-left"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control input-with-icon"
              id="password"
              v-model="password"
              required
            />
            <i
              :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              class="icon-right toggle-password"
              @click="togglePassword"
            ></i>
          </div>
        </div>

        <div class="d-flex justify-content-center">
          <button
            type="submit"
            class="btn btn-custom mb-4"
            style="border-radius: 20px;"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Masuk</span>
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger text-center error-message">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("http://localhost:3000/authentications", {
          username: this.username,
          password: this.password,
        });

        if (response.data.status === "success") {
          const { accessToken, refreshToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Redirect ke halaman utama
          this.$router.push("/mainsidebar/dashboard");
        } else {
          this.errorMessage = response.data.message || "Login gagal.";
        }
      } catch (error) {
        this.errorMessage =
          error?.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.form-container {
  border: 1px solid gainsboro;
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

.name_desc {
  color: #fbfbfb;
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  font-weight: 300;
  margin-top: 5px;
}

.form-label {
  color: #fbfbfb;
}

.btn:hover {
  transform: translateY(-2px);
  background-color: #E6DF1D;
  color: #fbfbfb;
}

.btn-custom {
  background-color: #fbfbfb;
  color: #E6DF1D;
  font-weight: bold;
}

/* Error Message */
.error-message {
  margin-top: -15px;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 1px;
  border-radius: 20px;
  color: #721c24;
}

.error-message i {
  margin-right: 8px;
}

/* Icon Style */
.input-group-custom {
  position: relative;
}

.input-with-icon {
  border-radius: 20px;
  padding-left: 35px;
  padding-right: 35px;
}

.icon-left,
.icon-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.icon-left {
  left: 10px;
}

.icon-right {
  right: 10px;
  cursor: pointer;
}

.icon-right:hover {
  color: #E6DF1D;
}
</style>
