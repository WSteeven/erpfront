<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="tab === 'rol_pago'"
    :tabOptions="tabOptionsEstadosRolPago"
    :accion1="btnFinalizarRolPago"
    :accion2="btnImprimirRolPago"
    :accion3="btnEnviarRolPago"
    :accion4="btnCashRolPago"
    :filtrar="filtrarRolPagoMes"
    :tabDefecto="tabActualRolPago"
    :ajustarCeldas="true"
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
        <q-tab name="rol_pago" label="Rol de Pago" icon="bi-person-lines-fill" />
        <q-tab
          v-if="rolpago.id"
          name="rol_pago_empleado"
          label="Rol de Empleados"
          icon="bi-person-rolodex"
        >
          <q-badge color="accent" floating>{{ roles_empleados.length }}</q-badge>
        </q-tab>
      </q-tabs>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="rol_pago">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-sm q-py-md">
              <!-- Mes -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block"> Mes </label>
                <q-input
                  v-model="rolpago.mes"
                  placeholder="Obligatorio"
                  :value="rolpago.mes"
                  mask="##-####"
                  :error="!!v$.mes.$errors.length"
                  :disable="accion == 'CONSULTAR' || accion == 'EDITAR'"
                  @blur="v$.mes.$touch"
                  readonly
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                        v-model="is_month"
                      >
                        <q-date
                          v-model="rolpago.mes"
                          minimal
                          mask="MM-YYYY"
                          emit-immediately
                          default-view="Years"
                          @update:model-value="checkValue"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:error>
                    <div v-for="error of v$.mes.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>
              <!-- Nombre -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Nombre</label>
                <q-input
                  v-model="rolpago.nombre"
                  placeholder="Obligatorio"
                  disable
                  type="textarea"
                  autogrow
                  outlined
                  dense
                >
                </q-input>
              </div>
              <!-- Aceptar Sugerencias -->
              <div class="col-12 col-md-3">
                <q-checkbox
                  class="q-mt-lg q-pt-md"
                  v-model="rolpago.es_quincena"
                  label="Es quincena"
                  :disable="disabled"
                  @update:model-value="obtenerNombreMes"
                  outlined
                  dense
                ></q-checkbox>
              </div>
            </div>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="rol_pago_empleado">
          <essential-table-tabs
            titulo="Rol de pago de Empleados"
            :configuracionColumnas="columnasRolPagoEmpleados"
            :datos="roles_empleados"
            :tabOptions="tabOptionsEstadosRolPagoEmpleado"
            :accion1="btnConsultarRolPagoEmpleado"
            :accion2="btnIniciar"
            :accion3="btnEditarRolPagoEmpleado"
            :accion4="btnFinalizar"
            :accion5="btnImprimir"
            :accion6="btnEliminarRolPago"
            :accion7="btnEnviarRolPagoEmpleado"
            :accion1Header="btnAgregarRolPagoEmpleado"
            :permitirExportar="true"
            :accion2Header="btnEjecutarMasivo"
            :accion3Header="btnFinalizarMasivo"
            :accion4Header="btnGenerarReporte"
            :accion5Header="btnRefrescar"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-botones="false"
            :mostrarFooter="true"
            :permitirFiltrar="true"
            @tab-seleccionado="filtrarRolPagoEmpleado"
            :tabDefecto="tabActual"
            :alto-fijo="true"
            :primeraColumnaFija="true"
            :ajustarCeldas="true"
          ></essential-table-tabs>
        </q-tab-panel>
      </q-tab-panels>
      <modales-entidad
        :comportamiento="modalesRolPagoMes"
        :mixin-modal="mixin"
        @guardado="guardado"
      />

      <modales-entidad
        :comportamiento="modalesRolPago"
        :persistente="false"
        @guardado="(data) => guardado(data)"
      />
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./RolPagoMesPage.ts"></script>
