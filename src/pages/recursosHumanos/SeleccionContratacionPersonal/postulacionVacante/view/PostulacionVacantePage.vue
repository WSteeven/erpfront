<template>
  <simple-layout forzarGuardar :mixin="mixin">
    <template #formulario>
      <div class="text-subtitle2">
        Completa el formulario para continuar con la postulación
      </div>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Datos personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Nombres -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Nombres </label>
            <q-input
              v-model="postulacion.nombres"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- Apellidos -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Apellidos </label>
            <q-input
              v-model="postulacion.apellidos"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- Tipo de Identificacion -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Tipo de Identificacion</label>
            <q-select
              v-model="postulacion.tipo_identificacion"
              :options="tiposDocumentosIdentificaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :error="!!v$.tipo_identificacion.$errors.length"
              :option-value="v => v.value"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.tipo_identificacion.$errors"
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

          <!-- Identificación -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Identificación </label>
            <q-input
              v-model="postulacion.identificacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
              autogrow
            >
            </q-input>
          </div>

          <!-- correo -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Correo Personal</label>
            <q-input
              type="email"
              v-model="postulacion.correo_personal"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.correo_personal.$errors.length"
              @blur="v$.correo_personal.$touch"
              @update:model-value="
                v => (postulacion.correo_personal = v.toLowerCase())
              "
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.correo_personal.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Telefono -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              type="tel"
              v-model="postulacion.telefono"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.telefono.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Genero -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Sexo asignado al nacer</label>
            <q-toggle
              :label="postulacion.genero == 'M' ? 'Masculino' : 'Femenino'"
              v-model="postulacion.genero"
              true-value="M"
              false-value="F"
              color="primary"
              keep-color
              indeterminate-icon="fa fa-user"
              checked-icon="fa fa-male"
              unchecked-icon="fa fa-female"
              :disable="disabled"
            />
          </div>

          <!-- Identidad de genero -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Identidad de Género</label>
            <q-select
              v-model="postulacion.identidad_genero"
              :options="identidades"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              :error="!!v$.identidad_genero.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.identidad_genero.$errors"
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

          <!-- Nacionalidad -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Nacionalidad</label>
            <q-select
              v-model="postulacion.pais"
              :options="paises"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              :input-debounce="0"
              @filter="filtrarPaises"
              :error="!!v$.pais.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.pais.$errors" :key="error.$uid">
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

          <!-- Pais de residencia -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">País de Residencia</label>
            <q-select
              v-model="postulacion.pais_residencia"
              :options="paises"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              :input-debounce="0"
              @filter="filtrarPaises"
              :error="!!v$.pais_residencia.$errors.length"
              :option-value="v => v.id"
              :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.pais_residencia.$errors"
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

          <!-- documentos en regla -->
          <div
            class="col-md-3 col-sm-6 col-xs-12"
            v-if="postulacion.pais != postulacion.pais_residencia"
          >
            <q-checkbox
              class="q-mt-sm q-pt-md"
              v-model="postulacion.tengo_documentos_regla"
              label="¿Tengo documentos habilitantes para trabajar en este país?"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Fecha nacimiento -->
          <div class="col-md-3 col-sm-6 col-xs-12">
            <label class="q-mb-sm block">Fecha de nacimiento</label>
            <q-input
              v-model="postulacion.fecha_nacimiento"
              placeholder="Obligatorio"
              :error="!!v$.fecha_nacimiento.$errors.length"
              @blur="v$.fecha_nacimiento.$touch"
              :disable="disabled"
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
                      v-model="postulacion.fecha_nacimiento"
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
                  style="clear: inherit"
                  v-for="error of v$.fecha_nacimiento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Dirección  -->
          <div class="col-md-4 col-sm-12 col-xs-12">
            <label class="q-mb-sm block">Dirección </label>
            <q-input
              v-model="postulacion.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              autogrow
              :error="!!v$.direccion.$errors.length"
              @blur="v$.direccion.$touch"
            >
              <template v-slot:error>
                <div
                  style="clear: inherit"
                  v-for="error of v$.direccion.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Información adicional"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-pa-md">
          <div class="col-12">
            Puedes seleccionar un CV de los que ya tienes registrados o subir
            uno nuevo
            <q-btn-toggle
              v-model="quieroSubirCV"
              class="toggle-button-primary"
              :disable="disabled"
              spread
              no-caps
              rounded
              toggle-color="primary"
              unelevated
              :options="[
                {
                  label: 'Utilizar un Currículum Vitae ya subido',
                  value: false
                },
                {
                  label: 'Quiero subir mi Currículum Vitae',
                  value: true
                }
              ]"
            />
          </div>
          <div class="col-12" v-if="!quieroSubirCV">
            <essential-table
              :titulo="`Tienes ${listadoCurriculumnsUsuario.length} curriculums registrados`"
              ref="refArchivoUsuario"
              @selected="seleccionarArchivo"
              tipo-seleccion="single"
              :configuracionColumnas="columnas"
              :datos="listadoCurriculumnsUsuario"
              ajustarCeldas
              :alto-fijo="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrar-botones="false"
              :permitir-buscar="false"
              :accion1="btnDescargarCurriculumUsuario"
              :accion2="btnEliminarCurriculumUsuario"
            ></essential-table>
          </div>
          <div class="col-12" v-if="quieroSubirCV">
            <!-- Solo se admiten pdfs -->
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar Currículum Vitae u Hoja de Vida"
              :mixin="mixin"
              :disable="disabled"
              :quieroSubirArchivos="accion == acciones.nuevo"
              formato=".pdf"
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

          <div class="col-12">
            <label class="q-mb-sm block"
              >Comentanos brevemente tu experiencia en el rol (<strong>{{
                vacante.nombre
              }}</strong
              >) al que estas postulando
            </label>
            <q-input
              type="textarea"
              v-model="postulacion.mi_experiencia"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              autogrow
              :error="!!v$.mi_experiencia.$errors.length"
              @blur="v$.mi_experiencia.$touch"
            >
              <template v-slot:error>
                <div
                  style="clear: inherit"
                  v-for="error of v$.mi_experiencia.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-py-md text-subtitle1 text-bold">
            Por favor, a continuación, marca la casilla si cumples con los
            siguientes requisitos:
          </div>
          <!-- Tengo Experiencia -->
          <div class="row col-12" v-if="vacante.anios_experiencia !== null">
            <!-- <strong
              >Tengo mínimo {{ vacante.anios_experiencia?.toLowerCase() }} de
              experiencia
            </strong> -->
            <div class="col-md-6 col-xs-12">
              Tengo mínimo {{ vacante.anios_experiencia?.toLowerCase() }} de
              experiencia en un cargo similar?
            </div>
            <div class="col-md-6 col-xs-12">
              <option-group-component
                v-model="postulacion.tengo_experiencia_requerida"
                :disable="disabled"
              />
            </div>
          </div>
          <!-- Tengo Disponibilidad de viajar -->
          <div class="row col-12" v-if="vacante.disponibilidad_viajar">
            <div class="col-md-6 col-xs-12">
              Tengo disponibilidad de viajar fuera de la provincia cuando sea
              requerido?
            </div>
            <div class="col-md-6 col-xs-12">
              <option-group-component
                v-model="postulacion.tengo_disponibilidad_viajar"
                :disable="disabled"
              />
            </div>
          </div>
          <!-- Tengo Licencia de conducir -->
          <div
            class="row col-12 q-col-gutter-sm q-pa-xs q-my-xs border-grey rounded-4"
            v-if="vacante.requiere_licencia"
          >
            <div class="col col-md-6 col-xs-12">
              <!-- <strong>Poseo licencia de conducir vigente?:</strong> -->
              Poseo licencia de conducir vigente?
              <option-group-component
                v-model="postulacion.tengo_licencia_conducir"
                :disable="disabled"
              />
            </div>
            <!--Tipo de Licencia -->
            <div
              class="col col-md-6 col-xs-12"
              v-if="postulacion.tengo_licencia_conducir"
            >
              <label class="q-mb-sm block"
                >Selecciona tus tipos de Licencia vigentes</label
              >
              <q-select
                v-model="postulacion.tipo_licencia"
                :options="tiposLicencias"
                transition-show="jump-up"
                transition-hide="jump-down"
                hint="Obligatorio"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-chips
                multiple
                :error="!!v$.tipo_licencia.$errors.length"
                error-message="Debes seleccionar un tipo de licencia"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label
                        ><strong>{{ opt.label }}</strong> -
                        {{ opt.caption }}</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle
                        :model-value="selected"
                        @update:model-value="toggleOption(opt)"
                      />
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:error>
                  <div
                    v-for="error of v$.tipo_licencia.$errors"
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
          </div>

          <div
            class="row col-12 q-col-gutter-sm q-pa-xs q-my-xs border-grey rounded-4"
          >
            <div class="col-md-6 col-xs-12">
              El cargo requiere tener conocimientos en:
              <q-chip
                v-for="conocimiento of vacante.areas_conocimiento"
                :key="conocimiento"
              >
                {{ conocimiento }}
              </q-chip>
            </div>
            <div class="col-md-6 col-xs-12">
              <!-- <strong>Tengo los conocimientos requeridos?</strong> -->
              Tengo los conocimientos requeridos?
              <option-group-component
                v-model="postulacion.tengo_conocimientos_requeridos"
                :disable="disabled"
              />
            </div>
          </div>
          <div
            class="row col-12 q-col-gutter-sm q-pa-xs q-my-xs border-grey rounded-4"
            v-if="vacante.requiere_formacion_academica"
          >
            <div class="col-md-6 col-sm-12 col-xs-12">
              El cargo requiere tener cierta formación académica:
              <div
                v-for="formacion of vacante.formaciones_academicas"
                :key="formacion.id"
              >
                <q-chip
                  :class="{ 'truncate-chip-labels': truncateChips }"
                  :label="
                    formacion.nivel +
                    ' - ' +
                    formacion.nombre +
                    ' O EQUIVALENTE'
                  "
                  :title="
                    formacion.nivel +
                    ' - ' +
                    formacion.nombre +
                    ' O EQUIVALENTE'
                  "
                >
                  <q-tooltip>
                    {{ formacion.nivel }} - {{ formacion.nombre }} O EQUIVALENTE
                  </q-tooltip>
                </q-chip>
              </div>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12">
              <!-- <strong>Tengo la formación académica requerida?</strong> -->
              Tengo la formación académica requerida?
              <option-group-component
                v-model="postulacion.tengo_formacion_academica_requerida"
                :disable="disabled"
              />
            </div>
          </div>
        </div>
      </q-expansion-item>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Referencias Personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-12">
            <label class="q-mb-sm block">
              <strong style="color: red">*</strong> Es recomendable que
              registres <strong>3 referencias </strong> personales o laborales
            </label>
            <!-- <label>
              También puedes subir tus referencias en
              <strong>formato PDF</strong></label
            > -->
            <essential-table
              :configuracionColumnas="configuracionColumnasReferencias"
              :datos="postulacion.referencias"
              ajustarCeldas
              :permitirConsultar="false"
              :permitirEditarCeldas="true"
              :permitirEditar="false"
              :permitirEliminar="false"
              :altoFijo="false"
              :accion1Header="btnAgregarReferencia"
              :accion1="btnEliminar"
              :mostrarFooter="false"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>
    </template>
  </simple-layout>
  <!-- </q-card-section>
    </template>
  </basic-container> -->
</template>
<script src="./PostulacionVacantePage.ts" />

<style lang="sass" scoped>
.truncate-chip-labels > .q-chip
  max-width: 40px
</style>
