<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :tab-options="tabOptionsPagosComisiones"
    :tabDefecto="tabDefecto"
    :permitirEditar="false" 
    :filtrar="filtrarCortesComisiones"
    :accion1="btnAnular"
    :accion2="btnGenerarReporteExcel"
    :accion3="btnMarcarPagado"
  >
  <!-- :permitirEditar="tabDefecto == 'PENDIENTE'" -->
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm">
          <!-- Boton seleccionar fecha -->
          <div class="col-12 col-md-4" v-if="accion == acciones.nuevo">
            <label class="q-mb-sm block">Selecciona un rango de fechas</label>
            <q-btn icon="event" round color="primary">
              <q-popup-proxy
                @before-show="updateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="fecha"
                  :mask="maskFecha"
                  range
                  :options="options"
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn
                      label="OK"
                      color="primary"
                      flat
                      @click="save"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-4" v-if="accion != acciones.nuevo">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="pago.nombre"
              placeholder="Obligatorio"
              autogrow
              disable
              outlined
              dense
            />
          </div>
          <!-- Fecha de inicio -->
          <div class="col-12 col-md-4" v-if="pago.fecha_inicio">
            <label class="q-mb-sm block">Desde</label>
            <q-input
              v-model="pago.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              disable
              @blur="v$.fecha_inicio.$touch"
              outlined
              dense
              emit-value
            >
              <template v-slot:error>
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Fecha de fin -->
          <div class="col-12 col-md-4" v-if="pago.fecha_fin">
            <label class="q-mb-sm block">Hasta</label>
            <q-input
              v-model="pago.fecha_fin"
              placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length"
              disable
              @blur="v$.fecha_fin.$touch"
              outlined
              dense
              emit-value
            >
              <template v-slot:error>
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-4" v-if="accion != acciones.nuevo">
            <label class="q-mb-sm block">Estado</label>
            <q-input v-model="pago.estado" disable outlined dense />
          </div>
          <!-- Causa anulación -->
          <div
            class="col-12 col-md-4"
            v-if="accion != acciones.nuevo && pago.causa_anulacion"
          >
            <label class="q-mb-sm block">Causa anulación</label>
            <q-input v-model="pago.causa_anulacion" disable outlined dense />
          </div>
          <!-- Listado de empleados en el corte -->
          <div
            class="col-12 col-md-12"
            v-if="accion !== acciones.nuevo && pago.listadoEmpleados.length > 0"
          >
            <essential-table
              titulo="Comisiones de Empleados"
              :configuracionColumnas="
                accion === acciones.editar
                  ? [
                      ...configuracionColumnasPagoComisionEmpleado,
                      accionesTabla,
                    ]
                  : configuracionColumnasPagoComisionEmpleado
              "
              :datos="pago.listadoEmpleados"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./PagoComisionPage.ts"></script>
