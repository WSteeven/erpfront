<template>
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
import { configuracionColumnasPausas } from 'controlTareas/modules/subtareas/domain/configuracionColumnasPausas'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { endpoints } from 'config/api'
import { ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

// Props
defineProps({
  mixinModal: {
    type: Object as () => ContenedorSimpleMixin<any>,
    required: true,
  },
})

// Emits
defineEmits(['cerrar-modal', 'seleccionar'])

const subtareaListadoStore = useSubtareaListadoStore()

const idSubtarea = subtareaListadoStore.idSubtareaSeleccionada
const listado = ref([])

obtenerPausas()

async function obtenerPausas() {
  const axios = AxiosHttpRepository.getInstance()
  const ruta = axios.getEndpoint(endpoints.pausas_subtareas) + '/' + idSubtarea
  const response: any = await axios.get(ruta)
  listado.value = response.data.results
}
</script>
