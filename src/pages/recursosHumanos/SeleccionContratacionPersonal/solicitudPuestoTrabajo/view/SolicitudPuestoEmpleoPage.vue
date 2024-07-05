<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div
            class="col-12 col-md-4"
            v-if="solicitud.tipo_puesto === tipo_puesto.nuevo"
          >
            <label class="q-mb-sm block">Nombre del Puesto</label>
            <q-input
              v-model="solicitud.nombre"
              @blur="v$.nombre.$touch"
              @update:model-value="(v) => (solicitud.nombre = removeAccents(v))"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tipos de Puestos de Trabajo-->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Tipo de Puesto</label>
            <q-select
              v-model="solicitud.tipo_puesto"
              :options="tipos_puestos_trabajo"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @blur="v$.tipo_puesto.$touch"
              @update:model-value="cambiarTipoPuesto()"
              :error="!!v$.tipo_puesto.$errors.length"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo_puesto.$errors" :key="error.$uid">
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
          <!-- Cargos -->
          <div
            class="col-12 col-md-4 col-sm-3"
            v-if="solicitud.tipo_puesto !== tipo_puesto.nuevo"
          >
            <label class="q-mb-sm block">Cargos</label>
            <q-select
              v-model="solicitud.puesto"
              :options="cargos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @blur="v$.puesto.$touch"
              @filter="filtrarCargos"
              :error="!!v$.puesto.$errors.length"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.puesto.$errors" :key="error.$uid">
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
          <!-- Autorización -->
          <div
            class="col-12 col-md-4 col-sm-3"
            v-if="
              authenticationStore.can('puede.autorizar.solicitud_puesto_empleo')
            "
          >
            <label class="q-mb-sm block">Autorización</label>
            <q-select
              v-model="solicitud.autorizacion"
              :options="autorizaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @blur="v$.autorizacion.$touch"
              :error="!!v$.autorizacion.$errors.length"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.autorizacion.$errors" :key="error.$uid">
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
          {{ v$.$errors }}
          <!-- Descripcion de vacante -->
          <div class="col-12 col-md-12">
            <essential-editor
              :value="solicitud.descripcion"
              :disable="disabled"
              label="Descripción de la vacante"
              :v="v$"
              v_error_key="descripcion"
              :error="!!v$.descripcion.$errors.length"
            />
            <div
              v-for="error of v$.descripcion.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>
          <div class="col-12 col-md-3 col-sm-12">
            <q-btn
              color="primary"
              @click="agregarConocimiento()"
              class="col-12 col-md-3 full-width"
              >Agregar conocimiento</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasConocimientoReactive,
                accionesTabla,
              ]"
              :datos="solicitud.conocimientos"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :grid="false"
              :accion1="btnEliminarPuestoEmpleo"
              :alto-fijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
          </div>
          <div class="col-12 col-md-3 col-sm-12">
            <q-btn
              color="primary"
              @click="agregarFormacionAcademica()"
              class="col-12 col-md-3 full-width"
              >Agregar Titulo Academico</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasFormacionAcademicaReactive,
                accionesTabla,
              ]"
              :datos="solicitud.formaciones_academicas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :grid="false"
              :accion1="btnEliminarFormacionAcademica"
              :alto-fijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
          </div>
          <!-- años de experiencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Años de Experiencia</label>
            <q-input
              v-model="solicitud.anios_experiencia"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              @blur="v$.anios_experiencia.$touch"
              :error="!!v$.anios_experiencia.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.anios_experiencia.$errors"
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
  </tab-layout>
</template>

<script src="./SolicitudPuestoEmpleoPage.ts"></script>
