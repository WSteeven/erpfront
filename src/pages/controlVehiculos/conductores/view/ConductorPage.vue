<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Conductores"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información Personal"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Identificación -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Chofer</label>
              <q-select
                v-model="conductor.empleado"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
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
                :option-label="(v) => v.apellidos + ' ' + v.nombres"
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
                      <q-item-label
                        >{{ scope.opt.apellidos }}
                        {{ scope.opt.nombres }}</q-item-label
                      >
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
          label="Información de Licencia"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!--Tipo de Licencia -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de Licencia</label>
              <q-select
                v-model="conductor.tipo_licencia"
                :options="tiposLicencias"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.tipo_licencia.$errors.length"
                error-message="Debes seleccionar un tipo de licencia"
                :option-value="(v) => v.value"
                :option-label="(v) => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.tipo_licencia.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.caption }}
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
            <!-- Fecha Inicio Vigencia -->
            <div class="col-6 col-md-3">
              <label class="q-mb-sm block">Fecha Inicial Vigencia</label>
              <q-input
                v-model="conductor.inicio_vigencia"
                placeholder="Obligatorio"
                :error="!!v$.inicio_vigencia.$errors.length"
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
                        v-model="conductor.inicio_vigencia"
                        :mask="maskFecha"
                        today-btn
                        @update:model-value="calcularFechaFinal"
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
                    v-for="error of v$.inicio_vigencia.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Fecha Fin Vigencia -->
            <div class="col-6 col-md-3">
              <label class="q-mb-sm block">Fecha Final Vigencia</label>
              <q-input
                v-model="conductor.fin_vigencia"
                placeholder="Obligatorio"
                :error="!!v$.fin_vigencia.$errors.length"
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
                        v-model="conductor.fin_vigencia"
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
                    v-for="error of v$.fin_vigencia.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- puntos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Puntos</label>
              <q-input
                v-model="conductor.puntos"
                type="number"
                step=".5"
                :disable="disabled"
                :error="!!v$.puntos.$errors.length"
                error-message="Debe ingresar un valor entre 0 y 30"
                @blur="v$.puntos.$touch"
                outlined
                dense
                ><template v-slot:error>
                  <div
                    v-for="error of v$.puntos.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Tabla de multas -->
            <div class="col-12 col-md-12">
                    <essential-table
                      ref="refMultas"
                      titulo="Multas del Conductor"
                      :configuracionColumnas="columnasMultasConductor"
                      :datos="conductor.multas"
                      :accion1Header="abrirModalMultaConductor"
                      :permitirBuscar="false"
                      :permitirConsultar="false"
                      :permitirEditar="true"
                      :permitirEliminar="true"
                      :mostrarBotones="false"
                      :mostrarCantidadElementos="false"
                      :permitirEditarModal="true"
                      :modalMaximized="false"
                      :alto-fijo="false"
                      :mostrarFooter="false"
                    ></essential-table>
                  </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
  ></modales-entidad>
</template>

<script src="./ConductorPage.ts"></script>
