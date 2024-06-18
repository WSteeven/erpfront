<template>
  <essential-table
    v-if="listado.length"
    titulo="Registro de pausas realizadas"
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
import { configuracionColumnasPausas } from '../domain/configuracionColumnasPausas'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref,  watchEffect } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useSubtareaStore } from 'stores/subtarea'

const props = defineProps({
  idSubtarea: Number,
})

// Emits
defineEmits(['cerrar-modal', 'seleccionar', 'guardado'])

/*********
 * Stores
 *********/
const subtareaStore = useSubtareaStore()

/************
 * Variables
 ************/
// const tareaTieneSubtareas = subtareaStore.tareaTieneSubtareas
// const codigoTareaSeleccionada = subtareaStore.codigoTareaSeleccionada
// const codigoSubtareaSeleccionada = subtareaStore.codigoSubtareaSeleccionada
const listado = ref([])

// const labelCodigo = computed(
//   () => 'Código de ' + (!tareaTieneSubtareas ? 'tarea: ' : 'subtarea: ')
// )

// const codigo = computed(() =>
//   !tareaTieneSubtareas ? codigoTareaSeleccionada : codigoSubtareaSeleccionada
// )

/*************
 * Funciones
 *************/
async function obtenerPausas() {
  const statusEssentialLoading = new StatusEssentialLoading()
  statusEssentialLoading.activar()

  const axios = AxiosHttpRepository.getInstance()
  const ruta =
    axios.getEndpoint(endpoints.pausas_subtareas) + '/' + props.idSubtarea
  const response: AxiosResponse = await axios.get(ruta)
  listado.value = response.data.results

  statusEssentialLoading.desactivar()
}

watchEffect(() => {
  if (props.idSubtarea) obtenerPausas()
})
</script>
