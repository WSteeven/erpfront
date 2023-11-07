<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <!-- Trimestre -->
        <div class="col-12 col-md-3">
            <label class="q-mb-sm block">TRIMESTRE</label>
            <q-input
              v-model="bono_trimestral_cumplimiento.trimestre"
              placeholder="Obligatorio"
 	            @click="$refs.monthPicker.show()"
              :error="!!v$.trimestre.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.trimestre.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                    v-model="bono_trimestral_cumplimiento.trimestre"
                      mask="Qo-YYYY"
                      minimal
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkValue"




                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.trimestre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./BonoTrimestralCumplimientoPage.ts"></script>
