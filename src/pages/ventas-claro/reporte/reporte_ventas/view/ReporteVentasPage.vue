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
        <!-- Fecha Inicio -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Inicio:</label>
          <q-input
            v-model="reporte_ventas.fecha_inicio"
            placeholder="Obligatorio"
            :error="!!v$.fecha_inicio.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="reporte_ventas.fecha_inicio" :mask="maskFecha" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- Fecha Fin -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Fin:</label>
          <q-input
            v-model="reporte_ventas.fecha_fin"
            placeholder="Obligatorio"
            :error="!!v$.fecha_fin.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="reporte_ventas.fecha_fin" :mask="maskFecha" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
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
