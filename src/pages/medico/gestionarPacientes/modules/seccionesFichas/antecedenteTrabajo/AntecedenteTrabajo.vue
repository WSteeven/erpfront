<template>
  <div class="row q-col-gutter-xs">
    <div class="col-12 col-md-6 q-mb-md">
      <label class="q-mb-sm block"
        >Fue calificado por el Instituto de Seguridad Social
        correspondiente</label
      >
      <div class="q-gutter-sm">
        <q-radio
          v-for="option in selectOptionsSiNo"
          :key="option.label"
          v-model="entidad.calificado_iess"
          :val="option.value"
          :label="`${option.label}`"
          :disable="disable"
        />
      </div>
    </div>

    <div v-if="entidad.calificado_iess" class="col-12 col-md-6 q-mb-md">
      <label class="q-mb-sm block">Especificar</label>
      <q-input
        v-model="entidad.descripcion"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
      >
      </q-input>
    </div>

    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Fecha</label>
      <q-input
        v-model="entidad.fecha"
        placeholder="Opcional"
        outlined
        :disable="disable"
        type="date"
        dense
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="entidad.fecha" :mask="maskFecha" today-btn>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-6 q-mb-md">
      <label class="q-mb-sm block">Observación</label>
      <q-input
        v-model="entidad.observacion"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
      >
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { DescripcionAntecedenteTrabajo } from '../../fichaPeriodicaPreocupacional/domain/DescripcionAntecedenteTrabajo'
import { maskFecha, selectOptionsSiNo } from 'config/utils'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  antecedenteTrabajo: {
    type: Object as () => DescripcionAntecedenteTrabajo,
    required: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
})

const entidad = reactive(props.antecedenteTrabajo)

const emitir = () => emit('update:modelValue', entidad)
</script>
