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
          class="row bg-body text-bold q-pa-md rounded justify-between q-mb-lg"
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
      <q-tab-panels
        v-model="tabsCoordinadorConsultado"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
        :class="{ 'rounded-tabpanel': !$q.screen.xs }"
      >
        <!-- Formulario -->
        <q-tab-panel
          :name="opcionesCoordinadorConsultado.coordinadorConsultadoGrafico"
        >
          <div
            v-if="mostrarTitulosSeccion"
            class="row bg-body text-bold q-pa-md rounded justify-between q-mb-md"
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
              <small class="q-mb-md block"
                >Haga click sobre una categoría del gráfico de pastel para más
                detalles</small
              >
              <div>
                <grafico-generico
                  v-if="cantidadesPorEstadosSubtareas.length"
                  :data="cantidadesPorEstadosSubtareasBar"
                  :options="optionsPie"
                  @click="clickCantidadesPorEstadoSubtareas"
                ></grafico-generico>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel
          :name="opcionesCoordinadorConsultado.coordinadorConsultadoListado"
        >
          <div
            class="row bg-body text-bold q-pa-md rounded justify-between q-mb-lg"
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

          <q-btn
            color="primary"
            @click="tabsCoordinadorConsultado = 'coordinadorConsultadoGrafico'"
            glossy
            no-caps
            rounded
            unelevated
            class="q-mx-auto block"
          >
            <q-icon name="bi-arrow-left"></q-icon>
            Regresar al gráfico</q-btn
          >

          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                v-if="subtareasFiltradas.length"
                titulo="Subtareas del empleado consultado"
                :configuracionColumnas="columnasSubtareas"
                :datos="subtareasFiltradas"
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
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <!-- <q-card-section> -->
      <q-tab-panels
        v-model="tabsSubordinados"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
      >
        <!-- Graficos -->
        <q-tab-panel :name="opcionesSubordinado.subordinadosGrafico">
          <div
            class="row bg-body text-bold q-pa-md rounded justify-between q-mb-md"
          >
            <span class="q-col-gutter-x-xs">
              <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            </span>
            <span class="text-primary"
              >Gráficos estadísticos de los empleados subordinados</span
            >
            <span class="q-col-gutter-x-xs">
              <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            </span>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-btn-toggle
                v-model="tipoFiltroSubordinados"
                class="toggle-button-primary q-mb-md"
                spread
                no-caps
                rounded
                glossy
                toggle-color="primary"
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

          <div class="q-mb-xl q-gutter-y-md column items-center">
            <q-btn-group push>
              <q-btn
                push
                label="Una columna"
                icon="bi-list"
                no-caps
                @click="() => (modoUnaColumna = true)"
              />
              <q-btn
                push
                label="Dos columnas"
                icon="bi-grid"
                no-caps
                @click="() => (modoUnaColumna = false)"
              />
            </q-btn-group>
          </div>

          <div
            v-if="tipoFiltroSubordinados === modosAsignacionTrabajo.por_grupo"
            class="q-col-gutter-y-xl q-col-gutter-x-xs"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
          >
            <!-- Agendados -->
            <div v-if="agendados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Agendados</div>
              <div class="text-center row justify-center" style="height: 300px">
                <grafico-generico
                  v-if="agendados.length"
                  :data="agendadosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.AGENDADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Suspendidos -->
            <div v-if="suspendidos.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Suspendidos</div>
              <div class="text-center row justify-center">
                <grafico-generico
                  v-if="suspendidos.length"
                  :data="suspendidosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.SUSPENDIDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Ejecutados -->
            <div v-if="ejecutados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Ejecutando</div>
              <div>
                <grafico-generico
                  v-if="ejecutados.length"
                  :data="ejecutadosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.EJECUTANDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Pausados -->
            <div v-if="pausados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Pausados</div>
              <div>
                <grafico-generico
                  v-if="pausados.length"
                  :data="pausadosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.PAUSADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Suspendidos -->
            <div v-if="suspendidos.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Suspendidos</div>
              <div>
                <grafico-generico
                  v-if="suspendidos.length"
                  :data="suspendidosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.SUSPENDIDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Cancelados -->
            <div v-if="cancelados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Cancelados</div>
              <div>
                <grafico-generico
                  v-if="cancelados.length"
                  :data="canceladosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.CANCELADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Realizados -->
            <div v-if="realizados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">Realizados</div>
              <div>
                <grafico-generico
                  v-if="realizados.length"
                  :data="realizadosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.REALIZADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Finalizados -->
            <div v-if="finalizados.length" class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 bg-body rounded q-mb-lg">
                Finalizados
              </div>
              <div>
                <grafico-generico
                  v-if="finalizados.length"
                  :data="finalizadosBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickCantidadesSubtareasSubordinados(
                        data,
                        estadosTrabajos.FINALIZADO
                      )
                  "
                />
              </div>
            </div>
          </div>

          <div
            v-if="
              tipoFiltroSubordinados === modosAsignacionTrabajo.por_empleado
            "
            class="q-col-gutter-y-xl q-col-gutter-x-xs"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
          >
            <!-- Agendados -->
            <div
              v-if="agendadosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Agendados</div>
              <div>
                <grafico-generico
                  v-if="agendadosEmpleado.length"
                  :data="agendadosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.AGENDADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Suspendidos -->
            <div
              v-if="suspendidosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Suspendidos</div>
              <div class="text-center row justify-center">
                <grafico-generico
                  v-if="suspendidosEmpleado.length"
                  :data="suspendidosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.SUSPENDIDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Ejecutados -->
            <div
              v-if="ejecutadosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Ejecutando</div>
              <div>
                <grafico-generico
                  v-if="ejecutadosEmpleado.length"
                  :data="ejecutadosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.EJECUTANDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Pausados -->
            <div
              v-if="pausadosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Pausados</div>
              <div>
                <grafico-generico
                  v-if="pausadosEmpleado.length"
                  :data="pausadosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.PAUSADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Suspendidos -->
            <div
              v-if="suspendidosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Suspendidos</div>
              <div>
                <grafico-generico
                  v-if="suspendidosEmpleado.length"
                  :data="suspendidosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.SUSPENDIDO
                      )
                  "
                />
              </div>
            </div>

            <!-- Cancelados -->
            <div
              v-if="canceladosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Cancelados</div>
              <div>
                <grafico-generico
                  v-if="canceladosEmpleado.length"
                  :data="canceladosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.CANCELADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Realizados -->
            <div
              v-if="realizadosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Realizados</div>
              <div>
                <grafico-generico
                  v-if="realizadosEmpleado.length"
                  :data="realizadosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.REALIZADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Finalizados -->
            <div
              v-if="finalizadosEmpleado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Finalizados</div>
              <div>
                <grafico-generico
                  v-if="finalizadosEmpleado.length"
                  :data="finalizadosEmpleadoBar"
                  :options="optionsPie"
                  @click="
                    (data) =>
                      clickGraficoEmpleadoSubordinado(
                        data,
                        estadosTrabajos.FINALIZADO
                      )
                  "
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesSubordinado.subordinadosListado">
          <div
            class="row bg-body text-bold q-pa-md rounded justify-between q-mb-lg"
          >
            <span class="q-col-gutter-x-xs">
              <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            </span>
            <span class="text-primary"
              >Tabla de subtareas de grupos subordinados</span
            >
            <span class="q-col-gutter-x-xs">
              <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
              <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            </span>
          </div>

          <q-btn
            color="primary"
            @click="tabsSubordinados = opcionesSubordinado.subordinadosGrafico"
            glossy
            no-caps
            rounded
            unelevated
            class="q-mx-auto block"
          >
            <q-icon name="bi-arrow-left"></q-icon>
            Regresar al gráfico</q-btn
          >
          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                titulo="Subtareas del grupo seleccionado"
                :configuracionColumnas="columnasSubtareas"
                :datos="subtareasSubordinados"
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
        </q-tab-panel>

        <q-tab-panel :name="opcionesSubordinado.subordinadosEmpleadoListado">
          <div
            class="row bg-body text-bold q-pa-md rounded justify-between q-mb-lg"
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

          <q-btn
            color="primary"
            @click="tabsSubordinados = opcionesSubordinado.subordinadosGrafico"
            glossy
            no-caps
            rounded
            unelevated
            class="q-mx-auto block"
          >
            <q-icon name="bi-arrow-left"></q-icon>
            Regresar al gráfico</q-btn
          >
          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                titulo="Subtareas del empleado seleccionado"
                :configuracionColumnas="columnasSubtareas"
                :datos="subtareasEmpleadoSubordinado"
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
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <modales-entidad
      :comportamiento="modalesSubtarea"
      :mixin-modal="mixinSubtarea"
    />
  </q-page>
</template>

<script src="./DashboardTareasPage.ts"></script>
