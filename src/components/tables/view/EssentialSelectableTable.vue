<template>
  <q-dialog v-model="abierto" full-width position="top">
    <q-card>
      <essential-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnas"
        :datos="datos"
        :permitir-ocultar-columnas="false"
        :permitir-exportar="false"
        tipoSeleccion="single"
        @fila-seleccionada="emitEventSeleccionar"
      ></essential-table>

      <div class="modal-footer">
        <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-primary" @click="seleccionar()">
            Seleccionar
          </button>
          <button class="btn btn-danger text-white" @click="ocultar()">
            Cancelar
          </button>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { defineComponent, ref } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
// import { TipoSeleccion } from 'config/utils'

// Componentes
import EssentialTable from './EssentialTable.vue'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    datos: {
      type: Array,
      required: true,
    },
  },
  components: { EssentialTable },
  emits: ['seleccionar'],
  setup(props, { emit }) {
    const refModal = ref()
    const refListado = ref()
    let modal: any

    const abierto = ref(false)

    const mostrar = () => (abierto.value = true)
    const ocultar = () => (abierto.value = false)

    const seleccionar = (result?: any) => {
      if (result) {
        emit('seleccionar', result.id)
        return
      }

      refListado.value.seleccionar()
    }

    const emitEventSeleccionar = (filaSeleccionada: any) => {
      if (filaSeleccionada) {
        emit('seleccionar', filaSeleccionada.id)
        ocultar()
      }
    }

    return {
      refModal,
      refListado,
      mostrar,
      ocultar,
      seleccionar,
      abierto,
      // tipoSeleccion,
      emitEventSeleccionar,
    }
  },
})
</script>
