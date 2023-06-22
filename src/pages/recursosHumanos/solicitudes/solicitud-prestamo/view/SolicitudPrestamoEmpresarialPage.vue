<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="mostrarListado"
    :tabOptions="tabOptionsSolicitudPedido"
    :full="true"
    :permitirEditar="true"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :accion1="botonAprobar"
    :accion2="botonCancelar"
    :filtrar="filtrarSolicitudPrestamo"
    tabDefecto="1"
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
              :disable="accion.value != 'NUEVO' ? false : true"
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
              :disable="accion.value != 'NUEVO' ? false : true"
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
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Plazo </label>
            <q-input
              v-model="solicitudPrestamo.plazo"
              type="number"
              :disable="accion.value != 'NUEVO' ? false : true"
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
          <!-- Observacion  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion </label>
            <q-input
              v-model="solicitudPrestamo.observacion"
              placeholder="Obligatorio"
              :disable="disabled"
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
          <!-- Validado -->
          <div
            class="col-12 col-md-3"
            v-if="accion == 'EDITAR' && store.can('puede.ver.campo.validado')"
          >
            <label class="q-mb-sm block">Validado</label>
            <q-toggle
              :label="es_validado ? 'SI' : 'NO'"
              v-model="es_validado"
              @update:model-value="validarPermiso"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./SolicitudPrestamoEmpresarialPage.ts"></script>
