<script setup lang="ts">
import { ref, UnwrapRef } from 'vue'
import { AsistenciaController } from 'controlPersonal/asistencia/infraestructure/AsistenciaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasAsistencia } from 'controlPersonal/asistencia/domain/configuracionColumnasAsistencia'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

const props = defineProps({
  mostrarEncabezado: { type: Boolean, default: true },
  datos: Object as () => UnwrapRef<{ marcacion_id: int }>
})
const cargando = new StatusEssentialLoading()
const marcacion = ref()
const listado = ref([])

async function consultarMarcacion() {
  try {
    cargando.activar()

    const { result } = await new AsistenciaController().consultar(
      props.datos?.marcacion_id
    )
    marcacion.value = result
    listado.value.push(marcacion.value)
  } catch (error) {
    console.error(error)
  } finally {
    cargando.desactivar()
  }
}

consultarMarcacion()
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-pb-md" v-if="mostrarEncabezado">
        Registro de marcaciones del empleado: {{ marcacion?.empleado }}
      </div>

      <essential-table
        :datos="listado"
        :alto-fijo="false"
        :mostrarHeader="false"
        :mostrarFooter="false"
        :configuracion-columnas="configuracionColumnasAsistencia"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
