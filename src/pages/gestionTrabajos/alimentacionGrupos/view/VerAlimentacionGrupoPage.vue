<template>
  <q-page>
    <div
      v-for="alimentacion in listado"
      :key="alimentacion.id"
      class="row q-mb-xl q-col-gutter-md bg-desenfoque border-white q-pb-md"
    >
      <div class="col-12 col-md-6">
        <label>Tarea</label>
        <div class="text-bold">{{ alimentacion.tarea }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Coordinador</label>
        <div class="text-bold">{{ alimentacion.coordinador }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Grupo</label>
        <div class="text-bold">{{ alimentacion.grupo }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Subtarea</label>
        <div class="text-bold">{{ alimentacion.subtarea }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Fecha de registro de alimentación</label>
        <div class="text-bold">{{ alimentacion.fecha }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Tipo de alimentación</label>
        <div class="text-bold">{{ alimentacion.tipo_alimentacion }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Observación</label>
        <div class="text-bold">{{ alimentacion.observacion }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Cantidad personas</label>
        <div class="text-bold">{{ alimentacion.cantidad_personas }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Precio</label>
        <div class="text-bold">{{ alimentacion.precio }}</div>
      </div>

      <div class="col-12 col-md-3">
        <label>Total</label>
        <div class="text-bold">{{ alimentacion.total }}</div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { AlimentacionGrupoController } from 'gestionTrabajos/alimentacionGrupos/infraestructure/AlimentacionGrupoController'
import { ref, defineProps } from 'vue'
import { AlimentacionGrupoPropsData } from '../domain/AlimentacionGrupoPropsData'

const props = defineProps({
  datos: Object as () => UnwrapRef<AlimentacionGrupoPropsData>
})

console.log(props)

const controller = new AlimentacionGrupoController()

const listado = ref()

controller
  .listar({ subtarea_id: props.datos.idSubtarea })
  .then(response => (listado.value = response.result))
</script>
