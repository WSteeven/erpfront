<template>
  <essential-table
    ref="refTrabajos"
    :titulo="titulo"
    :configuracionColumnas="columnas"
    :datos="trabajoRealizado"
    :alto-fijo="false"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :permitir-buscar="false"
    :permitirEditarModal="true"
    :mostrarFooter="!trabajoRealizado.length"
    separador="cell"
    :accion1Header="agregarActividadRealizada"
    :accion1="accion1"
    @eliminar="eliminarTrabajoRealizado"
    :modalMaximized="$q.screen.xs"
    :entidad="entidad"
    :editarFilaLocal="editarFilaLocal"
    @guardarFila="(fila) => emit('guardar-fila', fila)"
    :ajustar-celdas="true"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { obtenerTiempoActual } from 'shared/utils'
import { accionesTabla } from 'config/utils'
import { Ref, ref, watchEffect } from 'vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Instanciable } from 'shared/entidad/domain/instanciable'

const props = defineProps({
  listado: {
    type: Object as () => EntidadAuditable[],
    required: true,
  },
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  entidad: {
    type: Object as Instanciable,
    required: true,
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  mostrarAccion1Header: {
    type: Boolean,
    default: true,
  },
  editarFilaLocal: {
    type: Boolean,
    default: true,
  },
  titulo: String,
  consultarTiempo: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['actualizar', 'guardar-fila'])

/************
 * Variables
 ************/
const trabajoRealizado: Ref<any[]> = ref(props.listado)
const { confirmar, notificarError } = useNotificaciones()
const refTrabajos = ref()
const cargando = new StatusEssentialLoading()

watchEffect(() => (trabajoRealizado.value = props.listado))

/***************************
 * Configuracion de columnas
 ****************************/
const columnas: any = [...props.configuracionColumnas, accionesTabla]

/************
 * Funciones
 ************/
const agregarActividadRealizada: CustomActionTable = {
  titulo: 'Agregar fila',
  icono: 'bi-plus',
  color: 'positive',
  visible: () => props.mostrarAccion1Header,
  accion: async () => {
    try {
      cargando.activar()
      if (props.consultarTiempo) {
        const { fecha_hora } = await obtenerTiempoActual()
        refTrabajos.value.abrirModalEditar({ fecha_hora })
        console.log(fecha_hora + '')
      } else {
        refTrabajos.value.abrirModalEditar()
      }
      // emit('actualizar', trabajoRealizado.value)
    } catch (e) {
      notificarError(
        'Problemas para obtener la fecha y hora actual del servidor. Verifica tu conexión a Internet.'
      )
    } finally {
      cargando.desactivar()
    }
  },
}

const eliminarTrabajoRealizado = ({ posicion }) => {
  confirmar('¿Está seguro de que desea eliminar?', () => {
    trabajoRealizado.value.splice(posicion, 1)
  })
}
</script>
