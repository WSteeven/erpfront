<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsLicencias"
    :full="true"
    :permitirEditar="!esRecursosHumanos"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarPermisoEmpleado"
    tabDefecto="1"
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Tipo de licencia -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="licencia.tipo_licencia"
              :options="tipos_licencias"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="!esNuevo"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @update:model-value="obtener_dias_licencia"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_licencia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Fecha de inicio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input
              v-model="licencia.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              :disable="!esNuevo"
              @blur="v$.fecha_inicio.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="licencia.fecha_inicio"
                        mask="DD-MM-YYYY"
                        :options="optionsFechaInicio"
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
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha de fin -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
              v-model="licencia.fecha_fin"
              placeholder="Obligatorio"
              :error="!!v$.fecha_fin.$errors.length"
              disable
              @blur="v$.fecha_fin.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="licencia.fecha_fin"
                        mask="DD-MM-YYYY"
                        :options="optionsFecha"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
            <div class="q-gutter-md row items-start"></div>
          </div>
          <!-- justificativo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificativo</label>
            <q-input
              v-model="licencia.justificacion"
              @update:model-value="(v) => (licencia.justificacion = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="!esNuevo"
              :error="!!v$.justificacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.justificacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
              <!-- Documento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Documento</label>
            <gestor-documentos
              ref="refArchivoPrestamoEmpresarial"
              :mixin="mixinArchivoPrestamoEmpleado"
              :endpoint="endpoint"
              :disable="!esNuevo"
              :permitir-eliminar="false"
              :listar-al-guardar="false"
              :esMultiple="false"
            >
            </gestor-documentos>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dias de licencia</label>
            <q-input
              v-model="licencia.dias_licencia"
              placeholder="Obligatorio"
              :disable="tiene_dias_licencia"
              @blur="v$.fecha_fin.$touch"
              outlined
              dense
            >
            </q-input>
          </div>
           <!-- Autorizacion -->
           <div class="col-12 col-md-3" v-if="accion == 'EDITAR' && es_jefe_inmediato">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="licencia.estado"
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
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./LicenciaEmpleadoPage.ts"></script>
