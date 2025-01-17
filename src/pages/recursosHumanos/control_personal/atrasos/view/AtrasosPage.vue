<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Atrasos de Empleados"
    :tab-options="tabOptions"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarListadoAtrasos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-page class="q-pa-md">
          <q-card class="q-pa-md">
            <!-- Contenido del formulario -->
            <q-card-section>
              <div class="row q-col-gutter-md">
                <!-- Empleado -->
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Empleado</label>
                  <q-select
                    v-model="atraso.empleado"
                    :options="empleados"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    disable
                    options-dense
                    dense
                    outlined
                    :error="!!v$.empleado.$errors.length"
                    @blur="v$.empleado.$touch"
                    error-message="Debes seleccionar un empleado"
                    use-input
                    input-debounce="0"
                    @filter="filtrarEmpleados"
                    @popup-show="ordenarLista(empleados, 'nombres')"
                    :option-value="v => v.id"
                    :option-label="v => v.nombres + ' ' + v.apellidos"
                    emit-value
                    map-options
                  >
                    <template v-slot:error>
                      <error-component clave="empleado" :v$="v$" />
                    </template>

                    <template v-slot:no-option>
                      <no-option-component />
                    </template>
                  </q-select>
                </div>

                <!-- Fecha de atraso -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Fecha de Atraso</label>
                  <q-input
                    v-model="atraso.fecha_atraso"
                    outlined
                    dense
                    disable
                    hint="Fecha de atraso"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="atraso.fecha_atraso"
                            :mask="maskFecha"
                            today-btn
                            disable
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
                  </q-input>
                </div>
                <!-- Tiempo de atraso -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Tiempo de Atraso</label>
                  <q-input
                    v-model="atraso.tiempo_atraso"
                    outlined
                    dense
                    disable
                    hint="Tiempo de atraso calculados"
                  />
                </div>

                <!-- Ocurrencia -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Ocurrencia del Atraso</label>
                  <q-input
                    v-model="atraso.ocurrencia"
                    outlined
                    dense
                    disable
                    hint="Ocurrencia del atraso"
                  />
                </div>

                <!-- Justificar -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">¿Justificar?</label>
                  <option-group-component
                    v-model="atraso.justificado"
                    :disable="disabled"
                  />
                </div>

                <!-- Existe UPC cercano -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">¿Revisado?</label>
                  <option-group-component
                    v-model="atraso.revisado"
                    :disable="true"
                  />
                </div>

                <div class="col-6 col-md-3 col-sm-12">
                  <label for="q-mb-xl block">Imagen Evidencia</label>
                  <selector-imagen
                    file_extensiones=".jpg, image/*"
                    :imagen="atraso.imagen_evidencia"
                    :disable="disabled"
                    :alto="'300px'"
                    @update:model-value="
                      data => (atraso.imagen_evidencia = data)
                    "
                  ></selector-imagen>
                </div>

                <!-- Justificación -->
                <div class="col-12">
                  <label class="q-mb-sm block">Justificación del atraso</label>
                  <essential-editor
                    v-model="atraso.justificacion"
                    :disable="disabled"
                  ></essential-editor>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./AtrasosPage.ts" lang="ts"></script>
