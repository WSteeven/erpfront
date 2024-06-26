<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    ajustarCeldas
    :tab-options="tabOptions"
    :tabDefecto="tabActual"
    :filtrar="filtrarTransferencias"
    titulo-pagina="Transferencia de Vehículos"
    :permitirEditar="tabActual == 'PENDIENTE'"
    :accion1="btnDevolverVehiculo"
    :accion2="btnTransferirVehiculo"
    :accion3="btnImprimirActaResponsabilidadTransferencia"
  >
    <!-- :permitirEliminar="tabActual == 'PENDIENTE'" -->
    <!-- :permitirEditar="tabActual=='PENDIENTE' && transferencia.responsable==store.user.id" -->
    <template #formulario>
      <q-form @submit.prevent v-if="true">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Persona que entrega -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Empleado entrega</label>
            <q-select
              v-model="transferencia.entrega"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              disable
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
              :option-value="(item) => item.id"
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

          <!-- Persona responsable -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Empleado recibe (responsable)</label>
            <q-select
              v-model="transferencia.responsable"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :error="!!v$.responsable.$errors.length"
              @blur="v$.responsable.$touch"
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
              :option-value="(item) => item.id"
              :option-disable="(item) => item.id == transferencia.entrega"
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
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarEmpleados">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="transferencia.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              :error="!!v$.vehiculo.$errors.length"
              @blur="v$.vehiculo.$touch"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.marca + ' ' + scope.opt.modelo
                    }}</q-item-label>
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
              <template v-slot:error>
                <div v-for="error of v$.vehiculo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarVehiculos">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>

          <!-- Ciudad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-select
              v-model="transferencia.canton"
              :options="cantones"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :error="!!v$.canton.$errors.length"
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              @filter="filtrarCantones"
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
              <template v-slot:error>
                <div v-for="error of v$.canton.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Fecha de entrega -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de entrega </label>
            <q-input
              v-model="transferencia.fecha_entrega"
              placeholder="Obligatorio"
              :error="!!v$.fecha_entrega.$errors.length"
              :disable="disabled"
              @blur="v$.fecha_entrega.$touch"
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
                      v-model="transferencia.fecha_entrega"
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
                <div
                  v-for="error of v$.fecha_entrega.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- motivo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Motivo</label>
            <q-select
              v-model="transferencia.motivo"
              options-dense
              hint="Selecciona o ingresa un motivo"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              :error="!!v$.motivo.$errors.length"
              input-debounce="0"
              @new-value="crearMotivo"
              :options="motivos"
              @filter="filtrarMotivos"
            >
              <template v-slot:error>
                <div v-for="error of v$.motivo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Observacion entrega -->
          <div
            class="col-12 col-md-3"
            v-if="transferencia.observacion_entrega || accion == acciones.nuevo"
          >
            <label class="q-mb-sm block"
              >Observación (persona que entrega)
            </label>
            <q-input
              v-model="transferencia.observacion_entrega"
              placeholder="Opcional"
              autogrow
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- estado carroceria -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado de carrocería</label>
            <q-select
              v-model="transferencia.estado_carroceria"
              options-dense
              hint="Selecciona o ingresa uno o varios ítem"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              :error="!!v$.estado_carroceria.$errors.length"
              input-debounce="0"
              @new-value="crearEstado"
              :options="estados"
              @filter="filtrarEstados"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.estado_carroceria.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- estado mecanico -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado Mecánico</label>
            <q-select
              v-model="transferencia.estado_mecanico"
              options-dense
              hint="Selecciona o ingresa uno o varios ítem"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              :error="!!v$.estado_mecanico.$errors.length"
              input-debounce="0"
              @new-value="crearEstado"
              :options="estados"
              @filter="filtrarEstados"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.estado_mecanico.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- estado electrico -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Estado Eléctrico y A/AC</label>
            <q-select
              v-model="transferencia.estado_electrico"
              options-dense
              hint="Selecciona o ingresa uno o varios ítem"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              :error="!!v$.estado_electrico.$errors.length"
              input-debounce="0"
              @new-value="crearEstado"
              :options="estados"
              @filter="filtrarEstados"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.estado_electrico.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Observacion recibe -->
          <div
            class="col-12 col-md-3"
            v-if="transferencia.observacion_recibe || accion == acciones.editar"
          >
            <label class="q-mb-sm block">Observación (receptor)</label>
            <q-input
              v-model="transferencia.observacion_recibe"
              placeholder="Opcional"
              autogrow
              :disable="disabled"
              outlined
              dense
            />
          </div>
          <!-- Select garaje -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Garaje</label>
            <q-select
              v-model="transferencia.garaje"
              :options="opcionesGaraje"
              options-dense
              dense
              outlined
              :error="!!v$.garaje.$errors.length"
              :disable="disabled"
              :option-value="(v) => v"
              :option-label="(v) => v"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.garaje.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ubicación</label>
            <q-btn
              color="positive"
              no-caps
              no-wrap
              class="full-width"
              @click="obtenerCoordenadas()"
              :disable="disabled"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Obtener ubicación</q-btn
            >
          </div>
          <!-- Latitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Latitud</label>
            <q-input
              v-model="transferencia.latitud"
              placeholder="Opcional"
              autogrow
              :error="!!v$.latitud.$errors.length"
              :disable="disabled"
              outlined
              dense
              ><template v-slot:error>
                <div v-for="error of v$.latitud.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template></q-input
            >
          </div>

          <!-- Longitud -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Longitud</label>
            <q-input
              v-model="transferencia.longitud"
              placeholder="Opcional"
              autogrow
              :error="!!v$.longitud.$errors.length"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.longitud.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Select estado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label
              color="light-green-2"
              class="text-positive text-bold q-mb-sm inline-block bg-light-green-2 rounded q-px-md"
              >Estado
            </label>
            <q-select
              v-model="transferencia.estado"
              :options="estadosTransferenciasVehiculos"
              options-dense
              dense
              outlined
              :disable="
                disabled || store.user.id !== transferencia.responsable_id
              "
              :option-value="(v) => v.label"
              :option-label="(v) => v.label"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <!-- accesorios -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Accesorios</label>
            <q-select
              v-model="transferencia.accesorios"
              options-dense
              hint="Selecciona o ingresa un ítem"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              :error="!!v$.accesorios.$errors.length"
              input-debounce="0"
              @new-value="crearAccesorio"
              :options="accesorios"
              @filter="filtrarAccesorios"
            >
              <template v-slot:error>
                <div v-for="error of v$.accesorios.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Tabla de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              :quieroSubirArchivos="btnSubirArchivos"
              label="Quiero compartir archivos e imagenes del vehículo"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idRegistro"
            >
              <template #boton-subir>
                <q-btn
                  v-if="false"
                  color="positive"
                  push
                  no-caps
                  class="full-width q-mb-lg"
                  @click="subirArchivos()"
                >
                  <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                  Subir archivos seleccionados</q-btn
                >
              </template>
            </gestor-archivos>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./TransferenciaVehiculoPage.ts" />
