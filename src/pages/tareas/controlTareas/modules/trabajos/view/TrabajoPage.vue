<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTrabajo"
    tituloPagina="Control de trabajos"
    :full="true"
    :permitirConsultar="false"
    :permitirEliminar="false"
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
            <div class="col-12">
              <q-btn-toggle
                v-model="trabajo.para_cliente_proyecto"
                class="toggle-button"
                spread
                no-caps
                rounded
                toggle-color="positive"
                unelevated
                :options="[
                  {
                    label: 'Tarea para un proyecto',
                    value: destinosTareas.paraProyecto,
                  },
                  {
                    label: 'Tarea para cliente final',
                    value: destinosTareas.paraClienteFinal,
                  },
                ]"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Codigo tarea JP -->
            <div v-if="trabajo.codigo_tarea" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de tarea</label>
              <q-input
                v-model="trabajo.codigo_trabajo"
                outlined
                dense
                disable
              ></q-input>
            </div>

            <!-- Numero tarea cliente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de trabajo cliente</label>
              <q-input
                v-model="trabajo.codigo_trabajo_cliente"
                placeholder="Obligatorio"
                hint="Ticket, OT, Tarea"
                :error="!!v$.codigo_trabajo_cliente.$errors.length"
                @blur="v$.codigo_trabajo_cliente.$touch"
                outlined
                dense
                autofocus
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.codigo_trabajo_cliente.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Cliente principal -->
            <div v-if="paraClienteFinal" class="col-12 col-md-6">
              <label class="q-mb-sm block">Cliente corporativo</label>
              <q-select
                v-model="trabajo.cliente"
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
                @update:model-value="establecerCliente()"
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

            <!-- Fiscalizador -->
            <div v-if="paraClienteFinal" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fiscalizador JPCONSTRUCRED</label>
              <q-select
                v-model="trabajo.fiscalizador"
                :options="fiscalizadores"
                @filter="filtrarFiscalizadores"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                clearable
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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
              </q-select>
            </div>

            <!-- Coordinador -->
            <div
              v-if="paraClienteFinal && trabajo.coordinador"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Coordinador</label>
              <q-select
                v-model="trabajo.coordinador"
                :options="coordinadores"
                @filter="filtrarCoordinadores"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                clearable
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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
              </q-select>
            </div>

            <!-- Fecha de solicitud -->
            <div v-if="paraClienteFinal" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha de solicitud del cliente</label
              >
              <q-input v-model="trabajo.fecha_solicitud" outlined dense>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="trabajo.fecha_solicitud"
                        mask="DD-MM-YYYY"
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
              </q-input>
            </div>

            <!-- Codigo de proyecto -->
            <div v-if="paraProyecto" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de proyecto</label>
              <q-select
                v-model="trabajo.proyecto"
                :options="proyectos"
                @filter="filtrarProyectos"
                @blur="v$.proyecto.$touch"
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
                :error="!!v$.proyecto.$errors.length"
                @update:modelValue="setCliente"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:error>
                  <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Tiene subtareas -->
            <div class="col-12 col-md-3">
              <br />
              <q-toggle
                v-model="trabajo.tiene_subtrabajos"
                checked-icon="check"
                label="Tiene subtrabajos  "
                unchecked-icon="clear"
              />
            </div>

            <!-- Tipo trabajo -->
            <div v-if="!trabajo.tiene_subtrabajos" class="col-12 col-md-3">
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
                :option-label="(item) => item.descripcion"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :disable="disable"
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

            <!-- Titulo -->
            <div class="col-12">
              <label class="q-mb-sm block">Título del trabajo a realizar</label>
              <q-input
                v-model="trabajo.titulo"
                placeholder="Obligatorio"
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
                dense
                autogrow
                type="textarea"
              >
              </q-input>
            </div>

            <!-- Es dependiente -->
            <div
              v-if="
                !trabajo.tiene_subtrabajos &&
                trabajoStore.nivelActual > nivelesTrabajos.TAREA
              "
              class="col-12 col-md-3"
            >
              <br />
              <q-checkbox
                v-model="trabajo.es_dependiente"
                label="Es dependiente"
                :disable="disable"
                outlined
                dense
              ></q-checkbox>
            </div>

            <!--  Trabajo del que depende -->
            <div v-if="trabajo.es_dependiente" class="col-12 col-md-3">
              <label class="q-mb-sm block">Trabajo del que depende</label>
              <q-select
                v-model="trabajo.trabajo_dependiente"
                :options="subtareas"
                @filter="filtrarSubtareas"
                :error="!!v$.trabajo_dependiente.$errors.length"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.codigo_subtarea"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                :disable="disable"
                emit-value
                map-options
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="q-my-sm">
                    <q-item-section>
                      <q-item-label class="text-bold text-primary">{{
                        scope.opt.codigo_subtarea
                      }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.detalle }}
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
            <div
              v-if="!trabajo.tiene_subtrabajos"
              class="col-12 col-md-3 q-mb-md"
            >
              <br />
              <q-checkbox
                v-model="trabajo.es_ventana"
                label="Es ventana de trabajo"
                :disable="disable"
                @blur="verificarEsVentana()"
                outlined
                dense
              ></q-checkbox>
            </div>

            <div v-if="!trabajo.tiene_subtrabajos" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de agendamiento</label>
              <q-input
                v-model="trabajo.fecha_agendado"
                placeholder="Obligatorio"
                :error="!!v$.fecha_agendado.$errors.length"
                :disable="disable"
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
                        v-model="trabajo.fecha_agendado"
                        mask="DD-MM-YYYY"
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

            <!-- Hora inicio de ventana -->
            <div v-if="!trabajo.tiene_subtrabajos" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Hora inicio de agendamiento (24H)</label
              >
              <q-input
                v-model="trabajo.hora_inicio_agendado"
                :disable="disable"
                placeholder="Obligatorio"
                :error="!!v$.hora_inicio_agendado.$errors.length"
                mask="time"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon name="bi-clock" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="trabajo.hora_inicio_agendado"
                        format24h
                        now-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>

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
                :disable="disable"
                placeholder="Obligatorio"
                :error="!!v$.hora_fin_agendado.$errors.length"
                type="time"
                stack-label
                outlined
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
          v-if="!trabajo.tiene_subtrabajos"
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
                color="bg-body"
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
            class="q-mb-md"
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
                :configuracionColumnas="columnasGrupo"
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
                :configuracionColumnas="configuracionColumnasEmpleado"
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
                :configuracionColumnas="columnas"
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

        <q-expansion-item
          v-if="paraClienteFinal"
          class="overflow-hidden q-mb-md expansion"
          label="Ubicación del trabajo para cliente final"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <label-abrir-modal
                v-if="mostrarLabelModal"
                label="Cliente final"
                @click="modales.abrirModalEntidad('ClienteFinalPage')"
              />
              <label v-else class="q-mb-sm block">Cliente final</label>
              <q-select
                v-model="trabajo.cliente_final"
                :options="clientesFinales"
                @filter="filtrarClientesFinales"
                hint="Primero seleccione al cliente principal"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                @update:model-value="
                  (v) => obtenerClienteFinal(trabajo.cliente_final)
                "
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

            <!-- Id de cliente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">ID de cliente final</label>
              <q-input
                v-model="clienteFinal.id_cliente_final"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Celular -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="clienteFinal.celular"
                outlined
                dense
                disable
              ></q-input>
            </div>

            <!-- Provincia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Provincias</label>
              <q-select
                v-model="clienteFinal.provincia"
                :options="listadosAuxiliares.provincias"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                disable
                :option-label="(item) => item.provincia"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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
              </q-select>
            </div>

            <!-- Ciudad -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Cantón</label>
              <q-select
                v-model="clienteFinal.canton"
                :options="listadosAuxiliares.cantones"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                disable
                :option-label="(item) => item.canton"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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
              </q-select>
            </div>

            <!-- Parroquia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Parroquia/Barrio</label>
              <q-input
                v-model="clienteFinal.parroquia"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Direccion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="clienteFinal.direccion"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Referencia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Referencia</label>
              <q-input
                v-model="clienteFinal.referencia"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Coordenada latitud -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Coordenada latitud</label>
              <q-input
                v-model="clienteFinal.coordenada_latitud"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Coordenada longitud -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Coordenada longitud</label>
              <q-input
                v-model="clienteFinal.coordenada_longitud"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
          </div>
        </q-expansion-item>

        <!--<button-submits
          :accion="accion"
          @cancelar="reestablecerDatos()"
          @editar="editarDatos(subtarea)"
          @guardar="guardarDatos(subtarea)"
        />-->

        <essential-selectable-table
          ref="refListadoSeleccionableTecnicos"
          :configuracion-columnas="configuracionColumnasEmpleado"
          :datos="listadoTecnicos"
          tipo-seleccion="multiple"
          @selected="seleccionarEmpleado"
        ></essential-selectable-table>

        <modales-entidad :comportamiento="modales" />
        <!--</q-form>
  </q-page> -->
      </div>
    </template>
  </tab-layout>
</template>

<script src="./TrabajoPage.ts"></script>
