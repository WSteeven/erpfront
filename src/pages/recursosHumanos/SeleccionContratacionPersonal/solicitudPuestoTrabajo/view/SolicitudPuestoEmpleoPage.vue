<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Solicitud de Personal"
    :tab-options="tabOptionsSolicitudesPersonal"
    :filtrar="filtrarSolicitudes"
    :permitirEditar="tabActual =='1'"
    :tabDefecto="tabActual"
    ajustarCeldas
    :accion1="btnPublicar"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tipos de Puestos de Trabajo-->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Tipo de Puesto</label>
            <q-select
              v-model="solicitud.tipo_puesto"
              :options="tiposPuestos"
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
          <div class="col-12 col-md-4">
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
          <div class="col-12 col-md-4 col-sm-3">
            <label-abrir-modal
              v-if="accion == acciones.nuevo || accion == acciones.editar"
              label="Cargo"
              @click="modales.abrirModalEntidad('CargoPage')"
            />
            <label v-else class="q-mb-sm block">Cargo</label>
            <q-select
              v-model="solicitud.cargo"
              :options="cargos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @blur="v$.cargo.$touch"
              @filter="filtrarCargos"
              @update:model-value="consultarConocimientos"
              :error="!!v$.cargo.$errors.length"
              :option-value="(v) => v.id"
              :option-label="(v) => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.cargo.$errors" :key="error.$uid">
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
            v-if="store.can('puede.autorizar.rrhh_solicitudes_nuevas_vacantes')"
          >
            <label
              color="light-green-2"
              class="text-positive text-bold q-mb-sm inline-block bg-light-green-2 rounded q-px-md"
              >Autorización</label
            >
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
          <div class="col-12 col-md-6 col-sm-6">
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
              :error="!!v$.areas_conocimiento.$errors.length"
              :option-label="(item) => item?.nombre"
              :option-value="(item) => item?.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section
                    class="text-grey"
                    v-if="solicitud.cargo == null"
                  >
                    Selecciona un cargo
                  </q-item-section>
                  <q-item-section class="text-grey" v-else>
                    Escribe un conocimiento y presiona enter
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <div
                  v-for="error of v$.areas_conocimiento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Requiere formacion academica -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Requiere formación académica</label>
            <q-toggle
              :label="solicitud.requiere_formacion_academica ? 'SI' : 'NO'"
              v-model="solicitud.requiere_formacion_academica"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
              @update:model-value="checkRequiereFormacionAcademica"
            />
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
              @update:model-value="checkRequiereExperiencia"
            />
          </div>

          <!-- {{ v$.$errors }} -->
          <div
            class="col-12 col-md-6 col-sm-12"
            v-if="solicitud.requiere_formacion_academica"
          >
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
              :disable="disabled"
              :grid="false"
              :accion1="btnEliminarFormacionAcademica"
              :alto-fijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
            <div
              v-for="error of v$.formaciones_academicas.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>Ingresa al menos un título académico</small>
            </div>
          </div>

          <!-- años de experiencia -->
          <div class="col-12 col-md-3" v-if="solicitud.requiere_experiencia">
            <label class="q-mb-sm block">Tiempo de experiencia en el mismo cargo</label>
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

          <!-- Manejo de archivos -->
          <div
            class="col-12 q-mb-md"
            v-if="solicitud.tipo_puesto == tipo_puesto.nuevo"
          >
            <!-- formato=".pdf, .doc,.docx" -->
            <gestor-archivos
              ref="refArchivo"
              label="Manual de funciones"
              :mixin="mixin"
              :disable="disabled"
              :quieroSubirArchivos="accion == acciones.nuevo"
              formato=".pdf,.docx,.docx"
              :maxFiles="1"
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
  <modal-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modal-entidad>
</template>

<script src="./SolicitudPuestoEmpleoPage.ts" />
