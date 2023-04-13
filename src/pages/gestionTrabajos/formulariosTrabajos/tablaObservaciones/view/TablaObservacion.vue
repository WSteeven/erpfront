<template>
  <essential-table
    ref="refObservaciones"
    titulo="Observaciones / Mejoras / Pendientes"
    :configuracionColumnas="columnasObservacion"
    :datos="observaciones"
    :alto-fijo="false"
    :permitirConsultar="false"
    :permitir-buscar="false"
    :permitirEditarModal="true"
    :mostrarFooter="!observaciones.length"
    separador="cell"
    :accion1Header="agregarObservacion"
    @eliminar="eliminarObservacion"
    :modalMaximized="$q.screen.xs"
    :entidad="Observacion"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasObservacion } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasObservacion'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla } from 'config/utils'
import { ref, Ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import Observacion from '../../emergencias/domain/Observacion'

const props = defineProps({
  listado: {
    type: Object as () => Observacion[],
    required: true,
  },
})

const emit = defineEmits(['actualizar'])

/************
 * Variables
 ************/
const refObservaciones = ref()
const observaciones: Ref<Observacion[]> = ref(props.listado)
const { confirmar } = useNotificaciones()

/***************************
 * Configuracion de columnas
 ****************************/
const columnasObservacion: any = [
  ...configuracionColumnasObservacion,
  accionesTabla,
]

/************
 * Funciones
 ************/
const agregarObservacion: CustomActionTable = {
  titulo: 'Agregar observación',
  icono: 'bi-arrow-bar-down',
  color: 'positive',
  accion: () => {
    /* const fila: Observacion = new Observacion()

    observaciones.value.push(fila)
    refObservaciones.value.abrirModalEntidad(
      fila,
      observaciones.value.length - 1
    ) */
    refObservaciones.value.abrirModalEditar()
    emit('actualizar', observaciones.value)
  },
}

const eliminarObservacion = ({ posicion }) => {
  confirmar('¿Está seguro de que desea eliminar?', () => {
    observaciones.value.splice(posicion, 1)
  })
}
</script>
