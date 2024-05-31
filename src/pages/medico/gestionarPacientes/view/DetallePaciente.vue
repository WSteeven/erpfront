<template>
  <div class="row bg-desenfoque q-pa-md rounded">
    <div class="col-12 col-md-2 text-center">
      <q-img :src="empleado.foto_url ?? ''" width="60%"></q-img>
    </div>

    <div class="col-12 col-md-10">
      
      <div class="row q-col-gutter-md">
        <div class="col-12 text-primary text-bold text-h6 q-mb-md">
          {{ nombres }}
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Identificación</div>
          <q-icon name="bi-hash" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ empleado.identificacion }}</span><br>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Cantón</div>
          <q-icon
          name="bi-geo-alt-fill"
          color="primary"
          class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.nombre_canton }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Correo</div>
          <div>
            <q-icon
            name="bi-envelope-fill"
            color="primary"
            class="q-mr-sm"
            ></q-icon>
            <span>{{ empleado.email }}</span>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Edad</div>
          <q-icon name="cake" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ empleado.edad + ' años' }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Tipo de sangre</div>
          <q-icon
          name="bi-droplet-fill"
          color="primary"
          class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.tipo_sangre }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Género</div>
          <q-icon
          name="bi-gender-ambiguous"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ genero }}</span>
        </div>

        <div v-if="empleado.id" class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Peso</div>
          <q-icon name="bi-dot" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ '80KG' }}</span>
        </div>

        <div v-if="empleado.id" class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Altura</div>
          <q-icon name="bi-dot" color="primary" class="q-mr-sm"></q-icon>
          <span>{{ '1.80m' }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Teléfono</div>
          <q-icon
          name="bi-telephone-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.telefono }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Área</div>
          <q-icon
          name="bi-building-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.area_info }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Cargo</div>
          <q-icon
          name="bi-building-fill"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <span>{{ empleado.nombre_cargo }}</span>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-primary q-mb-sm">Fecha de ingreso</div>
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
