<script setup lang="ts">
import { ref } from 'vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { PermisoEmpleadoController } from 'recursosHumanos/permiso-empleado/infraestructure/PermisoEmpleadoController'
import { configuracionColumnasPermisoEmpleado } from 'recursosHumanos/permiso-empleado/domain/configuracionColumnasPermisoEmpleado'
import CalloutComponent from 'components/CalloutComponent.vue';

const props = defineProps({
  mostrarEncabezado: { type: Boolean, default: true },
  empleado_id: { type: Number, required: true },
  fecha: { type: String, required: true }
})
const cargando = new StatusEssentialLoading()
const permiso = ref()
const listado = ref([])

async function consultarPermiso() {
  try {
    cargando.activar()

    const { result } = await new PermisoEmpleadoController().listar({
      'or[empleado_id]': props.empleado_id,
      fecha_hora_inicio: props.fecha,
    }
    )
    permiso.value = result[0]
    listado.value.push(permiso.value)
  } catch (error) {
    console.error(error)
  } finally {
    cargando.desactivar()
  }
}

consultarPermiso()
</script>

<template>
  <q-card>
    <q-card-section v-if="permiso">
      <div class="text-h6 q-pb-md" v-if="mostrarEncabezado">
        Permisos solicitados por el empleado: {{ permiso?.empleado_info }}
      </div>

      <essential-table
        :datos="listado"
        :alto-fijo="false"
        :mostrarHeader="false"
        :mostrarFooter="false"
        :configuracion-columnas="configuracionColumnasPermisoEmpleado"
      />
    </q-card-section>
    <q-card-section v-else>
      <div class="row justify-center">
       <div class="text-h6 col-12 text-center">
         <callout-component mensaje="No hay permisos registrados para este día" tipo="warning"/>

      </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
