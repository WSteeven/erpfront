<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-bold q-mb-lg">
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
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-lg"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary"
            >Información de tickets creados y asignados del empleado
            seleccionado</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12 col-md-6 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantTicketsCreados >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white no-border custom-shadow q-pa-md text-center cursor-pointer q-card-hover q-card-press"
                  style="background-color: #bc98f3"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCreados }}
                  </div>
                  <div>Cantidad de tickets creados</div>
                </q-card>
              </div>

              <div v-if="cantTicketsCreadosParaMi >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
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
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
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
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
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
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover bg-negative text-white"
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
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-positive q-mb-md">
                    {{ cantTicketsCalificadosSolicitante }}
                  </div>
                  <div>Cantidad de tickets que creó y calificó</div>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Segunda columna -->
          <div v-if="cantTicketsRecibidos >= 0" class="col-12 col-md-6 column">
            <div class="row q-col-gutter-xs">
              <div class="col-12">
                <q-card
                  class="rounded-card custom-shadow text-white no-border q-pa-md text-center full-height cursor-pointer q-card-hover q-card-press"
                  style="background-color: #bc98f3"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsRecibidos }}
                  </div>
                  <div>Cantidad de tickets asignados</div>
                </q-card>
              </div>

              <div v-if="cantTicketsAsignados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height cursor-pointer q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsAsignados }}
                  </div>
                  <div>Cantidad de tickets pendientes</div>
                </q-card>
              </div>

              <div v-if="cantTicketsCancelados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card text-white custom-shadow no-border q-pa-md text-center full-height bg-negative cursor-pointer q-card-hover"
                >
                  <div class="text-h3 q-mb-md">
                    {{ cantTicketsCancelados }}
                  </div>
                  <div>Cantidad de tickets que le cancelaron</div>
                </q-card>
              </div>

              <div v-if="cantTicketsReasignados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsReasignados }}
                  </div>
                  <div>Cantidad de tickets que le transfirieron</div>
                </q-card>
              </div>

              <div v-if="cantTicketsEjecutados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsEjecutados }}
                  </div>
                  <div>Cantidad de tickets que está ejecutando</div>
                </q-card>
              </div>

              <div v-if="cantTicketsPausados >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
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
                <q-card
                  class="rounded-card no-border custom-shadow q-pa-md text-center q-card-hover"
                >
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
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center q-card-hover"
                >
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
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-positive q-mb-md">
                    {{ cantTicketsCalificadosResponsable }}
                  </div>
                  <div>Cantidad de tickets que finalizó, calificados</div>
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
                  class="rounded-card text-white no-border custom-shadow q-pa-md text-center bg-positive full-height q-card-hover"
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
            >Gráficos estadísticos del empleado consultado</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div v-if="mostrarTitulosSeccion" class="row justify-center q-mb-xl">
          <div class="col-12 col-md-6 text-center">
            <div class="text-subtitle2">Tickets asignados</div>
            <div>
              <Pie
                v-if="ticketsPorEstado.length"
                :data="ticketsPorEstadoBar"
                :options="optionsPie"
                @click="clickTicketPorEstado"
              />
            </div>
          </div>
        </div>

        <div v-if="mostrarTitulosSeccion" class="row q-mb-xl">
          <div class="col-12 col-md-6 text-center">
            <div class="text-subtitle2">Tickets creados</div>
            <div>
              <Pie
                v-if="cantidadesTicketsSolicitadosPorDepartamento.length"
                :data="cantidadesTicketsSolicitadosPorDepartamentoBar"
                :options="optionsPie"
              />
            </div>
          </div>

          <div class="col-12 col-md-6 text-center">
            <div class="text-subtitle2">Tickets asignados</div>
            <div>
              <Pie
                v-if="cantidadesTicketsRecibidosPorDepartamento.length"
                :data="cantidadesTicketsRecibidosPorDepartamentoBar"
                :options="optionsPie"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion && esResponsableDepartamento"
      class="q-mb-md rounded no-border custom-shadow"
    >
      <q-card-section>
        <div
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-md"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary"
            >Gráficos estadísticos del departamento</span
          >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div v-if="esResponsableDepartamento" class="row q-col-gutter-y-xl">
          <!-- Asignados -->
          <div
            v-if="ticketsPorDepartamentoEstadoAsignado.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Pendientes</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoAsignadoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoAsignado.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoReasignado.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Transferidos</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoReasignadoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoReasignado.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoEjecutando.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Ejecutando</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoEjecutandoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoEjecutando.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoPausado.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Pausados</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoPausadoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoPausado.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoFinalizadoSolucionado.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Finalizado solucionado</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoFinalizadoSolucionadoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoFinalizadoSolucionado.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoFinalizadoSinSolucion.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Finalizado sin solución</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoFinalizadoSinSolucionBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoFinalizadoSinSolucion.length"
              />
            </div>
          </div>

          <div
            v-if="ticketsPorDepartamentoEstadoCalificado.length"
            class="col-12 col-md-6 text-center"
          >
            <div class="text-subtitle2">Calificado</div>
            <div>
              <Pie
                :data="ticketsPorDepartamentoEstadoCalificadoBar"
                :options="optionsPie"
                v-if="ticketsPorDepartamentoEstadoCalificado.length"
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
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-md"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-primary">Tablas de tickets</span>
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
          </span>
        </div>

        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <!-- Responsable -->
          <div v-if="esResponsableDepartamento" class="col-12">
            <label class="q-mb-sm block"
              >Empleados responsables del departamento seleccionado</label
            >
            <q-select
              v-model="empleadoResponsableDepartamento"
              :options="empleadosResponsables"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="(item) => `${item.nombres} ${item.apellidos}`"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="
                obtenerTicketsEmpleadoResponsable(
                  empleadoResponsableDepartamento
                )
              "
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione un departamento
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12 text-center">
            <div class="text-bold q-mb-md">Seleccione una opción</div>
            <q-btn-toggle
              v-model="tabsTickets"
              class="toggle-button"
              spread
              no-caps
              rounded
              glossy
              toggle-color="positive"
              @update:model-value="
                obtenerTicketsEmpleadoResponsable(
                  empleadoResponsableDepartamento
                )
              "
              unelevated
              :options="[
                {
                  label: 'Creados',
                  value: 'creados',
                },
                {
                  label: 'Recibidos',
                  value: 'recibidos',
                },
              ]"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12">
            <essential-table
              v-if="ticketsEmpleadoResponsable.length"
              titulo="Tickets finalizados con solución"
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
          <!-- {{ ticketsEmpleadoResponsable }} -->
        </div>
      </q-card-section>
    </q-card>

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./DashboardTicketsPage.ts"></script>
