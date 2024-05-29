<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="mostrarListado"
    :tabOptions="tabOptionsSolicitudPedido"
    :full="true"
    :permitirEditar="(esValidador || esAutorizador)& ver_boton_editar"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarSolicitudPrestamo"
    :tabDefecto="tabSolicitudPrestaamo"
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="solicitudPrestamo.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true"
              @blur="v$.fecha.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="solicitudPrestamo.fecha"
                      :mask="maskFecha"
                      :options="optionsSolicitudPrestamo"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Valor  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor </label>
            <q-input
              v-model="solicitudPrestamo.monto"
              placeholder="Obligatorio"
              type="number"
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true"
              :error="!!v$.monto.$errors.length"
              lazy-rules
              :rules="maximoValorsolicitudPrestamo"
              @blur="v$.monto.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.monto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Plazo -->
          <div class="col-12 col-md-3" v-if="esValidador || esAutorizador">
            <label class="q-mb-sm block">Plazo (Meses) </label>
            <q-input
              v-model="solicitudPrestamo.plazo"
              type="number"
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true || disabled"
              :error="!!v$.plazo.$errors.length"
              placeholder="Obligatorio"
              @blur="v$.plazo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.plazo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Motivo  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Motivo </label>
            <q-input
              v-model="solicitudPrestamo.motivo"
              placeholder="Obligatorio"
              :disable="disabled"
              type="textarea"
              :error="!!v$.motivo.$errors.length"
              @blur="v$.motivo.$touch"
              autogrow
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Observacion  -->
          <div class="col-12 col-md-3" v-if="esValidador || esAutorizador">
            <label class="q-mb-sm block">Observacion </label>
            <q-input
              v-model="solicitudPrestamo.observacion"
              placeholder="Obligatorio"
              :disable="!esValidador"
              type="textarea"
              :error="!!v$.observacion.$errors.length"
              @blur="v$.observacion.$touch"
              autogrow
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="solicitudPrestamo.cargo_utilidad"
              label="Cargo a Utilidades"
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true || disabled"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!--Periodos -->
          <div class="col-12 col-md-3" v-if="solicitudPrestamo.cargo_utilidad">
            <label class="q-mb-sm block">Periodo</label>
            <q-select
              v-model="solicitudPrestamo.periodo"
              :options="periodos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true || disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarPeriodo"
              :error="!!v$.periodo.$errors.length"
              @blur="v$.periodo.$touch"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.periodo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- Valor Utilidad  -->
          <div class="col-12 col-md-3" v-if="solicitudPrestamo.periodo != null">
            <label class="q-mb-sm block">Valor Utilidades </label>
            <q-input
              v-model="solicitudPrestamo.valor_utilidad"
              placeholder="Obligatorio"
              type="number"
              :disable="accion.value !== acciones.nuevo && solicitudPrestamo.estado !== autorizacionesId.CANCELADO ? false : true || disabled"
              :error="!!v$.valor_utilidad.$errors.length"
              @blur="v$.valor_utilidad.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_utilidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Autorizacion -->
          <div
            class="col-12 col-md-3"
            v-if="accion == 'EDITAR' && (esValidador || esAutorizador)"
          >
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="solicitudPrestamo.estado"
              :options="autorizaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!--nivel endeudamiento-->
          <!--Total descuentos-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total de Descuentos </label>
            <q-input
              v-model="recursosHumanosStore.total_descuento"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!--Porcentaje Endeudamiento-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Porcentaje de Descuentos </label>
            <q-input
              v-model="recursosHumanosStore.porcentaje_endeudamiento"
              disable
              outlined
              dense
            >
              <template v-slot:after> % </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label
              v-if="recursosHumanosStore.mensaje"
              class="q-mb-sm text-red text-h6 block"
              >{{ recursosHumanosStore.mensaje }}</label
            >
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./SolicitudPrestamoEmpresarialPage.ts"></script>
