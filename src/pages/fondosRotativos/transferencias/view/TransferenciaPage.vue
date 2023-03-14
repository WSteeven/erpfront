<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios envia -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Enviado Por</label>
            <q-select
              v-model="transferencia.usuario_envia"
              :options="usuarios"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.usuario_envia.$errors.length"
              error-message="Debes seleccionar un usuario"
              use-input
              input-debounce="0"
              @filter="filtrarUsuarios"
              :option-value="(v) => v.usuario_id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.usuario_envia.$errors"
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
          <!-- Usuarios Reciben -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Usuario</label>
            <q-select
              v-model="transferencia.usuario_recive"
              :options="usuarios"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.usuario_recive.$errors.length"
              error-message="Debes seleccionar un usuario"
              use-input
              input-debounce="0"
              @filter="filtrarUsuarios"
              :option-value="(v) => v.usuario_id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.usuario_recive.$errors"
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
          <!-- Monto  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto:</label>
            <q-input
              v-model="transferencia.monto"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.monto.$errors.length"
              @blur="v$.monto.$touch"
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
          <!-- Motivo  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Motivo:</label>
            <q-input
              v-model="transferencia.motivo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.motivo.$errors.length"
              @blur="v$.motivo.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!--Comprobante-->

          <!-- Comprobante 1 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante </label>
            <selector-imagen
              :imagen="transferencia.comprobante"
              @update:modelValue="(data) => (transferencia.comprobante = data)"
            >
            </selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./TransferenciaPage.ts"></script>
