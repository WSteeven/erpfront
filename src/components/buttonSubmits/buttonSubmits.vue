<template>
  <!-- submit and reset -->
  <div class="row inline justify-end q-gutter-sm">
    <!-- Boton guardar -->
    <q-btn
      form="formulario"
      v-if="accion === nuevo && permitirGuardar"
      color="primary"
      type="submit"
      no-caps
      push
      :disable="disabled"
      @click="emitir('guardar')"
    >
      <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
      <span>{{ labelGuardar }}</span>
    </q-btn>

    <!-- Boton modificar -->
    <q-btn
      form="formulario"
      v-if="accion === editar || permitirModificar"
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
      v-if="permitirCancelar"
      color="negative"
      no-caps
      push
      @click="
        () => {
          emitir('cancelar', true)
          emitir('cerrar-modal')
        }
      "
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
    permitirGuardar: {
      type: Boolean,
      required: false,
      default: true,
    },
    permitirModificar: {
      type: Boolean,
      required: false,
      default: false,
    },
    permitirCancelar: {
      type: Boolean,
      required: false,
      default: true,
    },
    labelGuardar: {
      type: String,
      default: 'Guardar',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['guardar', 'editar', 'cancelar', 'eliminar', 'cerrar-modal'],
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
