<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Publicación de Vacante"
    :tab-options="tabOptions"
    :filtrar="filtrarVacantes"
    :tabDefecto="tabActual"
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del Puesto</label>
            <q-input
              v-model="vacante.nombre"
              @update:model-value="(v) => (vacante.nombre = removeAccents(v))"
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
          <!-- Imagen de referencia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Imagen de Referencia</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              placeholder="Opcional"
              :imagen="vacante.imagen_referencia"
              :error="!!v$.imagen_referencia.$errors.length"
              alto="200px"
              @update:modelValue="(data) => (vacante.imagen_referencia = data)"
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.imagen_referencia.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </selector-imagen>
          </div>
          <!-- Publicidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Publicidad</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              placeholder="Opcional"
              :imagen="vacante.imagen_publicidad"
              :error="!!v$.imagen_publicidad.$errors.length"
              alto="200px"
              @update:modelValue="(data) => (vacante.imagen_publicidad = data)"
            />
          </div>

          <!--Canton -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Ciudad</label>
            <q-select
              v-model="vacante.canton"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarCantones"
              :option-value="v => v.id"
              :option-label="v => v.canton"
              :error="!!v$.canton.$errors.length"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.canton }}</q-item-label>
                    <q-item-label caption
                      >Provincia {{ scope.opt.provincia }}</q-item-label
                    >
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

          <!-- num_plazas -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cant. Plazas</label>
            <q-input
              v-model="vacante.num_plazas"
              type="number"
              @blur="v$.num_plazas.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.num_plazas.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.num_plazas.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Numero de Postulantes -->
          <div class="col-12 col-md-3" v-if="accion!==acciones.nuevo">
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
            <label class="q-mb-sm block"
              >Fecha de Caducidad de Publicación</label
            >
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
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="vacante.fecha_caducidad"
                      :mask="maskFecha"
                      :options="optionsFechaCaducidad"
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
                  v-for="error of v$.fecha_caducidad.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Publicación activa -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">¿Publicación activa?</label>
            <q-toggle
              :label="vacante.activo ? 'SI' : 'NO'"
              v-model="vacante.activo"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
              @update:model-value="checkRequiereFormacionAcademica"
            />
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
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
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
            <essential-editor v-model="vacante.descripcion" :disable="disabled">
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
              :label="vacante.requiere_formacion_academica ? 'SI' : 'NO'"
              v-model="vacante.requiere_formacion_academica"
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
              :label="vacante.requiere_experiencia ? 'SI' : 'NO'"
              v-model="vacante.requiere_experiencia"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
              @update:model-value="checkRequiereExperiencia"
            />
          </div>


          <div class="col-12 col-md-6 col-sm-12" v-if="vacante.requiere_formacion_academica">
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
              :accion1="btnEliminarFormacionAcademica"
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

          <!-- Modalidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modalidad</label>
            <q-select
              v-model="vacante.modalidad"
              :options="modalidades"
              options-dense
              dense
              outlined
              use-chips
              :disable="disabled"
              :error="!!v$.modalidad.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <!-- @filter="filtrarModalidades" -->
              <template v-slot:error>
                <div v-for="error of v$.modalidad.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Disponibilidad de viajar -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">¿Disponibilidad de Viajar?</label>
            <q-toggle
              :label="vacante.disponibilidad_viajar ? 'SI' : 'NO'"
              v-model="vacante.disponibilidad_viajar"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- Posee licencia -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block"
              >¿Debe poseer licencia de conducir?</label
            >
            <q-toggle
              :label="vacante.requiere_licencia ? 'SI' : 'NO'"
              v-model="vacante.requiere_licencia"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- {{v$.$errors}} -->

        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./VacantePage.ts" />
