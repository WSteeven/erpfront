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
    :filtrar="filtrarRolPagoMes"
    tabDefecto="0"
    :forzarListar="true"
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
                  :disable="disabled"
                  @blur="v$.mes.$touch"
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
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
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
            :accion3="btnRealizar"
            :accion4="btnEditarRolPagoEmpleado"
            :accion6="btnImprimir"
            :accion1Header="btnAgregarRolPagoEmpleado"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-botones="false"
            :mostrarFooter="true"
            :permitirFiltrar="false"
            @tab-seleccionado="filtrarRolPagoEmpleado"
            :tabDefecto="tabActual"
            :alto-fijo="false"
          ></essential-table-tabs>
        </q-tab-panel>
      </q-tab-panels>
      <modales-entidad
        :comportamiento="modalesRolPagoMes"
        :mixin-modal="mixin"
        @guardado="guardado"
      />

      <modales-entidad :comportamiento="modalesRolPago" :mixin-modal="mixinRolEmpleado" />
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./RolPagoMesPage.ts"></script>
