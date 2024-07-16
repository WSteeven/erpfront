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
        icon="bi-lock"
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
        icon="bi-unlock"
        :class="{
          'tab-inactive':
            tabPrivacidadCuestionario !==
            opcionesPrivacidadCuestionarios.PUBLICO,
        }"
        no-caps
      />
    </q-tabs>

    <div class="bg-desenfoque rounded-footer border-white q-pa-sm">
      <q-expansion-item
        v-show="
          tabPrivacidadCuestionario === opcionesPrivacidadCuestionarios.PUBLICO
        "
        class="overflow-hidden q-mb-sm rounded bg-desenfoque-2 border-white"
        label="Links creados"
        header-class="text-bold bg-desenfoque text-primary border-bottom"
        icon="bi-link-45deg"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <essential-table
              titulo="Cada link es una empresa"
              :configuracionColumnas="[
                ...ConfiguracionColumnasLinksCreados,
                accionesTabla,
              ]"
              :datos="linksCreados"
              :permitir-consultar="false"
              :permitir-editar="false"
              :permitir-eliminar="false"
              :alto-fijo="false"
              :desplegarDesde="3"
              :accion1Header="btnCrearLinkCuestionario"
              :accion1="btnCompartirLink"
              :accion2="btnAbrirLink"
              :accion3="btnDeshabilitarLink"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-card flat class="q-mb-sm bg-desenfoque border-white">
        <q-card-section class="row q-col-gutter-sm">
          <!-- <div class="col-12 col-md-3">
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
                      :mask="maskFecha"
                      emit-immediately
                      default-view="Years"
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
          </div> -->

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="filtro.fecha_inicio"
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
                      v-model="filtro.fecha_inicio"
                      :mask="maskFecha"
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
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de fin</label>
            <q-input
              v-model="filtro.fecha_fin"
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
                      v-model="filtro.fecha_fin"
                      :mask="maskFecha"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Tipo cuestionario</label>
            <q-select
              v-model="filtro.tipo_cuestionario_id"
              :options="tiposCuestionarios"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.titulo"
              :option-value="(item) => item.id"
              :error="!!v$.tipo_cuestionario_id.$errors.length"
              @blur="v$.tipo_cuestionario_id.$touch"
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

              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_cuestionario_id.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div
            v-if="
              tabPrivacidadCuestionario ===
              opcionesPrivacidadCuestionarios.PUBLICO
            "
            class="col-12 col-md-4"
          >
            <label class="q-mb-sm block">Link</label>
            <q-select
              v-model="filtro.link"
              :options="linksCreados"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.link"
              :option-value="(item) => item.link"
              :error="!!v$.link.$errors.length"
              @blur="v$.link.$touch"
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

              <template v-slot:error>
                <div v-for="error of v$.link.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
              no-wrap
              no-caps
              @click="consultar()"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>

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
