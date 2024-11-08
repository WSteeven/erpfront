<script src="./VacacionPage.ts" />

<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    ajustar-celdas
    :tab-defecto="tabDefecto"
    :permitir-editar="tabDefecto == 'PENDIENTES'"
    :filtrar="filtrar"
    :tab-options="tabOptions"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Jefe -->
          <div class="col-12 col-md-3 q-mb-md col-sm-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="vacacion.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              disable
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
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

          <!-- Fecha Ingreso -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Fecha de Ingreso</label>
            <q-input
              v-model="vacacion.fecha_ingreso"
              disable
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
                      v-model="vacacion.fecha_ingreso"
                      :mask="maskFecha"
                      today-btn
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Dias de vacaciones -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Días de Vacaciones</label>
            <q-input v-model="vacacion.dias" disable readonly outlined dense>
            </q-input>
          </div>

          <!--Periodos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Periodo</label>
            <q-select
              v-model="vacacion.periodo"
              :options="periodos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              disable
              :error="!!v$.periodo.$errors.length"
              error-message="Debes seleccionar un periodo"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.periodo.$errors" :key="error.$uid">
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

          <!-- Dias tomados -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Días Tomados</label>
            <q-input
              type="number"
              v-model="vacacion.dias_tomados"
              disable
              readonly
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Dias disponibles -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Días Disponibles</label>
            <q-input
              type="number"
              v-model="vacacion.dias_disponibles"
              disable
              readonly
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Completadas -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Vacaciones Tomadas</label>
            <q-toggle
              :label="vacacion.completadas ? 'SI' : 'NO'"
              v-model="vacacion.completadas"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              disable
            />
          </div>

          <!-- Completadas -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Optó por cobrar vacaciones</label>
            <q-toggle
              :label="vacacion.opto_pago ? 'SI' : 'NO'"
              v-model="vacacion.opto_pago"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              @update:model-value="checkOptoPago"
              :disable="disabled"
            />
          </div>
          <div class="col-12" v-if="accion !== acciones.nuevo">
            <essential-table
              titulo="Registro de días de vacaciones tomados"
              :datos="vacacion.detalles"
              :configuracion-columnas="
                accion === acciones.editar
                  ? [...configuracionColumnasDetallesVacacion, accionesTabla]
                  : configuracionColumnasDetallesVacacion
              "
              :accion1-header="btnAgregarDetalle"
              :alto-fijo="false"
              ajustar-celdas
              :permitir-consultar="false"
              :permitir-editar="false"
              :permitir-eliminar="false"
              :accion1="btnEditarDetalle"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="guardado"
  />
</template>
