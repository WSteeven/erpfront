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
    :class="{ 'my-custom-toggle': !$q.screen.xs }"
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
    <!--:class="{ 'bg-grey-3': $q.screen.xs }" -->
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
    :agregarElemento="agregarElemento"
    :alto-fijo="altoFijo"
    :mostrarFooter="mostrarFooter"
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

function saludar() {
  console.log('amix')
}
</script>

<style lang="scss" scoped>
.my-custom-toggle {
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-radius: 8px 8px 0 0;
}
</style>
