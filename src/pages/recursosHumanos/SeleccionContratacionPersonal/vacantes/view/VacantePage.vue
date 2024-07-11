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
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del Puesto</label>
            <q-input
              v-model="vacante.nombre"
              @update:model-value="
                (v) => (vacante.nombre = removeAccents(v))
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
          <!-- Tipos de Puestos de Trabajo-->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Tipo de Puesto</label>
            <q-select
              v-model="vacante.tipo_puesto"
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
          <!-- Imagen de referencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Imagen de Referencia</label>
            <imagen-comprimida-component
              :imagen="vacante.imagen_referencia"
              file_extensiones=".jpg, image/*"
              @update:modelValue="
                (data) => (vacante.imagen_referencia = data)
              "
            >
              <template v-slot:error>
                <div v-for="error of v$.imagen_referencia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </imagen-comprimida-component>
          </div>
          <!-- Publicidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Publicidad</label>
            <imagen-comprimida-component
              :imagen="vacante.publicidad"
              file_extensiones=".jpg, image/*"
              @update:modelValue="(data) => (vacante.publicidad = data)"
            >
              <template v-slot:error>
                <div v-for="error of v$.publicidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </imagen-comprimida-component>
          </div>

          <!-- Numero de Postulantes -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Número de Postulantes</label>
            <q-input
              v-model="vacante.numero_postulantes"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>


          <!-- Fecha de caducidad Publicación-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de Caducidad de Publicación</label>
            <q-input
              v-model="vacante.fecha_caducidad"
              placeholder="Obligatorio"
              :error="!!v$.fecha_caducidad.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.fecha_caducidad.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="vacante.fecha_caducidad"
                      :mask="maskFecha"
                      :options="optionsFechaCaducidad"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_viat.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Manejo de archivos -->
          <div class="col-12 col-md-6 q-mb-md" v-if="false">
            <gestor-archivos
              ref="refArchivo"
              label="Manual de Funciones "
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              quieroSubirArchivos
              :permitir-eliminar="accion == acciones.nuevo || accion == acciones.editar"
              :idModelo="1"
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
          <!-- Descripcion de vacante -->
          <div class="col-12 col-md-12">
            <div class="row justify-between">
              <label class="q-mb-sm block">Descripción de Vacante</label>
              <b class="text-italic">*No enviar imágenes demasiado grandes</b>
            </div>
            <essential-editor
              v-model="vacante.descripcion"
              :disable="disabled"
            >
            </essential-editor>
            <div
              v-for="error of v$.descripcion.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>
          
          <!-- areas de conocimiento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Conocimiento</label>
            <q-select
              v-model="vacante.areas_conocimiento"
              options-dense
              hint="Selecciona o ingresa uno o varios ítems"
              :disable="disabled"
              dense
              outlined
              use-input
              use-chips
              multiple
              input-debounce="0"
              :options="areasConocimiento"
              @filter="filtrarAreasConocimiento"
              :error="!!v$.conocimientos.$errors.length"
              :option-label="(item) => item?.nombre"
              :option-value="(item) => item?.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section
                    class="text-grey"
                    v-if="vacante.cargo == null"
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
                  v-for="error of v$.conocimientos.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6 col-sm-12">
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
              :datos="vacante.formaciones_academicas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :grid="false"
              @eliminar="btnEliminarFormacionAcademica"
              :alto-fijo="false"
              :ajustarCeldas="true"
            >
            </essential-table>
          </div>
          
          <!-- años de experiencia -->
          <div class="col-12 col-md-3" v-if="vacante.requiere_experiencia">
            <label class="q-mb-sm block">Tiempo de Experiencia</label>
            <q-select
              v-model="vacante.anios_experiencia"
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
</template>


<script src="./VacantePage.ts" />
