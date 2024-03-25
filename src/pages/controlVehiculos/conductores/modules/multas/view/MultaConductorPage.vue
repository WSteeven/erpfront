<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Multas de Conductores"
    :mostrarListado="mostrarListado"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información del conductor"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Conductor -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Conductor</label>
              <q-select
                v-model="multa.empleado"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled || soloLectura"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @popup-show="ordenarEmpleados"
                @update:model-value="obtenerEmpleado"
                :error="!!v$.empleado.$errors.length"
                error-message="Debes seleccionar un empleado para convertirlo en chofer"
                :option-value="(v) => v.id"
                :option-label="(v) => v.empleado"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.empleado }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.identificacion }}
                      </q-item-label>
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
            <!-- identificacion-->
            <div class="col-12 col-md-3" v-if="empleado.identificacion">
              <label class="q-mb-sm block">Identificacion</label>
              <q-input
                mask="#############"
                v-model="empleado.identificacion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Canton -->
            <div class="col-12 col-md-3" v-if="empleado.canton">
              <label class="q-mb-sm block">Ciudad</label>
              <q-select
                v-model="empleado.canton"
                :options="cantones"
                disable
                dense
                outlined
                :option-value="(v) => v.id"
                :option-label="(v) => v.canton"
                emit-value
                map-options
              />
            </div>
            <!-- direccion -->
            <div class="col-12 col-md-3" v-if="empleado.direccion">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="empleado.direccion"
                autogrow
                disable
                outlined
                dense
              />
            </div>
            <!--celular -->
            <div class="col-12 col-md-3" v-if="empleado.celular">
              <label class="q-mb-sm block">Celular</label>
              <q-input v-model="empleado.celular" disable dense outlined />
            </div>

            <!-- correo-->
            <div class="col-12 col-md-3" v-if="empleado.email">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                v-model="empleado.email"
                autogrow
                disable
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Registro de Multas"
          header-class="text-bold bg-header-collapse"
          default-opened
          ><div class="row q-col-gutter-sm q-pa-sm">
            <!--Fecha de infraccion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de Infracción</label>
              <q-input
                v-model="multa.fecha_infraccion"
                placeholder="Obligatorio"
                :error="!!v$.fecha_infraccion.$errors.length"
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
                        v-model="multa.fecha_infraccion"
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
                  <div
                    v-for="error of v$.fecha_infraccion.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Placa -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Placa</label>
              <q-select
                v-model="multa.placa"
                :options="vehiculos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                @filter="filtrarVehiculos"
                error-message="Debes seleccionar un numero de placa"
                use-input
                input-debounce="0"
                :option-value="(v) => v.placa"
                :option-label="(v) => v.placa"
                emit-value
                map-options
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.placa }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.marca }}:
                        {{ scope.opt.modelo }}</q-item-label
                      >
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

            <!-- puntos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Puntos</label>
              <q-input
                v-model="multa.puntos"
                type="number"
                step=".5"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
                <!-- <template v-slot:error>
                  <div
                    v-for="error of v$.numero_cuenta.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template> -->
              </q-input>
            </div>

            <!-- total-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Total a Pagar</label>
              <q-input
                v-model="multa.total"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.total.$errors.length"
                outlined
                dense
                ><template v-slot:error>
                  <div v-for="error of v$.total.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            
            <!-- afectacion al empleado-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Se descuenta valor al Empleado?</label>
              <q-toggle
                v-model="multa.descontable"
                :label="multa.descontable ? 'SI' : 'NO'"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            
            <!-- estado -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Estado</label>
              <q-toggle
                v-model="multa.estado"
                :label="multa.estado ? 'PAGADA' : 'PENDIENTE'"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>

            <!--Fecha de pago -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha de Pago</label>
              <q-input
                v-model="multa.fecha_pago"
                placeholder="Obligatorio"
                :error="!!v$.fecha_pago.$errors.length"
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
                        v-model="multa.fecha_pago"
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
                  <div v-for="error of v$.fecha_pago.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- comentario -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Observación</label>
              <q-input
                v-model="multa.comentario"
                autogrow
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./MultaConductorPage.ts" />
