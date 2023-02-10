<template>
  <form @submit.prevent>
    <div class="row">
      <!-- Nombre -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label">Nombre</label>
        <input
          v-model="perfilUsuario.name"
          name="nombre"
          type="text"
          class="form-control"
          :class="{'input-invalid': errors.nombre}"
          placeholder="Obligatorio"
          @input="handleNombre"
          @blur="handleNombre"
        />
        <small style="color: #c70000">{{ errors.nombre }}</small>
      </div>

      <!-- Apellidos -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label">Apellidos</label>
        <input
          v-model="perfilUsuario.lastname"
          type="text"
          class="form-control"
          :class="{'input-invalid': errors.apellidos}"
          placeholder="Obligatorio"
          @input="handleApellidos"
          @blur="handleApellidos"
        />
        <small style="color: #c70000">{{ errors.apellidos }}</small>
      </div>

      <!-- Celular -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label">Celular</label>
        <input
          v-model="perfilUsuario.cellphone"
          type="text"
          class="form-control"
          placeholder="Opcional"
        />
      </div>

      <!-- Correo -->
      <div class="col-md-12 col-lg-4 mb-4">
        <label class="form-label">Correo</label>
        <input
          v-model="perfilUsuario.email"
          type="email"
          class="form-control"
          placeholder="Obligatorio"
        />
      </div>
    </div>

    <!-- Botones -->
    <div class="row">
      <div
        class="col-12 d-grid d-md-flex justify-content-md-end gap-2"
        @click="actualizarPerfil()"
      >
        <button class="btn btn-primary block">
          <!--             <span
              v-if="enviando"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
 -->
          <i class="bi-save me-2"></i>
          Actualizar perfil
        </button>
        <button class="btn btn-danger block" @click="eliminarCuenta()">
          <i class="bi-trash me-2"></i>
          Eliminar cuenta
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" src="./perfil.page.ts"></script>
