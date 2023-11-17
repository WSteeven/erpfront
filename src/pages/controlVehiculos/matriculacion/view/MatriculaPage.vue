<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    :tab-options="tabOptionsMatriculas"
    tabDefecto="1"
    :filtrar="filtrarMatriculas"
    titulo-pagina="Matriculas de Vehículos"
    :accion1Header="btnConsultarMatricula"
    :accion2Header="btnConsultarMultas"
    :permitirEditar="false"
    :accion1="btnPagarMatricula"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Placa -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Placa</label>
            <q-select
              v-model="matricula.vehiculo"
              :options="vehiculos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              @filter="filtrarVehiculos"
              @update:model-value="asignarPlaca"
              error-message="Debes seleccionar un numero de placa"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
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

          <!-- Fecha de matricula -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Matriculación </label>
            <q-input
              v-model="matricula.fecha_matricula"
              placeholder="Obligatorio"
              :value="matricula.fecha_matricula"
              mask="##-####"
              hint="Fecha de matriculación"
              :error="!!v$.fecha_matricula.$errors.length"
              :disable="disabled"
              @blur="v$.fecha_matricula.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                      v-model="matricula.fecha_matricula"
                      minimal
                      mask="MM-YYYY"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkValue"
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
                  v-for="error of v$.fecha_matricula.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Proxima matricula -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Próxima Matrícula </label>
            <q-input
              v-model="matricula.proxima_matricula"
              placeholder="Obligatorio"
              :value="matricula.proxima_matricula"
              mask="##-####"
              hint="Fecha de matriculación"
              :error="!!v$.proxima_matricula.$errors.length"
              :disable="disabled"
              @blur="v$.proxima_matricula.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                      v-model="matricula.proxima_matricula"
                      minimal
                      mask="MM-YYYY"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkValue"
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
                  v-for="error of v$.proxima_matricula.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./MatriculaPage.ts" />
