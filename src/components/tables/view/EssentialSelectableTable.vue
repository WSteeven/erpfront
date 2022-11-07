<template>
  <q-dialog v-model="abierto" full-width position="top">
    <q-card>
      <q-linear-progress :value="1" color="primary" />

      <essential-table
        ref="refTabla"
        :configuracion-columnas="configuracionColumnas"
        :datos="datos"
        :mostrar-botones="false"
        :tipoSeleccion="tipoSeleccion"
        @selected="emitSelected"
      ></essential-table>

      <div class="modal-footer">
        <div class="row justify-end q-pa-md q-gutter-md">
          <q-btn color="primary" no-caps push @click="seleccionar()">
            <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
            <span>Seleccionar</span>
          </q-btn>

          <q-btn color="negative" no-caps push @click="ocultar()">
            <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
            <span>Cancelar</span>
          </q-btn>
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
import { TipoSeleccion } from 'config/utils'

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
    tipoSeleccion: {
      type: String as () => TipoSeleccion,
      default: 'single',
    },
  },
  components: { EssentialTable },
  emits: ['selected'],
  setup(props, { emit }) {
    const refTabla = ref()

    const abierto = ref(false)

    const mostrar = () => (abierto.value = true)
    const ocultar = () => (abierto.value = false)

    /**
     * Si se deja el campo de busqueda vacio lista todos los elementos, en ese caso no se pasa ningún parametro y se llama a seleccionar de refTabla
     * @param itemSeleccionado Si la búsqueda devuelve un elemento, se autoselecciona
     */
    const seleccionar = (itemSeleccionado?: any) => {
      if (itemSeleccionado) return emit('selected', itemSeleccionado.id)
      refTabla.value.seleccionar()
    }

    const emitSelected = (itemsSeleccionados: EntidadAuditable[]) => {
      if (itemsSeleccionados.length) {
        if (props.tipoSeleccion === 'single') {
          console.log('Fila seleccionada en el modal: ', itemsSeleccionados[0])
          emit('selected', itemsSeleccionados[0])
        }
        if (props.tipoSeleccion === 'multiple')
          emit(
            'selected',
            // itemsSeleccionados.map((item: any) => item.id)
            itemsSeleccionados
          )
      }
      ocultar()
    }

    return {
      refTabla,
      mostrar,
      ocultar,
      seleccionar,
      abierto,
      emitSelected,
    }
  },
})
</script>
