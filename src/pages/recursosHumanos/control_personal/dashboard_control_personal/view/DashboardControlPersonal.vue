<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de Control de Personal
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"> Tipo de filtro</label>
            <q-select
              v-model="dashboard.tipo"
              :options="tiposFiltros"
              dense
              outlined
            />
          </div>
          <!-- Tiempos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="dashboard.fecha_inicio"
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
                      v-model="dashboard.fecha_inicio"
                      :mask="maskFecha"
                      @update:model-value="consultar()"
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
                <error-component clave="fecha_inicio" :v$="v$" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de fin</label>
            <q-input
              v-model="dashboard.fecha_fin"
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
                      v-model="dashboard.fecha_fin"
                      :mask="maskFecha"
                      today-btn
                      @update:model-value="consultar()"
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
                <error-component clave="fecha_fin" :v$="v$" />
              </template>
            </q-input>
          </div>

          <div class="col-12" style="height: 400px">
            <e-chart-componente
              ref="chartRef"
              :option="option"
              @click="graficoClickeado"
              @datazoom="graficoDataZoom"
              @legendselectchanged="graficoCambioLeyenda"
              @mouseover="(e)=>console.log('mouseover', e)"
              @selectchanged="(e)=>console.log('selectchanged', e)"
              @legendselected="(e)=>console.log('legendselected', e)"
              @legendunselected="(e)=>console.log('legendunselected', e)"
              @legendselectall="(e)=>console.log('legendselectall', e)"
              @legendinverseselect="(e)=>console.log('legendinverseselect', e)"
              @legendscroll="(e)=>console.log('legendscroll', e)"
              @datarangeselected="(e)=>console.log('datarangeselected', e)"
              @graphroam="(e)=>console.log('graphroam', e)"
              @georoam="(e)=>console.log('georoam', e)"
              @treeroam="(e)=>console.log('treeroam', e)"
              @timelinechanged="(e)=>console.log('timelinechanged', e)"
              @timelineplaychanged="(e)=>console.log('timelineplaychanged', e)"
              @restore="(e)=>console.log('restore', e)"
              @dataviewchanged="(e)=>console.log('dataviewchanged', e)"
              @axisareaselected="(e)=>console.log('axisareaselected', e)"
              @brush="(e)=>console.log('brush', e)"
            />
<!--              @finished="graficoTerminado"-->
            <!--              :labels="['Lun', 'Mar', 'Mié', 'Jue', 'Vie']"-->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./DashboardControlPersonal.ts" />
