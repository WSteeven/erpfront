<template>
  <div class="pt-5 px-4 position-fixed w-100 h-100">
    <div class="row mb-4">
      <div class="card col-12 col-md-6 mx-auto p-4">
        <form @submit.prevent="enviarCorreoRecuperacion" class="w-100">
          <div class="d-grid gap-2 mb-4">
            <div class="pb-4">
              <h2 class="text-texto">Recupera tu cuenta</h2>
              <span class="text-texto"
                >Ingrese el correo electrónico con el que se registró</span
              >
            </div>
            <!-- Correo -->
            <div>
              <label class="form-label" for="email">Correo</label>
              <input
                class="form-control"
                v-model="loginUser.email"
                type="email"
                placeholder="Ingrese su correo"
              />
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
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              <i v-else class="bi-envelope me-2"></i>
              Enviar correo de recuperación
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
    <img src="/img/forgot_password.svg" alt="Imagen contraseña olvidada" />
  </div>
</template>

<script lang="ts" src="./forgotPassword.page.ts"></script>
