<template>
  <q-page padding>
    <div class="text-bold q-mb-lg">Control de tendidos</div>
    <q-card flat bordered class="q-mb-md">
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Tarea -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Tarea</label>
          <q-select
            v-model="filtroReporteMaterial.tarea"
            :options="listadosAuxiliares.tareas"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.detalle"
            :option-value="(item) => item.id"
            emit-value
            map-options
            :error="!!v$.tarea.$errors.length"
            ><template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.detalle }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.tarea.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Grupo</label>
          <q-select
            v-model="filtroReporteMaterial.grupo"
            :options="listadosAuxiliares.grupos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombre"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.grupo.$errors.length"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.grupo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <!-- Fecha -->
        <div class="col-12 col-md-5">
          <label class="q-mb-sm block">Fecha</label>
          <q-input
            v-model="filtroReporteMaterial.fecha"
            outlined
            dense
            :error="!!v$.fecha.$errors.length"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filtroReporteMaterial.fecha"
                    mask="DD-MM-YYYY"
                    today-btn
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
              <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>

            <template #after>
              <q-btn
                color="positive"
                push
                no-caps
                class="full-width"
                @click="consultarReporte()"
              >
                <q-icon name="bi-search" class="q-mr-xs" size="xs"></q-icon>
                Consultar reporte</q-btn
              >
            </template>
          </q-input>
        </div>
      </div>
    </q-card>

    <essential-table
      v-if="listado.length"
      titulo="Listado de materiales"
      :configuracionColumnas="configuracionColumnasControlAsistencia"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEliminar="false"
      :permitirEditar="false"
      :mostrarBotones="false"
      :alto-fijo="false"
    ></essential-table>

    <!--<div v-if="listado.length" class="row justify-end q-gutter-sm q-pt-md">
      <q-btn color="primary" no-caps push @click="pdfMakeImprimir()">
        <q-icon name="bi-printer" size="xs" class="q-pr-sm"></q-icon>
        <span>Imprimir</span>
      </q-btn>
    </div> -->
  </q-page>
</template>

<script src="./ReporteResumenTendidoPage.ts"></script>
