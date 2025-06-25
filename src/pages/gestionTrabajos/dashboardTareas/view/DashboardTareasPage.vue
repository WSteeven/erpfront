<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border bg-desenfoque custom-shadow">
        <q-card-section>
        <div class="col-12 col-md-6">
            <q-btn-toggle
                v-model="tipoDashboard"
                class="toggle-button-primary"
                spread
                no-caps
                rounded
                toggle-color="primary"
                unelevated
                :options="tiposDashboard"
            />
        </div>
        </q-card-section>

        <q-card-section v-if="tipoDashboard === SISTEMA">
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
          Análisis de datos: Módulo de tareas
        </div>
        <!-- Tiempos -->
        <div class="row q-col-gutter-sm">
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="block q-mb-sm">Filtrar por</label>
            <q-btn-toggle
              v-model="filtro.grupo_empleado"
              class="toggle-button-primary"
              spread
              no-caps
              rounded
              toggle-color="primary"
              unelevated
              @click="limpiarDatosConsultados()"
              :options="[
                {
                  label: 'Por coordinador',
                  value: opcionesFiltroGrupoEmpleado.porEmpleado
                },
                {
                  label: 'Por grupo',
                  value: opcionesFiltroGrupoEmpleado.porGrupo
                }
              ]"
            />
          </div>

          <div v-if="mostrarSeccionEmpleado" class="col-12 col-md-10">
            <label class="q-mb-sm block"
              >Seleccione un coordinador para consultar</label
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

          <div class="col-12 col-md-2 q-pt-lg">
              <q-checkbox
                class="q-mt-sm q-pt-sm"
                v-model="mostrarInactivos"
                label="Inactivos"
                outlined
                @update:model-value="checkMostrarInactivos"
                dense
              ></q-checkbox>
          </div>

          <!-- Grupo -->
          <div v-show="mostrarSeccionGrupo" class="col-12">
            <label class="q-mb-sm block"
              >Seleccione un grupo para consultar</label
            >
            <q-select
              v-model="filtro.grupo"
              :options="grupos"
              @filter="filtrarGrupos"
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
              @update:model-value="consultarGrupo()"
              :error="!!v$.grupo.$errors.length"
              @blur="v$.grupo.$touch"
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
          </div>
        </div>
      </q-card-section>
        <q-card-section v-if="tipoDashboard===APPENATE">
            <div class="border-1 text-primary text-bold q-mb-lg">
                <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
                Análisis de datos: Módulo de tareas 
            </div>
            <!-- Tiempos -->
            <div class="row q-col-gutter-sm">
                <iframe title="Dashboard de Tareas de Técnicos"
                        :width="$q.screen.width" :height="$q.screen.height"
                        src="https://app.powerbi.com/view?r=eyJrIjoiZWIwM2ZlZDgtY2NiOS00YjJhLTllOGMtNzBkZTBiZTNkZDBhIiwidCI6IjhiODI2NjQwLTRkZTQtNDEyOS04MWNlLTU3NjE0MTIwZjAwMCIsImMiOjR9"
                        frameborder="0"
                        allowFullScreen="true"></iframe>
            </div>
        </q-card-section>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion && mostrarCantidades"
      class="q-mb-md rounded no-border custom-shadow bg-desenfoque q-pa-md"
    >
      <div
        v-if="mostrarTitulosSeccion"
        class="row text-bold text-primary rounded items-center"
      >
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Información de tareas activas y subtareas creadas
      </div>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-6 q-mb-lg">
            <div class="row q-col-gutter-xs">
              <div v-if="cantidadTareasActivas >= 0" class="col-12">
                <q-card
                  class="rounded-card text-white q-pa-md text-center"
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
                  class="rounded-card text-white q-pa-md text-center bg-positive"
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
                  class="rounded-card text-white q-pa-md text-center full-height bg-primary"
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
                <q-card class="rounded-card q-pa-md text-center full-height">
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
                  class="rounded-card text-white q-pa-md text-center full-height bg-pink-10"
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
                <q-card class="rounded-card q-pa-md text-center full-height">
                  <div class="text-h3 text-primary q-mb-md">
                    {{ cantidadSubtareasEjecutadas }}
                  </div>
                  <div>Cantidad de subtareas en ejecución</div>
                </q-card>
              </div>

              <div v-if="cantidadSubtareasPausadas >= 0" class="col-6 col-md-3">
                <q-card class="rounded-card q-pa-md text-center full-height">
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
                <q-card class="rounded-card q-pa-md text-center full-height">
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
                <q-card class="rounded-card q-pa-md text-center">
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
                <q-card class="rounded-card q-pa-md text-center">
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
      v-if="
        graficoLineaTiempoSubtareasRealizadasCoordinador ||
        graficoLineaTiempoSubtareasFinalizadasCoordinador
      "
      class="q-mb-md rounded q-pa-md no-border custom-shadow bg-desenfoque"
    >
      <div
        v-if="mostrarTitulosSeccion"
        class="row text-bold text-primary rounded items-center q-mb-lg"
      >
        <q-icon name="bi-graph-up-arrow" class="q-mr-sm"></q-icon>
        Linea de tiempo de las tareas finalizadas
      </div>

      <div class="row q-px-md q-col-gutter-x-sm">
        <div class="col-12 text-center q-mb-md">
          <label class="text-bold q-mb-md block"
            >Tiempo transcurrido desde la ejecución hasta la realización de las
            subtareas</label
          >
          <div>
            <grafico-generico
              :data="graficoLineaTiempoSubtareasRealizadasCoordinador"
              :options="optionsLine"
              tipo="line"
              @click="data => clickGraficoLineaTiempo(data)"
            />
          </div>
        </div>

        <div class="col-12 text-center">
          <label class="text-bold q-mb-md block"
            >Tiempo transcurrido desde la realización hasta la finalización de
            las subtareas</label
          >
          <div>
            <grafico-generico
              :data="graficoLineaTiempoSubtareasFinalizadasCoordinador"
              :options="optionsLine"
              tipo="line"
              @click="data => clickGraficoLineaTiempo(data)"
            />
          </div>
        </div>
      </div>
    </q-card>

    <q-card
      v-if="mostrarTitulosSeccion && cantidadesPorEstadosSubtareasBar"
      class="q-mb-md rounded no-border bg-desenfoque custom-shadow"
    >
      <div
        v-if="mostrarTitulosSeccion"
        class="row text-bold text-primary q-pa-md rounded items-center"
      >
        <q-icon name="bi-pie-chart" class="q-mr-sm"></q-icon>
        Estados de las subtareas del coordinador consultado
      </div>

      <q-tab-panels
        v-model="tabsCoordinadorConsultado"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
        class="bg-desenfoque"
        :class="{ 'rounded-tabpanel': !$q.screen.xs }"
      >
        <q-tab-panel
          :name="opcionesCoordinadorConsultado.coordinadorConsultadoGrafico"
        >
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
                :mostrar-exportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-card
      v-if="
        mostrarTitulosSeccion &&
        (graficosCoordinadorSubordinadosPorGrupo.length ||
          graficosCoordinadorSubordinadosPorCoordinador.length)
      "
      class="q-mb-md rounded no-border bg-desenfoque custom-shadow"
    >
      <div class="row text-bold text-primary q-pa-md rounded items-center">
        <q-icon name="bi-pie-chart" class="q-mr-sm"></q-icon>
        Estados de las subtareas de los empleados subordinados
      </div>

      <!-- <q-card-section> -->
      <q-tab-panels
        v-model="tabsSubordinados"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="bg-desenfoque"
        keep-alive
      >
        <!-- Graficos -->
        <q-tab-panel :name="opcionesSubordinado.subordinadosGrafico">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-btn-toggle
                v-model="tipoFiltroSubordinados"
                class="toggle-button-grey q-mb-md"
                spread
                no-caps
                rounded
                toggle-color="grey-8"
                unelevated
                :options="[
                  {
                    label: 'Por grupo',
                    value: modosAsignacionTrabajo.por_grupo
                  },
                  {
                    label: 'Por empleado',
                    value: modosAsignacionTrabajo.por_empleado
                  }
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
            class="q-col-gutter-y-xl q-col-gutter-x-md"
            :class="{ row: !modoUnaColumna, column: modoUnaColumna }"
          >
            <!-- Agendados -->
            <div
              v-for="(
                grafico, index
              ) in graficosCoordinadorSubordinadosPorGrupo"
              :key="index"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">{{ grafico.titulo }}</div>
              <div class="text-center row justify-center" style="height: 300px">
                <grafico-generico
                  :data="grafico"
                  :options="optionsPie"
                  @click="
                    data =>
                      clickCantidadesSubtareasSubordinados(data, grafico.titulo)
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
              v-for="(
                grafico, index
              ) in graficosCoordinadorSubordinadosPorCoordinador"
              :key="index"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-subtitle2 q-mb-lg">{{ grafico.titulo }}</div>
              <div class="text-center row justify-center" style="height: 300px">
                <grafico-generico
                  :data="grafico"
                  :options="optionsPie"
                  @click="
                    data =>
                      clickGraficoEmpleadoSubordinado(data, grafico.titulo)
                  "
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesSubordinado.subordinadosListado">
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
                :mostrar-exportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesSubordinado.subordinadosEmpleadoListado">
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
                :mostrar-exportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-card v-if="graficos" class="q-mb-md rounded no-border custom-shadow">
      <div class="row text-bold text-primary q-pa-md rounded items-center">
        <q-icon name="bi-pie-chart" class="q-mr-sm"></q-icon>
        Estados de las subtareas de los grupos
      </div>
      <q-tab-panels
        v-model="tabsGrupo"
        animated
        transition-prev="scale"
        transition-next="scale"
        keep-alive
        :class="{ 'rounded-tabpanel': !$q.screen.xs }"
      >
        <q-tab-panel :name="opcionesGrupo.grupoGrafico">
          <div class="row q-px-md q-col-gutter-x-sm">
            <div
              v-for="(grafico, index) in graficos"
              :key="index"
              class="col-12 text-center q-mb-md"
            >
              <label class="text-bold q-mb-md block">{{
                grafico.titulo
              }}</label>
              <div>
                <grafico-generico
                  :data="grafico"
                  :options="optionsPie"
                  @click="data => clickGraficoEstadosGrupo(data)"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="opcionesGrupo.grupoListado">
          <q-btn
            color="primary"
            @click="tabsGrupo = opcionesGrupo.grupoGrafico"
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
                :datos="listadoFiltrado"
                :permitirConsultar="false"
                :permitirEditar="false"
                :permitirEliminar="false"
                :mostrarBotones="false"
                :alto-fijo="false"
                :accion1="botonVer"
                :accion2="btnSeguimiento"
                :mostrar-exportar="true"
              ></essential-table>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <modales-entidad
      :comportamiento="modalesSubtarea"
      :mixin-modal="mixinSubtarea"
      :persistente="false"
      :confirmar-cerrar="false"
    />
  </q-page>
</template>

<script src="./DashboardTareasPage.ts"></script>
