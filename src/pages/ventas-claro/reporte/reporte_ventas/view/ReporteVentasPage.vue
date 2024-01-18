<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Ventas</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Mes -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Mes:</label>
          <q-input
              v-model="reporte_ventas.mes"
              placeholder="Obligatorio"
              :value="reporte_ventas.mes"
              @click="$refs.monthPicker.show()"
              mask="##-####"
              :error="!!v$.mes.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.mes.$touch"
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
                      v-model="reporte_ventas.mes"
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

      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around">
        <q-btn color="positive" @click="generar_reporte(reporte_ventas, 'excel')">
          <q-icon name="bi-file-earmark-excel-fill" size="xs" class="q-mr-sm"></q-icon
          >Generar</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ReporteVentasPage.ts"></script>
