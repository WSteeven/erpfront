<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios Reciben -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="!transferencia.es_devolucion"
          >
            <label class="q-mb-sm block">Destinatario:</label>
            <q-select
              v-model="transferencia.usuario_recibe"
              :options="usuarios"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.usuario_recibe.$errors.length"
              error-message="Debes seleccionar un usuario"
              use-input
              @blur="v$.usuario_recibe.$touch"
              input-debounce="0"
              @filter="filtrarUsuarios"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.usuario_recibe.$errors"
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
              type="number"
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
          <!-- cuenta bancarea-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cuenta:</label>
            <q-input
              v-model="transferencia.cuenta"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.cuenta.$errors.length"
              @blur="v$.cuenta.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cuenta.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="!transferencia.es_devolucion">
            <label class="q-mb-sm block">Tareas</label>
            <q-select
              v-model="transferencia.tarea"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.tarea.$errors.length"
              @filter="filtrarTareas"
              @blur="v$.tarea.$touch"
              error-message="Debes seleccionar una Tarea"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_tarea
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
                  </q-item-section>
                </q-item>
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
          <!--Comprobante-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante </label>
            <selector-imagen
              :imagen="transferencia.comprobante"
              :error="!!v$.comprobante.$errors.length"
              @update:modelValue="(data) => (transferencia.comprobante = data)"
            >
              <template #error>
                <div v-for="error of v$.comprobante.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>

          </div>
          <!--Es devolucion-->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="transferencia.es_devolucion"
              label="¿Es devolucion?"
              :disable="disabled"
              @update:model-value="existeDevolucion()"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="transferencia.observacion"
              placeholder="obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
              autogrow
              @blur="v$.observacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.observacion.$errors" :key="error.$uid">
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
<script src="./TransferenciaPage.ts"></script>
