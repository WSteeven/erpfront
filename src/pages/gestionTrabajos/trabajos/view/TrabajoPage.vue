<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTrabajo"
    tituloPagina="Control de trabajos"
    :permitirConsultar="false"
    :permitirEliminar="false"
    :mostrar-listado="false"
    :mostrar-custom-listado="true"
  >
    <template #formulario>
      <div class="q-pa-sm">
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="1. Información general"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Titulo -->
            <div class="col-12">
              <label class="q-mb-sm block">Título del trabajo a realizar</label>
              <q-input
                v-model="trabajo.titulo"
                placeholder="Obligatorio"
                :disable="disable"
                outlined
                dense
                :error="!!v$.titulo.$errors.length"
                @blur="v$.titulo.$touch"
              >
                <template v-slot:error>
                  <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                    <div>{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Descripcion completa -->
            <div class="col-12">
              <label class="q-mb-sm block"
                >Descripción completa del trabajo a realizar</label
              >
              <q-input
                v-model="trabajo.descripcion_completa"
                placeholder="Obligatorio"
                outlined
                :disable="disable"
                dense
                autogrow
                type="textarea"
                :error="!!v$.descripcion_completa.$errors.length"
                @blur="v$.descripcion_completa.$touch"
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.descripcion_completa.$errors"
                    :key="error.$uid"
                  >
                    <div>{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Observacion -->
            <div class="col-12">
              <label class="q-mb-sm block">Observación</label>
              <q-input
                v-model="trabajo.observacion"
                placeholder="Opcional"
                outlined
                :disable="disable"
                dense
                autogrow
                type="textarea"
              >
              </q-input>
            </div>

            <!-- Codigo tarea JP -->
            <div v-if="trabajo.codigo_trabajo" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de trabajo</label>
              <q-input
                v-model="trabajo.codigo_trabajo"
                outlined
                dense
                disable
              ></q-input>
            </div>

            <!-- Tarea -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tarea</label>
              <q-select
                v-model="trabajo.tarea"
                :options="tareas"
                @filter="filtrarTareas"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :disable="disable"
                :option-label="(item) => item.codigo_tarea"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :error="!!v$.tipo_trabajo.$errors.length"
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
                    v-for="error of v$.tipo_trabajo.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Tipo trabajo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de trabajo a realizar</label>
              <q-select
                v-model="trabajo.tipo_trabajo"
                :options="tiposTrabajos"
                @filter="filtrarTiposTrabajos"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :disable="disable"
                :option-label="(item) => item.descripcion"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :error="!!v$.tipo_trabajo.$errors.length"
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
                    v-for="error of v$.tipo_trabajo.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Es dependiente -->
            <div class="col-12 col-md-3">
              <br />
              <q-checkbox
                v-model="trabajo.es_dependiente"
                label="Es dependiente"
                outlined
                :disable="disable"
                dense
              ></q-checkbox>
            </div>

            <!--  Trabajo del que depende -->
            <div v-if="trabajo.es_dependiente" class="col-12 col-md-3">
              <label class="q-mb-sm block">Trabajo del que depende</label>
              <q-select
                v-model="trabajo.trabajo_dependiente"
                :options="trabajos"
                @filter="filtrarTrabajos"
                :error="!!v$.trabajo_dependiente.$errors.length"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :disable="disable"
                :option-label="(item) => item.codigo_trabajo"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="q-my-sm">
                    <q-item-section>
                      <q-item-label class="text-bold text-primary">{{
                        scope.opt.codigo_trabajo
                      }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.titulo }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:error>
                  <div
                    v-for="error of v$.subtarea_dependiente.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Es ventana -->
            <div class="col-12 col-md-3 q-mb-md">
              <br />
              <q-checkbox
                v-model="trabajo.es_ventana"
                label="Es ventana de trabajo"
                @blur="verificarEsVentana()"
                outlined
                :disable="disable"
                dense
              ></q-checkbox>
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de agendamiento</label>
              <q-input
                v-model="trabajo.fecha_agendado"
                placeholder="Obligatorio"
                :error="!!v$.fecha_agendado.$errors.length"
                outlined
                :disable="disable"
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
                        v-model="trabajo.fecha_agendado"
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
                  <div
                    v-for="error of v$.fecha_agendado.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Hora inicio de agendamiento -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Hora inicio de agendamiento (24H)</label
              >
              <q-input
                v-model="trabajo.hora_inicio_agendado"
                placeholder="Obligatorio"
                :error="!!v$.hora_inicio_agendado.$errors.length"
                type="time"
                :disable="disable"
                stack-label
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.hora_inicio_agendado.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Hora fin de agendamiento -->
            <div v-if="trabajo.es_ventana" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Hora fin de agendamiento (24H)</label
              >
              <q-input
                v-model="trabajo.hora_fin_agendado"
                placeholder="Obligatorio"
                :error="!!v$.hora_fin_agendado.$errors.length"
                type="time"
                stack-label
                outlined
                :disable="disable"
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.hora_fin_agendado.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. Asignación de trabajo"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Asignar trabajo -->
            <div class="col-12 q-mb-md">
              <label class="text-center q-mb-sm block"
                >Modo de asignación del trabajo</label
              >
              <q-btn-toggle
                v-model="trabajo.modo_asignacion_trabajo"
                spread
                class="toggle-button"
                no-caps
                unelevated
                :disable="disable"
                rounded
                toggle-color="positive"
                @update:model-value="resetListados()"
                :options="[
                  {
                    label: 'Por grupo',
                    value: opcionesModoAsignacionTrabajo.por_grupo,
                  },
                  {
                    label: 'Por empleado',
                    value: opcionesModoAsignacionTrabajo.por_trabajador,
                  },
                ]"
              />
            </div>
          </div>

          <!-- Grupo -->
          <div
            v-if="
              trabajo.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_grupo
            "
            class="row q-col-gutter-sm q-mb-md q-pa-sm"
          >
            <div class="col-12 col-md-10">
              <label class="q-mb-sm block">Grupo técnico seleccionado</label>
              <q-select
                v-model="trabajo.grupo"
                :options="grupos"
                @filter="filtrarGrupos"
                transition-show="scale"
                transition-hide="scale"
                hint="Seleccione y presione en Agregar"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                clearable
                :disable="disable"
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

            <div class="col-12 col-md-2 q-pt-md">
              <br />
              <q-btn
                color="positive"
                class="full-width"
                :disable="disable"
                no-caps
                push
                @click="agregarGrupoSeleccionado(trabajo.grupo)"
              >
                <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
                <div>Agregar</div>
              </q-btn>
            </div>
          </div>

          <div
            v-if="
              trabajo.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_trabajador
            "
            class="row q-col-gutter-sm q-pa-sm"
          >
            <!-- Busqueda -->
            <div class="col-12 col-md-10">
              <label class="q-mb-sm block">Empleado</label>
              <q-input
                v-model="criterioBusquedaTecnico"
                placeholder="Nombres / Apellidos / Identificación"
                hint="Ingrese los datos del empleado y presione Enter para buscar"
                @keydown.enter="listarTecnicos()"
                @blur="criterioBusquedaTecnico === '' ? limpiarTecnico() : null"
                :disable="disable"
                clearable
                outlined
                dense
              ></q-input>
            </div>

            <div class="col-12 col-md-2 q-pt-md">
              <br />
              <q-btn
                color="positive"
                class="full-width"
                :disable="disable"
                no-caps
                push
                @click="listarTecnicos()"
              >
                <q-icon name="bi-search" class="q-pr-sm" size="xs"></q-icon>
                <div>Buscar</div>
              </q-btn>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12">
              <essential-table
                v-if="
                  trabajo.modo_asignacion_trabajo ===
                  opcionesModoAsignacionTrabajo.por_grupo
                "
                titulo="Grupos seleccionados"
                estilos="margin-bottom: 14px;"
                :configuracionColumnas="columnasGrupoSeleccionado"
                :datos="trabajo.grupos_seleccionados"
                :accion1Header="asignarNuevoTecnicoLider"
                :accion2Header="designarNuevoSecretario"
                :accion3Header="cancelarDesignacion"
                :mostrarBotones="false"
                :permitirConsultar="false"
                :permitirEditar="false"
                :permitirEliminar="false"
                :alto-fijo="false"
                :mostrar-header="true"
                :permitir-buscar="false"
                :mostrar-footer="!trabajo.grupos_seleccionados.length"
                :tipo-seleccion="tipoSeleccion"
                :accion1="quitarGrupo"
                :accion2="designarGrupoPrincipal"
              >
                <!-- @selected="entidadSeleccionada" -->
              </essential-table>

              <essential-table
                v-if="
                  trabajo.modo_asignacion_trabajo ===
                  opcionesModoAsignacionTrabajo.por_grupo
                "
                ref="refEmpleadosAsignados"
                titulo="Empleados de los grupos seleccionados"
                estilos="margin-bottom: 14px;"
                :configuracionColumnas="
                  configuracionColumnasEmpleadoSeleccionable
                "
                :datos="trabajo.empleados_seleccionados"
                :accion1Header="asignarNuevoTecnicoLider"
                :accion2Header="designarNuevoSecretario"
                :accion3Header="cancelarDesignacion"
                :mostrarBotones="false"
                :permitirConsultar="false"
                :permitirEditar="false"
                :permitirEliminar="false"
                :alto-fijo="false"
                :mostrar-header="true"
                :permitir-buscar="false"
                :tipo-seleccion="tipoSeleccion"
                :mostrar-footer="!trabajo.empleados_seleccionados.length"
              >
                <!--@selected="entidadSeleccionada" -->
              </essential-table>

              <essential-table
                v-if="
                  trabajo.modo_asignacion_trabajo ===
                  opcionesModoAsignacionTrabajo.por_trabajador
                "
                ref="refEmpleadosAsignados"
                titulo="Empleados de los grupos seleccionados"
                :configuracionColumnas="columnasEmpleadoSeleccionado"
                :datos="trabajo.empleados_seleccionados"
                :accion1Header="asignarNuevoTecnicoLider"
                :accion2Header="designarNuevoSecretario"
                :accion3Header="cancelarDesignacion"
                :mostrarBotones="false"
                :permitirConsultar="false"
                :permitirEditar="false"
                :permitirEliminar="false"
                :alto-fijo="false"
                :mostrar-header="true"
                :permitir-buscar="false"
                :tipo-seleccion="tipoSeleccion"
                :mostrar-footer="!trabajo.empleados_seleccionados.length"
                :accion1="quitarEmpleado"
                :accion2="designarEmpleadoResponsable"
              >
                <!--@selected="entidadSeleccionada"-->
              </essential-table>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          v-if="accion !== acciones.nuevo"
          class="overflow-hidden q-mb-md expansion"
          label="Tiempos"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Fecha de creacion -->
            <div v-if="trabajo.fecha_hora_creacion" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de creación</label>
              <q-input
                v-model="trabajo.fecha_hora_creacion"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <div v-if="trabajo.fecha_hora_asignacion" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de asignación</label>
              <q-input
                v-model="trabajo.fecha_hora_asignacion"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Fecha de inicio -->
            <div v-if="trabajo.fecha_hora_inicio" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de inicio de trabajo</label
              >
              <q-input
                v-model="trabajo.fecha_hora_inicio"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Fecha de finalizacion -->
            <div v-if="trabajo.fecha_hora_finalizacion" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de finalización de trabajo</label
              >
              <q-input
                v-model="trabajo.fecha_hora_finalizacion"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Técnico responsable -->
            <div v-if="trabajo.cantidad_dias" class="col-12 col-md-3">
              <label class="q-mb-sm block">Cantidad de días</label>
              <q-input
                v-model="trabajo.cantidad_dias"
                outlined
                disable
                dense
              ></q-input>
            </div>

            <!-- Fecha y hora de estado realizado -->
            <div v-if="trabajo.fecha_hora_realizado" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora realizado</label>
              <q-input
                v-model="trabajo.fecha_hora_realizado"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Fecha y hora de estado suspendido -->
            <div v-if="trabajo.fecha_hora_suspendido" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha y hora de estado suspendido</label
              >
              <q-input
                v-model="trabajo.fecha_hora_suspendido"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Causa de la suspencion -->
            <div v-if="trabajo.causa_suspencion" class="col-12 col-md-3">
              <label class="q-mb-sm block">Causa de la suspención</label>
              <q-input
                v-model="trabajo.causa_suspencion"
                disable
                outlined
                type="textarea"
                autogrow
                dense
              ></q-input>
            </div>

            <!-- Fecha y hora de estado cancelacion -->
            <div v-if="trabajo.fecha_hora_cancelado" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha y hora de cancelación</label>
              <q-input
                v-model="trabajo.fecha_hora_cancelado"
                outlined
                dense
                disable
              >
              </q-input>
            </div>

            <!-- Causa de la suspencion -->
            <div
              v-if="trabajo.fecha_hora_estado_cancelado"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Causa de la cancelación</label>
              <q-input
                v-model="trabajo.causa_cancelacion"
                placeholder="Opcional"
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>

        <essential-selectable-table
          ref="refListadoSeleccionableTecnicos"
          :configuracion-columnas="configuracionColumnasEmpleadoSeleccionable"
          :datos="listadoTecnicos"
          tipo-seleccion="multiple"
          @selected="seleccionarEmpleado"
        ></essential-selectable-table>
      </div>
    </template>

    <template #custom-listado>
      <essential-table
        :configuracionColumnas="[
          ...configuracionColumnasTrabajo,
          accionesTabla,
        ]"
        :datos="listado"
        :accion1="botonEditarTrabajo"
        :accion2="botonSubirArchivos"
        :accion3="botonAsignar"
        :accion4="botonCancelar"
        :accion5="botonReagendar"
        :accion6="botonFormulario"
        :accion7="botonVerPausas"
        :accion8="botonFinalizar"
        separador="cell"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :mostrar-botones="false"
        :mostrarFooter="true"
        @filtrarTodos="filtrarTodos"
      ></essential-table>
    </template>

    <template #modales>
      <modales-entidad :comportamiento="modales" />
    </template>
  </tab-layout>
</template>

<script src="./TrabajoPage.ts"></script>
