<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
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
            <label class="block q-mb-sm">Filtrar por</label>
            <q-btn-toggle
              v-model="filtro.departamento_empleado"
              class="toggle-button-grey"
              spread
              no-caps
              rounded
              toggle-color="grey-9"
              unelevated
              :options="[
                {
                  label: 'Por departamento',
                  value: opcionesFiltroDepartamentoEmpleado.porDepartamento,
                },
                {
                  label: 'Por empleado',
                  value: opcionesFiltroDepartamentoEmpleado.porEmpleado,
                },
              ]"
            />
          </div>

          <!-- Departamento -->
          <div
            v-if="
              filtro.departamento_empleado ===
              opcionesFiltroDepartamentoEmpleado.porDepartamento
            "
            class="col-12"
          >
            <label class="q-mb-sm block">Seleccione un departamento</label>
            <q-select
              v-model="filtro.departamento"
              :options="departamentos"
              @filter="filtrarDepartamentos"
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
              :error="!!v$.departamento.$errors.length"
              @blur="v$.departamento.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.departamento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div
            v-if="
              filtro.departamento_empleado ===
              opcionesFiltroDepartamentoEmpleado.porEmpleado
            "
            class="col-12"
          >
            <label class="q-mb-sm block"
              >Seleccione el empleado a consultar</label
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
      <div
        class="row bg-body text-bold text-primary q-pa-md rounded justify-center q-mb-lg"
      >
        Información de tickets creados y asignados del empleado seleccionado
      </div>
      <q-card-section>
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-6 q-mb-lg">
            <div class="row q-col-gutter-xs">
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
                  class="rounded-card q-pa-md text-center full-height bg-negative text-white"
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
              <div class="col-12">
                <q-card
                  class="rounded-card text-white no-border q-pa-md text-center full-height cursor-pointer bg-primary"
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
                  class="rounded-card text-white q-pa-md text-center full-height bg-negative"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCancelados }}
                  </div>
                  <div>Cantidad de tickets que le cancelaron</div>
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
                class="col-6 col-md-3"
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
                class="col-12"
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
      v-if="mostrarTitulosSeccion"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row bg-body text-bold q-pa-md rounded text-primary justify-center q-mb-lg"
      >
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
                    (data) =>
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
            class="row q-col-gutter-y-xl q-col-gutter-x-xs q-mb-xl"
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
                    (data) =>
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
                    (data) =>
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
                v-if="ticketsPorEstadoListado.length"
                titulo="Tickets del empleado"
                :configuracionColumnas="[
                  ...configuracionColumnasTicket,
                  accionesTabla,
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
      v-if="mostrarTitulosSeccion && esResponsableDepartamento"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <div
        class="row bg-body text-bold text-primary q-pa-md rounded justify-center q-mb-md"
      >
        Gráficos estadísticos del departamento
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
            v-if="esResponsableDepartamento"
            class="q-col-gutter-y-xl q-col-gutter-x-xs"
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
                    (data) =>
                      clickGraficoTicketsDepartamento(
                        data,
                        estadosTickets.ASIGNADO
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
                    (data) =>
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
                    (data) =>
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
                    (data) =>
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
                    (data) =>
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
                    (data) =>
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
            color="primary"
            @click="tabsDepartamento = opcionesDepartamento.departamentoGrafico"
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
              <!-- v-if="ticketsEmpleadoResponsable.length" -->
              <essential-table
                titulo="Tickets"
                :configuracionColumnas="[
                  ...configuracionColumnasTicket,
                  accionesTabla,
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

    <q-card class="q-mb-md rounded no-border custom-shadow">
      <div
        class="row bg-body text-bold q-pa-md rounded text-primary justify-center q-mb-lg"
      >
        Gráfico promedio de tiempos
      </div>

      <div class="row">
        <div class="col-12 col-md-6 text-center">
          <div class="text-subtitle2 q-mb-lg">Promedio de tickets</div>
          <div>
            <grafico-generico
              v-if="ticketsPorEstado.length"
              :data="ticketsPorEstadoBar"
              :options="optionsPie"
              @click="
                (data) =>
                  clickGraficoTicketsEmpleado(
                    data,
                    categoriaGraficosEmpleado.ESTADO_ACTUAL
                  )
              "
            />
          </div>
        </div>
      </div>
    </q-card>

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./DashboardTicketsPage.ts"></script>
