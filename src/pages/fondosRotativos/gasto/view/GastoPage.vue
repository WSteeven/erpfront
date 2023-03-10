<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="mostrarListado"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-select
              v-model="gasto.lugar"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.lugar.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              :option-value="(v) => v.id"
              :option-label="(v) => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.lugar.$errors" :key="error.$uid">
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

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="gasto.fecha_viat"
              placeholder="Obligatorio"
              :error="!!v$.fecha_viat.$errors.length"
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
                      v-model="gasto.fecha_viat"
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
                <div v-for="error of v$.fecha_viat.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Proyectos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyectos</label>
            <q-select
              v-model="gasto.proyecto"
              :options="proyectos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.proyecto.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarProyectos"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_proyecto
                    }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.nombre }} </q-item-label>
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

          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Tareas</label>
            <q-select
              v-model="gasto.num_tarea"
              :options="listadoTareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.num_tarea.$errors.length"
              error-message="Debes seleccionar una Tarea"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.num_tarea.$errors" :key="error.$uid">
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

          <!-- Factura -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">#Factura</label>
            <q-input
              v-model="gasto.factura"
              placeholder="Obligatorio"
              mask="###-###-#########"
              fill-mask
              hint="###-###-#########"
              :disable="disabled"
              :error="!!v$.factura.$errors.length"
              @blur="v$.factura.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.factura.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- RUC -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="gasto.ruc"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.ruc.$errors.length"
              @blur="v$.ruc.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.ruc.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Cantidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input
              v-model="gasto.cantidad"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.cantidad.$errors.length"
              @blur="v$.cantidad.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cantidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Valor Unitario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor Unitario</label>
            <q-input
              v-model="gasto.valor_u"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.valor_u.$errors.length"
              @blur="v$.valor_u.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.valor_u.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Total -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input
              v-model="gasto.total"
              placeholder="Obligatorio"
              type="number"
              disable
              :error="!!v$.total.$errors.length"
              @blur="v$.total.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.total.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Autorizacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-select
              v-model="gasto.aut_especial"
              :options="autorizacionesEspeciales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.aut_especial.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarAutorizacionesEspeciales"
              :option-value="(v) => v.id"
              :option-label="(v) => v.usuario"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.aut_especial.$errors" :key="error.$uid">
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
          <!-- Detalle -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="gasto.detalle"
              :options="detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.detalle.$errors.length"
              error-message="Debes seleccionar un canton"
              use-input
              input-debounce="0"
              @filter="filtrarDetalles"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.detalle.$errors" :key="error.$uid">
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
          <!-- Subdetalle-->
          <div class="col-12 col-md-3 q-mb-md" v-if="gasto.detalle != null">
            <label class="q-mb-sm block">SubDetalle</label>
            <q-select
              v-model="gasto.sub_detalle"
              :options="listadoSubdetalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.sub_detalle.$errors.length"
              error-message="Debes seleccionar un sub detalle"
              use-input
              input-debounce="0"
              @filter="filtarSubdetalles"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.sub_detalle.$errors" :key="error.$uid">
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

          <!-- Comprobante 1 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <selector-imagen
              :imagen="gasto.comprobante1"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
            >
            </selector-imagen>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <selector-imagen
              :imagen="gasto.comprobante2"
              @update:modelValue="(data) => (gasto.comprobante2 = data)"
            >
            </selector-imagen>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="Obligatorio"
              type="textarea"
              :disable="disabled"
              :error="!!v$.observacion.$errors.length"
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
<script src="./GastoPage.ts"></script>
