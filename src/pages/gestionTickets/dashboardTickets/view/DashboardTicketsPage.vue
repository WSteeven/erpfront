<template>
  <q-page padding>
    <q-card flat bordered class="q-mb-md rounded">
      <q-card-section>
        <div class="text-bold q-mb-lg">
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
            <label class="q-mb-sm block"
              ><b>Paso 1: </b>Seleccione un empleado</label
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

        <div v-if="mostrarTitulosSeccion" class="text-bold q-mb-sm">
          Datos generales
        </div>
        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div v-if="cantTicketsCreados >= 0" class="col-12 col-md-3">
            <q-card
              class="rounded-card text-white q-pa-md text-center full-height"
              style="background-color: #5086c1"
            >
              <div>Cantidad de tickets creados</div>
              <div class="text-h3">{{ cantTicketsCreados }}</div>
            </q-card>
          </div>

          <div v-if="cantTicketsRecibidos >= 0" class="col-12 col-md-3">
            <q-card
              class="rounded-card text-white q-pa-md text-center full-height"
              style="background-color: #8f7193"
            >
              <div>Cantidad de tickets que recibió</div>
              <div class="text-h3">{{ cantTicketsRecibidos }}</div>
            </q-card>
          </div>

          <div
            v-if="cantTicketsFinalizadosSolucionados >= 0"
            class="col-12 col-md-3"
          >
            <q-card
              class="rounded-card text-white q-pa-md text-center"
              style="background-color: #bc98f3"
            >
              <div>Cantidad de tickets finalizados con solución</div>
              <div class="text-h3">
                {{ cantTicketsFinalizadosSolucionados }}
              </div>
            </q-card>
          </div>

          <div
            v-if="cantTicketsFinalizadosSinSolucion >= 0"
            class="col-12 col-md-3"
          >
            <q-card
              class="rounded-card text-white q-pa-md text-center"
              style="background-color: #73bcf8"
            >
              <div>Cantidad de tickets finalizados sin solución</div>
              <div class="text-h3">{{ cantTicketsFinalizadosSinSolucion }}</div>
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
              class="bg-positive rounded-card text-white q-pa-md text-center"
            >
              <div>Cantidad de tickets finalizados</div>
              <div class="text-h3">
                {{
                  cantTicketsFinalizadosSolucionados +
                  cantTicketsFinalizadosSinSolucion
                }}
              </div>
            </q-card>
          </div>
        </div>

        <div v-if="mostrarTitulosSeccion" class="text-bold q-mb-sm">
          Gráficos estadísticos
        </div>
        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12 col-md-6">
            <Bar
              v-if="cantidadesTicketsSolicitadosPorDepartamento.length"
              :data="cantidadesTicketsSolicitadosPorDepartamentoBar"
              :options="options"
            />
          </div>

          <div class="col-12 col-md-6">
            <Bar
              v-if="cantidadesTicketsRecibidosPorDepartamento.length"
              :data="cantidadesTicketsRecibidosPorDepartamentoBar"
              :options="options"
            />
          </div>
        </div>

        <div v-if="mostrarTitulosSeccion" class="text-bold q-mb-sm">
          Tablas de datos
        </div>
        <div class="row q-col-gutter-sm q-py-md q-mb-lg">
          <div class="col-12">
            <essential-table
              v-if="ticketsConSolucion.length"
              titulo="Tickets finalizados con solución"
              :configuracionColumnas="configuracionColumnasDashboardTicket"
              :datos="ticketsConSolucion"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-buscar="false"
              :alto-fijo="false"
            ></essential-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./DashboardTicketsPage.ts"></script>
