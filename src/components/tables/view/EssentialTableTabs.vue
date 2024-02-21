<template>
  <div>
    <!-- narrow-indicator -->
    <q-tabs
      v-if="mostrarTabs"
      v-model="tabSeleccionado"
      no-caps
      bordered
      dense
      inline-label
      :active-color="activeColor"
      :active-bg-color="activeBgColor"
      :indicator-color="indicatorColor"
      align="justify"
      @click="emit('tab-seleccionado', tabSeleccionado)"
    >
      <q-tab
        v-for="opcion in tabOptions"
        :key="opcion.label"
        :name="opcion.value + ''"
        :class="{
          'rounded shadow-chip q-mx-xs q-my-md': $q.screen.xs,
          'tab-inactive': tabSeleccionado !== opcion.label && !$q.screen.xs,
        }"
      >
        <span>{{ opcion.label }}</span>
        <q-badge
          v-if="tabSeleccionado == opcion.value && datos?.length > 0"
          color="accent"
          style="margin-right: -15px"
          floating
          >{{ datos.length }}</q-badge
        >
      </q-tab>
    </q-tabs>

    <div :class="{ 'q-mx-sm': $q.screen.xs }">
      <essential-table
        :titulo="titulo"
        :configuracionColumnas="configuracionColumnas"
        :datos="datos"
        :permitirConsultar="permitirConsultar"
        :permitirEditar="permitirEditar"
        :permitirEliminar="permitirEliminar"
        :mostrar-botones="mostrarBotones"
        :accion1="accion1"
        :accion2="accion2"
        :accion3="accion3"
        :accion4="accion4"
        :accion5="accion5"
        :accion6="accion6"
        :accion7="accion7"
        :accion8="accion8"
        :accion9="accion9"
        :accion10="accion10"
        :accion1Header="accion1Header"
        :accion2Header="accion2Header"
        :accion3Header="accion3Header"
        :accion4Header="accion4Header"
        :accion5Header="accion5Header"
        :accion6Header="accion6Header"
        :alto-fijo="altoFijo"
        :mostrarFooter="mostrarFooter"
        :mostrarExportar="mostrarExportar"
        @consultar="consultar"
        @editar="editar"
        @eliminar="eliminar"
        @accion1="emitAccion1"
        @accion2="emitAccion2"
        @accion3="emitAccion3"
        @accion4="emitAccion4"
        @accion5="emitAccion5"
        @accion6="emitAccion6"
        @accion7="emitAccion7"
        @accion8="emitAccion8"
        @accion9="emitAccion9"
        @accion10="emitAccion10"
        :permitir-filtrar="permitirFiltrar"
        :permitir-buscar="permitirBuscar"
        :primeraColumnaFija="primeraColumnaFija"
        @filtrar="consultarTodos"
        @toggle-filtros="toggleFiltros"
        :ajustarCeldas="ajustarCeldas"
        :separador="separador"
      ></essential-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TabOption } from 'components/tables/domain/TabOption' // nico, salaas, patricion mnedes , fernando, milton -> operacion y mantenimiento pero no supervisores
import { ColumnConfig } from '../domain/ColumnConfig'
import EssentialTable from './EssentialTable.vue'
import { TipoSeleccion } from 'config/utils'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps({
  titulo: {
    type: String,
    default: 'Listado',
  },
  separador: {
    type: String,
    default: 'horizontal',
  },
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  datos: {
    type: Array,
    required: true,
  },
  permitirEditarCeldas: {
    type: Boolean,
    default: false,
  },
  permitirConsultar: {
    type: Boolean,
    default: true,
  },
  permitirEditar: {
    type: Boolean,
    default: true,
  },
  permitirEliminar: {
    type: Boolean,
    default: true,
  },
  tipoSeleccion: {
    type: String as () => TipoSeleccion,
    default: 'none',
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false,
  },

  accion2: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion3: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion4: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion5: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion6: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion7: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion8: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion9: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion10: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion1Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion2Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion3Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion4Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion5Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion6Header: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  mostrarBotones: {
    type: Boolean,
    default: true,
  },
  altoFijo: {
    type: Boolean,
    default: true,
  },
  mostrarHeader: {
    type: Boolean,
    default: true,
  },
  mostrarFooter: {
    type: Boolean,
    default: true,
  },
  tabOptions: {
    type: Array as () => TabOption[],
    required: true,
  },
  tabDefecto: String,
  permitirFiltrar: {
    type: Boolean,
    default: false,
  },
  permitirBuscar: {
    type: Boolean,
    default: true,
  },
  primeraColumnaFija: {
    type: Boolean,
    default: false,
  },
  mostrarExportar: {
    type: Boolean,
    default: false,
  },
  ajustarCeldas: {
    //valor que se envia para que el contenido de la celda se autoaujuste al tamaño de la celda en lugar de aumentar su tamaño
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'consultar',
  'editar',
  'eliminar',
  'accion1',
  'accion2',
  'accion3',
  'accion4',
  'accion5',
  'accion6',
  'accion7',
  'accion8',
  'accion9',
  'accion10',
  'tab-seleccionado',
  'filtrar',
  'limpiar-listado',
])

const tabSeleccionado = ref(props.tabDefecto)
const mostrarTabs = ref(true)
const activeColor = computed(
  () =>
    props.tabOptions.find(
      (opcion: TabOption) => opcion.value === tabSeleccionado.value
    )?.color_icono ?? 'white'
)

const indicatorColor = computed(
  () =>
    props.tabOptions.find(
      (opcion: TabOption) => opcion.value === tabSeleccionado.value
    )?.color_icono ?? 'accent'
)

const activeBgColor = computed(
  () =>
    props.tabOptions.find(
      (opcion: TabOption) => opcion.value === tabSeleccionado.value
    )?.bg_color ?? 'primary'
)

watchEffect(() => {
  tabSeleccionado.value = props.tabDefecto
})

function toggleFiltros(mostrarFiltros: boolean) {
  mostrarTabs.value = !mostrarFiltros
  if (mostrarTabs.value) emit('tab-seleccionado', tabSeleccionado.value)
  else emit('limpiar-listado')
}

const consultar = (data) => emit('consultar', data)
const editar = (data) => emit('editar', data)
const eliminar = (data) => emit('eliminar', data)
const emitAccion1 = (data) => emit('accion1', data)
const emitAccion2 = (data) => emit('accion2', data)
const emitAccion3 = (data) => emit('accion3', data)
const emitAccion4 = (data) => emit('accion4', data)
const emitAccion5 = (data) => emit('accion5', data)
const emitAccion6 = (data) => emit('accion6', data)
const emitAccion7 = (data) => emit('accion7', data)
const emitAccion8 = (data) => emit('accion8', data)
const emitAccion9 = (data) => emit('accion9', data)
const emitAccion10 = (data) => emit('accion10', data)

function consultarTodos(uri) {
  emit('filtrar', uri)
}
</script>
