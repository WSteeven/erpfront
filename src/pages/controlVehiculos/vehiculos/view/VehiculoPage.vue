<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :ajustarCeldas="true"
    titulo-pagina="Combustibles"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipo de vehiculo -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Categoria</label>
            <q-select
              v-model="vehiculo.tipo"
              :options="tiposCategoriasVehiculos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo.$errors.length"
              :option-label="(item) => item.value"
              :option-value="(item) => item.value"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div v-for="error of v$.tipo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Propietario -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Propietario</label>
            <q-input
              v-model="vehiculo.propietario"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.propietario.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.propietario.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          
          <!-- Marca -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Marca</label>
            <q-select
              v-model="vehiculo.marca"
              :options="marcas"
              hint="Agregue elementos desde el panel de marcas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarMarcas"
              @update:model-value="seleccionarModelo"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Modelo -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Modelo</label>
            <q-select
              v-model="vehiculo.modelo"
              :options="modelos"
              hint="Agregue elementos desde el panel de modelos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.modelo.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtrarModelos"
              @update:model-value="seleccionarMarca"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.modelo.$errors" :key="error.$uid">
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
          <!-- Combustible -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Tipo de combustible</label>
            <q-select
              v-model="vehiculo.combustible"
              :options="combustibles"
              hint="Agregue elementos desde el panel de combustibles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.combustible.$errors.length"
              use-input
              input-debounce="0"
              @filter="filtrarCombustibles"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.combustible.$errors" :key="error.$uid">
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
          <!-- Tracción -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Tracción</label>
            <q-select
              v-model="vehiculo.traccion"
              :options="opciones_traccion_vehiculos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.traccion.$errors.length"
              :option-label="(item) => item.label"
              :option-value="(item) => item.value"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.traccion.$errors" :key="error.$uid">
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
          <!-- placa -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Placa</label>
            <q-input
              v-model="vehiculo.placa"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.placa.$errors.length"
              error-message="Debe ingresar un numero de placa válido"
              mask="XXX-##X#"
              fill-mask
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.placa.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- num_chasis -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">N° Chasis</label>
            <q-input
              v-model="vehiculo.num_chasis"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.num_chasis.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_chasis.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- num_motor -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">N° Motor</label>
            <q-input
              v-model="vehiculo.num_motor"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.num_motor.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_motor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo de vehiculo -->
          <div class="col-12 col-md-3 col-sm-6 q-mb-md">
            <label class="q-mb-sm block">Tipo de Vehículo</label>
            <q-select
              v-model="vehiculo.tipo_vehiculo"
              :options="tiposVehiculos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarTiposVehiculos"
              :error="!!v$.tipo_vehiculo.$errors.length"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_vehiculo.$errors"
                  :key="error.$uid"
                >
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
          <!-- año -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Año de fabricación</label>
            <q-input
              type="number"
              v-model="vehiculo.anio_fabricacion"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.anio_fabricacion.$errors.length"
              error-message="Debe ingresar un año válido"
              @blur="v$.anio_fabricacion.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.anio_fabricacion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- cilindraje -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Cilindraje (cc)</label>
            <q-input
              type="number"
              v-model="vehiculo.cilindraje"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.cilindraje.$errors.length"
              error-message="Debe ingresar máx 4 dígitos"
              @blur="v$.cilindraje.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.cilindraje.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- rendimiento -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Rendimiento (km/gl)</label>
            <q-input
              type="number"
              v-model="vehiculo.rendimiento"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.rendimiento.$errors.length"
              error-message="Debe ingresar máx 2 dígitos"
              @blur="v$.rendimiento.$touch"
              outlined
              dense
              ><template v-slot:error>
                <div v-for="error of v$.rendimiento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- capacidad tanque-->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Capacidad tanque (gl)</label>
            <q-input
              v-model="vehiculo.capacidad_tanque"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              error-message="Ingrese la capacidad del tanque de combustible"
              mask="##.##"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- capacidad tanque-->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Color</label>
            <q-input
              v-model="vehiculo.color"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              error-message="Ingrese el color del vehiculo"
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- aire acondicionado -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Tiene aire acondicionado</label>
            <q-toggle
              :label="vehiculo.aire_acondicionado ? 'SI' : 'NO'"
              v-model="vehiculo.aire_acondicionado"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Seguro vehicular -->
          <div class="col-12 col-md-3 col-sm-6">
            <label-abrir-modal
              v-if="
                (mostrarLabelModal && store.esAdministradorVehiculos) || true
              "
              label="Seguro"
              @click="modales.abrirModalEntidad('SeguroVehicularPage')"
            />
            <label v-else class="q-mb-sm block">Seguro</label>
            <q-select
              v-model="vehiculo.seguro"
              :options="seguros"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarSeguros"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre + ' - ' + v.num_poliza"
              emit-value
              map-options
            >
              <template v-slot:after>
                <q-btn color="positive" @click="recargarSeguros">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
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

          <!-- tiene rastreo -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Tiene rastreo</label>
            <q-toggle
              :label="vehiculo.tiene_rastreo ? 'SI' : 'NO'"
              v-model="vehiculo.tiene_rastreo"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- tiene gravamen -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">¿Está prendado?</label>
            <q-toggle
              :label="vehiculo.tiene_gravamen ? 'SI' : 'NO'"
              v-model="vehiculo.tiene_gravamen"
              @update:model-value="
                () =>
                  (vehiculo.prendador = vehiculo.tiene_gravamen
                    ? vehiculo.prendador
                    : null)
              "
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- prendador -->
          <div class="col-12 col-md-3 col-sm-6" v-if="vehiculo.tiene_gravamen">
            <label class="q-mb-sm block">Prendador</label>
            <q-input
              v-model="vehiculo.prendador"
              placeholder="Obligatorio"
              :disable="disabled"
              hint="Ingrese la institución o empresa propietaria del vehículo"
              :error="!!v$.prendador.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.prendador.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Fotografías y Documentación del Vehículo"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idVehiculo"
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
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modales-entidad>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./VehiculoPage.ts"></script>
