<script setup lang="ts">
import { ref, UnwrapRef } from 'vue'
import { AsistenciaController } from 'controlPersonal/asistencia/infraestructure/AsistenciaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasAsistencia } from 'controlPersonal/asistencia/domain/configuracionColumnasAsistencia'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import PermisoPage from './PermisoPage.vue';
import {Asistencia} from 'controlPersonal/asistencia/domain/Asistencia';

const props = defineProps({
  mostrarEncabezado: { type: Boolean, default: true },
  datos: Object as () => UnwrapRef<{ marcacion_id: number }>
})
const cargando = new StatusEssentialLoading()
const marcacion = ref<Asistencia>()
const listado = ref([])
const mostrarPermisoComponent = ref(false)

async function consultarMarcacion() {
  try {
    cargando.activar()

    const { result } = await new AsistenciaController().consultar(
      props.datos?.marcacion_id
    )
    marcacion.value = result
    listado.value.push(marcacion.value)
    mostrarPermisoComponent.value = true
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
  </q-card> <hr>
  <permiso-page v-if="mostrarPermisoComponent" :empleado_id="marcacion?.empleado_id" :fecha="marcacion?.fecha"/>
</template>

<style scoped></style>
