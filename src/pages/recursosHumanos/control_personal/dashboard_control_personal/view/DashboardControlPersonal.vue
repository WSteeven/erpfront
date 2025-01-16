<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-people" class="q-mr-sm"></q-icon>
          Dashboard de Control de Personal
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione el tipo</label>
            <q-select
              v-model="dashboard.tipo"
              :options="opcionesTipos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              @update:model-value="consultar()"
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input v-model="dashboard.fecha_inicio" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dashboard.fecha_inicio" today-btn @update:model-value="consultar()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de fin</label>
            <q-input v-model="dashboard.fecha_fin" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="dashboard.fecha_fin" today-btn @update:model-value="consultar()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md rounded no-border custom-shadow" v-if="dashboard.tipo == 'ASISTENCIAS'">
      <q-card-section>
        <div class="row text-bold text-primary q-pa-md rounded q-mb-md">Resumen de Asistencias</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <q-card class="rounded-card text-white no-border q-pa-md text-center bg-primary">
              <div class="text-h3 q-mb-md">{{ totalAsistencias }}</div>
              <div class="text-bold">Total de asistencias</div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md rounded no-border custom-shadow" v-if="dashboard.tipo == 'ATRASOS'">
      <q-card-section>
        <div class="row text-bold text-primary q-pa-md rounded q-mb-md">Resumen de Atrasos</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <q-card class="rounded-card text-white no-border q-pa-md text-center bg-negative">
              <div class="text-h3 q-mb-md">{{ totalAtrasos }}</div>
              <div class="text-bold">Total de atrasos</div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md rounded no-border custom-shadow" v-if="dashboard.tipo">
      <q-card-section>
        <q-tab-panels v-model="tabs" animated transition-prev="scale" transition-next="scale" keep-alive>
          <q-tab-panel :name="'graficos'">
            <div class="q-mb-xl q-gutter-y-md column items-center">
              <q-btn-group push>
                <q-btn label="Una columna" icon="bi-list" no-caps @click="modoUnaColumna = true" />
                <q-btn label="Dos columnas" icon="bi-grid" no-caps @click="modoUnaColumna = false" />
              </q-btn-group>
            </div>
            <div :class="{ row: !modoUnaColumna, column: modoUnaColumna }">
              <div class="col-12 col-md-6 text-center" v-for="grafico in graficos" :key="grafico.id">
                <div class="text-subtitle2 q-mb-lg">{{ grafico.encabezado }}</div>
                <grafico-generico v-if="grafico" :data="grafico" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel :name="'listado'">
            <essential-table v-if="registros.length" :datos="registros" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./DashboardControlPersonal.ts" />

