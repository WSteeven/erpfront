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

      <essential-table
        v-if="empleado.id"
        titulo="Esquema de vacunación"
        :configuracionColumnas="columnasEsquemaVacunacion"
        :datos="listadosAuxiliares.esquemasVacunas"
        :alto-fijo="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :mostrar-footer="false"
        :mostrar-botones="false"
        :accion1Header="btnAgregarVacunaAplicada"
        :accion1="btnEditarVacunaAplicada"
      ></essential-table>

      <br />

      <!-- Tabs -->
      <div v-show="empleado.id">
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
            @click="seleccionarTabTipoProcesoIngreso()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.OCUPACIONALES"
            :label="tiposProcesosExamenes.OCUPACIONALES"
            :class="{ 'tab-inactive': tabs !== '2' }"
            @click="seleccionarTabTipoProcesoOcupacional()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.REINGRESO"
            :label="tiposProcesosExamenes.REINGRESO"
            :class="{ 'tab-inactive': tabs !== '3' }"
            @click="seleccionarTabTipoProcesoReingreso()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.SALIDA"
            :label="tiposProcesosExamenes.SALIDA"
            :class="{ 'tab-inactive': tabs !== '4' }"
            @click="seleccionarTabTipoProcesoSalida()"
            no-caps
          />
        </q-tabs>

        <!-- Paneles -->
        <div class="q-mb-md">
          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.INGRESO"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoIngreso"
                :tipo-proceso="tiposProcesosExamenes.INGRESO"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>

          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.OCUPACIONALES"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoOcupacional"
                :tipo-proceso="tiposProcesosExamenes.OCUPACIONALES"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>

          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.REINGRESO"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoReingreso"
                :tipo-proceso="tiposProcesosExamenes.REINGRESO"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>

          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.SALIDA"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoSalida"
                :tipo-proceso="tiposProcesosExamenes.SALIDA"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>
        </div>
      </div>
    </template>
  </tab-layout-filter-tabs2>

  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
    @guardado="insertarListados"
    @modificado="actualizarListados"
  />
</template>

<script src="./GestionarPacientePage.ts" />

<style>
.alto-tabla {
  height: 1200px;
}
</style>
