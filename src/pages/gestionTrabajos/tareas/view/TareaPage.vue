<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTarea"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="tab === 'tarea'"
  >
    <template #formulario>
      <q-tabs
        v-model="tab"
        class="text-primary"
        :class="{ 'bg-grey-1': !$q.dark.isActive }"
        active-color="primary"
        :indicator-color="indicatorColor"
        align="justify"
        no-caps
        inline-label
      >
        <q-tab name="tarea" label="Tarea" icon="bi-pin-angle" />
        <q-tab
          v-if="tarea.tiene_subtareas"
          name="subtareas"
          label="Subtareas"
          icon="bi-check2-square"
        >
          <q-badge color="accent" floating>{{ subtareas.length }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="tarea">
          <q-form @submit.prevent>
            <q-expansion-item
              class="overflow-hidden q-mb-md expansion"
              label="Información general"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <div class="col-12">
                  <q-btn-toggle
                    v-model="tarea.para_cliente_proyecto"
                    class="toggle-button"
                    :disable="disabled"
                    spread
                    no-caps
                    rounded
                    glossy
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

              <div class="row q-col-gutter-sm q-pa-sm">
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Medio de notificación</label>
                  <q-select
                    v-model="tarea.medio_notificacion"
                    :options="mediosNotificacion"
                    :disable="disabled"
                    options-dense
                    dense
                    outlined
                  />
                </div>

                <!-- Codigo tarea JP -->
                <div v-if="tarea.codigo_tarea" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Código de tarea</label>
                  <q-input
                    v-model="tarea.codigo_tarea"
                    outlined
                    dense
                    disable
                  ></q-input>
                </div>

                <!-- Numero tarea cliente -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Código de tarea cliente</label>
                  <q-input
                    v-model="tarea.codigo_tarea_cliente"
                    placeholder="Obligatorio"
                    hint="Ticket, OT, Tarea"
                    :error="!!v$.codigo_tarea_cliente.$errors.length"
                    @blur="v$.codigo_tarea_cliente.$touch"
                    :disable="disabled"
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
                <div v-if="paraClienteFinal" class="col-12 col-md-6">
                  <label class="q-mb-sm block">Cliente corporativo</label>
                  <q-select
                    v-model="tarea.cliente"
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
                    :disable="disabled"
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
                        v-for="error of v$.cliente.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>

                <!-- Fiscalizador -->
                <div v-if="paraClienteFinal" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Fiscalizador</label>
                  <q-select
                    v-model="tarea.fiscalizador"
                    :options="fiscalizadores"
                    @filter="filtrarFiscalizadores"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    clearable
                    outlined
                    :option-label="
                      (item) => item.nombres + ' ' + item.apellidos
                    "
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    :disable="disabled"
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
                  v-if="paraClienteFinal && tarea.coordinador"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Coordinador</label>
                  <q-select
                    v-model="tarea.coordinador"
                    :options="coordinadores"
                    @filter="filtrarCoordinadores"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    clearable
                    outlined
                    :option-label="
                      (item) => item.nombres + ' ' + item.apellidos
                    "
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    :disable="disabled"
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
                  <q-input
                    v-model="tarea.fecha_solicitud"
                    outlined
                    dense
                    :disable="disabled"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="tarea.fecha_solicitud"
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
                    v-model="tarea.proyecto"
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
                    :disable="disabled"
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
                        v-for="error of v$.proyecto.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>

                <!-- Tiene subtareas -->
                <div class="col-12 col-md-3">
                  <br />
                  <q-checkbox
                    v-model="tarea.tiene_subtareas"
                    label="Tiene subtareas"
                    outlined
                    :disable="disabled"
                    dense
                  ></q-checkbox>
                </div>

                <!-- Titulo -->
                <div class="col-12">
                  <label class="q-mb-sm block">Título de la tarea</label>
                  <q-input
                    v-model="tarea.titulo"
                    placeholder="Obligatorio"
                    outlined
                    dense
                    :error="!!v$.titulo.$errors.length"
                    @blur="v$.titulo.$touch"
                    :disable="disabled"
                  >
                    <template v-slot:error>
                      <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                        <div>{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Observacion -->
              <div class="col-12 q-mb-md q-px-sm">
                <label class="q-mb-sm block">Observación</label>
                <q-input
                  v-model="tarea.observacion"
                  placeholder="Opcional"
                  outlined
                  :disable="disabled"
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>

              <!-- Seccion subtarea -->
              <div
                v-if="!tarea.tiene_subtareas"
                class="row q-col-gutter-sm q-px-sm"
              >
                <!-- Descripcion completa -->
                <div class="col-12">
                  <label class="q-mb-sm block"
                    >Descripción completa del trabajo a realizar</label
                  >
                  <q-input
                    v-model="tarea.descripcion_completa"
                    placeholder="Obligatorio"
                    outlined
                    :disable="disabled"
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

                <!-- Tipo trabajo -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Tipo de trabajo a realizar</label
                  >
                  <q-select
                    v-model="tarea.tipo_trabajo"
                    :options="tiposTrabajos"
                    @filter="filtrarTiposTrabajos"
                    transition-show="scale"
                    transition-hide="scale"
                    hint="Seleccione primero una tarea"
                    options-dense
                    dense
                    outlined
                    :disable="disabled"
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

                <!-- Es ventana -->
                <div class="col-12 col-md-3 q-mb-md">
                  <br />
                  <q-checkbox
                    v-model="tarea.es_ventana"
                    label="Es ventana de trabajo"
                    @blur="verificarEsVentana()"
                    outlined
                    :disable="disabled"
                    dense
                  ></q-checkbox>
                </div>

                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Fecha de agendamiento</label>
                  <q-input
                    v-model="tarea.fecha_agendado"
                    :placeholder="tarea.es_ventana ? 'Obligatorio' : 'Opcional'"
                    :error="!!v$.fecha_agendado.$errors.length"
                    outlined
                    :disable="disabled"
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
                            v-model="tarea.fecha_agendado"
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
                    v-model="tarea.hora_inicio_agendado"
                    :error="!!v$.hora_inicio_agendado.$errors.length"
                    type="time"
                    :disable="disabled"
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
                <div v-if="tarea.es_ventana" class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Hora fin de agendamiento (24H)</label
                  >
                  <q-input
                    v-model="tarea.hora_fin_agendado"
                    :error="!!v$.hora_fin_agendado.$errors.length"
                    type="time"
                    stack-label
                    outlined
                    :disable="disabled"
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
              v-if="!tarea.tiene_subtareas"
              class="overflow-hidden q-mb-md expansion"
              label="Designación de trabajo"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div
                v-if="!tarea.tiene_subtareas"
                class="row q-col-gutter-xs q-pa-sm"
              >
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Trabajo designado</label>
                  <q-btn-toggle
                    v-model="tarea.modo_asignacion_trabajo"
                    class="toggle-button"
                    spread
                    no-caps
                    rounded
                    glossy
                    toggle-color="positive"
                    unelevated
                    :options="[
                      {
                        label: 'Para un grupo',
                        value: modosAsignacionTrabajo.por_grupo,
                      },
                      {
                        label: 'Para un empleado',
                        value: modosAsignacionTrabajo.por_empleado,
                      },
                    ]"
                  />
                </div>

                <div
                  v-if="
                    tarea.modo_asignacion_trabajo ===
                    modosAsignacionTrabajo.por_grupo
                  "
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Grupo seleccionado</label>
                  <q-select
                    v-model="tarea.grupo"
                    :options="grupos"
                    @filter="filtrarGrupos"
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
                    :disable="disabled"
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

                <div
                  v-if="
                    tarea.modo_asignacion_trabajo ===
                    modosAsignacionTrabajo.por_empleado
                  "
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Empleado seleccionado</label>
                  <q-select
                    v-model="tarea.empleado"
                    :options="empleados"
                    @filter="filtrarEmpleados"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    :option-label="
                      (item) => item.nombres + ' ' + item.apellidos
                    "
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    :disable="disabled"
                    :error="!!v$.empleado.$errors.length"
                    @blur="v$.empleado.$touch"
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
                        v-for="error of v$.empleado.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>
              </div>
            </q-expansion-item>

            <q-expansion-item
              v-if="paraClienteFinal"
              class="overflow-hidden q-mb-md expansion"
              label="Ubicación del trabajo para cliente final"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div v-if="paraClienteFinal" class="row q-col-gutter-sm q-pa-sm">
                <!-- Nombre -->
                <div class="col-12">
                  <label-abrir-modal
                    v-if="mostrarLabelModal"
                    label="Cliente final"
                    @click="modales.abrirModalEntidad('ClienteFinalPage')"
                  />
                  <label v-else class="q-mb-sm block">Cliente final</label>
                  <q-select
                    v-model="tarea.cliente_final"
                    :options="clientesFinales"
                    @filter="filtrarClientesFinales"
                    hint="Primero seleccione al cliente principal"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    :option-label="
                      (item) => item.nombres + ' ' + (item.apellidos ?? '')
                    "
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    :disable="disabled"
                    @update:model-value="
                      (v) => obtenerClienteFinal(tarea.cliente_final)
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
                <div
                  v-if="clienteFinal.id_cliente_final"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block"
                    >ID/Código de cliente final</label
                  >
                  <q-input
                    v-model="clienteFinal.id_cliente_final"
                    disable
                    outlined
                    dense
                  ></q-input>
                </div>

                <!-- Celular -->
                <div v-if="clienteFinal.celular" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Celular</label>
                  <q-input
                    v-model="clienteFinal.celular"
                    outlined
                    dense
                    disable
                  ></q-input>
                </div>

                <!-- Provincia -->
                <div v-if="clienteFinal.provincia" class="col-12 col-md-3">
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
                <div v-if="clienteFinal.canton" class="col-12 col-md-3">
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
                <div v-if="clienteFinal.parroquia" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Parroquia/Barrio</label>
                  <q-input
                    v-model="clienteFinal.parroquia"
                    disable
                    outlined
                    dense
                  ></q-input>
                </div>

                <!-- Direccion -->
                <div v-if="clienteFinal.direccion" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Dirección</label>
                  <q-input
                    v-model="clienteFinal.direccion"
                    disable
                    outlined
                    dense
                  ></q-input>
                </div>

                <!-- Referencia -->
                <div v-if="clienteFinal.referencia" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Referencia</label>
                  <q-input
                    v-model="clienteFinal.referencia"
                    disable
                    outlined
                    dense
                  ></q-input>
                </div>

                <!-- Coordenada latitud -->
                <div
                  v-if="clienteFinal.coordenada_latitud"
                  class="col-12 col-md-3"
                >
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
                <div
                  v-if="clienteFinal.coordenada_longitud"
                  class="col-12 col-md-3"
                >
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

            <q-expansion-item
              v-if="!tarea.tiene_subtareas"
              class="overflow-hidden q-mb-md expansion"
              label="Tiempos"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <div v-if="!tarea.tiene_subtareas" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Estado de la tarea</label>
                  <estados-subtareas
                    :propsTable="{ value: 'CREADO' }"
                  ></estados-subtareas>
                </div>

                <!-- Fecha de creacion -->
                <div v-if="tarea.fecha_hora_creacion" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Fecha y hora de creación</label>
                  <q-input
                    v-model="tarea.fecha_hora_creacion"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <div v-if="tarea.fecha_hora_asignacion" class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Fecha y hora de asignación</label
                  >
                  <q-input
                    v-model="tarea.fecha_hora_asignacion"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Fecha de inicio -->
                <div v-if="tarea.fecha_hora_ejecucion" class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Fecha y hora de ejecución del trabajo</label
                  >
                  <q-input
                    v-model="tarea.fecha_hora_ejecucion"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Fecha de finalizacion -->
                <div
                  v-if="tarea.fecha_hora_finalizacion"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block"
                    >Fecha y hora de finalización de trabajo</label
                  >
                  <q-input
                    v-model="tarea.fecha_hora_finalizacion"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Técnico responsable -->
                <div v-if="tarea.cantidad_dias" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Cantidad de días</label>
                  <q-input
                    v-model="tarea.cantidad_dias"
                    outlined
                    disable
                    dense
                  ></q-input>
                </div>

                <!-- Fecha y hora de estado realizado -->
                <div v-if="tarea.fecha_hora_realizado" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Fecha y hora realizado</label>
                  <q-input
                    v-model="tarea.fecha_hora_realizado"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Fecha y hora de estado suspendido -->
                <div v-if="tarea.fecha_hora_suspendido" class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Fecha y hora de estado suspendido</label
                  >
                  <q-input
                    v-model="tarea.fecha_hora_suspendido"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Causa de la suspencion -->
                <div v-if="tarea.causa_suspencion" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Causa de la suspención</label>
                  <q-input
                    v-model="tarea.causa_suspencion"
                    disable
                    outlined
                    type="textarea"
                    autogrow
                    dense
                  ></q-input>
                </div>

                <!-- Fecha y hora de estado cancelacion -->
                <div v-if="tarea.fecha_hora_cancelado" class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Fecha y hora de cancelación</label
                  >
                  <q-input
                    v-model="tarea.fecha_hora_cancelado"
                    outlined
                    dense
                    disable
                  >
                  </q-input>
                </div>

                <!-- Causa de la suspencion -->
                <div
                  v-if="tarea.fecha_hora_estado_cancelado"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Causa de la cancelación</label>
                  <q-input
                    v-model="tarea.causa_cancelacion"
                    placeholder="Opcional"
                    outlined
                    dense
                  ></q-input>
                </div>
              </div>
            </q-expansion-item>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="subtareas">
          <essential-table-tabs
            :configuracionColumnas="columnasSubtareas"
            :datos="subtareas"
            :tabOptions="tabOptionsEstadosSubtareas"
            :accion1="btnConsultarSubtarea"
            :accion2="botonCancelar"
            :accion3="botonReagendar"
            :accion4="botonFormulario"
            :accion5="botonVerPausas"
            :accion6="botonFinalizar"
            :accion1Header="btnAgregarSubtarea"
            separador="cell"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-botones="false"
            :mostrarFooter="true"
            :permitirFiltrar="false"
            :permitirBuscar="false"
            @tab-seleccionado="filtrarSubtareas"
            tabDefecto=""
            :alto-fijo="false"
          ></essential-table-tabs>
          <!--:accion2="botonSubirArchivos" -->
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </tab-layout>

  <modales-entidad :comportamiento="modales" />
  <modales-entidad
    :comportamiento="modalesSubtarea"
    :mixin-modal="mixinSubtarea"
  />
</template>

<script src="./TareaPage.ts"></script>
