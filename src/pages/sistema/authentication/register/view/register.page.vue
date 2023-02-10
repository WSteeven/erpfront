<template>
  <div class="pt-5 px-4 position-fixed w-100 h-100">
    <img
      src="/img/login.svg"
      alt="Imagen contraseña olvidada"
      class="position-absolute bottom-0"
    />
    <div class="row mb-4">
      <div class="card col-12 col-md-6 mx-auto p-4">
        <form @submit.prevent="enviarCorreoRecuperacion" class="w-100">
          <div class="d-grid gap-2 mb-4">
            <div class="pb-4">
              <h2 class="text-texto">Registrate</h2>
              <span class="text-texto">Es fácil y rápido</span>
            </div>

            <!-- Nombre -->
            <div>
              <label class="form-label">Nombre</label>
              <input
                class="form-control"
                v-model="registerUser.name"
                type="text"
                placeholder="Ingrese su nombre"
              />
            </div>

            <!-- Apellidos -->
            <div>
              <label class="form-label">Apellidos</label>
              <input
                class="form-control"
                v-model="registerUser.lastname"
                type="text"
                placeholder="Ingrese su apellidos"
              />
            </div>

            <!-- Correo -->
            <div>
              <label class="form-label">Correo</label>
              <input
                class="form-control"
                v-model="registerUser.email"
                type="email"
                placeholder="Ingrese su correo"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label class="form-label">Contraseña</label>
              <password-input v-model="registerUser.password"></password-input>
            </div>

            <!-- Confirmacion de contraseña -->
            <div>
              <label class="form-label">Confirmar contraseña</label>
              <password-input
                v-model="registerUser.password_confirmation"
                placeholder="Repita la contraseña"
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
                v-show="enviando"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Registrar
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
  </div>
</template>

<script lang="ts" src="./register.page.ts"></script>
