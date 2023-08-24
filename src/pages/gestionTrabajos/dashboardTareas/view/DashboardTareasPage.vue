<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="text-bold q-mb-lg">Análisis de datos: Módulo de tareas</div>

        <!-- Tiempos -->
        <div class="row q-col-gutter-sm q-mb-md">
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
                      mask="DD-MM-YYYY"
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
                      mask="DD-MM-YYYY"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Seleccione un empleado</label>
            <q-select
              v-model="filtro.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              @update:model-value="consultar()"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados(empleados)"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
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
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <q-card-section>
        <div
          v-if="mostrarTitulosSeccion"
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-lg"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary">Datos generales</span>
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12 col-md-6 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantidadTareasActivas >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border custom-shadow q-pa-md text-center cursor-pointer q-card-hover q-card-press"
                  style="background-color: #bc98f3"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantidadTareasActivas }}
                  </div>
                  <div>Cantidad de tareas activas</div>
                </q-card>
              </div>

              <div v-if="cantidadTareasFinalizadas >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border custom-shadow q-pa-md text-center cursor-pointer q-card-hover q-card-press bg-positive"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantidadTareasFinalizadas }}
                  </div>
                  <div>Cantidad de tareas finalizadas</div>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Segunda columna -->
          <div v-if="totalSubtareas >= 0" class="col-12 col-md-6 column">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <q-card
                  class="rounded-card custom-shadow text-white no-border q-pa-md text-center full-height cursor-pointer q-card-hover q-card-press bg-primary"
                >
                  <div class="text-h3 q-mb-md">
                    {{ totalSubtareas }}
                  </div>
                  <div>Cantidad de subtareas creadas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasAgendadas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height cursor-pointer q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasAgendadas }}
                  </div>
                  <div>Cantidad de subtareas agendadas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasCanceladas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card text-white custom-shadow no-border q-pa-md text-center full-height bg-negative cursor-pointer q-card-hover"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantidadSubtareasCanceladas }}
                  </div>
                  <div>Cantidad de subtareas canceladas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasEjecutadas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasEjecutadas }}
                  </div>
                  <div>Cantidad de subtareas en ejecución</div>
                </q-card>
              </div>

              <div v-if="cantidadSubtareasPausadas >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasPausadas }}
                  </div>
                  <div>Cantidad de subtareas pausadas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasSuspendidas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasSuspendidas }}
                  </div>
                  <div>Cantidad de subtareas suspendidas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasRealizadas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card no-border custom-shadow q-pa-md text-center q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasRealizadas }}
                  </div>
                  <div>Cantidad de subtareas realizadas</div>
                </q-card>
              </div>

              <div
                v-if="cantidadSubtareasFinalizadas >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasFinalizadas }}
                  </div>
                  <div>Cantidad de subtareas finalizadas</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <q-card-section>
        <div
          v-if="mostrarTitulosSeccion"
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-md"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary"
            >Gráficos estadísticos del coordinador consultado</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div v-if="mostrarTitulosSeccion" class="row justify-center q-mb-xl">
          <div class="col-12 col-md-6 text-center">
            <div class="text-subtitle2">Subtareas creadas</div>
            <div>
              <Pie
                :data="cantidadesPorEstadosSubtareasBar"
                :options="optionsPie"
                v-if="cantidadesPorEstadosSubtareas.length"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <q-card-section>
        <div
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-lg"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary"
            >Tabla de subtareas creadas por el empleado selecionado</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12">
            <essential-table
              v-if="subtareas.length"
              titulo="Subtareas del empleado consultado"
              :configuracionColumnas="columnasSubtareas"
              :datos="subtareas"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :alto-fijo="false"
              :accion1="botonVer"
              :accion2="btnSeguimiento"
            ></essential-table>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <q-card-section>
        <div
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-lg"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary"
            >Tabla de subtareas de empleados subordinados</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12">
            <q-btn-toggle
              v-model="tipoFiltroSubordinados"
              class="toggle-button"
              spread
              no-caps
              rounded
              glossy
              toggle-color="positive"
              unelevated
              :options="[
                {
                  label: 'Por grupo',
                  value: modosAsignacionTrabajo.por_grupo,
                },
                {
                  label: 'Por empleado',
                  value: modosAsignacionTrabajo.por_empleado,
                },
              ]"
            />
          </div>
        </div>

        <div
          v-if="tipoFiltroSubordinados === modosAsignacionTrabajo.por_grupo"
          class="row q-col-gutter-sm q-py-md q-mb-lg"
        >
          <div class="col-12">
            <label class="q-mb-sm block">Grupo seleccionado</label>
            <q-select
              v-model="grupo"
              :options="grupos"
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
              @update:model-value="filtrarSubtareasGrupo()"
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

          <div class="col-12">
            <essential-table
              titulo="Subtareas"
              :configuracionColumnas="columnasSubtareas"
              :datos="subtareasResponsable"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :alto-fijo="false"
              :accion1="botonVer"
              :accion2="btnSeguimiento"
            ></essential-table>
          </div>
        </div>

        <div
          v-if="tipoFiltroSubordinados === modosAsignacionTrabajo.por_empleado"
          class="row q-col-gutter-sm q-py-md q-mb-lg"
        >
          <!-- Responsable -->
          <div v-if="filtro.empleado" class="col-12">
            <label class="q-mb-sm block">Empleados subordinados</label>
            <q-select
              v-model="empleadoResponsable"
              :options="empleadosResponsables"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => `${item.apellidos} ${item.nombres}`"
              :option-value="(item) => item.id"
              @filter="filtrarEmpleadosResponsables"
              @popup-show="ordenarEmpleadosResponsables(empleadosResponsables)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="filtrarSubtareasResponsable()"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <essential-table
              titulo="Subtareas"
              :configuracionColumnas="columnasSubtareas"
              :datos="subtareasResponsable"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :alto-fijo="false"
              :accion1="botonVer"
              :accion2="btnSeguimiento"
            ></essential-table>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <modales-entidad
      :comportamiento="modalesSubtarea"
      :mixin-modal="mixinSubtarea"
    />
  </q-page>
</template>

<script src="./DashboardTareasPage.ts"></script>
