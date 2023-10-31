<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <!-- Mes -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block"> Mes </label>
          <q-input
            v-model="pagocomision.mes"
            placeholder="Obligatorio"
            :value="pagocomision.mes"
            mask="##-####"
            :error="!!v$.mes.$errors.length"
            :disable="accion == 'CONSULTAR' || accion == 'EDITAR'"
            @blur="v$.mes.$touch"
            readonly
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
                    v-model="pagocomision.mes"
                    minimal
                    mask="MM-YYYY"
                    emit-immediately
                    default-view="Years"
                    @update:model-value="checkValue"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.mes.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./ComisionPagoPage.ts"></script>
