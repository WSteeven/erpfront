<template>
  <div class="col-12 q-mb-lg">
    <b>Código de trabajo: </b>{{ codigoTrabajoSeleccionado }}
  </div>
  <essential-table
    titulo="Pausas realizadas"
    :configuracionColumnas="(configuracionColumnasPausas as any)"
    :datos="listado"
    separador="cell"
    :alto-fijo="false"
    :permitir-buscar="false"
    :mostrar-footer="!listado.length"
  ></essential-table>
</template>

<script lang="ts" setup>
// Dependencias
import { configuracionColumnasPausas } from 'trabajos/modules/pausasRealizadas/domain/configuracionColumnasPausas'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useTrabajoStore } from 'stores/trabajo'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

// Emits
defineEmits(['cerrar-modal', 'seleccionar'])

/*********
 * Stores
 *********/
const trabajoStore = useTrabajoStore()

/************
 * Variables
 ************/
const codigoTrabajoSeleccionado = trabajoStore.codigoTrabajoSeleccionado
const listado = ref([])

/*************
 * Funciones
 *************/

async function obtenerPausas() {
  const statusEssentialLoading = new StatusEssentialLoading()
  statusEssentialLoading.activar()

  const axios = AxiosHttpRepository.getInstance()
  const ruta =
    axios.getEndpoint(endpoints.pausas_trabajos) +
    '/' +
    trabajoStore.idTrabajoSeleccionado
  const response: AxiosResponse = await axios.get(ruta)
  listado.value = response.data.results

  statusEssentialLoading.desactivar()
}

obtenerPausas()
</script>
