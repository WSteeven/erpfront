<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas"  :mostrarListado="mostrarListado"
    :mostrarButtonSubmits="!mostrarAprobacion">
    <template #formulario>

      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios Reciben -->
          <div class="col-12 col-md-3 q-mb-md" v-if="!esDevolucion || transferencia.usuario_recibe !== null">
            <label class="q-mb-sm block">Recibido Por:</label>
            <q-select v-model="transferencia.usuario_recibe" :options="usuarios" transition-show="jump-up"
              transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
              :error="!!v$.usuario_recibe.$errors.length" error-message="Debes seleccionar un usuario" use-input
              @blur="v$.usuario_recibe.$touch"
              input-debounce="0" @filter="filtrarUsuarios" :option-value="(v) => v.usuario_id"
              :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
              <template v-slot:error>
                <div v-for="error of v$.usuario_recibe.$errors" :key="error.$uid">
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
            <q-input v-model="transferencia.monto" placeholder="Obligatorio" :disable="disabled"
              :error="!!v$.monto.$errors.length" @blur="v$.monto.$touch" outlined dense>
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
            <q-input v-model="transferencia.cuenta" placeholder="Obligatorio" :disable="disabled"
              :error="!!v$.cuenta.$errors.length" @blur="v$.cuenta.$touch" outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.cuenta.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
            <!-- Tareas -->
            <div class="col-12 col-md-3">
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
            <selector-imagen :imagen="transferencia.comprobante"
            @blur="v$.comprobante.$touch"
              @update:modelValue="(data) => (transferencia.comprobante = data)">
            </selector-imagen>
          </div>
          <!--Es devolucion-->
          <div class="col-12 col-md-3">
            <q-checkbox v-model="esDevolucion" label="¿Es devolucion?" class="q-mb-sm block" @update:model-value="existeDevolucion()"/>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./TransferenciaPage.ts"></script>
