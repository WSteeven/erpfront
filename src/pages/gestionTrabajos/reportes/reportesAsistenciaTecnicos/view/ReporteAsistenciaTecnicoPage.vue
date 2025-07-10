<template>
<q-page padding>
  <q-card class="q-mb-md rounded no-border bg-desenfoque custom-shadow">
<!--    <q-card-section>-->
<!--      <div class="col-12 col-md-6">-->
<!--        <q-btn-toggle-->
<!--            v-model="tipoDashboard"-->
<!--            class="toggle-button-primary"-->
<!--            spread-->
<!--            no-caps-->
<!--            rounded-->
<!--            toggle-color="primary"-->
<!--            unelevated-->
<!--            :options="tiposDashboard"-->
<!--        />-->
<!--      </div>-->
<!--    </q-card-section>-->

<!--    <q-card-section v-if="tipoDashboard === SISTEMA">-->
    <q-card-section v-if="true">
      <div class="border-1 text-primary text-bold q-mb-lg">
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Reporte de asistencia: Módulo de tareas
      </div>
      <!-- Tiempos -->
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de inicio</label>
          <q-input
              v-model="reporte.fecha_inicio"
              :error="!!v$.fecha_inicio.$errors.length"
              @blur="v$.fecha_inicio.$touch"
              outlined
              dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                >
                  <q-date
                      v-model="reporte.fecha_inicio"
                      :mask="maskFecha"
                      @update:model-value="buscarReporte"
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
              <error-component clave="fecha_inicio" :v$="v$"/>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de fin</label>
          <q-input
              v-model="reporte.fecha_fin"
              :error="!!v$.fecha_fin.$errors.length"
              @blur="v$.fecha_fin.$touch"
              outlined
              dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                >
                  <q-date
                      v-model="reporte.fecha_fin"
                      :mask="maskFecha"
                      today-btn
                      @update:model-value="buscarReporte"
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
              <error-component clave="fecha_fin" :v$="v$"/>
            </template>
          </q-input>
        </div>
        <!-- Grupo de botones -->
        <div class="col-6 col-md-6 col-sm-12 q-mt-sm">
          <label> &nbsp;</label>
          <div class="text-center">

            <!-- Boton excel -->
            <q-btn
                color="positive"
                class="full-width"
                no-caps
                no-wrap
                push
                glossy
                @click="buscarReporte('excel')"
            >
              <q-icon
                  name="bi-file-earmark-excel-fill"
                  size="xs"
                  class="q-mr-sm"
              ></q-icon>
              <span>Excel</span>
            </q-btn>

          </div>
        </div>
      </div>
    </q-card-section>
<!--    <q-card-section v-if="tipoDashboard===APPENATE">-->
    <q-card-section v-if="false">
      <div class="border-1 text-primary text-bold q-mb-lg">
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Reporte de asistencia: Módulo de tareas
      </div>
      <!-- Tiempos -->
      <div class="row q-col-gutter-sm">
        <iframe title="Dashboard de Tareas de Técnicos"
                :width="$q.screen.width" :height="$q.screen.height"
                src="https://app.powerbi.com/view?r=eyJrIjoiZWIwM2ZlZDgtY2NiOS00YjJhLTllOGMtNzBkZTBiZTNkZDBhIiwidCI6IjhiODI2NjQwLTRkZTQtNDEyOS04MWNlLTU3NjE0MTIwZjAwMCIsImMiOjR9"
                frameborder="0"
                allowFullScreen="true"></iframe>
      </div>
    </q-card-section>
  </q-card>
</q-page>
</template>
<script src="./ReporteAsistenciaTecnicoPage.ts"/>


<style scoped>

</style>