<template>
  <essential-table
    ref="refTrabajos"
    titulo="Cronología de trabajos realizados"
    :configuracionColumnas="columnasTrabajoRealizado"
    :datos="trabajoRealizado"
    :alto-fijo="false"
    :permitirConsultar="false"
    :permitir-buscar="false"
    :permitirEditarModal="true"
    :mostrarFooter="!trabajoRealizado.length"
    separador="cell"
    :accion1Header="agregarActividadRealizada"
    @eliminar="eliminarTrabajoRealizado"
    :modalMaximized="$q.screen.xs"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { obtenerTiempoActual } from 'shared/utils'
import { accionesTabla } from 'config/utils'
import { Ref, ref, watchEffect } from 'vue'

// Componentes
import TrabajoRealizado from '../../emergencias/domain/TrabajoRealizado'

// Logica y controladores
import EssentialTable from 'components/tables/view/EssentialTable.vue'

const props = defineProps({
  listado: {
    type: Object as () => TrabajoRealizado[],
    required: true,
  },
})

const emit = defineEmits(['actualizar'])

/************
 * Variables
 ************/
const trabajoRealizado: Ref<TrabajoRealizado[]> = ref(props.listado)
const { confirmar } = useNotificaciones()
const refTrabajos = ref()

watchEffect(() => (trabajoRealizado.value = props.listado))

/***************************
 * Configuracion de columnas
 ****************************/
const columnasTrabajoRealizado: any = [
  ...configuracionColumnasTrabajoRealizado,
  accionesTabla,
]

/************
 * Funciones
 ************/
const agregarActividadRealizada: CustomActionTable = {
  titulo: 'Agregar actividad',
  icono: 'bi-arrow-bar-down',
  color: 'positive',
  accion: async () => {
    const fila: TrabajoRealizado = new TrabajoRealizado()
    const { hora } = await obtenerTiempoActual()
    fila.hora = hora
    trabajoRealizado.value.push(fila)
    refTrabajos.value.abrirModalEntidad(fila, trabajoRealizado.value.length - 1)
    emit('actualizar', trabajoRealizado.value)
  },
}

const eliminarTrabajoRealizado = ({ posicion }) => {
  confirmar('¿Está seguro de que desea eliminar?', () => {
    trabajoRealizado.value.splice(posicion, 1)
  })
}
</script>
