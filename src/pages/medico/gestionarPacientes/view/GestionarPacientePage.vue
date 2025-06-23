<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :permitir-editar="false"
    :mostrarButtonSubmits="false"
    :tabOptions="tabOptionsEstadosEmpleados"
    tabDefecto="1"
    :filtrar="filtrarEmpleados"
    :full="true"
    ajustar-celdas
  >
    <template #formulario>
      <!-- <div :class="{ 'q-fmb-md bg-white': empleado.id }"> -->
      <detalle-paciente
        v-if="empleado.id"
        :empleado="empleado"
      ></detalle-paciente>
      <!-- </div> -->

      <q-separator class="q-my-md" color=""></q-separator>
      <!-- Tabs -->
      <div v-show="empleado.id">
        <q-tabs
          v-model="tabs"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          active-class="tab-active"
          class="border-bottom"
          dense
        >
          <q-tab
            :name="tiposProcesosExamenes.INGRESO"
            :label="tiposProcesosExamenes.INGRESO"
            :class="{ 'tab-inactive': tabs !== tiposProcesosExamenes.INGRESO }"
            @click="seleccionarTabTipoProcesoIngreso()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.PERIODICO"
            :label="tiposProcesosExamenes.PERIODICO"
            :class="{
              'tab-inactive': tabs !== tiposProcesosExamenes.PERIODICO
            }"
            @click="seleccionarTabTipoProcesoOcupacional()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.REINTEGRO"
            :label="tiposProcesosExamenes.REINTEGRO"
            :class="{
              'tab-inactive': tabs !== tiposProcesosExamenes.REINTEGRO
            }"
            @click="seleccionarTabTipoProcesoReingreso()"
            no-caps
          />
          <q-tab
            :name="tiposProcesosExamenes.RETIRO"
            :label="tiposProcesosExamenes.RETIRO"
            :class="{ 'tab-inactive': tabs !== tiposProcesosExamenes.RETIRO }"
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
              v-show="tabs === tiposProcesosExamenes.PERIODICO"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoOcupacional"
                :tipo-proceso="tiposProcesosExamenes.PERIODICO"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>

          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.REINTEGRO"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoReingreso"
                :tipo-proceso="tiposProcesosExamenes.REINTEGRO"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>

          <transition name="scale" mode="out-in">
            <div
              v-show="tabs === tiposProcesosExamenes.RETIRO"
              class="q-pa-none"
            >
              <panel-tipo-proceso
                ref="refPanelTipoProcesoSalida"
                :tipo-proceso="tiposProcesosExamenes.RETIRO"
                :empleado="empleado"
                :mixin="mixin"
              />
            </div>
          </transition>
        </div>
      </div>

      <q-separator class="q-my-md" color="white"></q-separator>
      <div v-if="empleado.id" class="q-mb-md">
        <gestor-archivos
          ref="refGestorFichaMedica"
          label="Ficha médica firmada"
          :mixin="mixin"
          :listarAlGuardar="false"
          :idModelo="empleado.id"
        >
          <template #boton-subir>
            <q-btn
              color="primary"
              push
              no-caps
              class="full-width q-mb-lg"
              @click="subirFichaMedicaFirmada"
            >
              <q-icon name="bi-upload" class="q-mr-sm" size="xs" />
              Subir ficha médica firmada
            </q-btn>
          </template>
        </gestor-archivos>
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
