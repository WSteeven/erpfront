<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasClienteFinal"
    titulo-pagina="Proyectos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="text-bold q-pt-md">Información general</div>

        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="clienteFinal.cliente"
              :options="clientes"
              @filter="filtrarClientes"
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

          <!-- Id de cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">ID de cliente final</label>
            <q-input
              v-model="clienteFinal.id_cliente_final"
              :error="!!v$.id_cliente_final.$errors.length"
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

          <!-- Celular -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              v-model="clienteFinal.celular"
              :error="!!v$.celular.$errors.length"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.celular.$errors" :key="error.$uid">
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
              :error="!!v$.apellidos.$errors.length"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.apellidos.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
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

        <!-- UBICACION -->
        <div class="text-bold">Ubicación</div>
        <div class="row q-col-gutter-sm q-py-md q-mb-md">
          <!-- Provincia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Provincias</label>
            <q-select
              v-model="clienteFinal.provincia"
              :options="listadosAuxiliares.provincias"
              :error="!!v$.provincia.$errors.length"
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

              <template v-slot:error>
                <div v-for="error of v$.provincia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
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
            <label class="q-mb-sm block">Coordenada longitud</label>
            <q-input
              v-model="clienteFinal.coordenada_longitud"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Coordenada latitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenada latitud</label>
            <q-input
              v-model="clienteFinal.coordenada_latitud"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>

        <!-- RUTA -->
        <div class="text-bold">Ruta</div>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Origen</label>
            <q-input
              v-model="clienteFinal.ruta_origen"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Destino</label>
            <q-input
              v-model="clienteFinal.ruta_destino"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>

        <!-- ODF -->
        <div class="text-bold">ODF</div>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Origen</label>
            <q-input
              v-model="clienteFinal.odf_origen"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Destino</label>
            <q-input
              v-model="clienteFinal.odf_destino"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>

        <!-- ODF -->
        <div class="text-bold">Hilos</div>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hilo 1</label>
            <q-input
              v-model="clienteFinal.odf_origen"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hilo 2</label>
            <q-input
              v-model="clienteFinal.odf_destino"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ClienteFinalPage.ts"></script>
