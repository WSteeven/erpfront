<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTarea"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="tab === 'tarea'"
    :tabOptions="tabOptionsEstadosTareas"
    :accion1="btnFinalizarTarea"
    :accion2="btnVerImagenInforme"
    :filtrar="filtrarTarea"
    tabDefecto="0"
    :forzarListar="true"
    subtitulo-pagina="Módulo de Tareas"
  >
    <!-- :labelGuardar="tarea.tiene_subtareas ? 'Guardar' : 'Guardar y agendar'" -->
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
        <!-- v-if="tarea.tiene_subtareas" -->
        <q-tab
          v-if="tarea.id"
          name="subtareas"
          label="Subtareas"
          icon="bi-ui-checks-grid"
        >
          <q-badge color="accent" floating>{{ subtareas.length }}</q-badge>
        </q-tab>
      </q-tabs>

      <div
        v-if="tarea.finalizado"
        class="col-12 rounded-card q-mt-md q-mx-md q-py-sm text-center text-positive bg-green-2"
      >
        <div>
          <q-icon name="bi-check-circle-fill" class="q-mr-sm"></q-icon>
          La tarea ha finalizado
        </div>
      </div>

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
                    class="toggle-button-primary"
                    :disable="disabled"
                    spread
                    no-caps
                    rounded
                    toggle-color="primary"
                    unelevated
                    :options="[
                      {
                        label: 'Tarea para un proyecto',
                        value: destinosTareas.paraProyecto,
                      },
                      {
                        label: 'Tarea para cliente final y mantenimiento',
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
                    hint="Obligatorio"
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
                    placeholder="Opcional"
                    hint="Ticket, OT, Tarea"
                    :disable="disabled"
                    outlined
                    dense
                    autofocus
                  >
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
                  v-if="
                    (paraClienteFinal &&
                      (esCoordinadorBackup || esJefeTecnico)) ||
                    accion === acciones.consultar
                  "
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
                    @blur="v$.coordinador.$touch"
                    :error="!!v$.coordinador.$errors.length"
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
                        v-for="error of v$.coordinador.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
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
                  <label-abrir-modal
                    v-if="mostrarLabelModal"
                    label="Proyecto"
                    @click="modalesTarea.abrirModalEntidad('ProyectoPage')"
                  />
                  <label v-else class="q-mb-sm block">Proyecto</label>
                  <q-select
                    v-model="tarea.proyecto"
                    :options="proyectos"
                    @filter="filtrarProyectos"
                    transition-show="scale"
                    transition-hide="scale"
                    hint="Obligatorio"
                    options-dense
                    dense
                    outlined
                    :option-label="(item) => item.nombre"
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    @blur="v$.proyecto.$touch"
                    :error="!!v$.proyecto.$errors.length"
                    @update:modelValue="seleccionarProyecto()"
                    :disable="disabled"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" class="q-my-sm">
                        <q-item-section>
                          <q-item-label class="text-bold text-primary">{{
                            scope.opt.codigo_proyecto
                          }}</q-item-label>
                          <q-item-label caption
                            >{{ scope.opt.nombre }}
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
                        v-for="error of v$.proyecto.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>

                <div
                  v-if="tarea.proyecto && paraProyecto && etapas.length"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Etapa</label>
                  <q-select
                    v-model="tarea.etapa"
                    :options="etapas"
                    @filter="filtrarEtapas"
                    transition-show="scale"
                    transition-hide="scale"
                    hint="Opcional"
                    options-dense
                    dense
                    outlined
                    :option-label="(item) => item.nombre"
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    :error="!!v$.etapa.$errors.length"
                    :disable="disabled"
                    @blur="v$.etapa.$touch"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:error>
                      <div v-for="error of v$.etapa.$errors" :key="error.$uid">
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>

                <!-- Metraje tendido -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block"
                    >Cantidad de fibra óptica a tender (m)</label
                  >
                  <q-input
                    v-model="tarea.metraje_tendido"
                    placeholder="Opcional"
                    :disable="disabled"
                    @update:model-value="
                      convertirNumeroPositivo(tarea, 'metraje_tendido')
                    "
                    outlined
                    dense
                  >
                  </q-input>
                </div>

                <!-- Es para el cliente -->
                <div class="col-12 col-md-3 q-mb-xl">
                  <q-checkbox
                    class="q-mt-lg q-pt-md"
                    v-model="tarea.no_lleva_centro_costo"
                    label="¿No lleva centro de costos?"
                    :disable="disabled"
                    @update:model-value="checkCentroCosto"
                    outlined
                    dense
                  ></q-checkbox>
                </div>

                <!-- Select de centro de costos  -->
                <div
                  class="col-12 col-md-3"
                  v-if="
                    (tarea.cliente && !tarea.no_lleva_centro_costo) ||
                    tarea.centro_costo
                  "
                >
                  <label class="q-mb-sm block">Centro de Costos</label>
                  <q-select
                    v-model="tarea.centro_costo"
                    :options="centros_costos"
                    transition-show="scale"
                    transition-hide="scale"
                    use-input
                    input-debounce="0"
                    options-dense
                    clearable
                    dense
                    outlined
                    :disable="disabled"
                    :option-label="(item) => item.nombre"
                    :option-value="(item) => item.id"
                    @filter="filtrarCentrosCostos"
                    :error="!!v$.centro_costo.$errors.length"
                    emit-value
                    map-options
                  >
                    <template v-slot:error>
                      <div
                        v-for="error of v$.centro_costo.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-italic text-grey">
                          No hay datos, se creará un nuevo centro de costos
                          asociado a la tarea
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
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

              <!-- Noevedad -->
              <div v-if="tarea.novedad" class="col-12 q-mb-md q-px-sm">
                <label class="q-mb-sm block"
                  >Novedad registrada al finalizar la tarea</label
                >
                <q-input
                  v-model="tarea.novedad"
                  outlined
                  disable
                  dense
                  autogrow
                  type="textarea"
                >
                </q-input>
              </div>
            </q-expansion-item>

            <q-expansion-item
              v-if="paraClienteFinal"
              class="overflow-hidden q-mb-md expansion"
              label="Ubicación del trabajo"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <div class="col-12">
                  <q-btn-toggle
                    v-model="tarea.ubicacion_trabajo"
                    class="toggle-button-primary"
                    :disable="disabled"
                    spread
                    no-caps
                    rounded
                    toggle-color="primary"
                    unelevated
                    :options="[
                      {
                        label: 'Seleccionar cliente final',
                        value: ubicacionesTrabajo.clienteFinal,
                      },
                      {
                        label: 'Seleccionar una ruta',
                        value: ubicacionesTrabajo.ruta,
                      },
                    ]"
                  />
                </div>
              </div>

              <div
                v-if="
                  paraClienteFinal &&
                  tarea.ubicacion_trabajo === ubicacionesTrabajo.clienteFinal
                "
                class="row q-col-gutter-sm q-pa-sm"
              >
                <!-- Nombre -->
                <div class="col-12">
                  <label-abrir-modal
                    v-if="mostrarLabelModal"
                    label="Cliente final"
                    @click="modalesTarea.abrirModalEntidad('ClienteFinalPage')"
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
                    clearable
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
                <div
                  v-if="clienteFinal.provincia_nombre"
                  class="col-12 col-md-3"
                >
                  <label class="q-mb-sm block">Provincia</label>
                  <q-input
                    v-model="clienteFinal.provincia_nombre"
                    disable
                    outlined
                    dense
                  ></q-input>
                </div>

                <!-- Canton -->
                <div v-if="clienteFinal.canton_nombre" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Cantón</label>
                  <q-input
                    v-model="clienteFinal.canton_nombre"
                    disable
                    outlined
                    dense
                  ></q-input>
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
                <div v-if="clienteFinal.coordenadas" class="col-12 col-md-3">
                  <label class="q-mb-sm block">Coordenadas</label>
                  <q-input
                    v-model="clienteFinal.coordenadas"
                    disable
                    outlined
                    dense
                  >
                  </q-input>
                </div>
              </div>

              <div
                v-if="
                  paraClienteFinal &&
                  tarea.ubicacion_trabajo === ubicacionesTrabajo.ruta
                "
                class="row q-col-gutter-sm q-pa-sm"
              >
                <!-- Nombre -->
                <div class="col-12">
                  <label class="q-mb-sm block">Ruta</label>
                  <q-select
                    v-model="tarea.ruta_tarea"
                    :options="rutas"
                    @filter="filtrarRutas"
                    hint="Primero seleccione al cliente corporativo"
                    transition-show="scale"
                    transition-hide="scale"
                    options-dense
                    dense
                    outlined
                    :option-label="(item) => item.ruta"
                    :option-value="(item) => item.id"
                    use-input
                    input-debounce="0"
                    emit-value
                    map-options
                    clearable
                    :disable="disabled"
                    :error="!!v$.ruta_tarea.$errors.length"
                    @blur="v$.ruta_tarea.$touch"
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
                        v-for="error of v$.ruta_tarea.$errors"
                        :key="error.$uid"
                      >
                        <div class="error-msg">{{ error.$message }}</div>
                      </div>
                    </template>
                  </q-select>
                </div>
              </div>
            </q-expansion-item>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="subtareas">
          <essential-table-tabs
            titulo="Subtareas"
            :configuracionColumnas="columnasSubtareas"
            :datos="subtareas"
            :tabOptions="tabOptionsEstadosSubtareas"
            :accion1="btnConsultarSubtarea"
            :accion2="btnIniciar"
            :accion3="btnPausar"
            :accion4="btnReanudar"
            :accion5="btnRealizar"
            :accion6="btnReagendar"
            :accion7="btnSeguimiento"
            :accion8="btnSuspender"
            :accion9="btnCancelar"
            :accion10="btnFinalizar"
            :accion1Header="btnAgregarSubtarea"
            separador="cell"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-botones="false"
            :mostrarFooter="true"
            :permitirFiltrar="false"
            @tab-seleccionado="filtrarSubtareas"
            :tabDefecto="tabActual"
            :alto-fijo="false"
          ></essential-table-tabs>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </tab-layout-filter-tabs2>

  <visor-imagen ref="refVisorImagen"></visor-imagen>

  <solicitar-imagen
    :mostrar="mostrarSolicitarImagen"
    :confirmar="imagenSubida"
    @cerrar="mostrarSolicitarImagen = false"
  ></solicitar-imagen>

  <modales-entidad
    :comportamiento="modalesTarea"
    :mixin-modal="mixin"
    :persistent="false"
    @guardado="guardado"
  />

  <modales-entidad
    :comportamiento="modalesSubtarea"
    :mixin-modal="mixinSubtarea"
    :persistent="false"
  />
</template>

<script src="./TareaPage.ts"></script>
