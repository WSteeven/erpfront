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

        <div v-if="mostrarTitulosSeccion" class="text-bold q-mb-sm">
          Datos generales
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

              <!-- <div v-if="cantTicketsCreadosParaMi >= 0" class="col-6 col-md-3">
                <q-card
                  class="rounded-card custom-shadow no-border q-pa-md text-center full-height q-card-hover"
                >
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantTicketsCreadosParaMi }}
                  </div>
                  <div>Cantidad de tickets creadas para sí mismo</div>
                </q-card>
              </div> -->

              <!-- <div
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
              </div> -->

              <!-- <div
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
              </div> -->

              <!-- <div
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
              </div> -->

              <!-- <div
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
              </div> -->
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

              <!-- <div
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
              </div> -->
            </div>
          </div>
        </div>

        <div
          v-if="mostrarTitulosSeccion"
          class="row bg-grey-2 text-bold q-pa-md rounded justify-between q-mb-md"
        >
          <span class="q-col-gutter-x-xs">
            <q-icon name="bi-circle-fill" color="grey-3"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-4"></q-icon>
            <q-icon name="bi-circle-fill" color="grey-5"></q-icon>
          </span>
          <span class="text-grey-9"
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

        <!-- <div v-if="mostrarTitulosSeccion" class="row q-mb-xl">
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
        </div> -->

        <div
          v-if="mostrarTitulosSeccion && esResponsableDepartamento"
          class="text-bold q-mb-xl"
        >
          Gráficos estadísticos del departamento
        </div>
        <div v-if="esResponsableDepartamento" class="row q-col-gutter-y-xl">
          <!-- Asignados -->
          <!-- <div
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
          </div> -->
        </div>

        <div v-if="mostrarTitulosSeccion" class="text-bold q-mb-sm">
          Tabla de subtareas
        </div>
        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12">
            <essential-table
              v-if="subtareas.length"
              titulo="Subtareas"
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
          <!-- {{ ticketsEmpleadoResponsable }} -->
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
