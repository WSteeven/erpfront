<template>
  <!-- <basic-container>
    <template #contenido>
      <q-card-section> -->
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="text-subtitle2">
        Completa el formulario para continuar con la postulación
      </div>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Datos personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Nombres -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Nombres </label>
            <q-input
              v-model="postulacion.nombres"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- Apellidos -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Apellidos </label>
            <q-input
              v-model="postulacion.apellidos"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- Tipo de Identificacion -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Tipo de Identificacion</label>
            <q-select
              v-model="postulacion.tipo_identificacion"
              :options="tiposDocumentosIdentificaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :error="!!v$.tipo_identificacion.$errors.length"
              :option-value="v => v.value"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_identificacion.$errors"
                  :key="error.$uid"
                >
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

          <!-- Identificación -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Identificación </label>
            <q-input
              v-model="postulacion.identificacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- correo -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Correo Personal</label>
            <q-input
              type="email"
              v-model="postulacion.correo_personal"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.correo_personal.$errors.length"
              @blur="v$.correo_personal.$touch"
              @update:model-value="
                v => (postulacion.correo_personal = v.toLowerCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.correo_personal.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Telefono -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              type="tel"
              v-model="postulacion.telefono"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.telefono.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Genero -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Sexo asignado al nacer</label>
            <q-toggle
              :label="postulacion.genero == 'M' ? 'Masculino' : 'Femenino'"
              v-model="postulacion.genero"
              true-value="M"
              false-value="F"
              color="primary"
              keep-color
              indeterminate-icon="fa fa-user"
              checked-icon="fa fa-male"
              unchecked-icon="fa fa-female"
              :disable="disabled"
            />
          </div>

          <!-- Identidad de genero -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Identidad de Género</label>
            <q-select
              v-model="postulacion.identidad_genero"
              :options="identidades"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :error="!!v$.identidad_genero.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identidad_genero.$errors"
                  :key="error.$uid"
                >
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

          <!-- Nacionalidad -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Nacionalidad</label>
            <q-select
              v-model="postulacion.pais"
              :options="paises"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              :input-debounce="0"
              @filter="filtrarPaises"
              :error="!!v$.pais.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.pais.$errors" :key="error.$uid">
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

          <!-- Pais de residencia -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">País de Residencia</label>
            <q-select
              v-model="postulacion.pais_residencia"
              :options="paises"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              :input-debounce="0"
              @filter="filtrarPaises"
              :error="!!v$.pais_residencia.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.pais_residencia.$errors"
                  :key="error.$uid"
                >
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

          <!-- documentos en regla -->
          <div
            class="col-md-3 col-sm-6 col-xs-12"
            v-if="postulacion.pais != postulacion.pais_residencia"
          >
            <q-checkbox
              class="q-mt-sm q-pt-md"
              v-model="postulacion.tengo_documentos_regla"
              label="¿Tengo documentos habilitantes para trabajar en este país?"
              outlined
              dense
            ></q-checkbox>
          </div>

           <!-- Fecha nacimiento -->
           <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Fecha de nacimiento</label>
              <q-input
                v-model="postulacion.fecha_nacimiento"
                placeholder="Obligatorio"
                :error="!!v$.fecha_nacimiento.$errors.length"
                @blur="v$.fecha_nacimiento.$touch"
                :disable="disabled"
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
                    >
                      <q-date
                        v-model="postulacion.fecha_nacimiento"
                        :options="optionsFecha"
                        :mask="maskFecha"
                        today-btn
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:error>
                  <div
                    style="clear: inherit"
                    v-for="error of v$.fecha_nacimiento.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

          <!-- Dirección  -->
          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="q-mb-sm block">Dirección </label>
            <q-input
              v-model="postulacion.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- {{postulacion}} -->
        </div>
      </q-expansion-item>
      <!-- <pre>
              {{ $q.screen }}
            </pre> -->
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Información adicional"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-pa-md">
          <div class="col col-md-4">
            <label class="q-mb-sm block"
              >Comentanos tu experiencia en el rol al que estas postulando
            </label>
            <q-input
              v-model="postulacion.nombres"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>
    </template>
  </simple-layout>
  <!-- </q-card-section>
    </template>
  </basic-container> -->
</template>
<script src="./PostulacionVacantePage.ts" />
