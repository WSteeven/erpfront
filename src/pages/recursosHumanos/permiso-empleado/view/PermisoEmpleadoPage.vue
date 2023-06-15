<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Cargos">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleados -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select v-model="permiso.empleado" :options="empleados" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
              :error="!!v$.empleado.$errors.length" error-message="Debes seleccionar un empleado" use-input
              input-debounce="0" @filter="filtrarEmpleado" :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.usuario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Tipo del prestamo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select v-model="permiso.tipo_permiso" :options="tipos_permisos" transition-show="jump-up"
              transition-hide="jump-down" :disable="disabled" options-dense dense outlined :input-debounce="0" use-input
              :option-value="(v) => v.id" :option-label="(v) => v.nombre" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.tipo_permiso.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Fecha de inicio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input v-model="permiso.fecha_hora_inicio" placeholder="Obligatorio"
              :error="!!v$.fecha_hora_inicio.$errors.length" :disable="disabled" @blur="v$.fecha_hora_inicio.$touch"
              outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date v-model="permiso.fecha_hora_inicio" mask="DD-MM-YYYY HH:mm" today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time v-model="permiso.fecha_hora_inicio" mask="DD-MM-YYYY HH:mm" color="primary" />
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
            <q-input v-model="permiso.fecha_hora_fin" placeholder="Obligatorio"
              :error="!!v$.fecha_hora_fin.$errors.length" :disable="disabled" @blur="v$.fecha_hora_fin.$touch" outlined
              dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <div class="q-gutter-md row items-start">
                      <q-date v-model="permiso.fecha_hora_fin" mask="DD-MM-YYYY HH:mm" today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Cerrar" color="primary" flat />
                        </div>
                      </q-date>
                      <q-time v-model="permiso.fecha_hora_fin" mask="DD-MM-YYYY HH:mm" color="primary" />
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
            <div class="q-gutter-md row items-start">

            </div>
          </div>
          <!-- justificativo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificativo</label>
            <q-input v-model="permiso.justificacion"
              @update:model-value="(v) => (permiso.justificacion = removeAccents(v))" placeholder="Obligatorio"
              :disable="disabled" :error="!!v$.justificacion.$errors.length" outlined dense>
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
            <selector-imagen :imagen="permiso.documento" file_extensiones=".jpg, image/*"
              :error="!!v$.documento.$errors.length" error-message="Debes de cargar imagen de comprobante"
              @blur="v$.documento.$touch" @update:modelValue="(data) => (permiso.documento = data)">
              <template v-slot:error>
                <div v-for="error of v$.documento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>
          <!-- Fecha Recuperacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Recuperacion</label>
            <q-input v-model="permiso.fecha_recuperacion" placeholder="Obligatorio"
              :error="!!v$.fecha_recuperacion.$errors.length" :disable="disabled" @blur="v$.fecha_recuperacion.$touch"
              outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="permiso.fecha_recuperacion" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_viat.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora inicio de agendamiento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora de Recuperacion (24 horas)</label>
            <q-input v-model="permiso.hora_recuperacion" :error="!!v$.hora_recuperacion.$errors.length" type="time"
              :disable="disabled" hint='Obligatorio' stack-label outlined clearable dense>
              <template v-slot:error>
                <div v-for="error of v$.hora_recuperacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Recuperable -->
          <div class="col-12 col-md-3">
            <q-checkbox class="q-mt-lg q-pt-md" v-model="permiso.recuperables" label="Recuperables" :disable="disabled"
              outlined dense></q-checkbox>
          </div>
          <!-- Cargo a Vacaciones -->
          <div class="col-12 col-md-3">
            <q-checkbox class="q-mt-lg q-pt-md" v-model="permiso.cargo_vacaciones" label="Cargo a Vacaciones"
              :disable="disabled" outlined dense></q-checkbox>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dias de permiso</label>
            <q-input v-model="dias_permiso"
              placeholder="Obligatorio"
              :disable="disabled"  outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Horas de permiso</label>
            <q-input v-model="horas_permisos"
              placeholder="Obligatorio"
              :disable="disabled"  outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PermisoEmpleadoPage.ts"></script>
