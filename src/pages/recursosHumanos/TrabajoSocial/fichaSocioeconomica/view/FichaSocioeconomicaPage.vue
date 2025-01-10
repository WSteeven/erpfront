<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Ficha Socioeconomica"
    :permitir-eliminar="false"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListadoFichas"
    :accion1="btnImprimir"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!--        Datos personales -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="1. DATOS PERSONALES"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Colaborador -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Colaborador</label>
              <q-select
                v-model="ficha.empleado"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.empleado.$errors.length"
                @blur="v$.empleado.$touch"
                error-message="Debes seleccionar un empleado"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @update:model-value="empleadoSeleccionado"
                @popup-show="ordenarLista(empleados, 'nombres')"
                :option-value="v => v.id"
                :option-label="v => v.nombres + ' ' + v.apellidos"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="empleado" />
                </template>

                <template v-slot:no-option>
                  <no-option-component/>
                </template>
              </q-select>
            </div>
            <!-- Identificación -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Identificación</label>
              <q-input
                v-model="empleado.identificacion"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              ></q-input>
            </div>
            <!-- Nombres y Apellidos-->
            <!--            <div class="col-12 col-md-3">-->
            <!--              <label class="q-mb-sm block">Nombres y Apellidos</label>-->
            <!--              <q-input-->
            <!--                v-model="empleado.nombres_apellidos"-->
            <!--                placeholder="Obligatorio"-->
            <!--                disable-->
            <!--                outlined-->
            <!--                dense-->
            <!--              />-->
            <!--            </div>-->
            <!-- Fecha de Nacimiento -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">F. Nacimiento</label>
              <q-input
                v-model="empleado.fecha_nacimiento"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              />
            </div>

            <!-- Estado Civil -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Estado Civil</label>
              <q-input
                v-model="empleado.estado_civil"
                placeholder="Obligatorio"
                disable
                outlined
                dense
              />
            </div>

            <!-- Lugar de nacimiento -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Lugar Nacimiento</label>
              <q-input
                v-model="ficha.lugar_nacimiento"
                :error="!!v$.lugar_nacimiento.$errors.length"
                @blur="v$.lugar_nacimiento.$touch"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="lugar_nacimiento" />
                </template>
              </q-input>
            </div>

            <!-- Direccion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Dirección domicilio</label>
              <q-input
                v-model="empleado.direccion"
                placeholder="Obligatorio"
                disable
                autogrow
                outlined
                dense
              />
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Telefono Domicilio</label>
              <q-input
                type="tel"
                v-model="ficha.vivienda.telefono"
                placeholder="Obligatorio"
                :error="!!v$.vivienda.telefono.$errors.length"
                @blur="v$.vivienda.telefono.$touch"
                :disable="disabled"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="vivienda.telefono" />
                </template>
              </q-input>
            </div>

            <!-- Ciudad de Trabajo -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Ciudad de Trabajo</label>
              <q-select
                v-model="ficha.canton"
                :options="cantones"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @filter="filtrarCantones"
                @popup-show="ordenarLista(cantones, 'canton')"
                :error="!!v$.canton.$errors.length"
                @blur="v$.canton.$touch"
                :option-value="v => v.id"
                :option-label="v => v.canton"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="canton" />
                </template>

                <template v-slot:no-option>
                  <no-option-component/>
                </template>
              </q-select>
<!--              </q-input>-->
            </div>
          </div>
            <div class="row q-col-gutter-sm  border-grey q-pa-xs q-ma-sm">
            <!-- En caso de emergencia  -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block"
                >En caso de emergencia llamar a
              </label>
              <q-input
                v-model="ficha.contacto_emergencia"
                :disable="disabled"
                placeholder="Nombres y Apellidos del Contacto"
                autogrow
                :error="!!v$.contacto_emergencia.$errors.length"
                @blur="v$.contacto_emergencia.$touch"
                dense
                outlined
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="contacto_emergencia" />
                </template>
              </q-input>
            </div>

            <!-- Parentesco  -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Parentesco</label>
              <q-select
                v-model="ficha.parentesco_contacto_emergencia"
                :options="parentescos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.parentesco_contacto_emergencia.$errors.length"
                @blur="v$.parentesco_contacto_emergencia.$touch"
                error-message="Debes seleccionar un parentesco"
                :option-value="v => v.value"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component
                    :v$="v$"
                    clave="parentesco_contacto_emergencia"
                  />
                </template>
              </q-select>
            </div>

            <!-- telefono -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Teléfono </label>
              <q-input
                v-model="ficha.telefono_contacto_emergencia"
                :disable="disabled"
                :error="!!v$.telefono_contacto_emergencia.$errors.length"
                @blur="v$.telefono_contacto_emergencia.$touch"
                dense
                outlined
              >
                <template v-slot:error>
                  <error-component
                    :v$="v$"
                    clave="telefono_contacto_emergencia"
                  />
                </template>
              </q-input>
            </div>
            </div>
            <div class="row q-col-gutter-sm  border-grey q-pa-xs q-ma-sm">
              <!-- Contacto que no viva con ud  -->
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block"
                >Contacto que no viva con usted
                </label>
                <q-input
                  v-model="ficha.contacto_emergencia_externo"
                  :disable="disabled"
                  placeholder="Familiar que no vive con usted"
                  autogrow
                  :error="!!v$.contacto_emergencia_externo.$errors.length"
                  @blur="v$.contacto_emergencia_externo.$touch"
                  dense
                  outlined
                >
                  <template v-slot:error>
                    <error-component :v$="v$" clave="contacto_emergencia_externo" />
                  </template>
                </q-input>
              </div>

              <!-- Parentesco  -->
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block">Parentesco Contacto Externo</label>
                <q-select
                  v-model="ficha.parentesco_contacto_emergencia_externo"
                  :options="parentescos"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  :disable="disabled"
                  options-dense
                  dense
                  outlined
                  :error="!!v$.parentesco_contacto_emergencia_externo.$errors.length"
                  @blur="v$.parentesco_contacto_emergencia_externo.$touch"
                  error-message="Debes seleccionar un parentesco"
                  :option-value="v => v.value"
                  :option-label="v => v.nombre"
                  emit-value
                  map-options
                >
                  <template v-slot:error>
                    <error-component
                      :v$="v$"
                      clave="parentesco_contacto_emergencia_externo"
                    />
                  </template>
                </q-select>
              </div>

              <!-- telefono -->
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block">Teléfono Contacto Externo</label>
                <q-input
                  v-model="ficha.telefono_contacto_emergencia_externo"
                  :disable="disabled"
                  :error="!!v$.telefono_contacto_emergencia_externo.$errors.length"
                  @blur="v$.telefono_contacto_emergencia_externo.$touch"
                  dense
                  outlined
                >
                  <template v-slot:error>
                    <error-component
                      :v$="v$"
                      clave="telefono_contacto_emergencia_externo"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Ciudad de Trabajo -->
              <div class="col-12 col-md-3 q-mb-md">
                <label class="q-mb-sm block">Ciudad del Contacto Externo</label>
                <q-select
                  v-model="ficha.ciudad_contacto_emergencia_externo"
                  :options="cantones"
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  :disable="disabled"
                  options-dense
                  dense
                  outlined
                  :input-debounce="0"
                  use-input
                  @filter="filtrarCantones"
                  @popup-show="ordenarLista(cantones, 'canton')"
                  :error="!!v$.ciudad_contacto_emergencia_externo.$errors.length"
                  @blur="v$.ciudad_contacto_emergencia_externo.$touch"
                  :option-value="v => v.id"
                  :option-label="v => v.canton"
                  emit-value
                  map-options
                >
                  <template v-slot:error>
                    <error-component :v$="v$" clave="ciudad_contacto_emergencia_externo" />
                  </template>

                  <template v-slot:no-option>
                    <no-option-component/>
                  </template>
                </q-select>
              </div>
<!--            </div>-->
          </div>
        </q-expansion-item>
        {{ficha.composicion_familiar}}
        <!--        Informacion del conyuge -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. DATOS DEL CÓNYUGE"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tiene conyuge -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Tiene cónyuge</label>
              <q-toggle
                :label="ficha.tiene_conyuge ? 'SI' : 'NO'"
                v-model="ficha.tiene_conyuge"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm" v-if="ficha.tiene_conyuge">
            <!-- Nombres -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="ficha.conyuge.nombres"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.nombres.$errors.length"
                @blur="v$.conyuge.nombres.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.nombres" />
                </template>
              </q-input>
            </div>

            <!-- Apellidos-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                v-model="ficha.conyuge.apellidos"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.apellidos.$errors.length"
                @blur="v$.conyuge.apellidos.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.apellidos" />
                </template>
              </q-input>
            </div>

            <!-- Nivel academico -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Nivel académico</label>
              <q-select
                v-model="ficha.conyuge.nivel_academico"
                :options="niveles_academicos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.conyuge.nivel_academico.$errors.length"
                @blur="v$.conyuge.nivel_academico.$touch"
                error-message="Debes seleccionar un nivel académico o instrucción"
                use-input
                input-debounce="0"
                :option-value="v => v.nombre"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.nivel_academico" />
                </template>

                <template v-slot:no-option>
                  <no-option-component/>
                </template>
              </q-select>
            </div>

            <!-- Edad -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Edad</label>
              <q-input
                v-model="ficha.conyuge.edad"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.edad.$errors.length"
                @blur="v$.conyuge.edad.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.edad" />
                </template>
              </q-input>
            </div>

            <!-- Profesion u ocupacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Profesión u Ocupación</label>
              <q-input
                v-model="ficha.conyuge.profesion"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.profesion.$errors.length"
                @blur="v$.conyuge.profesion.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.profesion" />
                </template>
              </q-input>
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                v-model="ficha.conyuge.telefono"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.telefono.$errors.length"
                @blur="v$.conyuge.telefono.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.telefono" />
                </template>
              </q-input>
            </div>

            <!-- Dependencia laboral -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Dependencia Laboral</label>
              <option-group-component
                v-model="ficha.conyuge.tiene_dependencia_laboral"
                :disable="disabled"
                @update:model-value="checkDependenciaLaboral"
              />
            </div>

            <!-- Tiene negocio propio -->
            <div class="col-12 col-md-3" v-if="!ficha.conyuge.tiene_dependencia_laboral">
              <label class="q-mb-sm block">¿Tiene negocio propio?</label>
              <option-group-component
                v-model="ficha.conyuge.tiene_negocio_propio"
                :disable="disabled"
                @update:model-value="checkNegocioPropio"
              />
            </div>

            <!-- negocio propio -->
            <div class="col-12 col-md-3" v-if="ficha.conyuge.tiene_negocio_propio">
              <label class="q-mb-sm block">Especifique negocio propio o emprendimiento</label>
              <q-input
                v-model="ficha.conyuge.negocio_propio"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.negocio_propio.$errors.length"
                @blur="v$.conyuge.negocio_propio.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.negocio_propio" />
                </template>
              </q-input>
            </div>

            <!-- Promedio de ingreso mensual -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Promedio de Ingreso Mensual</label>
              <q-input
                v-model="ficha.conyuge.promedio_ingreso_mensual"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.conyuge.promedio_ingreso_mensual.$errors.length"
                @blur="v$.conyuge.promedio_ingreso_mensual.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="conyuge.promedio_ingreso_mensual" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-12 full-width text-center q-pa-md" v-else>
            <callout-component
              mensaje="Usted ha marcado que el empleado no tiene cónyuge."
              tipo="info"
            />
          </div>
        </q-expansion-item>

        <!--        3. Información de los hijos -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="3. INFORMACIÓN DE LOS HIJOS"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tiene hijos -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Tiene hijos</label>
              <q-toggle
                :label="ficha.tiene_hijos ? 'SI' : 'NO'"
                v-model="ficha.tiene_hijos"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-pa-sm" v-if="ficha.tiene_hijos">
            <div class="col-12">
              <essential-table
                :datos="ficha.hijos"
                :configuracion-columnas="[
                  ...configuracionColumnasHijos,
                  accionesTabla
                ]"
                :v$="v$"
                key-error="hijos"
                :titulo="null"
                :alto-fijo="false"
                :permitirBuscar="false"
                :permitir-eliminar="false"
                :permitir-editar="false"
                :permitir-consultar="false"
                permitirEditarModal
                @fila-modificada="filaModificadaHijo"
                :mostrarCantidadElementos="true"
                :accion1-header="btnAgregarFilaHijo"
                :accion1="btnEliminarDefault(ficha.hijos)"
                :permitirEditarCeldas="true"
              />
            </div>
          </div>
          <div class="col-12 text-center q-pa-md" v-else>
            <callout-component
              mensaje="Usted ha marcado que el empleado no tiene hijos."
              tipo="info"
            />
          </div>
        </q-expansion-item>

        <!--4. experiencia laboral (ultimo empleo)-->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="4. EXPERIENCIA LABORAL (último empleo)"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tiene experiencia previa -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block"
                >Tiene experiencia previa o último empleo</label
              >
              <option-group-component v-model="ficha.tiene_experiencia_previa" :disable="disabled" />
            </div>
          </div>
          <div
            class="row q-col-gutter-sm q-pa-sm"
            v-if="ficha.tiene_experiencia_previa"
          >
            <!-- Nombre de la empresa -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Nombre de la empresa</label>
              <q-input
                v-model="ficha.experiencia_previa.nombre_empresa"
                placeholder="Obligatorio"
                autogrow
                :disable="disabled"
                outlined
                dense
                :error="!!v$.experiencia_previa.nombre_empresa.$errors.length"
                @blur="v$.experiencia_previa.nombre_empresa.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.nombre_empresa" />
                </template>
              </q-input>
            </div>

            <!-- Cargo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Cargo</label>
              <q-input
                v-model="ficha.experiencia_previa.cargo"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.experiencia_previa.cargo.$errors.length"
                @blur="v$.experiencia_previa.cargo.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.cargo" />
                </template>
              </q-input>
            </div>

            <!-- Antiguedad -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Antiguedad</label>
              <q-input
                v-model="ficha.experiencia_previa.antiguedad"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.experiencia_previa.antiguedad.$errors.length"
                @blur="v$.experiencia_previa.antiguedad.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.antiguedad" />
                </template>
              </q-input>
            </div>

            <!-- Asegurado al IESS -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Asegurado IESS</label>
              <option-group-component
                v-model="ficha.experiencia_previa.asegurado_iess"
                :disable="disabled"
              />
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                v-model="ficha.experiencia_previa.telefono"
                hint="Separe con comas para registrar varios teléfonos"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.experiencia_previa.telefono.$errors.length"
                @blur="v$.experiencia_previa.telefono.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.telefono" />
                </template>
              </q-input>
            </div>

            <!-- Fecha de retiro  -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Fecha de retiro</label>
              <q-input
                v-model="ficha.experiencia_previa.fecha_retiro"
                placeholder="Obligatorio"
                :error="!!v$.experiencia_previa.fecha_retiro.$errors.length"
                @blur="v$.experiencia_previa.fecha_retiro.$touch"
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
                        v-model="ficha.experiencia_previa.fecha_retiro"
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
                  <error-component :v$="v$" clave="experiencia_previa.fecha_retiro" />
                </template>
              </q-input>
            </div>

            <!-- Motivo del retiro -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Motivo del retiro</label>
              <q-input
                v-model="ficha.experiencia_previa.motivo_retiro"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.experiencia_previa.motivo_retiro.$errors.length"
                @blur="v$.experiencia_previa.motivo_retiro.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.motivo_retiro" />
                </template>
              </q-input>
            </div>

            <!-- Salario -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Salario último empleo</label>
              <q-input
                v-model="ficha.experiencia_previa.salario"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.experiencia_previa.salario.$errors.length"
                @blur="v$.experiencia_previa.salario.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="experiencia_previa.salario" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-12 text-center q-pa-md" v-else>
            <callout-component
              mensaje="Usted ha marcado que el empleado no tiene experiencia previa o
                último empleo."
              tipo="info"
            />
          </div>
        </q-expansion-item>

        <!-- 5. Información de la vivienda-->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="5. INFORMACIÓN DE LA VIVIENDA (donde habita actualmente)"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <informacion-vivienda
            :mixin="mixin"
            :vivienda="ficha.vivienda"
            :accion="accion"
            :disable="disabled"
          />
        </q-expansion-item>

        <!-- 6. Situación Socioeconómica -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="6. Situación Socioeconómica"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Numero de personas que aportan economicamente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >N° personas que aportan económicamente en su hogar</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica.cantidad_personas_aportan
                "
                placeholder="Obligatorio"
                type="number"
                min="0"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.cantidad_personas_aportan.$errors.length"
                @blur="v$.situacion_socioeconomica.cantidad_personas_aportan.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.cantidad_personas_aportan" />
                </template>
              </q-input>
            </div>
            <!-- N° Personas que dependen económicamente de usted -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block"
                >N° Personas que dependen económicamente de usted</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica.cantidad_personas_dependientes
                "
                placeholder="Obligatorio"
                type="number"
                min="0"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.cantidad_personas_dependientes.$errors.length"
                @blur="v$.situacion_socioeconomica.cantidad_personas_dependientes.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.cantidad_personas_dependientes" />
                </template>
              </q-input>
            </div>
            <!-- recibe_apoyo_economico_otro_familiar -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Recibe apoyo económico de algún familiar?</label
              >
              <option-group-component
                v-model="
                  ficha.situacion_socioeconomica
                    .recibe_apoyo_economico_otro_familiar
                "
                :disable="disabled"
                clave="situacion_socioeconomica.recibe_apoyo_economico_otro_familiar"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.recibe_apoyo_economico_otro_familiar.$errors.length"
              />
            </div>

            <!-- Especifique al familiar que apoya -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="
                ficha.situacion_socioeconomica
                  .recibe_apoyo_economico_otro_familiar
              "
            >
              <label class="q-mb-sm block"
                >Especifique que familiar o amigo lo apoya</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica.familiar_apoya_economicamente
                "
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.familiar_apoya_economicamente.$errors.length"
                @blur="v$.situacion_socioeconomica.familiar_apoya_economicamente.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.familiar_apoya_economicamente" />
                </template>
              </q-input>
            </div>

            <!-- recibe_apoyo_economico_gobierno -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Recibe apoyo económico de alguna institución del
                gobierno?</label
              >
              <option-group-component
                v-model="
                  ficha.situacion_socioeconomica.recibe_apoyo_economico_gobierno
                "
                :disable="disabled"
                clave="situacion_socioeconomica.recibe_apoyo_economico_gobierno"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.recibe_apoyo_economico_gobierno.$errors.length"
              />
            </div>

            <!-- Especifique la institucion que lo apoya -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="
                ficha.situacion_socioeconomica.recibe_apoyo_economico_gobierno
              "
            >
              <label class="q-mb-sm block"
                >Especifique la institución que lo apoya</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica
                    .institucion_apoya_economicamente
                "
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                autogrow
                dense
                :error="!!v$.situacion_socioeconomica.institucion_apoya_economicamente.$errors.length"
                @blur="v$.situacion_socioeconomica.institucion_apoya_economicamente.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.institucion_apoya_economicamente" />
                </template>
              </q-input>
            </div>

            <!-- tiene_prestamos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene préstamos?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_prestamos"
                :disable="disabled"
                clave="situacion_socioeconomica.tiene_prestamos"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.tiene_prestamos.$errors.length"
              />
            </div>

            <!-- cantidad de prestamos -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="ficha.situacion_socioeconomica.tiene_prestamos"
            >
              <label class="q-mb-sm block">N° de préstamos que tiene</label>
              <q-input
                v-model="ficha.situacion_socioeconomica.cantidad_prestamos"
                placeholder="Obligatorio"
                type="number"
                :min="0"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.cantidad_prestamos.$errors.length"
                @blur="v$.situacion_socioeconomica.cantidad_prestamos.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.cantidad_prestamos" />
                </template>
              </q-input>
            </div>

            <!-- Nombre la entidad bancaria  -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="ficha.situacion_socioeconomica.tiene_prestamos"
            >
              <label class="q-mb-sm block"
                >Especifique la/s entidad/es bancaria/s</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica
                    .entidad_bancaria
                "
                placeholder="Obligatorio"
                hint="Para ingresar varias entidades bancarias por favor separe por comas"
                :disable="disabled"
                outlined
                autogrow
                dense
                :error="!!v$.situacion_socioeconomica.entidad_bancaria.$errors.length"
                @blur="v$.situacion_socioeconomica.entidad_bancaria.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.entidad_bancaria" />
                </template>
              </q-input>
            </div>

            <!-- tiene_tarjeta_credito -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Tarjeta de Crédito?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_tarjeta_credito"
                :disable="disabled"
                clave="situacion_socioeconomica.tiene_tarjeta_credito"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.tiene_tarjeta_credito.$errors.length"
              />
            </div>

            <!-- cantidad de tarjetas que posee -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="ficha.situacion_socioeconomica.tiene_tarjeta_credito"
            >
              <label class="q-mb-sm block">N° tarjetas (TC) que posee </label>
              <q-input
                v-model="
                  ficha.situacion_socioeconomica.cantidad_tarjetas_credito
                "
                placeholder="Obligatorio"
                type="number"
                :min="0"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.cantidad_tarjetas_credito.$errors.length"
                @blur="v$.situacion_socioeconomica.cantidad_tarjetas_credito.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.cantidad_tarjetas_credito" />
                </template>
              </q-input>
            </div>

            <!-- Vehículo -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Vehiculo que posee</label>
              <q-select
                v-model="ficha.situacion_socioeconomica.vehiculo"
                :options="vehiculos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.situacion_socioeconomica.vehiculo.$errors.length"
                @blur="v$.situacion_socioeconomica.vehiculo.$touch"
                error-message="Debes seleccionar un vehículo"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.vehiculo" />
                </template>

                <template v-slot:no-option>
                  <no-option-component/>
                </template>
              </q-select>
            </div>

            <!-- tiene_terreno -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Terreno?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_terreno"
                :disable="disabled"
                clave="situacion_socioeconomica.tiene_terreno"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.tiene_terreno.$errors.length"
                @update:model-value="checkTieneTerreno"
              />
            </div>

            <!-- Especificacion de tiene terreno -->
            <div class="col-12 col-md-3" v-if="ficha.situacion_socioeconomica.tiene_terreno">
              <label class="q-mb-sm block">Especifique terreno/s que posee</label>
              <q-input
                v-model="ficha.situacion_socioeconomica.especificacion_terreno"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.situacion_socioeconomica.especificacion_terreno.$errors.length"
                @blur="v$.situacion_socioeconomica.especificacion_terreno.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.especificacion_terreno" />
                </template>
              </q-input>
            </div>

            <!-- tiene_bienes -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Bienes?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_bienes"
                :disable="disabled"
                clave="situacion_socioeconomica.tiene_bienes"
                :v$="v$"
                @update:model-value="checkTieneBienes"
                :error="!!v$.situacion_socioeconomica.tiene_bienes.$errors.length"
              />
            </div>

            <!-- Especificacion de tiene bienes -->
            <div class="col-12 col-md-3" v-if="ficha.situacion_socioeconomica.tiene_bienes">
              <label class="q-mb-sm block">Especifique bien/es que posee</label>
              <q-input
                v-model="ficha.situacion_socioeconomica.especificacion_bienes"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.situacion_socioeconomica.especificacion_bienes.$errors.length"
                @blur="v$.situacion_socioeconomica.especificacion_bienes.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.especificacion_bienes" />
                </template>
              </q-input>
            </div>

            <!-- tiene ingresos adicionales -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Ingresos adicionales?</label>
              <option-group-component
                v-model="
                  ficha.situacion_socioeconomica.tiene_ingresos_adicionales
                "
                :disable="disabled"
                clave="situacion_socioeconomica.tiene_ingresos_adicionales"
                :v$="v$"
                :error="!!v$.situacion_socioeconomica.tiene_ingresos_adicionales.$errors.length"
                @update:model-value="checkTieneIngresosAdicionales"
              />
            </div>

            <!-- Especificacion de ingresos adicionales -->
            <div class="col-12 col-md-3" v-if="ficha.situacion_socioeconomica.tiene_ingresos_adicionales">
              <label class="q-mb-sm block">Especifique origen de ingresos adicionales</label>
              <q-input
                v-model="ficha.situacion_socioeconomica.especificacion_ingresos_adicionales"
                placeholder="Obligatorio"
                hint="Separe con comas para especificar varios"
                :disable="disabled"
                :error="!!v$.situacion_socioeconomica.especificacion_ingresos_adicionales.$errors.length"
                @blur="v$.situacion_socioeconomica.especificacion_ingresos_adicionales.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.especificacion_ingresos_adicionales" />
                </template>
              </q-input>
            </div>

            <!-- Ingresos adicionales -->
            <div
              class="col-12 col-md-3"
              v-if="ficha.situacion_socioeconomica.tiene_ingresos_adicionales"
            >
              <label class="q-mb-sm block">Ingresos Adicionales</label>
              <q-input
                v-model="ficha.situacion_socioeconomica.ingresos_adicionales"
                placeholder="Obligatorio"
                type="number"
                min="0"
                :disable="disabled"
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.ingresos_adicionales.$errors.length"
                @blur="v$.situacion_socioeconomica.ingresos_adicionales.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.ingresos_adicionales" />
                </template>
              </q-input>
            </div>

            <!-- apoya a algun familiar -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Apoya económicamente a algún familiar?</label
              >
              <option-group-component
                v-model="ficha.situacion_socioeconomica.apoya_familiar_externo"
                :disable="disabled"
                @update:model-value="checkApoyaEconomicamenteFamiliarExterno"
              />
            </div>

            <!-- Especificacion de ingresos adicionales -->
            <div class="col-12 col-md-3" v-if="ficha.situacion_socioeconomica.apoya_familiar_externo">
              <label class="q-mb-sm block">Especifique monto ($) con que apoya mensualmente </label>
              <q-input
                v-model="ficha.situacion_socioeconomica.valor_apoyo_familiar_externo"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.situacion_socioeconomica.valor_apoyo_familiar_externo.$errors.length"
                @blur="v$.situacion_socioeconomica.valor_apoyo_familiar_externo.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.valor_apoyo_familiar_externo" />
                </template>
              </q-input>
            </div>

            <!-- Familiar externo apoyado -->
            <div
              class="col-12 col-md-3"
              v-if="ficha.situacion_socioeconomica.apoya_familiar_externo"
            >
              <label class="q-mb-sm block"
                >Especifique el familiar al que apoya</label
              >
              <q-input
                v-model="
                  ficha.situacion_socioeconomica.familiar_externo_apoyado
                "
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
                :error="!!v$.situacion_socioeconomica.familiar_externo_apoyado.$errors.length"
                @blur="v$.situacion_socioeconomica.familiar_externo_apoyado.$touch"
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="situacion_socioeconomica.familiar_externo_apoyado" />
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>
        <!-- 7. Situación Sociofamiliar -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="7. SITUACIÓN SOCIOFAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <composicion-familiar
            :mixin="mixin"
            :datos="ficha.composicion_familiar"
            :accion="accion"
          />
        </q-expansion-item>
        <!--8. Salud -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="8. SALUD"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <salud-empleado
            :salud="ficha.salud"
            :mixin="mixin"
            :accion="accion"
            :disable="disabled"
          />
        </q-expansion-item>

        <!--9. Ambiente social o familiar -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="9. AMBIENTE SOCIAL O FAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- problemas -->
            <div class="col-12 col-md-12">
              <label class="q-mb-sm block"
                >¿En su entorno familiar o social ha evidenciado o existe alguno
                de estos problemas? (Puede seleccionar varios)</label
              >
              <option-group-component
                v-model="ficha.problemas_ambiente_social_familiar"
                type="checkbox"
                :options="optionsProblemasSociales"
                :disable="disabled"
                clave="problemas_ambiente_social_familiar"
                :v$="v$"
                :error="!!v$.problemas_ambiente_social_familiar.$errors.length"
              />
            </div>

            <!-- Observaciones -->
            <div class="col-12 col-md-12 q-mb-md col-sm-12">
              <label class="q-mb-sm block">Observaciones</label>
              <q-input
                v-model="ficha.observaciones_ambiente_social_familiar"
                placeholder="Opcional"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>
          </div>
        </q-expansion-item>

        <!--10. Capacitaciones y conocimientos -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="10. CAPACITACIONES Y CONOCIMIENTOS"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- tiene capacitaciones -->
            <div class="col-12 col-md-12">
              <label class="q-mb-sm block">¿Ha recibido capacitaciones?</label>
              <option-group-component
                v-model="ficha.tiene_capacitaciones"
                :disable="disabled"
                @update:model-value="checkTieneCapacitaciones"
                clave="tiene_capacitaciones"
                :v$="v$"
                :error="!!v$.tiene_capacitaciones.$errors.length"
              />
            </div>

            <!-- conocimientos  -->
            <div class="col-12 col-md-6" v-if="ficha.tiene_capacitaciones">
              <label class="q-mb-sm block"
                >¿Tiene algún tipo de conocimiento sobre estos temas?</label
              >
              <option-group-component
                v-model="ficha.conocimientos"
                :options="optionsConocimientos"
                type="checkbox"
                :disable="disabled"
                :horizontal="false"
                clave="conocimientos"
                :v$="v$"
                :error="!!v$.conocimientos.$errors.length"
              />
            </div>

            <!-- capacitaciones -->
            <div class="col-12 col-md-6" v-if="ficha.tiene_capacitaciones">
              <label class="q-mb-sm block"
                >¿Ha recibido capacitaciones o algún curso de estas
                instituciones?</label
              >
              <option-group-component
                v-model="ficha.capacitaciones"
                :options="optionsCapacitaciones"
                type="checkbox"
                :disable="disabled"
                :horizontal="false"
                clave="capacitaciones"
                :v$="v$"
                :error="!!v$.capacitaciones.$errors.length"
              />
            </div>
          </div>
        </q-expansion-item>

        <!-- 11. CROQUIS -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="11. CROQUIS"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <croquis-vivienda :vivienda="ficha.vivienda" :disable="disabled" :accion="accion" />
        </q-expansion-item>

<!--        <p><strong>Aqui van los errores: </strong> {{v$.$errors}}</p>-->

        <!-- 12. RUTAGRAMA Y VIAS DE ACCESO -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="12. RUTAGRAMA Y VIAS DE ACCESO"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- imagen_rutagrama -->
            <div class="col-12 col-md-12 col-sm-12">
              <label for="q-mb-xl block">Rutagrama y vías de acceso</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="ficha.imagen_rutagrama"
                :error="!!v$.imagen_rutagrama.$errors.length"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="data => (ficha.imagen_rutagrama = data)"
              ></selector-imagen>
            </div>

            <!-- Vias de transito regular al trabajo -->
            <div class="col-12 col-md-12 q-mb-md col-sm-12">
              <label class="q-mb-sm block"
                >Vías de tránsito regular al trabajo</label
              >
              <q-input
                v-model="ficha.vias_transito_regular_trabajo"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.vias_transito_regular_trabajo.$errors.length"
                @blur="v$.vias_transito_regular_trabajo.$touch"
                autogrow
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="vias_transito_regular_trabajo" />
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>

        <!-- Conclusiones -->
        <div class="col-12 col-md-12 q-mb-md col-sm-12">
          <label class="q-mb-sm block">Conclusiones</label>
          <q-input
            v-model="ficha.conclusiones"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.conclusiones.$errors.length"
            @blur="v$.conclusiones.$touch"
            autogrow
            outlined
            dense
          >
            <template v-slot:error>
              <error-component :v$="v$" clave="conclusiones" />
            </template>
          </q-input>
        </div>
<!--        <div>-->
<!--          <q-btn @click="v$.$validate()">Validar errores</q-btn>-->
<!--        </div>-->
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./FichaSocioeconomicaPage.ts" />
