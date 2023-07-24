<template>
  <q-table
    ref="referencia"
    :grid="grid || $q.screen.xs"
    flat
    bordered
    title="Treats"
    :rows="datos"
    :columns="configuracionColumnas"
    :filter="filter"
    :visible-columns="visibleColumns"
    :separator="$q.screen.xs ? 'horizontal' : separador"
    :hide-bottom="!mostrarFooter"
    row-key="id"
    v-model:selected="selected"
    :style="estilos"
    class="bg-body-table my-sticky-column-table borde"
    :class="{
      'alto-fijo-desktop': !inFullscreen && altoFijo && !$q.screen.xs,
      'alto-fijo-mobile': !inFullscreen && altoFijo && $q.screen.xs,
      'my-sticky-dynamic2': !inFullscreen && altoFijo,
      'bg-body-table-dark-color': $q.screen.xs && $q.dark.isActive,
      'my-sticky-column-table-dark': $q.dark.isActive,
      'my-sticky-column-table-light': !$q.dark.isActive,
      'rounded-header': $q.screen.xs,
      'bg-header-table': mostrarFiltros,
    }"
    virtual-scroll
    :virtual-scroll-item-size="offset"
    :pagination="pagination"
    no-data-label="Aún no se han agregado elementos"
    binary-state-sort
  >
    <!-- No data  -->
    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center text-primary q-gutter-sm">
        <q-icon size="2em" name="bi-exclamation-triangle-fill" />
        <span> {{ message }} </span>
      </div>
    </template>

    <!-- Pagination -->
    <template #pagination="scope">
      <botones-paginacion :scope="scope"> </botones-paginacion>
    </template>
    <!-- Edicion de celdas -->
    <template v-slot:body-cell="props">
      <q-td :key="props.col.name" :props="props">
        {{ props.row[props.col.name] }}
        <q-popup-edit
          v-if="props.col.editable"
          v-model="props.row[props.col.name]"
          :title="'Modificar ' + props.col.label"
          auto-save
          v-slot="scope"
          ><q-input
            v-if="props.col.type != 'toggle'"
            v-model="scope.value"
            :type="props.col.type ? props.col.type : 'text'"
            :hint="props.col.hint"
            dense
            autofocus
            counter
            @keyup.enter="scope.set"
          />
          <q-toggle
            v-else
            keep-color
            v-model="scope.value"
            :label="scope.value ? 'SI' : 'NO'"
          />
        </q-popup-edit>
      </q-td>
    </template>
    <!-- Personalizacion de celdas -->
    <!-- Facturable -->
    <template v-slot:body-cell-facturable="props">
      <q-td :key="props.col.name" :props="props">
        <q-icon
        size="md"
          :name="props.row[props.col.name] ? 'bi-toggle2-on' : 'bi-toggle2-off'"
          :color="props.row[props.col.name] ? 'positive' : 'negative'"
        />
        <q-popup-edit
          v-if="props.col.editable"
          v-model="props.row[props.col.name]"
          :title="'¿Es ' + props.col.name+'?'"
          auto-save
          v-slot="scope"
          >
          <q-toggle
            v-model="scope.value"
            :label="scope.value ? 'SI' : 'NO'"
          />
        </q-popup-edit>
      </q-td>
    </template>
    <!-- Grava IVA -->
    <template #body-cell-grava_iva="props">
      <q-td :key="props.col.name" :props="props">
        <q-icon
        size="md"
          :name="props.row[props.col.name] ? 'bi-toggle2-on' : 'bi-toggle2-off'"
          :color="props.row[props.col.name] ? 'positive' : 'negative'"
        />
        <q-popup-edit
          v-if="props.col.editable"
          v-model="props.row[props.col.name]"
          :title="'¿Grava IVA? '"
          auto-save
          v-slot="scope"
          >
          <q-toggle
            v-model="scope.value"
            :label="scope.value ? 'SI' : 'NO'"
          />
        </q-popup-edit>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { defineComponent, ref } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns } from 'shared/utils'
import { TipoSeparador } from 'config/utils'
import { offset } from 'config/utils_tablas'

export default defineComponent({
  components: {},
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    datos: {
      type: Array,
      required: true,
    },
    separador: {
      type: String as () => TipoSeparador,
      default: 'horizontal',
    },
    mostrarFooter: {
      type: Boolean,
      default: true,
    },
    estilos: {
      type: String,
      required: false,
    },
    altoFijo: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const filter = ref()
    const grid = ref(false)
    const inFullscreen = ref(false)
    const mostrarFiltros = ref(false)
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))
    const selected = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: props.altoFijo ? 15 : 0,
    })

    //Observers
    const seleccionar = () => emit('selected', selected.value)

    return {
      grid,
      filter,
      visibleColumns,
      selected,
      inFullscreen,
      mostrarFiltros,
      offset,
      pagination,
      seleccionar,
    }
  },
})
</script>
