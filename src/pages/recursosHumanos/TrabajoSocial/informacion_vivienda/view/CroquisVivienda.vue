<script setup lang="ts">
import SelectorImagen from 'components/SelectorImagen.vue'
import { obtenerUbicacion } from 'shared/utils'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

const props = defineProps({
  vivienda: { type: Vivienda, required: true },
  disable: { type: Boolean, default: false }
})

const vivienda: Vivienda = props.vivienda

const reglas = {
  imagen_croquis: { required },
  coordenadas: { required },
  direccion: { required },
  referencia: { required }
}
const v$ = useVuelidate(reglas, vivienda)

function obtenerCoordenadas() {
  obtenerUbicacion(ubicacion => {
    vivienda.coordenadas =
      ubicacion.coords.latitude + ' ' + ubicacion.coords.longitude
  })
}
</script>

<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col-6 col-md-6 col-sm-12 ">
      <label for="q-mb-xl block">Croquis</label>
      <selector-imagen
        file_extensiones=".jpg, image/*"
        :imagen="vivienda.imagen_croquis"
        :disable="disable"
        :error="!!v$.imagen_croquis.$errors.length"
        :alto="'300px'"
        @update:model-value="data => (vivienda.imagen_croquis = data)"
      ></selector-imagen>
    </div>
    <div class="col-6 col-md-6 col-sm-12">

      <!-- Coordenadas -->
      <div class="col-12 col-md-4">
        <label class="q-mb-sm block">Coordenadas</label>
        <q-input
          v-model="vivienda.coordenadas"
          placeholder="Obligatorio"
          :error="!!v$.coordenadas.$errors.length"
          @blur="v$.coordenadas.$touch"
          outlined
          :disable="disable"
          dense
        >
          <template v-slot:append>
            <q-icon
              name="bi-geo-alt"
              @click="obtenerCoordenadas"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:error>
            <div v-for="error of v$.coordenadas.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
      <!-- Dirección -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Dirección</label>
        <q-input
          v-model="vivienda.direccion"
          placeholder="Obligatorio"
          autogrow
          :error="!!v$.direccion.$errors.length"
          @blur="v$.direccion.$touch"
          outlined
          :disable="disable"
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.direccion.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Referencia -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Referencia</label>
        <q-input
          v-model="vivienda.referencia"
          placeholder="Obligatorio"
          outlined
          autogrow
          :error="!!v$.referencia.$errors.length"
          @blur="v$.referencia.$touch"
          :disable="disable"
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.referencia.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

    </div>
  </div>
</template>

<style scoped></style>
