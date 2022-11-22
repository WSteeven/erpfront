<template>
  <essential-table
    titulo="Pausas realizadas"
    :configuracionColumnas="(configuracionColumnasPausas as any)"
    :datos="listado"
    separador="cell"
    :alto-fijo="false"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasPausas } from '../../../../../domain/configuracionColumnasPausas'
import { Pausa } from 'pages/tareas/subtareas/domain/Pausa'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { ref } from 'vue'

/* const listado: Pausa[] = [
  {
    id: 1,
    fecha_pausa: '25/04/2022',
    hora_pausa: '08:15:14',
    fecha_retorno: '25/04/2022',
    hora_retorno: '10:15:14',
    detalle: 'SE REALIZÓ LA PAUSA POR ...',
  },
  {
    id: 2,
    fecha_pausa: '26/04/2022',
    hora_pausa: '12:36:45',
    fecha_retorno: '26/04/2022',
    hora_retorno: '16:36:45',
    detalle: 'HORA DE ALMUERZO ...',
  },
] */

console.log('abriendo pausas')
const subtareaListadoStore = useSubtareaListadoStore()
const controller = new SubtareaController()

const idSubtarea = subtareaListadoStore.idSubtareaSeleccionada
const listado = ref()

if (idSubtarea) {
  // consultar({ id: subtareaListadoStore.idSubtareaSeleccionada })
  obtenerPausas()
}

async function obtenerPausas() {
  console.log('Consultando: ' + subtareaListadoStore.idSubtareaSeleccionada)
  const axios = AxiosHttpRepository.getInstance()
  const ruta = axios.getEndpoint(endpoints.pausas_subtareas) + '/' + idSubtarea
  const response: any = await axios.get(ruta)
  console.log(response.data.results)
  listado.value = response.data.results
}
</script>
