<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Transacciones"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- N° transaccion -->
          <div v-if="transaccion.id" class="col-12 col-md-3">
            <label class="q-mb-sm block">Transacción N°</label>
            <q-input
              v-model="transaccion.id"
              placeholder="Obligatorio"
              :readonly="true"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Fecha de transaccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="transaccion.created_at"
              mask="date"
              :rules="['date']"
              :readonly="true"
              outlined
              dense
            />
          </div>
          <!-- Select tipo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="transaccion.tipo"
              :options="opciones_tipos"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              @update:model-value="filtroTipos"
              :option-value="(v) => v.nombre"
              :option-label="(v) => v.nombre"
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
          <!-- Select subtipo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Subtipo</label>
            <q-select
              v-model="transaccion.subtipo"
              :options="opciones_subtipos.subtipos"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.subtipo.$errors.length"
              error-message="Debes seleccionar un subtipo"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.subtipo.$errors" :key="error.$uid">
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
          <!-- Select autorizacion -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Autorizacion</label>
            <q-select
              v-model="transaccion.autorizacion"
              :options="opciones_autorizaciones"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.autorizacion.$errors.length"
              error-message="Debes seleccionar una autorizacion"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
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
          <!-- Tiene observacion de autorizacion -->
          <div class="col-12 col-md-3">
            <q-checkbox class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_obs_autorizacion"
              label="Tiene observación"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- observacion autorizacion -->
          <div v-if="transaccion.tiene_obs_autorizacion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transaccion.observacion_aut"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.observacion_aut.$errors.length"
              @update:model-value="
                (v) => (transaccion.observacion_aut = v.toUpperCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_aut.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Select sucursal -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Sucursal</label>
            <q-select
              v-model="transaccion.sucursal"
              :options="opciones_sucursales.sucursales"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.sucursal.$errors.length"
              error-message="Debes seleccionar una sucursal"
              :option-value="(v) => v.id"
              :option-label="(v) => v.lugar"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
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
          <!-- Justificacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Justificación</label>
            <q-input
              v-model="transaccion.justificacion"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.justificacion.$errors.length"
              @update:model-value="
                (v) => (transaccion.justificacion = v.toUpperCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.justificacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Solicitante -->
          <div v-if="transaccion.solicitante" class="col-12 col-md-3">
            <label class="q-mb-sm block">Solicitante</label>
            <q-input
              v-model="transaccion.solicitante"
              :readonly="true"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Lugar destino -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Asignado a</label>
            <q-input
              v-model="transaccion.lugar_destino"
              placeholder="Lugar/Tarea #"
              :readonly="disabled"
              :error="!!v$.lugar_destino.$errors.length"
              @update:model-value="
                (v) => (transaccion.lugar_destino = v.toUpperCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.lugar_destino.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Select estado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado</label>
            <q-select
              v-model="transaccion.estado"
              :options="opciones_estados"
              transition-show="jum-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.estado.$errors.length"
              error-message="Debes seleccionar un estado para la transacción"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.estado.$errors" :key="error.$uid">
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
          <!-- Tiene observación de estado -->
          <div class="col-12 col-md-3">
            <q-checkbox class="q-mt-lg q-pt-md"
              v-model="transaccion.tiene_obs_estado"
              label="Tiene observación"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- observacion estado -->
          <div v-if="transaccion.tiene_obs_estado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="transaccion.observacion_est"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.observacion_est.$errors.length"
              @update:model-value="
                (v) => (transaccion.observacion_est = v.toUpperCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.observacion_est.$errors"
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

<script src="./TransaccionPage.ts" />
