<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Registro de incidentes"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Persona que registra -->
          <div class="col-12 col-md-3" v-if="registro.persona_registra">
            <label class="q-mb-sm block">Persona que registra</label>
            <q-select
              v-model="registro.persona_registra"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              disable
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
              emit-value
              map-options
            ></q-select>
          </div>

          <!-- Placa -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Placa</label>
            <q-select
              v-model="registro.vehiculo"
              :options="vehiculos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              @filter="filtrarVehiculos"
              error-message="Debes seleccionar un número de placa"
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

          <!-- Fecha-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha del incidente</label>
            <q-input
              v-model="registro.fecha"
              placeholder="Obligatorio"
              :value="registro.fecha"
              :error="!!v$.fecha.$errors.length"
              :disable="disabled"
              @blur="v$.fecha.$touch"
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
                      v-model="registro.fecha"
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
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo de incidente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de incidente</label>
            <q-select
              v-model="registro.tipo"
              :options="tiposIncidentes"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              clearable
              @update:model-value="filtrarSubtipos"
              error-message="Debes seleccionar un tipo de incidente"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
            ></q-select>
          </div>

          <!-- SubTipo de incidente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Gravedad</label>
            <q-select
              v-model="registro.gravedad"
              :options="subtipos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              error-message="Debes seleccionar un elemento"
              :option-value="(v) => v.value"
              :option-label="(v) => v.label"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Primero selecciona un tipo de incidente
                  </q-item-section>
                </q-item>
              </template></q-select
            >
          </div>

          <!-- aplicó el seguro -->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="registro.aplica_seguro"
              label="¿Aplicó el seguro?"
              :disable="disabled"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Persona que reporta -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Persona que reporta</label>
            <q-select
              v-model="registro.persona_reporta"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-up"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              error-message="Debes seleccionar un empleado"
              :error="!!v$.persona_reporta.$errors.length"
              :disable="disabled"
              :option-label="(v) => v.apellidos + ' ' + v.nombres"
              :option-value="(v) => v.id"
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
              <template v-slot:error>
                <div
                  v-for="error of v$.persona_reporta.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- descripcion -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Descripción del incidente</label>
            <q-input
              type="textarea"
              autogrow
              v-model="registro.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.descripcion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Imágenes o archivos adjuntos"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idRegistro"
            />
          </div>

          <!-- end components -->
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./RegistroIncidentePage.ts" />
