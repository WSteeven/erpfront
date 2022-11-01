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
    :class="{ 'borde-header-tabla': !$q.screen.xs }"
    class="bg-white"
    align="justify"
    @click="emit('tab-seleccionado', tabSeleccionado)"
  >
    <q-tab
      v-for="opcion in tabOptions"
      :key="opcion.label"
      :label="opcion.label"
      :name="opcion.value"
      class="q-mx-xs q-my-md rounded"
      :class="{ 'shadow-chip borde': $q.screen.xs }"
    ></q-tab>
  </q-tabs>

  <essential-table
    titulo=""
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
    :agregarElemento="agregarElemento"
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
  ></essential-table>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TabOption } from 'components/tables/domain/TabOption'
import { useAuthenticationStore } from 'stores/authentication'
import { ColumnConfig } from '../domain/ColumnConfig'
import EssentialTable from './EssentialTable.vue'
import { TipoSeleccion } from 'config/utils'
import { ref } from 'vue'

defineProps({
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
  agregarElemento: {
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
  'tab-seleccionado',
])

const store = useAuthenticationStore()
const esBodeguero = store.esBodeguero
const esCoordinador = store.esCoordinador
const tabSeleccionado = ref('TODO')

const consultar = (data) => emit('consultar', data)
const editar = (data) => emit('editar', data)
const eliminar = (data) => emit('eliminar', data)
const emitAccion1 = (data) => emit('accion1', data)
const emitAccion2 = (data) => emit('accion2', data)
const emitAccion3 = (data) => emit('accion3', data)
const emitAccion4 = (data) => emit('accion4', data)
const emitAccion5 = (data) => emit('accion5', data)
</script>
