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
              @blur="v$.lugar.$touch"
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
              @blur="v$.fecha_viat.$touch"
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
              @blur="v$.proyecto.$touch"
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
              @blur="v$.num_tarea.$touch"
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
          <!--SubTareas-->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Sub Tareas</label>
            <q-select
              v-model="gasto.subTarea"
              :options="listadoSubTareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.subTarea.$errors.length"
              @blur="v$.subTarea.$touch"
              error-message="Debes seleccionar una Tarea"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.subTarea.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_subtarea
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
          <!--Tiene Factura-->
          <div class="col-12 col-md-3">
            <q-checkbox v-model="esFactura" label="¿Tiene Factura?" @update:model-value="existeComprobante()" />
          </div>
          <!-- Factura -->
          <div class="col-12 col-md-3" v-if="esFactura">
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
          <!-- Numero de Comprobante -->
          <div class="col-12 col-md-3" v-if="esFactura==false">
            <label class="q-mb-sm block">Numero de Comprobante</label>
            <q-input
              v-model="gasto.numComprobante"
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              :error="!!v$.numComprobante.$errors.length"
              @blur="v$.numComprobante.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.numComprobante.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3" v-if="esFactura">
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
              @blur="v$.aut_especial.$touch"
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
              @blur="v$.detalle.$touch"
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
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Subdetalle</label>
            <q-select
              v-model="gasto.sub_detalle"
              :options="listadoSubdetalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              multiple
              dense
              use-chips
              outlined
              @blur="v$.sub_detalle.$touch"
              :error="!!v$.sub_detalle.$errors.length"
              error-message="Debes seleccionar uno o varios sub_detalle"
              :option-value="(v) => v.id"
              :option-label="(v) => v.descripcion"
              emit-value
              map-options
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.descripcion }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.descripcion" />
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
                  </q-item-section>
                </q-item>
              </template>
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
              @blur="v$.comprobante1.$touch"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
            >
            </selector-imagen>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <selector-imagen
              :imagen="gasto.comprobante2"
              @blur="v$.comprobante2.$touch"
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
              autogrow
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
<script src="./GastoPage.ts"></script>
