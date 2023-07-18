<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsSolicitudPedido"
    :full="true"
    :accion1="editarPermiso"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarPermisoEmpleado"
    tabDefecto="1"
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Tipo del prestamo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="permiso.tipo_permiso"
              :options="tipos_permisos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="!esNuevo"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_permiso.$errors" :key="error.$uid">
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
              v-model="permiso.fecha_hora_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_inicio.$errors.length"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              @blur="v$.fecha_hora_inicio.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="permiso.fecha_hora_inicio"
                        mask="DD-MM-YYYY HH:mm"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time
                        v-model="permiso.fecha_hora_inicio"
                        mask="DD-MM-YYYY HH:mm"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha de fin -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
              v-model="permiso.fecha_hora_fin"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_fin.$errors.length"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              @blur="v$.fecha_hora_fin.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="permiso.fecha_hora_fin"
                        mask="DD-MM-YYYY HH:mm"
                        :options="optionsFecha"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time
                        v-model="permiso.fecha_hora_fin"
                        mask="DD-MM-YYYY HH:mm"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
            <div class="q-gutter-md row items-start"></div>
          </div>
          <!-- Sugerir Fecha -->
          <div
            class="col-12 col-md-3"
            v-if="permiso.id_jefe_inmediato != null && permiso.estado == 1"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="permiso.suguiere_fecha"
              label="Sugerir Fecha"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Fecha sugerida -->
          <div class="col-12 col-md-3" v-if="permiso.suguiere_fecha">
            <label class="q-mb-sm block">Fecha y hora sugerida</label>
            <q-input
              v-model="permiso.fecha_hora_reagendamiento"
              placeholder="Obligatorio"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="permiso.fecha_hora_reagendamiento"
                        mask="DD-MM-YYYY HH:mm"
                        :options="optionsFecha"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time
                        v-model="permiso.fecha_hora_reagendamiento"
                        mask="DD-MM-YYYY HH:mm"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div class="q-gutter-md row items-start"></div>
          </div>
          <!-- justificativo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificativo</label>
            <q-input
              v-model="permiso.justificacion"
              @update:model-value="(v) => (permiso.justificacion = removeAccents(v))"
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
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Empleado</label>
            <q-input v-model="permiso.empleado_info" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Departamento</label>
            <q-input v-model="permiso.departamento" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Fecha y hora de la solicitud</label>
            <q-input
              v-model="permiso.fecha_hora_solicitud"
              :disable="!esNuevo"
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3" v-if="!esNuevo">
            <label class="q-mb-sm block">Jefe Inmediato</label>
            <q-input v-model="permiso.jefe_inmediato" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <!-- observacion -->
          <div class="col-12 col-md-3" v-if="esAutorizador">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="permiso.observacion"
              placeholder="Obligatorio"
              :disable="!esAutorizador"
              :error="!!v$.observacion.$errors.length"
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

          <!-- Documento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Soporte</label>
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

          <!-- Fecha Recuperacion -->
          <div class="col-12 col-md-3" v-if="permiso.recuperables">
            <label class="q-mb-sm block">Fecha de Recuperacion</label>
            <q-input
              v-model="permiso.fecha_recuperacion"
              placeholder="Obligatorio"
              :error="!!v$.fecha_recuperacion.$errors.length"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              @blur="v$.fecha_recuperacion.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="permiso.fecha_recuperacion"
                      :mask="maskFecha"
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
                <div v-for="error of v$.fecha_recuperacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de recuperacion -->
          <div class="col-12 col-md-3" v-if="permiso.recuperables">
            <label class="q-mb-sm block">Hora de Recuperacion (24 horas)</label>
            <q-input
              v-model="permiso.hora_recuperacion"
              :error="!!v$.hora_recuperacion.$errors.length"
              type="time"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              hint="Obligatorio"
              stack-label
              outlined
              clearable
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_recuperacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Recuperable -->
          <div
            class="col-12 col-md-3"
            v-if="permiso.id_jefe_inmediato != null && permiso.estado == 1"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="permiso.recuperables"
              label="Recuperables"
              :disable="
                (permiso.id_jefe_inmediato == null && permiso.estado !== 1) || disabled
              "
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Recuperto -->
          <div
            class="col-12 col-md-3"
            v-if="permiso.id_jefe_inmediato != null && permiso.estado == 2"
          >
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="permiso.recupero"
              label="Recupero Horas de Trabajo"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Cargo a Vacaciones -->
          <div class="col-12 col-md-3" v-if="horas_permisos <= 8">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="permiso.cargo_vacaciones"
              label="Cargo a Vacaciones"
              :disable="!esNuevo"
              outlined
              dense
            ></q-checkbox>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dias de permiso</label>
            <q-input
              v-model="dias_permiso"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Horas de permiso</label>
            <q-input
              v-model="horas_permisos"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Autorizacion -->
          <div class="col-12 col-md-3" v-if="accion == 'EDITAR' && esAutorizador">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="permiso.estado"
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
<!-- :error="v$.nombre.$errors"  -->

<script src="./PermisoEmpleadoPage.ts"></script>
