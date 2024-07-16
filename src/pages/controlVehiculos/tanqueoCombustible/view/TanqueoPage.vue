<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Tanqueo de Combustible"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Fecha de creación -->
          <div v-if="tanqueo.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de creación</label>
            <q-input v-model="tanqueo.created_at" disable outlined dense />
          </div>
          <!-- vehículo -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="tanqueo.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :readonly="disabled"
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :error="!!v$.vehiculo.$errors.length"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.marca + ' ' + scope.opt.modelo
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
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

          <!-- Solicitante -->
          <div v-if="tanqueo.solicitante" class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input v-model="tanqueo.solicitante" disable outlined dense autogrow />
          </div>

          <!-- Fecha y hora -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="tanqueo.fecha_hora"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora.$errors.length"
              @blur="v$.fecha_hora.$touch"
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
                      v-model="tanqueo.fecha_hora"
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
                <div v-for="error of v$.fecha_hora.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Km Tanqueo -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Km Tanqueo</label>
            <q-input
              type="number"
              v-model="tanqueo.km_tanqueo"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.km_tanqueo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_tanqueo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Valor -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Monto</label>
            <q-input
              type="number"
              v-model="tanqueo.monto"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.monto.$errors.length"
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
          <!-- Combustible -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Tipo de combustible</label>
            <q-select
              v-model="tanqueo.combustible"
              :options="combustibles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.combustible.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtrarCombustibles"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.combustible.$errors" :key="error.$uid">
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
          <!-- Imagen comprobante -->
          <div class="col-12 col-md-3 col-sm-6">
            <label for="q-mb-sm block">Imagen Comprobante</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              placeholder="Obligatorio"
              :imagen="tanqueo.imagen_comprobante"
              :error="!!v$.imagen_comprobante.$errors.length"
              :alto="'200px'"
              @update:model-value="
                (data) => (tanqueo.imagen_comprobante = data)
              "
            ></selector-imagen>
          </div>

          <!-- Imagen tablero -->
          <div class="col-12 col-md-3 col-sm-6">
            <label for="q-mb-sm block">Imagen Tablero</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              placeholder="Obligatorio"
              :imagen="tanqueo.imagen_tablero"
              :error="!!v$.imagen_tablero.$errors.length"
              :alto="'200px'"
              @update:model-value="(data) => (tanqueo.imagen_tablero = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./TanqueoPage.ts" />
