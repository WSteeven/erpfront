<template>
  <div class="col-12">
    <essential-table
      ref="refModalEditable"
      titulo="Productos seleccionados para devolución"
      :configuracionColumnas="configuracionColumnas"
      :datos="data"
      :accion1Header="addRow"
      :permitirBuscar="false"
      :permitirConsultar="false"
      :permitirEditar="true"
      :permitirEliminar="true"
      @eliminar="eliminar"
      :mostrarBotones="false"
      :permitirEditarModal="true"
      :modalMaximized="false"
      :alto-fijo="altoFijo"
      :mostrarFooter="mostrarFooter"
    ></essential-table>
  </div>
</template>
<script lang="ts" setup>
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { Producto } from 'pages/bodega/productos/domain/Producto'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, ref, Ref } from 'vue'
import { CustomActionTable } from '../domain/CustomActionTable'
import EssentialTable from './EssentialTable.vue'

const { confirmar } = useNotificaciones()
const props = defineProps({
  listadoProductos: {
    type: Object as () => Producto[],
    required: true,
  },
  listado: {
    type: Object as () => DetalleProducto[],
    required: true,
  },
  altoFijo: {
    type: Boolean,
    default: true,
  },
  mostrarFooter: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['actualizar'])
let refModalEditable = ref()
const productos = computed(() => props.listadoProductos.slice())
const data: Ref<DetalleProducto[]> = ref(props.listado)

function eliminar({ posicion }) {
  confirmar('¿Está seguro de continuar?', () => data.value.splice(posicion, 1))
}
const configuracionColumnas: any = computed(() => [
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
    type: 'select',
    options: productos.value.map((v: Producto) => {
      return { label: v.nombre }
    }),
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    type: 'number',
    sortable: false,
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'right',
    sortable: false,
  },
])
const addRow: CustomActionTable = {
  titulo: 'Agregar ítem',
  icono: 'bi-arrow-bar-down',
  color: 'positive',
  accion: () => {
    const fila = new DetalleProducto()
    // props.listado.push(fila)
    data.value.push(fila)
    refModalEditable.value.abrirModalEntidad(fila, data.value.length - 1)
    emit('actualizar', data.value)
  },
}
</script>
