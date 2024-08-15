<template>
  <div class="row q-col-gutter-sm q-py-md">
    <!-- DESCRIPCION DEL PERMISO -->
    <div class="col-12">
      <label class="q-mb-sm block">Permiso</label>
      <q-input
        v-model="entidad.nombre"
        placeholder="Obligatorio"
        :readonly="disable"
        :error="!!v$?.nombre.$errors.length"
        outlined
        dense
        mask="DOC-### ### ###"
        fill-mask
      >
        <template v-slot:error>
          <div v-for="error of v$?.nombre.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- FECHA DE EMISION -->
    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Fecha de Emisión</label>
      <q-input
        v-model="entidad.fecha_emision"
        placeholder="Obligatorio"
        outlined
        :disable="disable"
        type="date"
        dense
        :error="!!v$?.fecha_emision.$errors.length"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="entidad.fecha_emision"
                :mask="maskFecha"
                today-btn
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:error>
          <div v-for="error of v$?.fecha_emision.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- FECHA DE CADUCIDAD -->
    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Fecha de Caducidad</label>
      <q-input
        v-model="entidad.fecha_caducidad"
        placeholder="Obligatorio"
        outlined
        :disable="disable"
        type="date"
        dense
        :error="!!v$?.fecha_caducidad.$errors.length"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="entidad.fecha_caducidad"
                :mask="maskFecha"
                today-btn
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:error>
          <div v-for="error of v$?.fecha_caducidad.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <!-- Foto de permiso -->
    <div class="col-12 col-md-6 col-sm-6">
      <label for="q-mb-sm block">Imagen del permiso (anverso)</label>
      <selector-imagen
        file_extensiones=".jpg, image/*"
        :imagen="entidad.imagen_permiso"
        placeholder="Obligatorio"
        :comprimir="true"
        :disable="disable"
        :alto="'200px'"
        :error="!!v$?.imagen_permiso.$errors.length"
        @update:model-value="(data) => (entidad.imagen_permiso = data)"
      ></selector-imagen>
    </div>

    <!-- Foto de permiso reverso -->
    <div class="col-12 col-md-6 col-sm-6">
      <label for="q-mb-sm block">Imagen del permiso (reverso)</label>
      <selector-imagen
        file_extensiones=".jpg, image/*"
        :imagen="entidad.imagen_permiso_reverso"
        placeholder="Obligatorio"
        :comprimir="true"
        :disable="disable"
        :alto="'200px'"
        :error="!!v$?.imagen_permiso_reverso.$errors.length"
        @update:model-value="(data) => (entidad.imagen_permiso_reverso = data)"
      ></selector-imagen>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { maskFecha } from 'config/utils'
import { reactive } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { PermisoArma } from '../domain/PermisoArma'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  permiso: {
    type: Object as () => PermisoArma,
    required: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  v$: {
    type: Object,
    required: false,
  },
})

const entidad = reactive(props.permiso)

const emitir = () => emit('update:modelValue', entidad)
</script>
