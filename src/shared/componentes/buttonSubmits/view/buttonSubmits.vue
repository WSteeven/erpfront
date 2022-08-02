<template>
  <!-- submit and reset -->
  <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
    <!-- Boton guardar -->
    <button
      form="formulario"
      v-if="accion === nuevo && mostrarGuardar"
      class="btn btn-primary"
      type="submit"
      @click="emitir('guardar')"
    >
      <i class="bi bi-save me-1" />
      <span>Guardar</span>
    </button>

    <!-- Boton modificar -->
    <button
      form="formulario"
      v-if="accion === modificar || mostrarModificar"
      class="btn btn-primary"
      type="submit"
      @click="emitir('editar')"
    >
      <i class="bi bi-save me-1" />
      <span>Modificar</span>
    </button>

    <!-- Boton eliminar -->
    <button
      v-if="accion === eliminar"
      class="btn btn-primary"
      type="submit"
      @click="emitir('eliminar')"
    >
      <i class="bi bi-trash me-1" />
      <span>Eliminar</span>
    </button>

    <!-- Boton cancelar -->
    <!-- data-bs-dismiss="modal" -->
    <button
      v-if="mostrarCancelar"
      class="btn btn-danger"
      @click="emitir('cancelar', true)"
    >
      <i class="bi bi-x-lg me-1" />
      <span>Cancelar</span>
    </button>
  </div>
</template>

<script lang="ts">
import {acciones} from "@config/utils.config"
import {defineComponent} from "vue"

export default defineComponent({
  components: {},
  props: {
    accion: {
      type: String,
      required: true,
    },
    mostrarGuardar: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarModificar: {
      type: Boolean,
      required: false,
      default: false,
    },
    mostrarCancelar: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["guardar", "editar", "cancelar", "eliminar"],
  setup(props, {emit}) {
    const {nuevo, consultar, modificar, eliminar} = acciones
    const emitir = (evento: any, ...args: any) => emit(evento, ...args)

    return {
      // editores
      nuevo,
      consultar,
      modificar,
      eliminar,
      // callbacks
      emitir,
    }
  },
})
</script>
