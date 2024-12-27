<template>
  <div class="col-12">
    <label class="q-mb-sm block">Seleccione un cliente</label>

    <!-- :disable="!['NUEVO', 'EDITAR'].includes(acciones.nuevo)" -->
    <q-select
      v-model="entidad.cliente"
      :options="listadosAuxiliares.clientes"
      transition-show="scale"
      transition-hide="scale"
      @update:model-value="entidad.detalles_productos = []"
      :disable="disable || deshabilitarAgregarProductos"
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
          :disable="disable || deshabilitarAgregarProductos"
          @click="refrescarListadosEmpleado('clientes')"
        >
          <q-icon size="xs" name="bi-arrow-clockwise" />
          <q-tooltip>Recargar clientes</q-tooltip>
        </q-btn>
      </template>
    </q-select>
  </div>

  <div class="col-12 col-md-12 q-mt-md">
    <label class="q-mb-sm block">Agregar productos</label>
    <div class="row q-col-gutter-x-xs">
      <div class="col-12 col-md-10 q-mb-md">
        <q-input
          v-model="criterioBusquedaProducto"
          placeholder="Escriba el nombre del producto y luego presione en Buscar producto"
          hint="También puede presionar Enter para buscar un producto"
          @keydown.enter="consultarProductos"
          @blur="criterioBusquedaProducto === '' ? limpiarProducto() : null"
          :disable="disable || deshabilitarAgregarProductos"
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
          :disable="disable || deshabilitarAgregarProductos"
          square
          no-caps
          no-wrap
          >Buscar producto</q-btn
        >
      </div>

      <div class="col-3">
        <q-checkbox
          v-model="filtrarPorCategoria"
          label="Filtrar por categoría"
          :disable="
            disable || deshabilitarAgregarProductos || forzarCategoriasSso
          "
          @update:model-value="
            () => {
              consultarCategorias()
              categoriaProductos = null
            }
          "
        />
      </div>

      <div v-if="filtrarPorCategoria" class="col-3">
        <label class="q-mb-sm block">Seleccione una categoría</label>
        <q-select
          v-model="categoriaProductos"
          :options="listadosAuxiliares.categorias"
          transition-show="scale"
          transition-hide="scale"
          :disable="disable || deshabilitarAgregarProductos"
          use-input
          input-debounce="0"
          options-dense
          dense
          outlined
          :option-label="item => item.nombre"
          :option-value="item => item.id"
          emit-value
          map-options
        >
          <template v-slot:after>
            <q-btn
              color="positive"
              unelevated
              :disable="disable"
              @click="refrescarListadosEmpleado('categorias')"
            >
              <q-icon size="xs" name="bi-arrow-clockwise" />
              <q-tooltip>Recargar clientes</q-tooltip>
            </q-btn>
          </template>
        </q-select>
      </div>
    </div>
  </div>

  <!-- Tabla -->
  <div class="col-12 q-mt-md">
    <essential-table
      titulo="Productos seleccionados"
      :configuracionColumnas="columnas"
      :datos="entidad.detalles_productos"
      :permitirConsultar="false"
      :permitirEditar="false"
      :disable="disable"
      :permitirEliminar="false"
      :mostrarBotones="false"
      :ajustarCeldas="true"
      :altoFijo="false"
      permitir-editar-celdas
      :accion1="accion1"
      :accion2="accion2"
      :accion3="accion3"
      :accion4="accion4"
      :accion5="accion5"
      :accion6="accion6"
    ></essential-table>
    <!-- :accion3="accion3" -->
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
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, ref, watch } from 'vue'
import { acciones } from 'config/utils'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

import { configuracionColumnasDetallesModal } from 'pages/gestionTrabajos/transferenciasProductosEmpleados/domain/configuracionColumnasDetallesModal'
import { ClienteMaterialEmpleadoController } from 'pages/gestionTrabajos/miBodega/infraestructure/ClienteMaterialEmpleadoController'
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController'
import { Categoria } from 'pages/bodega/categorias/domain/Categoria'
import { Cliente } from 'sistema/clientes/domain/Cliente'

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
  disable: Boolean,
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
  },
  accion4: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion5: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion6: {
    type: Object as () => CustomActionTable,
    required: false
  },
  filtrarPorCategoria: {
    type: Boolean,
    default: false
  },
  deshabilitarAgregarProductos: {
    type: Boolean,
    default: false
  },
  forzarCategoriasSso: {
    type: Boolean,
    default: false
  }
})

/********
 * Mixin
 ********/
const { cargarVista, obtenerListados } = props.mixin.useComportamiento()

const consultarCategorias = () =>
  cargarVista(async () => {
    await obtenerListados({
      categorias: new CategoriaController()
    })

    if (props.forzarCategoriasSso) {
      listadosAuxiliares.categorias = listadosAuxiliares.categorias.filter(
        (c: Categoria) => categoriasSso.includes(c.nombre ?? '')
      )
    }
  })

/************
 * Variables
 ************/
const { entidad, listadosAuxiliares, accion } = props.mixin.useReferencias()
const { notificarAdvertencia } = useNotificaciones()
const cargando = new StatusEssentialLoading()
const filtrarPorCategoria = ref(props.filtrarPorCategoria)
const categoriaProductos = ref()
const columnas =
  props.configuracionColumnas ??
  configuracionColumnasProductosSeleccionadosAccion
const categoriasSso = ['EPP', 'EQUIPO', 'EQUIPO PROPIO']

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

/*************
 * Observers
 *************/
// watch()

/*************
 * Funciones
 ************/
const consultarProductos = async () => {
  if (!entidad.cliente)
    return notificarAdvertencia(
      'Debe seleccionar un cliente para filtrar los productos de origen'
    )
  if (!props.tarea) {
    // Stock
    return await listarProductos({
      empleado_id: props.propietario,
      cliente_id: entidad.cliente,
      stock_personal: 1,
      categoria_id: categoriaProductos.value
    })
  } else {
    if (!props.proyecto && !props.etapa) {
      return listarProductos({
        empleado_id: props.propietario,
        cliente_id: entidad.cliente,
        tarea_id: props.tarea,
        categoria_id: categoriaProductos.value
      })
    } else {
      return listarProductos({
        empleado_id: props.propietario,
        cliente_id: entidad.cliente,
        proyecto_id: props.proyecto,
        etapa_id: props.etapa,
        categoria_id: categoriaProductos.value
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

    if (props.forzarCategoriasSso) {
      listadosAuxiliares.clientes = listadosAuxiliares.clientes.filter(
        (c: Cliente) =>
          ['JP CONSTRUCRED C.LTDA.'].includes(c.razon_social ?? '')
      )
    }
  } catch (e) {
    console.log(e)
  } finally {
    cargando.desactivar()
  }
}

async function refrescarListadosEmpleado(nombreListado: string) {
  switch (nombreListado) {
    case 'clientes':
      consultarClientesMaterialesEmpleado()
      break
    case 'categorias':
      consultarCategorias()
      break
  }
}

watch(
  computed(() => props.propietario),
  () => {
    consultarClientesMaterialesEmpleado()
    if (accion.value === acciones.nuevo) {
      entidad.detalles_productos = []
      entidad.cliente = null
    }
  }
)

filtrarPorCategoria.value = props.forzarCategoriasSso
consultarCategorias().then(
  () => (categoriaProductos.value = listadosAuxiliares.categorias[0].id)
)
</script>
