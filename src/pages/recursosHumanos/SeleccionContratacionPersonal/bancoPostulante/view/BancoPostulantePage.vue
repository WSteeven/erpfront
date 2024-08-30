<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Banco de Candidatos"
    :tab-options="tabOptions"
    ajustarCeldas
    :tabDefecto="tabActual"
    :filtrar="filtrarCandidatos"
    :permitirEditar="false"
    :permitirEliminar="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
          label="Datos del Candidato"
          header-class="text-bold bg-desenfoque text-primary"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Nombres -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Nombres </label>
              <q-input v-model="banco.nombres" disable outlined dense autogrow>
              </q-input>
            </div>

            <!-- Apellidos -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Apellidos </label>
              <q-input
                v-model="banco.apellidos"
                disable
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
                v-model="banco.tipo_identificacion"
                :options="tiposDocumentosIdentificaciones"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                disable
                outlined
                :option-value="v => v.value"
                :option-label="v => v.nombre"
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

            <!-- Identificación -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Identificación </label>
              <q-input
                v-model="banco.identificacion"
                disable
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
                autogrow
                type="email"
                v-model="banco.correo_personal"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                type="tel"
                v-model="banco.telefono"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Genero -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Sexo asignado al nacer</label>
              <q-toggle
                :label="banco.genero == 'M' ? 'Masculino' : 'Femenino'"
                v-model="banco.genero"
                true-value="M"
                false-value="F"
                color="primary"
                keep-color
                indeterminate-icon="fa fa-user"
                checked-icon="fa fa-male"
                unchecked-icon="fa fa-female"
                disable
              />
            </div>

            <!-- Identidad de genero -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Identidad de Género</label>
              <q-select
                v-model="banco.identidad_genero"
                :options="identidades"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                disable
                :input-debounce="0"
                use-input
                :option-value="v => v.id"
                :option-label="v => v.nombre"
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

            <!-- Nacionalidad -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Nacionalidad</label>
              <q-select
                v-model="banco.pais"
                :options="paises"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                use-input
                :input-debounce="0"
                disable
                :option-value="v => v.id"
                :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
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

            <!-- Pais de residencia -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">País de Residencia</label>
              <q-select
                v-model="banco.pais_residencia"
                :options="paises"
                transition-show="jump-up"
                transition-hide="jump-down"
                options-dense
                dense
                outlined
                use-input
                :input-debounce="0"
                disable
                :option-value="v => v.id"
                :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
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

            <!-- Fecha nacimiento -->
            <div class="col-md-3 col-sm-6 col-xs-12">
              <label class="q-mb-sm block">Fecha de nacimiento</label>
              <q-input
                v-model="banco.fecha_nacimiento"
                placeholder="Obligatorio"
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
                        v-model="banco.fecha_nacimiento"
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
              </q-input>
            </div>

            <!-- Dirección  -->
            <div class="col-md-12 col-sm-12 col-xs-12">
              <label class="q-mb-sm block">Dirección </label>
              <q-input
                v-model="banco.direccion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
                autogrow
              >
              </q-input>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
          label="Currículum"
          header-class="text-bold bg-desenfoque text-primary"
          default-opened
        >
          <div class="row q-pa-md">
            <div class="col-12">
              <!-- Solo se admiten pdfs -->
              <gestor-archivos
                ref="refArchivo"
                label="Adjuntar Currículum Vitae u Hoja de Vida"
                :mixin="mixinPostulaciones"
                disable
                :permitir-subir="false"
                formato=".pdf"
                :maxFiles="1"
                :listarAlGuardar="false"
                :permitir-eliminar="false"
                :idModelo="banco.postulacion_id"
              >
              </gestor-archivos>
            </div>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
          label="Datos de Evaluación"
          header-class="text-bold bg-desenfoque text-primary"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Cargo -->
            <div class="col-12 col-md-4 col-sm-3">
              <label class="q-mb-sm block">Cargo Potencial</label>
              <q-select
                v-model="banco.cargo"
                :options="cargos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                :option-value="v => v.id"
                :option-label="v => v.nombre"
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

            <!-- puntuacion -->
            <div class="col-12 col-md-4 col-sm-3">
              <label class="q-mb-sm block">Aptitud</label>
              <q-input
                v-model="banco.puntuacion"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- N° veces que fue contactado -->
            <div class="col-12 col-md-4 col-sm-3">
              <label class="q-mb-sm block">N° veces contactado</label>
              <q-input
              v-model="banco.fue_contactado"
              type="number"
              :disable="disabled"
                outlined
                dense
                >
              </q-input>
            </div>

            <div class="col-12 col-md-4 col-sm-3">
              <label class="q-mb-sm block">¿Está descartado?</label>
                <option-group-component
                  v-model="banco.descartado"
                  :disable="disabled"
                />
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./BancoPostulantePage.ts" />
