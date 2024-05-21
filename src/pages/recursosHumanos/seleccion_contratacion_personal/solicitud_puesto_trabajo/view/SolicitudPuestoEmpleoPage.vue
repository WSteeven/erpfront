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
          <div class="col-12 col-md-4" v-if="solicitudPuestoEmpleo.tipo_puesto === tipo_puesto.nuevo">
            <label class="q-mb-sm block">Nombre del Puesto</label>
            <q-input
              v-model="solicitudPuestoEmpleo.nombre"
              @blur="v$.nombre.$touch"

              @update:model-value="
                (v) => (solicitudPuestoEmpleo.nombre = removeAccents(v))
              "
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
                    <!-- Caqrgos -->
                    <div class="col-12 col-md-4 col-sm-3"  v-if="solicitudPuestoEmpleo.tipo_puesto !== tipo_puesto.nuevo">
            <label class="q-mb-sm block">Cargos</label>
            <q-select
              v-model="solicitudPuestoEmpleo.puesto"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Tipos de Puestos de Trabajo-->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Tipo de Puesto</label>
            <q-select
              v-model="solicitudPuestoEmpleo.tipo_puesto"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Autorización -->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Autorización</label>
            <q-select
              v-model="solicitudPuestoEmpleo.autorizacion"
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
                  <q-item-section class="text-grey"> No hay resultados </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Descripcion de vacante -->
          <div class="col-12 col-md-9">
            <div class="row justify-between">
              <label class="q-mb-sm block">Descripción de Vacante</label>
              <b class="text-italic">*No enviar imágenes demasiado grandes</b>
            </div>
            <essential-editor
              v-model="solicitudPuestoEmpleo.descripcion_vacante"
              :disable="disabled"
              @blur="v$.descripcion_vacante.$touch"
              :error="!!v$.descripcion_vacante.$errors.length"

            >
            <template v-slot:error>
                <div v-for="error of v$.descripcion_vacante.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </essential-editor>
            <div
              v-for="error of v$.descripcion_vacante.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>
          <div class="col-12 col-md-3 col-sm-12">
            <q-btn
              color="primary"
              @click="agregarDiscapacidad()"
              class="col-12 col-md-3 full-width"
              >Agregar conocimiento</q-btn
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasConocimientoReactive,
                accionesTabla,
              ]"
              :datos="solicitudPuestoEmpleo.conocimientos"
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
              :datos="solicitudPuestoEmpleo.formaciones_academicas"
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
              v-model="solicitudPuestoEmpleo.anios_experiencia"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              @blur="v$.anios_experiencia.$touch"
              :error="!!v$.anios_experiencia.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.anios_experiencia.$errors" :key="error.$uid">
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
