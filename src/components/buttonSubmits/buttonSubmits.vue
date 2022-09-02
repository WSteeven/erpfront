<template>
  <!-- submit and reset -->
  <div class="row justify-end q-gutter-sm q-pt-md">
    <!-- Boton guardar -->
    <q-btn
      form="formulario"
      v-if="accion === nuevo && mostrarGuardar"
      color="primary"
      type="submit"
      no-caps
      push
      @click="emitir('guardar')"
    >
      <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
      <span>Guardar</span>
    </q-btn>

    <!-- Boton modificar -->
    <q-btn
      form="formulario"
      v-if="accion === editar || mostrarModificar"
      color="primary"
      type="submit"
      no-caps
      push
      @click="emitir('editar')"
    >
      <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
      <span>Guardar cambios</span>
    </q-btn>

    <!-- Boton eliminar -->
    <q-btn
      v-if="accion === eliminar"
      color="primary"
      type="submit"
      no-caps
      push
      @click="emitir('eliminar')"
    >
      <q-icon name="bi-trash" size="xs" class="q-pr-sm"></q-icon>
      <span>Eliminar</span>
    </q-btn>

    <!-- Boton cancelar -->
    <!-- data-bs-dismiss="modal" -->
    <q-btn
      v-if="mostrarCancelar"
      color="negative"
      no-caps
      push
      @click="emitir('cancelar', true)"
    >
      <q-icon name="bi-x-lg" size="xs" class="q-pr-sm"></q-icon>
      <span>Cancelar</span>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { acciones } from 'config/utils'
import { defineComponent } from 'vue'

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
  emits: ['guardar', 'editar', 'cancelar', 'eliminar'],
  setup(props, { emit }) {
    const { nuevo, consultar, editar, eliminar } = acciones
    const emitir = (evento: any, ...args: any) => emit(evento, ...args)

    return {
      // editores
      nuevo,
      consultar,
      editar,
      eliminar,
      // callbacks
      emitir,
    }
  },
})
</script>
