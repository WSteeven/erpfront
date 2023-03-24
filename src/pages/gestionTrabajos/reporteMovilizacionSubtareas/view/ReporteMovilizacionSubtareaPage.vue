<template>
  <q-page padding>
    <q-card class="rounded-card q-mb-md">
      <q-card-section>
        <b>Movilización entre trabajos</b>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Cliente -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Seleccione un empleado</label>
              <q-select
                v-model="reporteMovilizacion.empleado"
                :options="empleados"
                @filter="filtrarEmpleados"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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

            <!--<div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha desde</label>
              <q-input
                v-model="reporteMovilizacion.fecha_inicio"
                placeholder="Obligatorio"
                :error="!!v$.fecha_desde.$errors.length"
                @blur="v$.fecha_desde.$touch"
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
                        v-model="reporteMovilizacion.fecha_desde"
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
                    v-for="error of v$.fecha_desde.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Fecha hasta</label>
              <q-input
                v-model="reporteMovilizacion.fecha_hasta"
                placeholder="Obligatorio"
                :error="!!v$.fecha_hasta.$errors.length"
                @blur="v$.fecha_hasta.$touch"
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
                        v-model="reporteMovilizacion.fecha_hasta"
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
                    v-for="error of v$.fecha_hasta.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div> -->
          </div>

          <div class="row justify-end q-gutter-sm q-pt-md">
            <!-- Boton guardar -->
            <q-btn color="primary" type="submit" no-caps push @click="buscar()">
              <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
              <span>Buscar</span>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <essential-table
      v-if="listado.length"
      titulo="Resultados"
      :configuracionColumnas="configuracionColumnasMovilizacionSubtarea"
      :datos="listado"
      :mostrarBotones="false"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :alto-fijo="false"
      :mostrar-header="true"
      :permitir-buscar="false"
    >
    </essential-table>
  </q-page>
</template>

<script src="./ReporteMovilizacionSubtareaPage.ts"></script>
