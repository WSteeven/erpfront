<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
             <!-- Motivos del prestamo -->
             <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Motivo</label>
              <q-select
                v-model="permiso.motivo"
                :options="motivos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
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
                  <div v-for="error of v$.motivo.$errors" :key="error.$uid">
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
            <q-input v-model="permiso.fecha_inicio" placeholder="Obligatorio" :error="!!v$.fecha_inicio.$errors.length"
              :disable="disabled" @blur="v$.fecha_inicio.$touch" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="permiso.fecha_inicio" :mask="maskFecha"  today-btn>
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
                <!-- Fecha de inicio -->
                <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input v-model="permiso.fecha_fin" placeholder="Obligatorio" :error="!!v$.fecha_fin.$errors.length"
              :disable="disabled" @blur="v$.fecha_fin.$touch" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="permiso.fecha_fin" :mask="maskFecha"  today-btn>
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
          </div>
                    <!-- Justificacion -->
                    <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <selector-imagen :imagen="permiso.justificacion" file_extensiones=".jpg, image/*"
              :error="!!v$.justificacion.$errors.length" error-message="Debes de cargar imagen de comprobante"
              @blur="v$.justificacion.$touch" @update:modelValue="(data) => (permiso.justificacion = data)">
              <template v-slot:error>
                <div v-for="error of v$.justificacion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>

        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./PermisoEmpleadoPage.ts"></script>
