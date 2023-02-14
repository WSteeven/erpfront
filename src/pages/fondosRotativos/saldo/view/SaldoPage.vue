<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Usuario</label>
            <q-select
              v-model="saldo.usuario"
              :options="usuarios"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.usuario.$errors.length"
              error-message="Debes seleccionar un usuario"
              use-input
              input-debounce="0"
              @filter="filtrarUsuarios"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres+' '+v.apellidos"
              emit-value
              map-options
            >
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
                    <!-- Tipo Fondo -->
                    <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo Fondo</label>
            <q-select
              v-model="saldo.tipo_fondo"
              :options="tiposFondos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.tipo_fondo.$errors.length"
              error-message="Debes seleccionar un tipo de fondo"
              use-input
              input-debounce="0"
              @filter="filtrarTiposFondos"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_fondo.$errors" :key="error.$uid">
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
          <!-- Tipo Saldo -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Tipo Saldo</label>
            <q-select
              v-model="saldo.tipo_saldo"
              :options="tiposSaldos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.tipo_saldo.$errors.length"
              error-message="Debes seleccionar un tipo de saldo"
              use-input
              input-debounce="0"
              @filter="filtrarTiposSaldos"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_saldo.$errors" :key="error.$uid">
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
          <!-- Referencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencia:</label>
            <q-input
              v-model="saldo.id_saldo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.id_saldo.$errors.length"
              @blur="v$.id_saldo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.id_saldo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Descripcion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción del Saldo:</label>
            <q-input
              v-model="saldo.descripcion_saldo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion_saldo.$errors.length"
              @blur="v$.descripcion_saldo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion_saldo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Fondo Rotativo:</label>
            <q-input
            v-model="saldo.fecha"
            placeholder="Obligatorio"
            :error="!!v$.fecha.$errors.length"
            :disable="disable"
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
                    v-model="saldo.fecha"
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

            <template v-slot:error>
              <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
          </div>
            <!-- Saldo depositado -->
            <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo Anterior(*):</label>
            <q-input
              v-model="saldo.saldo_anterior"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.saldo_anterior.$errors.length"
              @blur="v$.saldo_anterior.$touch"
              outlined
              dense
              type="number"
            >
              <template v-slot:error>
                <div v-for="error of v$.saldo_anterior.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
           <!--  Saldo Disponible -->
           <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo Depositado:</label>
            <q-input
              v-model="saldo.saldo_depositado"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.saldo_depositado.$errors.length"
              @blur="v$.saldo_depositado.$touch"
              outlined
              dense
              type="number"
            >
              <template v-slot:error>
                <div v-for="error of v$.saldo_depositado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
                <!--  Saldo Disponible -->
                <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Saldo Disponible:</label>
            <q-input
              v-model="saldo.saldo_actual"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.saldo_actual.$errors.length"
              @blur="v$.saldo_actual.$touch"
              outlined
              dense
              type="number"
            >
              <template v-slot:error>
                <div v-for="error of v$.saldo_actual.$errors" :key="error.$uid">
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
<script src="./SaldoPage.ts"></script>
