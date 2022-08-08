<template>
  <q-page padding>
    <div class="row align-items-center">
      <div class="q-pa-md logo-section">
        <img src="src/assets/logo.svg" height="30" />
        <h4 class="q-ml-2 fw-bold text-decoration-none text-texto">Business</h4>
      </div>
      <!-- Left side -->
      <div class="col-12 d-none d-lg-block col-lg-8 text-center">
        <img
          src="src/assets/login.svg"
          alt="Imagen bienvenida"
          class="h-50 w-75"
        />
      </div>
      <!-- Right side -->
      <div
        class="col-12 col-lg-4 q-px-4 q-px-md-5 text-start row items-center justify-center"
      >
        <form @submit.prevent="login">
          <div class="d-grid gap-2">
            <div class="pb-4">
              <h2 class="text-texto">Bienvenidos a Business</h2>
              <span class="text-texto">Inicie sesión con su cuenta</span>
            </div>

            <!-- Correo -->
            <div class="mb-2">
              <label class="form-text" for="email">Correo</label>
              <input
                id="email"
                class="form-control"
                v-model="loginUser.email"
                type="email"
                placeholder="Ingrese su correo"
              />
            </div>

            <!-- Contraseña -->
            <label class="form-text" for="password">Contraseña</label>
            <password-input v-model="loginUser.password"></password-input>

            <!-- Recuerdame -->
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="remember_session"
              />
              <label class="form-check-label text-texto" for="remember_session"
                >Recuérdame</label
              >
            </div>

            <!-- Botones -->
            <button
              class="btn btn-primary"
              :class="{ disabled: !enableLoginButton }"
            >
              Iniciar sesión
            </button>
            <!--  <router-link :to="{ name: 'Register' }" class="btn btn-danger"
              >Crear cuenta</router-link
            >
            <router-link :to="{ name: 'ForgotPassword' }" class="form-text"
              >¿Olvidaste tu contraseña?</router-link
            > -->
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script src="./LoginPage.ts"></script>

<style lang="scss" scoped>
.logo-section {
  position: absolute;
  left: 0px;
  top: 0;
  text-align: start;
  display: flex;
  align-items: flex-start;
}

h2 {
  line-height: 1.2;
  font-size: 1.714rem;
}

a {
  cursor: pointer;
}

@media (max-width: 576px) {
  form {
    width: 100%;
  }
}

@media (min-width: 577px) {
  form {
    width: 50%;
  }
}

@media (min-width: 992px) {
  form {
    width: 100%;
  }
}
</style>
