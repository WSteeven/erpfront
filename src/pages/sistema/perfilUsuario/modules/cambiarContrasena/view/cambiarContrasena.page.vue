<template>
  <form @submit.prevent="actualizarContrasena()">
    <div class="row">
      <!-- Contraseña actual -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label" for="email">Contraseña actual</label>
        <password-input
          v-model="cambiarContrasena.current_password"
          placeholder="Ingrese la contraseña actual"
        ></password-input>
      </div>

      <!-- Nueva contraseña -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label" for="email">Nueva contraseña</label>
        <password-input
          v-model="cambiarContrasena.password"
          placeholder="Ingrese la nueva contraseña"
        ></password-input>
      </div>

      <!-- Confirmar nueva contraseña -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label" for="email"
          >Confirme la nueva contraseña</label
        >
        <password-input
          v-model="cambiarContrasena.password_confirmation"
          placeholder="Repita la nueva contraseña"
        ></password-input>
      </div>
    </div>
    <!-- Botones -->
    <div class="row">
      <div class="col-12 d-grid d-md-flex justify-content-md-end gap-2">
        <button
          class="btn btn-primary block"
          :class="{disabled: !habilitarBoton}"
        >
          <i class="bi-save me-2"></i>
          Actualizar contraseña
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" src="./cambiarContrasena.page.ts"></script>
