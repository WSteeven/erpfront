<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasClienteFinal"
    titulo-pagina="Proyectos"
    :permitir-eliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="1. Información general"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Cliente -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Cliente corporativo</label>
              <q-select
                v-model="clienteFinal.cliente"
                :options="clientes"
                @filter="filtrarClientes"
                @blur="v$.cliente.$touch"
                :disable="disabled"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :error="!!v$.cliente.$errors.length"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:error>
                  <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Id / Codigo de cliente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">ID/Código de cliente final</label>
              <q-input
                v-model="clienteFinal.id_cliente_final"
                :error="!!v$.id_cliente_final.$errors.length"
                @blur="v$.id_cliente_final.$touch"
                placeholder="Obligatorio"
                :disable="disabled"
                autofocus
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.id_cliente_final.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Cedula -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Cédula</label>
              <q-input
                v-model="clienteFinal.cedula"
                placeholder="Opcional"
                :disable="disabled"
                :error="!!v$.cedula.$errors.length"
                @blur="v$.cedula.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <div
                    style="clear: inherit"
                    v-for="error of v$.cedula.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Nombres -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="clienteFinal.nombres"
                :error="!!v$.nombres.$errors.length"
                @blur="v$.nombres.$touch"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
                <template v-slot:error>
                  <div v-for="error of v$.nombres.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Apellidos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                v-model="clienteFinal.apellidos"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Correo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="clienteFinal.correo"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Celular -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="clienteFinal.celular"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Provincia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Provincias</label>
              <q-select
                v-model="clienteFinal.provincia"
                :options="listadosAuxiliares.provincias"
                :disable="disabled"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.provincia"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Ciudad -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Canton</label>
              <q-select
                v-model="clienteFinal.canton"
                :options="cantonesPorProvincia"
                :disable="disabled"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.canton"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Parroquia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Parroquia/Barrio</label>
              <q-input
                v-model="clienteFinal.parroquia"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Direccion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="clienteFinal.direccion"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Referencias -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Referencia</label>
              <q-input
                v-model="clienteFinal.referencia"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Coordenada longitud -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Coordenadas</label>
              <q-input
                v-model="clienteFinal.coordenadas"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <div class="col-12 col-md-3">
              <br />
              <q-toggle
                v-model="clienteFinal.activo"
                checked-icon="check"
                label="Activo"
                color="positive"
                :disable="disabled"
              />
            </div>
          </div>
        </q-expansion-item>

        <!--<q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. Información técnica"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Medios de transmisión (Opcional)</label
              >
              <q-option-group
                :options="mediosTransmision"
                type="radio"
                :disable="disabled"
                v-model="clienteFinal.medio_transmision"
              />
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Tendido interior de cable (Opcional)</label
              >
              <q-option-group
                :options="tendidosInteriorCable"
                type="radio"
                :disable="disabled"
                v-model="clienteFinal.tendido_interior_cable"
              />
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de activación</label>
              <q-input
                v-model="clienteFinal.fecha_activacion"
                placeholder="Opcional"
                :disable="disabled"
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
                        v-model="clienteFinal.fecha_activacion"
                        mask="DD-MM-YYYY"
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
              </q-input>
            </div>
          </div>
        </q-expansion-item> -->
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ClienteFinalPage.ts"></script>
