<template>
  <q-page padding>
    <q-card flat bordered class="q-mb-md rounded">
      <q-card-section>
        <div class="text-bold">Análisis de datos: Módulo de tareas</div>

        <!-- Tiempos -->
        <div
          class="row q-col-gutter-sm q-pa-md justify-center text-center q-mb-lg"
        >
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">
              Seleccione mes y año a consultar</label
            >
            <q-input
              v-model="filtro.mes_anio"
              placeholder="Obligatorio"
              mask="##-####"
              :error="!!v$.mes_anio.$errors.length"
              @blur="v$.mes_anio.$touch"
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
                      v-model="filtro.mes_anio"
                      minimal
                      mask="MM-YYYY"
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
                <div v-for="error of v$.mes_anio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>

        <!-- Tipos de trabajos realizados -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Tipos de trabajos realizados
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              :option-disable="(item) => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                () => {
                  consultar()
                  consultarTrabajoRealizadoPorRegion()
                }
              "
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- <div class="col-12 col-md-2">
            <label class="q-mb-sm block">&nbsp;</label>
            <q-btn
              color="secondary"
              class="full-width"
              no-caps
              push
              @click="consultar()"
            >
              <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
              <span>Consultar</span>
            </q-btn>
          </div> -->

          <div class="col-12 col-md-6">
            <table-view
              v-if="trabajosRealizados.length"
              :configuracion-columnas="configuracionColumnasSubtareasRealizadas"
              :elementos="trabajosRealizados"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajosRealizados.length"
              :data="trabajosRealizadosBar"
              :options="options"
            />
          </div>
        </div>

        <!-- Trabajos realizados por region -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por región
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12 col-md-6">
            <table-view
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorRegion
              "
              :elementos="trabajoRealizadoPorRegion"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajoRealizadoPorRegionBar"
              :data="trabajoRealizadoPorRegionBar"
              :options="optionsVertical"
            />
          </div>
        </div>

        <!-- Trabajos realizados por region y tipo de trabajo -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por región y tipo de trabajo
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              :option-disable="(item) => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultar()"
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Seleccione un tipo de trabajo</label>
            <q-select
              v-model="filtro.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                () => {
                  consultarTrabajoRealizadoPorRegionTipoTrabajo()
                  consultarTrabajoRealizadoPorGrupoTipoTrabajo()
                }
              "
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione cliente corporativo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <table-view
              v-if="trabajoRealizadoPorRegionTipoTrabajo.length"
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorRegion
              "
              :elementos="trabajoRealizadoPorRegionTipoTrabajo"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajoRealizadoPorRegionTipoTrabajoBar"
              :data="trabajoRealizadoPorRegionTipoTrabajoBar"
              :options="optionsVertical"
            />
          </div>
        </div>

        <!-- Trabajos realizados por grupo y tipo de trabajo -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y tipo de trabajo
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              :option-disable="(item) => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultar()"
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Seleccione un tipo de trabajo</label>
            <q-select
              v-model="filtro.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                () => {
                  consultarTrabajoRealizadoPorRegionTipoTrabajo()
                  consultarTrabajoRealizadoPorGrupoTipoTrabajo()
                }
              "
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione cliente corporativo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <table-view
              v-if="trabajoRealizadoPorGrupoTipoTrabajo.length"
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorGrupo
              "
              :elementos="trabajoRealizadoPorGrupoTipoTrabajo"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajoRealizadoPorGrupoTipoTrabajoBar"
              :data="trabajoRealizadoPorGrupoTipoTrabajoBar"
              :options="options"
            />
          </div>
        </div>

        <!-- Trabajos realizados por grupo y tipos de trabajos EMERGENCIA -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y tipos de trabajos de EMERGENCIA
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              :option-disable="(item) => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                consultarTrabajoRealizadoPorGrupoTiposTrabajosEmergencia()
              "
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <table-view
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia
              "
              :elementos="trabajoRealizadoPorGrupoTiposTrabajosEmergencia"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar"
              :data="trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar"
              :options="optionsVertical"
            />
          </div>
        </div>

        <!-- Trabajos realizados por grupo y causas de intervencion -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y causas de intervención
        </div>
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              :option-disable="(item) => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultar()"
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione el tipo de trabajo</label>
            <q-select
              v-model="filtro.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.descripcion"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                () => {
                  consultarTrabajoRealizadoPorRegionTipoTrabajo()
                  consultarTrabajoRealizadoPorGrupoTipoTrabajo()
                }
              "
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione cliente corporativo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Seleccione la causa de intervención</label
            >
            <q-select
              v-model="filtro.causa_intervencion"
              :options="causasIntervenciones"
              @filter="filtrarCausasIntervenciones"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                consultarTrabajoRealizadoPorGrupoCausaIntervencion()
              "
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione tipo de trabajo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <table-view
              v-if="trabajoRealizadoPorGrupoCausaIntervencion.length"
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorGrupo
              "
              :elementos="trabajoRealizadoPorGrupoCausaIntervencion"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="trabajoRealizadoPorGrupoCausaIntervencionBar"
              :data="trabajoRealizadoPorGrupoCausaIntervencionBar"
              :options="options"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!--<div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="filtro.grupo"
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
          </div>-->
  </q-page>
</template>

<script src="./ReporteModuloTareaPage.ts"></script>
