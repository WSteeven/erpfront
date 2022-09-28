<template>
  <q-btn-toggle
    v-model="tabSeleccionado"
    spread
    class="my-custom-toggle"
    no-caps
    unelevated
    bordered
    toggle-color="primary"
    color="white"
    text-color="grey-9"
    :options="tabOptions"
    @click="emit('tab-seleccionado', tabSeleccionado)"
  />

  <essential-table
    :titulo="titulo"
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :permitirConsultar="permitirConsultar"
    :permitirEditar="permitirEditar"
    :mostrar-botones="mostrarBotones"
    :accion1="accion1"
    :agregarElemento="agregarElemento"
    @consultar="emit('consultar')"
    @editar="emit('editar')"
    @eliminar="emit('eliminar')"
    @accion1="emit('accion1')"
  ></essential-table>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { ColumnConfig } from '../domain/ColumnConfig'
import EssentialTable from './EssentialTable.vue'
import { TipoSeleccion } from 'config/utils'
import { ref } from 'vue'
import { TabOption } from 'components/tables/domain/TabOption'

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
  'tab-seleccionado',
])

const tabSeleccionado = ref('todo')
</script>

<style lang="scss" scoped>
.my-custom-toggle {
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-radius: 8px 8px 0 0;
}
</style>
