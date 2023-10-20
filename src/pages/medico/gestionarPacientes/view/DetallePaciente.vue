<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 text-primary text-bold">
      {{ empleado.nombres + empleado.apellidos }}
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="bi-hash" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.identificacion }}</span>
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="bi-geo-alt-fill" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.nombre_canton }}</span>
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="bi-envelope-fill" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.email }}</span>
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="cake" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.fecha_nacimiento }}</span>
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="bi-telephone-fill" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.telefono }}</span>
    </div>

    <div class="col-12 col-md-3">
      <q-icon name="bi-droplet-fill" color="primary" class="q-mr-sm"></q-icon>
      <span>{{ empleado.tipo_sangre }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'

defineProps({
  empleado: {
    type: Object as () => Empleado,
    required: true,
  },
})
</script>
