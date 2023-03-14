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
import { configuracionColumnasPausas } from '../domain/configuracionColumnasPausas'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { useSubtareaStore } from 'stores/subtarea'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

// Se declara el props porque asi está en ModalEntidad
defineProps({
  mixinModal: {
    type: Object as () => ContenedorSimpleMixin<any>,
    required: false,
  },
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
const codigoTrabajoSeleccionado = subtareaStore.codigoTrabajoSeleccionado
const listado = ref([])

/*************
 * Funciones
 *************/

async function obtenerPausas() {
  const statusEssentialLoading = new StatusEssentialLoading()
  statusEssentialLoading.activar()

  const axios = AxiosHttpRepository.getInstance()
  const ruta =
    axios.getEndpoint(endpoints.pausas_subtareas) +
    '/' +
    subtareaStore.idSubtareaSeleccionada
  const response: AxiosResponse = await axios.get(ruta)
  listado.value = response.data.results

  statusEssentialLoading.desactivar()
}

obtenerPausas()
</script>
