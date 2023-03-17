<template>
  <essential-table
    titulo="Registro de suspensiones"
    :configuracionColumnas="(configuracionColumnasSuspendido as any)"
    :datos="listado"
    separador="cell"
    :alto-fijo="false"
    :permitir-buscar="false"
    :mostrar-footer="!listado.length"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasSuspendido } from '../domain/configuracionColumnasSuspendido'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref, watchEffect } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

const props = defineProps({
  idSubtarea: Number,
})

/************
 * Variables
 ************/
const listado = ref([])

/*************
 * Funciones
 *************/
async function obtenerSuspendidos() {
  const statusEssentialLoading = new StatusEssentialLoading()
  statusEssentialLoading.activar()

  const axios = AxiosHttpRepository.getInstance()
  const ruta =
    axios.getEndpoint(endpoints.suspendidos_subtareas) + '/' + props.idSubtarea
  const response: AxiosResponse = await axios.get(ruta)
  listado.value = response.data.results

  statusEssentialLoading.desactivar()
}

watchEffect(() => {
  if (props.idSubtarea) obtenerSuspendidos()
})
</script>
