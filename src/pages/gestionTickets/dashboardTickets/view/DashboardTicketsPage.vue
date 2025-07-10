<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shaddow bg-body">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de tickets
        </div>

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
                    <!-- mask="DD-MM-YYYY" -->
                    <q-date
                      v-model="filtro.fecha_inicio"
                      :mask="maskFecha"
                      @update:model-value="consultarDesdeFechas()"
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
                      @update:model-value="consultarDesdeFechas()"
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

          <div class="col-12 col-md-6">
            <label class="block q-mb-sm">Filtrar por</label>
            <q-btn-toggle
              v-model="filtro.departamento_empleado"
              class="toggle-button-primary"
              spread
              no-caps
              rounded
              toggle-color="primary"
              unelevated
              :options="[
                {
                  label: 'Por empleado',
                  value: opcionesFiltroDepartamentoEmpleado.porEmpleado
                },
                {
                  label: 'Por departamento',
                  value: opcionesFiltroDepartamentoEmpleado.porDepartamento
                }
              ]"
            />
          </div>

          <div v-if="mostrarSeccionEmpleado" class="col-12 col-md-8">
            <label class="q-mb-sm block"
              >Seleccione un empleado para consultar</label
            >
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
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>

              <template v-slot:error>
                <error-component clave="empleado" :v$="v$"/>
              </template>
            </q-select>
          </div>

          <!-- Departamento -->
          <div v-show="mostrarSeccionDepartamento" class="col-12 col-md-10">
            <label class="q-mb-sm block"
              >Seleccione un departamento para consultar</label
            >
            <q-select
              v-model="filtro.departamento"
              :options="departamentos"
              @filter="filtrarDepartamentos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultarDepartamento()"
              :error="!!v$.departamento.$errors.length"
              @blur="v$.departamento.$touch"
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>

              <template v-slot:error>
                <error-component clave="departamento" :v$="v$"/>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2 q-pt-lg" v-if="mostrarSeccionEmpleado">
            <q-checkbox
                class="q-mt-sm q-pt-sm"
                v-model="mostrarInactivos"
                label="Inactivos"
                outlined
                @update:model-value="checkMostrarInactivos"
                dense
            ></q-checkbox>
          </div>
          <div class="col-12 col-md-2">
            <label class="block q-mb-sm">&nbsp;</label>
            <q-btn
              icon="bi-table"
              label="Reporte Excel"
              color="positive"
              class="full-width"
              no-caps
              unelevated
              no-wrap
              @click="reporteExcel()"
            ></q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="
        mostrarTitulosSeccion && mostrarSeccionEmpleado && cantTicketsCreados
      "
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-lg"
      >
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Información de tickets creados y asignados del empleado seleccionado
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-6 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div class="col-12 text-bold">
                Tickets creados por el empleado
              </div>
              <div v-if="cantTicketsCreados >= 0" class="col-12">
                <q-card
                  class="rounded-card text-primary q-pa-md text-center bg-grey-2"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCreados }}
                  </div>
                  <div class="text-bold">Cantidad de tickets creados</div>
                </q-card>
              </div>

              <div v-if="cantTicketsCreadosParaMi >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsCreadosParaMi }}
                  </div>
                  <div>Cantidad de tickets creados para sí mismo</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsCreadosInternos >= 0"
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsCreadosInternos }}
                  </div>
                  <div>Cantidad de tickets creados para su departamento</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsCreadosADepartamentos >= 0"
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsCreadosADepartamentos }}
                  </div>
                  <div>Cantidad de tickets creados a otros departamentos</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsCanceladosPorMi >= 0"
                class="col-6 col-md-3"
              >
                <q-card
                  class="rounded-card q-pa-md text-center full-height bg-pink-10 text-white"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCanceladosPorMi }}
                  </div>
                  <div>Cantidad de tickets que ha cancelado</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsCalificadosSolicitante >= 0"
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-positive q-mb-md">
                    {{ cantTicketsCalificadosSolicitante }}
                  </div>
                  <div class="text-bold">
                    Cantidad de tickets que creó y calificó
                  </div>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Segunda columna -->
          <div v-if="cantTicketsRecibidos >= 0" class="col-12 col-md-6 column">
            <div class="row q-col-gutter-xs">
              <div class="col-12 text-bold">Tickets asignados al empleado</div>
              <div class="col-12">
                <q-card
                  class="rounded-card text-white no-border q-pa-md text-center full-height bg-secondary"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsRecibidos }}
                  </div>
                  <div>Cantidad de tickets asignados</div>
                </q-card>
              </div>

              <div v-if="cantTicketsAsignados >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsAsignados }}
                  </div>
                  <div>Cantidad de tickets pendientes</div>
                </q-card>
              </div>

              <div v-if="cantTicketsCancelados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card text-white q-pa-md text-center full-height bg-pink-10"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCancelados }}
                  </div>
                  <div>Cantidad de tickets que le cancelaron</div>
                </q-card>
              </div>

              <div v-if="cantTicketsRechazados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card text-white q-pa-md text-center full-height bg-pink-8"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsRechazados }}
                  </div>
                  <div>Cantidad de tickets que rechazó</div>
                </q-card>
              </div>

              <div v-if="cantTicketsReasignados >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsReasignados }}
                  </div>
                  <div>Cantidad de tickets que le transfirieron</div>
                </q-card>
              </div>

              <div v-if="cantTicketsEjecutados >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsEjecutados }}
                  </div>
                  <div>Cantidad de tickets que está ejecutando</div>
                </q-card>
              </div>

              <div v-if="cantTicketsPausados >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsPausados }}
                  </div>
                  <div>Cantidad de tickets pausados</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsFinalizadosSolucionados >= 0"
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsFinalizadosSolucionados }}
                  </div>
                  <div>Cantidad de tickets finalizados con solución</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsFinalizadosSinSolucion >= 0"
                class="col-6 col-md-3"
              >
                <q-card class="rounded-card q-pa-md text-center">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsFinalizadosSinSolucion }}
                  </div>
                  <div>Cantidad de tickets finalizados sin solución</div>
                </q-card>
              </div>

              <div
                v-if="cantTicketsCalificadosResponsable >= 0"
                class="col-6 col-md-6"
              >
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-positive q-mb-md">
                    {{ cantTicketsCalificadosResponsable }}
                  </div>
                  <div class="text-bold">
                    Cantidad de tickets que finalizó, calificados
                  </div>
                </q-card>
              </div>

              <div
                v-if="
                  cantTicketsFinalizadosSolucionados >= 0 ||
                  cantTicketsFinalizadosSinSolucion >= 0
                "
                class="col-12 col-md-6"
              >
                <q-card
                  class="rounded-card text-white q-pa-md text-center bg-positive full-height"
                >
                  <div class="text-h3 q-mb-md">
                    {{
                      cantTicketsFinalizadosSolucionados +
                      cantTicketsFinalizadosSinSolucion
                    }}
                  </div>
                  <div>Cantidad de tickets finalizados</div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion && mostrarSeccionEmpleado"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row text-bold q-pa-md rounded text-primary items-center q-mb-lg"
      >
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Gráficos estadísticos del empleado consultado
      </div>

      <q-tab-panels
        v-model="tabsEmpleado"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
      >
        <!-- Graficos -->
        <q-tab-panel :name="opcionesEmpleado.empleadoGrafico">
          <div v-if="mostrarTitulosSeccion" class="row justify-center q-mb-xl">
            <div class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">
                Estado actual de los tickets
              </div>
              <div>
                <grafico-generico
                  v-if="ticketsPorEstado.length"
                  :data="ticketsPorEstadoBar"
                  :options="optionsPie"
                  @click="
                    data =>
                      clickGraficoTicketsEmpleado(
                        data,
                        categoriaGraficosEmpleado.ESTADO_ACTUAL
                      )
                  "
                />
              </div>
            </div>
          </div>

          <div
            v-if="mostrarTitulosSeccion"
            class="row q-col-gutter-y-xl q-col-gutter-x-md q-mb-xl"
          >
            <div
              v-if="cantidadesTicketsSolicitadosPorDepartamento.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">
                Tickets creados a los departamentos
              </div>
              <div>
                <grafico-generico
                  v-show="cantidadesTicketsSolicitadosPorDepartamento.length"
                  :data="cantidadesTicketsSolicitadosPorDepartamentoBar"
                  :options="optionsPie"
                  @click="
                    data =>
                      clickGraficoTicketsEmpleado(
                        data,
                        categoriaGraficosEmpleado.CREADOS_A_DEPARTAMENTOS
                      )
                  "
                />
              </div>
            </div>

            <div class="col-12 col-md-6 text-center">
              <div class="text-subtitle2 q-mb-lg">
                Tickets recibidos por los departamentos
              </div>
              <div>
                <grafico-generico
                  v-if="cantidadesTicketsRecibidosPorDepartamento.length"
                  :data="cantidadesTicketsRecibidosPorDepartamentoBar"
                  :options="optionsPie"
                  @click="
                    data =>
                      clickGraficoTicketsEmpleado(
                        data,
                        categoriaGraficosEmpleado.ASIGNADOS_POR_DEPARTAMENTOS
                      )
                  "
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesEmpleado.empleadoListado">
          <q-btn
            color="primary"
            @click="tabsEmpleado = opcionesEmpleado.empleadoGrafico"
            no-caps
            rounded
          >
            <q-icon name="bi-chevron-left" size="xs"></q-icon>
            Regresar al gráfico</q-btn
          >

          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <essential-table
                v-if="ticketsPorEstadoListado.length"
                titulo="Tickets del empleado"
                :configuracionColumnas="[
                  ...configuracionColumnasTicket,
                  accionesTabla
                ]"
                :datos="ticketsPorEstadoListado"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :accion1="botonVer"
                :accion2="btnSeguimiento"
              ></essential-table>
            </div>
            <!-- {{ ticketsEmpleadoResponsable }} -->
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <!-- </q-card-section> -->
    </q-card>

    <q-card
      v-if="
        mostrarTitulosSeccion &&
        mostrarSeccionDepartamento &&
        listados.ticketsPorDepartamentoEstadoFinalizadoSolucionado
      "
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row text-bold q-pa-md rounded text-primary items-center q-mb-lg"
      >
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Gráfico de tiempos de tickets finalizados por el departamento
      </div>

      <div class="row q-col-gutter-x-md q-px-md">
        <div class="col-12 col-md-6">
          <div
            class="rounded-card text-indigo q-pa-md text-center bg-indigo-2"
            style="border: 1px solid #4a5bb980"
          >
            <div class="text-subtitle2 q-mb-md">
              Tiempo promedio de finalización: <br />
              <b>{{ listados.tiempoPromedio }}</b>
            </div>
            <q-icon name="bi-clock-history" size="xl" color="indigo-5"></q-icon>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div
            class="rounded-card text-positive q-pa-md text-center bg-light-green-1"
            style="border: 1px solid #9bc12a80"
          >
            <div class="text-subtitle2 q-mb-md">
              Cantidad de tickets finalizados en el intervalo seleccionado
              <br />
              <b>
                {{ listados.totalTicketsFinalizados + ' tickets' }}
              </b>
            </div>
            <q-icon
              name="bi-check-circle"
              size="xl"
              color="light-green-4"
            ></q-icon>
          </div>
        </div>
      </div>

      <div class="row q-pa-md q-col-gutter-x-sm">
        <div class="col-12 text-center">
          <div>
            <grafico-generico
              :data="promedioTiemposLine"
              :options="optionsLine"
              tipo="line"
              @click="data => clickGraficoLineaTiempo(data)"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- && esResponsableDepartamento" -->
    <q-card
      v-if="mostrarTitulosSeccion && mostrarSeccionDepartamento"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row text-bold text-primary q-pa-md rounded items-center q-mb-md"
      >
        <q-icon name="bi-pie-chart" class="q-mr-sm"></q-icon>
        Estados de los tickets del departamento
      </div>

      <q-tab-panels
        v-model="tabsDepartamento"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
      >
        <!-- Graficos -->
        <q-tab-panel :name="opcionesDepartamento.departamentoGrafico">
          <div class="q-mb-xl q-gutter-y-md column items-center">
            <q-btn-group push>
              <q-btn
                push
                label="Una columna"
                color="primary"
                icon="bi-list"
                no-caps
                @click="() => (modoUnaColumna = true)"
              />
              <q-btn
                push
                label="Dos columnas"
                icon="bi-grid"
                color="primary"
                no-caps
                @click="() => (modoUnaColumna = false)"
              />
            </q-btn-group>
          </div>

          <!-- v-if="esResponsableDepartamento" -->
          <div
            class="q-col-gutter-y-xl q-col-gutter-x-md"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
          >
            <!-- Asignados -->
            <div
              v-if="ticketsPorDepartamentoEstadoAsignado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Pendientes</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoAsignadoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoAsignado.length"
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.ASIGNADO
                      )
                  "
                />
              </div>
            </div>

            <!-- Rechazados -->
            <div
              v-if="ticketsPorDepartamentoEstadoRechazado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Rechazados</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoRechazadoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoRechazado.length"
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.RECHAZADO
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoReasignado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Transferidos</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoReasignadoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoReasignado.length"
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.REASIGNADO
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoEjecutando.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Ejecutando</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoEjecutandoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoEjecutando.length"
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.EJECUTANDO
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoPausado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Pausados</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoPausadoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoPausado.length"
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.PAUSADO
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoFinalizadoSolucionado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Finalizado solucionado</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar"
                  :options="optionsPie"
                  v-if="
                    ticketsPorDepartamentoEstadoFinalizadoSolucionado.length
                  "
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.FINALIZADO_SOLUCIONADO
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoFinalizadoSinSolucion.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Finalizado sin solución</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar"
                  :options="optionsPie"
                  v-if="
                    ticketsPorDepartamentoEstadoFinalizadoSinSolucion.length
                  "
                  @click="
                    data =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.FINALIZADO_SIN_SOLUCION
                      )
                  "
                />
              </div>
            </div>

            <div
              v-if="ticketsPorDepartamentoEstadoCalificado.length"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">Calificado</div>
              <div>
                <grafico-generico
                  :data="ticketsPorDepartamentoEstadoCalificadoBar"
                  :options="optionsPie"
                  v-if="ticketsPorDepartamentoEstadoCalificado.length"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesDepartamento.departamentoListado">
          <q-btn
            @click="tabsDepartamento = opcionesDepartamento.departamentoGrafico"
            no-caps
            rounded
            color="primary"
          >
            <q-icon name="bi-chevron-left" size="xs"></q-icon>
            Regresar al gráfico</q-btn
          >

          <div class="row q-col-gutter-sm q-py-md q-mb-lg">
            <div class="col-12">
              <!-- v-if="ticketsEmpleadoResponsable.length" -->
              <essential-table
                titulo="Tickets"
                :configuracionColumnas="[
                  ...configuracionColumnasTicket,
                  accionesTabla
                ]"
                :datos="ticketsEmpleadoResponsable"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
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

    <modales-entidad :comportamiento="modales" :persistent="false" />
  </q-page>
</template>

<script src="./DashboardTicketsPage.ts"></script>
