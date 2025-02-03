<template>
  <q-dialog
    v-model="abierto"
    full-width
    :position="$q.screen.xs ? 'standard' : 'top'"
    :maximized="$q.screen.xs"
  >
    <q-card>
      <q-linear-progress :value="1" color="primary" />

      <q-card-section style="height: 89vh" class="scroll">
        <essential-table
          ref="refTabla"
          :configuracion-columnas="configuracionColumnas"
          :datos="datos"
          :mostrar-botones="false"
          :tipoSeleccion="tipoSeleccion"
          @selected="emitSelected"
          :ajustarCeldas="true"
        ></essential-table>
      </q-card-section>

      <q-card-actions
        class="q-gutter-xs"
        :class="{ 'justify-end': !$q.screen.xs }"
      >
        <q-btn
          color="primary"
          :class="{ 'full-width': $q.screen.xs }"
          no-caps
          push
          @click="seleccionar()"
        >
          <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
          <span>Seleccionar</span>
        </q-btn>

        <q-btn
          color="negative"
          :class="{ 'full-width': $q.screen.xs }"
          no-caps
          push
          @click="ocultar()"
        >
          <q-icon name="bi-x-lg" size="xs" class="q-pr-sm"></q-icon>
          <span>Cancelar</span>
        </q-btn>
      </q-card-actions>
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
      required: true
    },
    datos: {
      type: Array,
      required: true
    },
    tipoSeleccion: {
      type: String as () => TipoSeleccion,
      default: 'single'
    }
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
      if (itemSeleccionado) return emit('selected', itemSeleccionado)
      refTabla.value.seleccionar()
    }

    const emitSelected = (itemsSeleccionados: EntidadAuditable[]) => {
      if (itemsSeleccionados.length) emit('selected', itemsSeleccionados)
      ocultar()
    }

    return {
      refTabla,
      mostrar,
      ocultar,
      seleccionar,
      abierto,
      emitSelected
    }
  }
})
</script>
