<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :permitir-editar="false"
    :mostrarButtonSubmits="false"
    :tabOptions="tabOptionsEstadosEmpleados"
    tabDefecto="1"
    :filtrar="filtrarEmpleados"
  >
    <template #formulario>
      <div :class="{ 'q-mb-md': empleado.id }">
        <detalle-paciente
          v-if="empleado.id"
          :empleado="empleado"
        ></detalle-paciente>
      </div>

      <!-- Tabs -->
      <div v-if="empleado.id">
        <q-tabs
          v-model="tabs"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          active-bg-color="blue-1"
          class="border-bottom-grey-5"
          dense
        >
          <q-tab
            :name="tiposProcesosExamenes.INGRESO"
            :label="tiposProcesosExamenes.INGRESO"
            :class="{ 'tab-inactive': tabs !== '1' }"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.OCUPACIONALES"
            :label="tiposProcesosExamenes.OCUPACIONALES"
            :class="{ 'tab-inactive': tabs !== '2' }"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.REINGRESO"
            :label="tiposProcesosExamenes.REINGRESO"
            :class="{ 'tab-inactive': tabs !== '3' }"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.SALIDA"
            :label="tiposProcesosExamenes.SALIDA"
            :class="{ 'tab-inactive': tabs !== '4' }"
            no-caps
          />
        </q-tabs>

        <!-- Paneles -->
        <q-tab-panels
          v-model="tabs"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="q-mb-md"
          helpalive
        >
          <q-tab-panel :name="tiposProcesosExamenes.INGRESO" class="q-pa-none">
            <q-splitter v-model="splitterModel" class="border-grey">
              <template v-slot:before>
                <div
                  class="border-bottom-grey-5 border-right-grey-5 text-center q-pb-md q-pt-sm"
                >
                  <q-btn
                    class="text-primary"
                    square
                    push
                    no-caps
                    @click="agregarRegistro()"
                  >
                    <q-icon
                      name="bi-plus-circle-fill"
                      size="xs"
                      class="q-mr-sm"
                    ></q-icon>
                    Nuevo registro</q-btn
                  >
                </div>
                <!-- Tabs -->
                <q-tabs
                  v-model="tabsRegistro"
                  vertical
                  indicator-color="transparent"
                  class="bg-toolbar"
                  active-class="bg-blue-1 text-black text-bold"
                >
                  <q-tab
                    v-for="registro in registros"
                    :key="registro.id"
                    :name="registro.id"
                    no-caps
                    @click="seleccionarRegistro(registro.id)"
                  >
                    <q-icon
                      name="bi-person"
                      size="xs"
                      class="text-primary q-mb-xs"
                    ></q-icon>
                    <span> Registro # {{ registro.numero_registro }} </span>
                  </q-tab>
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="tabsRegistro"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  helpalive
                >
                  <q-tab-panel
                    v-for="registro in registros"
                    :key="registro.id"
                    :name="registro.id"
                    class="q-pa-none"
                  >
                    <div class="row q-pa-md">
                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block">
                          Fecha y hora de registro
                        </label>
                        <div class="text-bold">{{ registro.created_at }}</div>
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block"> Observación </label>
                        <div class="text-bold">{{ registro.observacion }}</div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>

                <div class="q-px-sm">
                  <q-tabs
                    v-model="tabEstadoExamen"
                    align="justify"
                    active-color="primary"
                    indicator-color="primary"
                    active-bg-color="blue-1"
                    active-class="tab-active"
                    class="border-bottom-grey-5"
                    dense
                  >
                    <q-tab
                      :name="
                        estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
                      "
                      :label="
                        estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.label
                      "
                      :class="{
                        'tab-inactive':
                          tabs !==
                          estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value,
                      }"
                      no-caps
                      :icon="
                        estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.icono
                      "
                    />
                    <q-tab
                      :name="estadosSolicitudesExamenes.SOLICITADO.value"
                      :label="estadosSolicitudesExamenes.SOLICITADO.label"
                      :class="{
                        'tab-inactive':
                          tabs !== estadosSolicitudesExamenes.SOLICITADO.value,
                      }"
                      no-caps
                      :icon="estadosSolicitudesExamenes.SOLICITADO.icono"
                    />
                    <q-tab
                      :name="
                        estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value
                      "
                      :label="
                        estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.label
                      "
                      :class="{
                        'tab-inactive':
                          tabs !==
                          estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.value,
                      }"
                      class="q-pt-sm"
                      no-caps
                      :icon="
                        estadosSolicitudesExamenes.APROBADO_POR_COMPRAS.icono
                      "
                    />
                    <q-tab
                      :name="estadosSolicitudesExamenes.RESULTADOS.value"
                      :label="estadosSolicitudesExamenes.RESULTADOS.label"
                      :class="{
                        'tab-inactive':
                          tabs !== estadosSolicitudesExamenes.RESULTADOS.value,
                      }"
                      no-caps
                      :icon="estadosSolicitudesExamenes.RESULTADOS.icono"
                    />
                  </q-tabs>

                  <q-tab-panels
                    v-model="tabEstadoExamen"
                    animated
                    transition-prev="scale"
                    transition-next="scale"
                    class="q-mb-md"
                    helpalive
                  >
                    <q-tab-panel
                      :name="
                        estadosSolicitudesExamenes.PENDIENTE_SOLICITAR.value
                      "
                      class="q-pa-none"
                    >
                      <essential-table
                        ref="refTablaExamenes"
                        titulo="Examenes comúnes"
                        :configuracionColumnas="[
                          ...configuracionColumnasExamenes,
                          accionesTabla,
                        ]"
                        :datos="examenes"
                        :permitirConsultar="false"
                        :permitirEditar="false"
                        :permitirEliminar="false"
                        :accion1Header="btnSeleccionarVariosExamenes"
                        :accion2Header="btnCancelarSeleccionarVariosExamenes"
                        :accion3Header="btnSolicitarExamenesSeleccionados"
                        :accion1="btnSolicitarExamenIndividual"
                        :accion2="btnResultados"
                        :tipo-seleccion="tipoSeleccion"
                        @selected="seleccionarExamen"
                        :alto-fijo="false"
                      ></essential-table>
                    </q-tab-panel>

                    <q-tab-panel
                      :name="estadosSolicitudesExamenes.SOLICITADO.value"
                      class="q-pa-none"
                    >
                      <essential-table
                        titulo="Solicitudes de exámenes"
                        :configuracionColumnas="[
                          ...configuracionColumnasSolicitudExamen,
                          accionesTabla,
                        ]"
                        :datos="solicitudesExamenes"
                        :permitirConsultar="false"
                        :permitirEditar="false"
                        :permitirEliminar="false"
                        :accion1="btnConsultarEstadoSolicitudExamen"
                        :alto-fijo="false"
                      ></essential-table>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>

        <essential-table
          titulo="Esquema de vacunación"
          :configuracionColumnas="columnasEsquemaVacunacion"
          :datos="esquemaVacunaciones"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrar-footer="false"
          :mostrar-botones="false"
          :accion1="btnEsquemaVacunacion"
        ></essential-table>
      </div>
    </template>
  </tab-layout-filter-tabs2>

  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
    @guardado="actualizarListadoExamenes"
  />
</template>

<script src="./GestionarPacientePage.ts" />
