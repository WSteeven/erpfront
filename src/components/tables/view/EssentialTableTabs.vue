<template>
  <q-tabs
    v-model="tabSeleccionado"
    no-caps
    bordered
    dense
    narrow-indicator
    active-color="white"
    active-bg-color="primary"
    indicator-color="primary"
    :class="{
      'borde-header-tabla': !$q.screen.xs,
    }"
    class="bg-table-tabs"
    align="justify"
    @click="emit('tab-seleccionado', tabSeleccionado)"
  >
    <q-tab
      v-for="opcion in tabOptions"
      :key="opcion.label"
      :label="opcion.label"
      :name="opcion.value"
      class=""
      :class="{ 'rounded shadow-chip q-mx-xs q-my-md': $q.screen.xs }"
    >
    </q-tab>
  </q-tabs>

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
    :accion1Header="accion1Header"
    :accion2Header="accion2Header"
    :accion3Header="accion3Header"
    :alto-fijo="altoFijo"
    :mostrarFooter="mostrarFooter"
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
    :permitir-filtrar="permitirFiltrar"
    :permitir-buscar="permitirBuscar"
  ></essential-table>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TabOption } from 'components/tables/domain/TabOption'
import { ColumnConfig } from '../domain/ColumnConfig'
import EssentialTable from './EssentialTable.vue'
import { TipoSeleccion } from 'config/utils'
import { ref } from 'vue'

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
  'tab-seleccionado',
])

const tabSeleccionado = ref(props.tabDefecto)

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
</script>
