<template>
  <div class="row">
    <div class="col-12 col-md-2 text-center">
      <q-img :src="empleado.foto_url ?? ''" width="60%"></q-img>
    </div>

    <div class="col-12 col-md-10">
      <div class="row q-col-gutter-md">
        <div class="col-12 text-primary text-bold">
          {{ nombres }}
        </div>

        <div class="col-12 col-md-3">
          <q-icon name="bi-hash" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ empleado.identificacion }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-geo-alt-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.nombre_canton }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-envelope-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.email }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon name="cake" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ empleado.fecha_nacimiento }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-droplet-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.tipo_sangre }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-gender-ambiguous"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ genero }}</span>
        </div>

        <div v-if="empleado.id" class="col-12 col-md-3">
          <q-icon name="bi-dot" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ '80KG' }}</span>
        </div>

        <div v-if="empleado.id" class="col-12 col-md-3">
          <q-icon name="bi-dot" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ '1.80m' }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-telephone-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.telefono }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-building-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.area_info }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-building-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.nombre_cargo }}</span>
        </div>

        <div class="col-12 col-md-3">
          <q-icon
            name="bi-building-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.fecha_ingreso }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { computed } from 'vue'

const props = defineProps({
  empleado: {
    type: Object as () => Empleado,
    required: true,
  },
})

const genero = computed(() =>
  props.empleado.genero === 'M' ? 'MASCULINO' : 'FEMENINO'
)

const nombres = computed(
  () => props.empleado.nombres + ' ' + (props.empleado.apellidos ?? '')
)
</script>
