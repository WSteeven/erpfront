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

/************
 * Variables
 ************/
const refObservaciones = ref()
const observaciones: Ref<Observacion[]> = ref([])
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
  titulo: 'Agregar ítem',
  icono: 'bi-arrow-bar-down',
  accion: () => {
    const fila: Observacion = new Observacion()

    observaciones.value.push(fila)
    refObservaciones.value.abrirModalEntidad(
      fila,
      observaciones.value.length - 1
    )
  },
}

const eliminarObservacion = ({ posicion }) => {
  confirmar('¿Está seguro de que desea eliminar?', () => {
    observaciones.value.splice(posicion, 1)
  })
}
</script>
