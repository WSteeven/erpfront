<template>
  <div class="row g-0 pt-5 px-4">
    <div class="card col-12 col-md-6 mx-auto p-4">
      <form @submit.prevent="enviarCorreoRecuperacion" class="w-100">
        <div class="d-grid gap-2 mb-4">
          <div class="pb-4">
            <h2 class="text-texto">Cambia tu contraseña</h2>
          </div>
          <!-- email -->
          <div class="mb-2">
            <label class="form-text" for="email">Correo:</label>
            <input
              id="email"
              class="form-control"
              v-model="loginUser.email"
              type="email"
              placeholder="Ingrese su correo"
            />
          </div>
          <!-- Contraseña -->
          <div>
            <label class="form-label" for="email">Contraseña:</label>
            <password-input
              v-model="loginUser.password"
              placeholder="Ingrese la nueva contraseña"
            ></password-input>
          </div>
          <!-- Confirmar contraseña -->
          <div>
            <label class="form-label" for="email">Confirmar contraseña:</label>
            <password-input
              v-model="loginUser.password_confirmation"
              placeholder="Repita la nueva contraseña"
            ></password-input>
          </div>
        </div>
        <!-- Botones -->
        <div class="col-12 d-grid d-md-flex justify-content-md-end gap-2">
          <button
            class="btn btn-primary block"
            :class="{disabled: !enableLoginButton}"
          >
            <span
              v-if="enviando"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <i v-else class="bi-save me-2"></i>
            Actualizar
          </button>
          <router-link
            :to="{name: 'Login'}"
            replace
            class="btn btn-danger block"
            >Ir a login</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./resetPassword.page.ts"></script>

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
</style>
