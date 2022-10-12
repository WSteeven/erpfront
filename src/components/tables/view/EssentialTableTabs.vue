<template>
  <!--<q-btn-toggle
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
  /> -->
  <q-tabs
    v-model="tabSeleccionado"
    no-caps
    bordered
    dense
    :class="{ 'my-custom-toggle': !$q.screen.xs }"
    align="justify"
    @click="emit('tab-seleccionado', tabSeleccionado)"
  >
    <q-tab
      v-for="opcion in tabOptions"
      :key="opcion.label"
      :label="opcion.label"
      :name="opcion.value"
    ></q-tab>
    <!--<q-tab label="Asignadas (4)" name="asignadas" />
    <q-tab label="Pendientes de asignar (9)" name="pendientes" />
    <q-tab label="Ventanas (10)" name="ventanas" />
    <q-tab label="Proyectos (9)" name="proyectos" /> -->
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
