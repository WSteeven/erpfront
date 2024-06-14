<template>
  <q-page padding>
    <q-tabs
      v-model="tabPrivacidadCuestionario"
      align="justify"
      switch-indicator
      active-class="tab-active"
      indicator-color="transparent"
      dense
    >
      <q-tab
        :name="opcionesPrivacidadCuestionarios.INTERNO"
        label="Cuestionarios internos"
        :class="{
          'tab-inactive':
            tabPrivacidadCuestionario !==
            opcionesPrivacidadCuestionarios.INTERNO,
        }"
        no-caps
      />
      <q-tab
        :name="opcionesPrivacidadCuestionarios.PUBLICO"
        label="Cuestionarios públicos"
        :class="{
          'tab-inactive':
            tabPrivacidadCuestionario !==
            opcionesPrivacidadCuestionarios.PUBLICO,
        }"
        no-caps
      />
    </q-tabs>

    <div class="bg-desenfoque rounded-footer border-white q-pa-sm">
      <!-- Formulario -->
      <q-tab-panel :name="opcionesPrivacidadCuestionarios.INTERNO" class="q-pa-none">
        <q-card flat class="q-mb-sm bg-desenfoque border-white">
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-12 col-md-5">
              <label class="q-mb-sm block">
                Seleccione el año para consultar</label
              >
              <q-input v-model="filtro.anio" readonly outlined dense>
                <template v-slot:append>
                  <q-btn
                    name="event"
                    no-caps
                    unelevated
                    round
                    dense
                    color="white"
                  >
                    <q-icon
                      name="bi-calendar"
                      size="18px"
                      class="cursor-pointer"
                      color="grey"
                    ></q-icon>
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                      v-model="isYear"
                    >
                      <q-date
                        v-model="filtro.anio"
                        minimal
                        mask="YYYY"
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
                  </q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-5">
              <label class="q-mb-sm block">Tipo cuestionario</label>
              <q-select
                v-model="filtro.tipo_cuestionario"
                :options="tiposCuestionarios"
                transition-show="scale"
                transition-hide="scale"
                hint="Obligatorio"
                options-dense
                dense
                outlined
                :option-label="(item) => item.titulo"
                :option-value="(item) => item.id"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-2">
              <label class="q-mb-sm block">&nbsp;</label>
              <q-btn
                color="primary"
                label="Consultar"
                icon="bi-search"
                class="full-width"
                no-caps
                @click="consultar()"
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <transition name="scale" mode="out-in">
        <div v-if="listado.length">
          <essential-table
            titulo="Empleados que respondieron el cuestionario en el año seleccionado"
            :configuracionColumnas="[
              ...ConfiguracionColumnasReporteCuestionarioEmpleado,
            ]"
            :datos="listado"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :accion1Header="btnImprimirReporte"
            :accion2Header="btnImprimirRespuestas"
          >
          </essential-table>
        </div>
      </transition>
    </div>
  </q-page>
</template>

<script src="./ReporteCuestionarioPage.ts" />
