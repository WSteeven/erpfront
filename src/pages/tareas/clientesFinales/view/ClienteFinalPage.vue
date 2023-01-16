<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasClienteFinal"
    titulo-pagina="Proyectos"
  >
    <template #formulario>
      <q-form @submit.prevent>
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
              :disable="disabled"
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
              :error="!!v$.canton.$errors.length"
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

              <template v-slot:error>
                <div v-for="error of v$.canton.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Parroquia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Parroquia/Barrio</label>
            <q-input
              v-model="clienteFinal.parroquia"
              :error="!!v$.parroquia.$errors.length"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.parroquia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="clienteFinal.direccion"
              :error="!!v$.direccion.$errors.length"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Referencias -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencia</label>
            <q-input
              v-model="clienteFinal.referencia"
              :error="!!v$.referencia.$errors.length"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.referencia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Coordenada longitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenada longitud</label>
            <q-input
              v-model="clienteFinal.coordenada_longitud"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.coordenada_longitud.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Coordenada latitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenada latitud</label>
            <q-input
              v-model="clienteFinal.coordenada_latitud"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.coordenada_latitud.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ClienteFinalPage.ts"></script>
