<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Solicitud de Personal"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
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

          <!-- Cargo -->
          <div
            class="col-12 col-md-4 col-sm-3"
            v-if="solicitud.tipo_puesto !== tipo_puesto.nuevo"
          >
            <label-abrir-modal
              v-if="accion == acciones.nuevo || accion == acciones.editar"
              label="Cargo"
              @click="modales.abrirModalEntidad('CargoPage')"
            />
            <label v-else class="q-mb-sm block">Cargo</label>
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
            v-if="store.can('puede.autorizar.solicitud_puesto_empleo')"
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

          <!-- {{ v$.$errors }} -->

          <!-- Descripcion de vacante -->
          <div class="col-12">
            <div class="row justify-between">
              <label class="q-mb-sm block">Descripción</label>
              <b class="text-italic">*No enviar imágenes demasiado grandes</b>
            </div>
            <essential-editor
              v-model="solicitud.descripcion"
              :disable="disabled"
            />
            <div
              v-for="error of v$.descripcion.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>
          <!-- areas de conocimiento -->
          <div class="col-12 col-md-3" v-if="solicitud.requiere_experiencia">
            <label class="q-mb-sm block">Conocimiento</label>
            <q-select
              v-model="solicitud.areas_conocimiento"
              options-dense
              hint="Selecciona o ingresa uno o varios ítems"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              input-debounce="0"
              @new-value="crearAreaConocimiento"
              :options="areasConocimiento"
              @filter="filtrarAreasConocimiento"
            >
            </q-select>
          </div>
          <div class="col-12 col-md-3 col-sm-12" v-if="false">
            <q-btn
              color="positive"
              @click="agregarConocimiento()"
              class="col-12 col-md-3 q-mb-sm"
              no-caps
              icon="bi-plus"
              push
              >Agregar Conocimiento</q-btn
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
              color="positive"
              @click="agregarFormacionAcademica()"
              no-caps
              icon="bi-plus"
              push
              class="col-12 col-md-3 q-mb-sm"
              >Agregar Titulo Académico</q-btn
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
          <!-- Estado -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Requiere experiencia</label>
            <q-toggle
              :label="solicitud.requiere_experiencia ? 'SI' : 'NO'"
              v-model="solicitud.requiere_experiencia"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
          <!-- años de experiencia -->
          <div class="col-12 col-md-3" v-if="solicitud.requiere_experiencia">
            <label class="q-mb-sm block">Años de Experiencia</label>
            <q-select
              v-model="solicitud.anios_experiencia"
              options-dense
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              :error="!!v$.anios_experiencia.$errors.length"
              input-debounce="0"
              :options="anios_experiencia"
              @filter="filtrarAniosExperiencia"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.anios_experiencia.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
  <modal-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modal-entidad>
</template>

<script src="./SolicitudPuestoEmpleoPage.ts"></script>
