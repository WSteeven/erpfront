<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :accion1="btnAprobarTransferenciaForzado"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Empleado que envia -->
          <div
            class="col-12 col-md-3 q-mb-md col-sm-3"
            v-if="store.can('puede.registrar.fondos_terceros')"
          >
            <label class="q-mb-sm block">Empleado Solicitante</label>
            <q-select
              v-model="transferencia.usuario_envia"
              :options="empleados_delegadores"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.usuario_envia.$errors.length"
              @blur="v$.usuario_envia.$touch"
              error-message="Debes seleccionar un empleado al que se carga el gasto"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados_delegadores, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="usuario_envia" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Empleado Recibe -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="!transferencia.es_devolucion"
          >
            <label class="q-mb-sm block">Destinatario:</label>
            <q-select
              v-model="transferencia.usuario_recibe"
              :options="empleados"
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
              @filter="filtrarEmpleados"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="usuario_recibe" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Fecha  -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Fecha de Transferencia</label>
            <q-input
              v-model="transferencia.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              @blur="v$.fecha.$touch"
              :disable="disabled"
              readonly
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
                      v-model="transferencia.fecha"
                      :options="optionsFecha"
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
                <error-component clave="fecha" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Monto  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto</label>
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
                <error-component clave="monto" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- cuenta bancarea-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"># Comprobante</label>
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
                <error-component clave="cuenta" :v$="v$" />
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
              :option-value="v => v.id"
              :option-label="v => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tarea" :v$="v$" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary"
                      >{{ scope.opt.codigo_tarea }}
                    </q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!--Comprobante-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante </label>
            <selector-imagen
              placeholder="Obligatorio"
              :imagen="transferencia.comprobante"
              :error="!!v$.comprobante.$errors.length"
              @update:modelValue="data => (transferencia.comprobante = data)"
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
              label="¿Es devolucion a la cuenta de la empresa?"
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
                <error-component clave="observacion" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Usuario Tercero Aprueba -->
          <div class="col-12 col-md-3" v-if="transferencia.motivo_aprobacion_tercero">
            <label class="q-mb-sm block">Aprobado manualmente por</label>
            <q-input
              v-model="transferencia.usuario_tercero_aprueba"
              placeholder="obligatorio"
              disable
              autogrow
              outlined
              dense
            />
          </div>

          <!-- motivo_aprobacion_tercero -->
          <div class="col-12 col-md-6" v-if="transferencia.motivo_aprobacion_tercero">
            <label class="q-mb-sm block">Motivo Aprobación Tercero</label>
            <q-input
              v-model="transferencia.motivo_aprobacion_tercero"
              type="textarea"
              placeholder="obligatorio"
              disable
              autogrow
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./TransferenciaPage.ts"></script>
