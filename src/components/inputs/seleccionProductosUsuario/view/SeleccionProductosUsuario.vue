<template>
  <div class="col-12">
    <label class="q-mb-sm block">Seleccione un cliente</label>
    <q-select
      v-model="cliente"
      :options="listadosAuxiliares.clientes"
      transition-show="scale"
      transition-hide="scale"
      :disable="!['NUEVO', 'EDITAR'].includes(acciones.nuevo)"
      @update:model-value="entidad.detalle_productos = []"
      use-input
      input-debounce="0"
      options-dense
      dense
      outlined
      :option-label="item => item.razon_social"
      :option-value="item => item.cliente_id"
      emit-value
      map-options
    >
      <template v-slot:after>
        <q-btn
          color="positive"
          unelevated
          :disable="!(accion === acciones.nuevo)"
          @click="refrescarListadosEmpleado('clientes')"
        >
          <q-icon size="xs" name="bi-arrow-clockwise" />
          <q-tooltip>Recargar clientes</q-tooltip>
        </q-btn>
      </template>
    </q-select>
  </div>

  <div class="col-12 col-md-12 q-mt-md">
    <label class="q-mb-sm block"
      >Agregar productos<b
        ><i> *Primero seleccione el origen de los productos</i></b
      ></label
    >
    <div class="row q-col-gutter-x-xs">
      <div class="col-12 col-md-10 q-mb-md">
        <q-input
          v-model="criterioBusquedaProducto"
          placeholder="Nombre de producto"
          hint="Presiona Enter para seleccionar un producto"
          @keydown.enter="consultarProductos"
          @blur="criterioBusquedaProducto === '' ? limpiarProducto() : null"
          outlined
          dense
        >
        </q-input>
      </div>
      <div class="col-12 col-md-2">
        <q-btn
          @click="consultarProductos()"
          icon="search"
          unelevated
          color="primary"
          class="full-width"
          square
          no-caps
          no-wrap
          >Buscar producto</q-btn
        >
      </div>
    </div>
  </div>

  <!-- Tabla -->
  <div class="col-12">
    <essential-table
      titulo="Productos seleccionados"
      :configuracionColumnas="columnas"
      :datos="entidad.detalles_productos"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrarBotones="false"
      :ajustarCeldas="true"
      :altoFijo="false"
      permitir-editar-celdas
      :accion1="accion1"
      :accion2="accion2"
      :accion3="accion3"
    ></essential-table>
  </div>

  <!-- Modal de seleccion de detalles -->
  <essential-selectable-table
    ref="refListado"
    :configuracion-columnas="configuracionColumnasDetallesModal"
    :datos="listadoProductos"
    tipo-seleccion="multiple"
    @selected="seleccionarProducto"
  ></essential-selectable-table>
</template>

<script lang="ts" setup>
import { useOrquestadorSelectorDetallesProductos } from 'components/inputs/seleccionProductosUsuario/application/OrquestadorSelectorDetallesProductos'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones } from 'config/utils'
import { ref } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteMaterialEmpleadoController } from 'pages/gestionTrabajos/miBodega/infraestructure/ClienteMaterialEmpleadoController'
import { configuracionColumnasDetallesModal } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/domain/configuracionColumnasDetallesModal'
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

// Uso de defineProps con la interface
const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<any>,
    required: true
  },
  propietario: Number,
  proyecto: Number,
  tarea: Number,
  etapa: Number,
  configuracionColumnas: Object as () => ColumnConfig<any>[],
  accion1: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion2: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion3: {
    type: Object as () => CustomActionTable,
    required: false
  }
})

/************
 * Variables
 ************/
const { entidad, listadosAuxiliares, accion } = props.mixin.useReferencias()
const { notificarAdvertencia } = useNotificaciones()
const cargando = new StatusEssentialLoading()
const cliente = ref()
const columnas =
  props.configuracionColumnas ??
  configuracionColumnasProductosSeleccionadosAccion

/*******************************************************************************************
 * Botones de tabla
 ******************************************************************************************/
/* const { botonEditarCantidad, botonEliminar } = useBotonesListadoProductos(
  transferencia,
  accion
) */

/***************
 * Orquestador
 ***************/
const {
  refListadoSeleccionable: refListado,
  criterioBusqueda: criterioBusquedaProducto,
  listado: listadoProductos,
  listar: listarProductos,
  limpiar: limpiarProducto,
  seleccionar: seleccionarProducto
} = useOrquestadorSelectorDetallesProductos(
  entidad,
  'materiales_empleado_consolidado'
)

const consultarProductos = async () => {
  if (!cliente.value)
    return notificarAdvertencia(
      'Debe seleccionar un cliente para filtrar los productos de origen'
    )
  if (!props.tarea) {
    // Stock
    return await listarProductos({
      empleado_id: props.propietario,
      cliente_id: cliente.value,
      stock_personal: 1
    })
  } else {
    if (!props.proyecto && !props.etapa) {
      return listarProductos({
        empleado_id: props.propietario,
        cliente_id: cliente.value,
        tarea_id: props.tarea
      })
    } else {
      return listarProductos({
        empleado_id: props.propietario,
        cliente_id: cliente.value,
        proyecto_id: props.proyecto,
        etapa_id: props.etapa
      })
    }
  }
}

async function consultarClientesMaterialesEmpleado() {
  try {
    cargando.activar()
    const { result } = await new ClienteMaterialEmpleadoController().listar({
      empleado_id: props.propietario
    })

    listadosAuxiliares.clientes = result
  } catch (e) {
    console.log(e)
  } finally {
    cargando.desactivar()
  }
}

async function refrescarListadosEmpleado(nombreListado: string) {
  switch (nombreListado) {
    case 'clientes':
      await consultarClientesMaterialesEmpleado()
      break
  }
}

consultarClientesMaterialesEmpleado()
</script>
