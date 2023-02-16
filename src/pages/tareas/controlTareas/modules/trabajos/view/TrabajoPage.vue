<template>
  <q-page
    padding
    :class="{
      'bg-body-table-dark-color': $q.dark.isActive,
      'bg-white': !$q.dark.isActive,
    }"
  >
    <q-form @submit.prevent>
      <q-expansion-item
        class="overflow-hidden q-mb-md expansion"
        label="Información general"
        header-class="bg-header-collapse"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-btn-toggle
              v-model="subtarea.destino"
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
          <div v-if="subtarea.codigo_tarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de tarea</label>
            <q-input
              v-model="subtarea.codigo_tarea"
              outlined
              dense
              disable
            ></q-input>
          </div>

          <!-- Numero tarea cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de tarea cliente</label>
            <q-input
              v-model="subtarea.codigo_tarea_cliente"
              placeholder="Obligatorio"
              hint="Ticket, OT, Tarea"
              :error="!!v$.codigo_tarea_cliente.$errors.length"
              @blur="v$.codigo_tarea_cliente.$touch"
              outlined
              dense
              autofocus
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.codigo_tarea_cliente.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Cliente principal -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="subtarea.cliente"
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
              v-model="subtarea.fiscalizador"
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
          <div v-if="paraClienteFinal" class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordinador</label>
            <q-select
              v-model="subtarea.coordinador"
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
            <label class="q-mb-sm block">Fecha de solicitud del cliente</label>
            <q-input v-model="subtarea.fecha_solicitud" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="subtarea.fecha_solicitud"
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
              v-model="subtarea.proyecto"
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
              v-model="subtarea.tiene_subtareas"
              checked-icon="check"
              label="Tiene subtareas"
              unchecked-icon="clear"
            />
          </div>

          <!-- Titulo -->
          <div class="col-12">
            <label class="q-mb-sm block">Título del trabajo a realizar</label>
            <q-input
              v-model="subtarea.titulo"
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
              v-model="subtarea.descripcion_completa"
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
              v-model="subtarea.observacion"
              placeholder="Opcional"
              outlined
              dense
              autogrow
              type="textarea"
            >
            </q-input>
          </div>

          <!-- Tipo trabajo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de trabajo a realizar</label>
            <q-select
              v-model="subtarea.tipo_trabajo"
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
                <div v-for="error of v$.tipo_trabajo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Es dependiente -->
          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="subtarea.es_dependiente"
              label="Es dependiente"
              :disable="disable"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!--  Trabajo del que depende -->
          <div v-if="subtarea.es_dependiente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Trabajo del que depende</label>
            <q-select
              v-model="subtarea.subtarea_dependiente"
              :options="subtareas"
              @filter="filtrarSubtareas"
              :error="!!v$.subtarea_dependiente.$errors.length"
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
          <div class="col-12 col-md-3 q-mb-md">
            <br />
            <q-checkbox
              v-model="subtarea.es_ventana"
              label="Es ventana de trabajo"
              :disable="disable"
              @blur="verificarEsVentana()"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de agendamiento</label>
            <q-input
              v-model="subtarea.fecha_agendado"
              placeholder="Opcional"
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
                      v-model="subtarea.fecha_agendado"
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
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Hora inicio de agendamiento (24H)</label
            >
            <q-input
              v-model="subtarea.hora_inicio_agendado"
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
                      v-model="subtarea.hora_inicio_agendado"
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
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora fin de agendamiento (24H)</label>
            <q-input
              v-model="subtarea.hora_fin_agendado"
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
        class="overflow-hidden q-mb-md expansion"
        label="Tiempos"
        header-class="bg-header-collapse"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Fecha de creacion -->
          <div v-if="subtarea.fecha_hora_creacion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de creación</label>
            <q-input
              v-model="subtarea.fecha_hora_creacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <div v-if="subtarea.fecha_hora_asignacion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de asignación</label>
            <q-input
              v-model="subtarea.fecha_hora_asignacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha de inicio -->
          <div v-if="subtarea.fecha_hora_inicio" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de inicio de trabajo</label
            >
            <q-input
              v-model="subtarea.fecha_hora_inicio"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha de finalizacion -->
          <div v-if="subtarea.fecha_hora_finalizacion" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de finalización de trabajo</label
            >
            <q-input
              v-model="subtarea.fecha_hora_finalizacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Técnico responsable -->
          <div v-if="subtarea.cantidad_dias" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad de días</label>
            <q-input
              v-model="subtarea.cantidad_dias"
              outlined
              disable
              dense
            ></q-input>
          </div>

          <!-- Fecha y hora de estado realizado -->
          <div v-if="subtarea.fecha_hora_realizado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora realizado</label>
            <q-input
              v-model="subtarea.fecha_hora_realizado"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha y hora de estado suspendido -->
          <div v-if="subtarea.fecha_hora_suspendido" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de estado suspendido</label
            >
            <q-input
              v-model="subtarea.fecha_hora_suspendido"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Causa de la suspencion -->
          <div v-if="subtarea.causa_suspencion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Causa de la suspención</label>
            <q-input
              v-model="subtarea.causa_suspencion"
              disable
              outlined
              type="textarea"
              autogrow
              dense
            ></q-input>
          </div>

          <!-- Fecha y hora de estado cancelacion -->
          <div v-if="subtarea.fecha_hora_cancelado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de cancelación</label>
            <q-input
              v-model="subtarea.fecha_hora_cancelado"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Causa de la suspencion -->
          <div
            v-if="subtarea.fecha_hora_estado_cancelado"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Causa de la cancelación</label>
            <q-input
              v-model="subtarea.causa_cancelacion"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-expansion-item>

      <div class="text-bold q-mb-lg">2. Asignación de trabajo</div>
      <div class="row q-col-gutter-sm">
        <!-- Asignar trabajo -->
        <div class="col-12 q-mb-md">
          <label class="text-center q-mb-sm block"
            >Modo de asignación del trabajo</label
          >
          <q-btn-toggle
            v-model="subtarea.modo_asignacion_trabajo"
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
          subtarea.modo_asignacion_trabajo ===
          opcionesModoAsignacionTrabajo.por_grupo
        "
        class="row q-col-gutter-sm q-mb-md"
      >
        <div class="col-12 col-md-10">
          <label class="q-mb-sm block">Grupo técnico seleccionado</label>
          <q-select
            v-model="subtarea.grupo"
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
            @click="agregarGrupoSeleccionado(subtarea.grupo)"
          >
            <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
            <div>Agregar</div>
          </q-btn>
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <!-- Técnicos del grupo principal -->
        <div class="col-12">
          <div
            v-if="
              subtarea.asignar_mas_empleados ||
              subtarea.modo_asignacion_trabajo ===
                opcionesModoAsignacionTrabajo.por_trabajador
            "
            class="row q-col-gutter-sm q-mb-md"
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

          <essential-table
            v-if="
              subtarea.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_grupo
            "
            titulo="Grupos seleccionados"
            estilos="margin-bottom: 14px;"
            :configuracionColumnas="columnasGrupo"
            :datos="subtarea.grupos_seleccionados"
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
            :mostrar-footer="!subtarea.grupos_seleccionados.length"
            :tipo-seleccion="tipoSeleccion"
            :accion1="quitarGrupo"
            :accion2="designarGrupoPrincipal"
          >
            <!-- @selected="entidadSeleccionada" -->
          </essential-table>

          <essential-table
            v-if="
              subtarea.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_grupo
            "
            ref="refEmpleadosAsignados"
            titulo="Empleados de los grupos seleccionados"
            estilos="margin-bottom: 14px;"
            :configuracionColumnas="configuracionColumnasEmpleado"
            :datos="subtarea.empleados_seleccionados"
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
            :mostrar-footer="!subtarea.empleados_seleccionados.length"
          >
            <!--@selected="entidadSeleccionada" -->
          </essential-table>

          <essential-table
            v-if="
              subtarea.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_trabajador
            "
            ref="refEmpleadosAsignados"
            titulo="Empleados de los grupos seleccionados"
            :configuracionColumnas="columnas"
            :datos="subtarea.empleados_seleccionados"
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
            :mostrar-footer="!subtarea.empleados_seleccionados.length"
            :accion1="quitarEmpleado"
            :accion2="designarEmpleadoResponsable"
          >
            <!--@selected="entidadSeleccionada"-->
          </essential-table>
        </div>
      </div>

      <button-submits
        :accion="accion"
        @cancelar="reestablecerDatos()"
        @editar="editarDatos(subtarea)"
        @guardar="guardarDatos(subtarea)"
      />
    </q-form>

    <essential-selectable-table
      ref="refListadoSeleccionableTecnicos"
      :configuracion-columnas="configuracionColumnasEmpleado"
      :datos="listadoTecnicos"
      tipo-seleccion="multiple"
      @selected="seleccionarEmpleado"
    ></essential-selectable-table>
  </q-page>
</template>

<script src="./TrabajoPage.ts"></script>
