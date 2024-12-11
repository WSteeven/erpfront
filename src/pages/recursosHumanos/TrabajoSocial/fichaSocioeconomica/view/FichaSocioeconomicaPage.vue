<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Ficha Socioeconomica"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListadoFichas"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!--        Datos personales -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="1. Datos Personales"
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
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
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

            <!-- Coordenadas -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Coordenadas Domicilio</label>
              <q-input
                v-model="ficha.coordenadas"
                placeholder="Obligatorio"
                outlined
                :disable="disabled"
                dense
              >
                <template v-slot:append>
                  <q-icon
                    name="bi-geo-alt"
                    @click="obtenerCoordenadas"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Telefono Domicilio</label>
              <q-input
                type="tel"
                v-model="ficha.telefono_domicilio"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Ciudad de Trabajo -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Ciudad de Trabajo</label>
              <q-input
                v-model="ficha.ciudad_trabajo"
                :disable="disabled"
                dense
                outlined
              />
            </div>

            <!-- En caso de emergencia  -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block"
                >En caso de emergencia llamar a
              </label>
              <q-input
                v-model="ficha.contacto_emergencia"
                :disable="disabled"
                dense
                outlined
              />
            </div>

            <!-- Parentesco  -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Parentesco</label>
              <q-input
                v-model="ficha.parentesco"
                :disable="disabled"
                dense
                outlined
              />
            </div>

            <!-- telefono -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Teléfono </label>
              <q-input
                v-model="ficha.telefono_contacto_emergencia"
                :disable="disabled"
                dense
                outlined
              />
            </div>

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
        </q-expansion-item>
        <!--        Informacion del conyuge -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. Datos del cónyuge"
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
                outlined
                dense
              />
            </div>

            <!-- Apellidos-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                v-model="ficha.conyuge.apellidos"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Nivel academico -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Nivel académico</label>
              <q-select
                v-model="ficha.conyuge.nombres_apellidos"
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
                  <div
                    v-for="error of v$.conyuge.nivel_academico.$errors"
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

            <!-- Edad -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Edad</label>
              <q-input
                v-model="ficha.conyuge.edad"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              ></q-input>
            </div>

            <!-- Profesion u ocupacion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Profesión u Ocupación</label>
              <q-input
                v-model="ficha.conyuge.profesion"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Teléfono</label>
              <q-input
                v-model="ficha.conyuge.telefono"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Dependencia laboral -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Dependencia Laboral</label>
              <option-group-component
                v-model="ficha.conyuge.tiene_dependencia_laboral"
                :disable="disabled"
              />
            </div>

            <!-- Promedio de ingreso mensual -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Promedio de Ingreso Mensual</label>
              <q-input
                v-model="ficha.conyuge.promedio_ingreso_mensual"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-md" v-else>
            <div
              class="col-12 col-md-12 rounded-card q-pt-md text-center text-blue bg-blue-2"
            >
              <p>
                <q-icon name="bi-info-circle-fill" size="1em" />
                Usted ha marcado que el empleado no tiene cónyuge.
              </p>
            </div>
          </div>
        </q-expansion-item>

<!--        3. Información de los hijos -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="3. Información de los hijos"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tiene conyuge -->
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
                :titulo="null"
                :alto-fijo="false"
                :permitirBuscar="false"
                permitirEditarModal
                :mostrarCantidadElementos="true"
                :accion1-header="btnAgregarFilaHijo"
                :accion1="btnEliminarDefault(ficha.hijos)"
                :permitirEditarCeldas="true"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-md" v-else>
            <div
              class="col-12 col-md-12 rounded-card q-pt-md text-center text-blue bg-blue-2"
            >
              <p>
                <q-icon name="bi-info-circle-fill" size="1em" />
                Usted ha marcado que el empleado no tiene hijos.
              </p>
            </div>
          </div>
        </q-expansion-item>

        <!--4. experiencia laboral (ultimo empleo)-->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="4. Experiencia Laboral (último empleo)"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Tiene experiencia previa -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block"
                >Tiene experiencia previa o último empleo</label
              >
              <q-toggle
                :label="ficha.tiene_experiencia_previa ? 'SI' : 'NO'"
                v-model="ficha.tiene_experiencia_previa"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
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
              />
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
              />
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
              />
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
              />
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
                        v-model="empleado.fecha_nacimiento"
                        :options="optionsFecha"
                        :mask="maskFecha()"
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
                    v-for="error of v$.experiencia_previa.fecha_retiro.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
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
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-md" v-else>
            <div
              class="col-12 col-md-12 rounded-card q-pt-md text-center text-blue bg-blue-2"
            >
              <p>
                <q-icon name="bi-info-circle-fill" size="1em" />
                Usted ha marcado que el empleado no tiene experiencia previa o
                último empleo.
              </p>
            </div>
          </div>
        </q-expansion-item>

        <!-- 5. Información de la vivienda-->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="5. Información de la vivienda (donde habita actualmente)"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- tipo de vivienda -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Tipo de Vivienda</label>
              <q-select
                v-model="ficha.vivienda.tipo"
                :options="tipos_viviendas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.vivienda.tipo.$errors.length"
                @blur="v$.vivienda.tipo.$touch"
                error-message="Debes seleccionar un tipo de vivienda"
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.vivienda.tipo.$errors"
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

            <!-- Material predominante paredes -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Material Predominante Paredes</label>
              <q-select
                v-model="ficha.vivienda.material_paredes"
                :options="
                  obtenerListadoMaterialesPredominantes(
                    tipos_predominantes.PAREDES
                  )
                "
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.vivienda.material_paredes.$errors.length"
                @blur="v$.vivienda.material_paredes.$touch"
                error-message="Debes seleccionar un material predominante en paredes"
                use-input
                input-debounce="0"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.vivienda.material_paredes.$errors"
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

            <!-- Material predominante techo -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Material Predominante Techo</label>
              <q-select
                v-model="ficha.vivienda.material_techo"
                :options="
                  obtenerListadoMaterialesPredominantes(
                    tipos_predominantes.TECHO
                  )
                "
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.vivienda.material_techo.$errors.length"
                @blur="v$.vivienda.material_techo.$touch"
                error-message="Debes seleccionar un material predominante en techo"
                use-input
                input-debounce="0"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.vivienda.material_techo.$errors"
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

            <!-- Material predominante piso -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Material Predominante Piso</label>
              <q-select
                v-model="ficha.vivienda.material_piso"
                :options="
                  obtenerListadoMaterialesPredominantes(
                    tipos_predominantes.PISO
                  )
                "
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.vivienda.material_piso.$errors.length"
                @blur="v$.vivienda.material_piso.$touch"
                error-message="Debes seleccionar un material predominante en el piso"
                use-input
                input-debounce="0"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.vivienda.material_piso.$errors"
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

            <!-- Numero de dormitorios -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Cantidad Dormitorios</label>
              <q-input
                v-model="ficha.vivienda.numero_dormitorios"
                placeholder="Obligatorio"
                type="number"
                min="0"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Existe hacinamiento -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Existe Hacinamiento</label>
              <option-group-component
                v-model="ficha.vivienda.existe_hacinamiento"
                :disable="disabled"
              />
            </div>

            <!-- comodidad espacio familiar -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block"
                >Considera que el espacio donde convive con su grupo familiar
                es</label
              >
              <q-select
                v-model="ficha.vivienda.comodidad_espacio_familiar"
                :options="likertEspaciosFamiliares"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.vivienda.comodidad_espacio_familiar.$errors.length"
                @blur="v$.vivienda.comodidad_espacio_familiar.$touch"
                error-message="Debes seleccionar una opción"
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.vivienda.comodidad_espacio_familiar
                      .$errors"
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

            <!-- Existe UPC cercano -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Existe cerca UPC o vigilancia</label>
              <option-group-component
                v-model="ficha.vivienda.existe_upc_cercano"
                :disable="disabled"
              />
            </div>

            <!-- Otras consideraciones -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Alguna otra consideración</label>
              <q-input
                v-model="ficha.vivienda.otras_consideraciones"
                placeholder="Opcional"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>
          </div>
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
              />
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
              />
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
              />
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
              />
            </div>

            <!-- tiene_prestamos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene préstamos?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_prestamos"
                :disable="disabled"
              />
            </div>

            <!-- cantidad de prestamos -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="ficha.situacion_socioeconomica.cantidad_prestamos"
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
              />
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
                    .institucion_apoya_economicamente
                "
                placeholder="Obligatorio"
                hint="Para ingresar varias entidades bancarias por favor separe por comas"
                :disable="disabled"
                outlined
                autogrow
                dense
              />
            </div>

            <!-- tiene_tarjeta_credito -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Tarjeta de Crédito?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_tarjeta_credito"
                :disable="disabled"
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
              />
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
                  <div
                    v-for="error of v$.situacion_socioeconomica.vehiculo
                      .$errors"
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

            <!-- tiene_terreno -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Terreno?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_terreno"
                :disable="disabled"
              />
            </div>

            <!-- tiene_bienes -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Bienes?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.tiene_bienes"
                :disable="disabled"
              />
            </div>

            <!-- tiene ingresos adicionales -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene Ingresos adicionales?</label>
              <option-group-component
                v-model="
                  ficha.situacion_socioeconomica.tiene_ingresos_adicionales
                "
                :disable="disabled"
              />
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
              />
            </div>

            <!-- SBF luz -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Luz?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.sbf_luz"
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- SBF agua -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Agua?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.sbf_agua"
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- SBF telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Teléfono?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.sbf_telefono"
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- SBF internet -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Internet?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.sbf_internet"
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- SBF cable -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Cable?</label>
              <option-group-component
                v-model="ficha.situacion_socioeconomica.sbf_cable"
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- SBF Servicios Sanitarios -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Servicios Sanitarios?</label>
              <option-group-component
                v-model="
                  ficha.situacion_socioeconomica.sbf_servicios_sanitarios
                "
                :options="optionsServiciosBasicos"
                :disable="disabled"
              />
            </div>

            <!-- apoya a algun familiar -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Apoya económicamente a algún familiar?</label
              >
              <option-group-component
                v-model="ficha.situacion_socioeconomica.apoya_familiar_externo"
                :disable="disabled"
              />
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
              />
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
          <composicion-familiar :datos="ficha.composicion_familiar" :accion="accion"/>

        </q-expansion-item>

        <!--8. Salud -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="8. SALUD"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Tiene discapacidad -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">¿Tiene discapacidad?</label>
              <option-group-component
                v-model="ficha.salud.tiene_discapacidad"
                :disable="disabled"
              />
            </div>
            <div
              class="col-12 col-md-9 col-sm-12"
              v-if="ficha.salud.tiene_discapacidad"
            >
              <q-btn
                color="primary"
                @click="agregarDiscapacidad(ficha.salud.discapacidades)"
                class="col-12 col-md-3 full-width"
                >Agregar discapacidad
              </q-btn>
              <essential-table
                :configuracionColumnas="[
                  ...configuracionColumnasDiscapacidades,
                  accionesTabla
                ]"
                :datos="ficha.salud.discapacidades"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :permitir-editar-celdas="true"
                :mostrar-header="false"
                :grid="false"
                :accion1="btnEliminarDefault(ficha.salud.discapacidades)"
                :alto-fijo="false"
                :ajustarCeldas="true"
              >
              </essential-table>
            </div>

            <!-- Sufre de alguna enfermedad crónica -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Sufre de alguna enfermedad crónica?</label
              >
              <option-group-component
                v-model="ficha.salud.tiene_enfermedad_cronica"
                :disable="disabled"
              />
            </div>

            <!-- Antiguedad -->
            <div
              class="col-12 col-md-3 q-mb-md col-sm-3"
              v-if="ficha.salud.tiene_enfermedad_cronica"
            >
              <label class="q-mb-sm block">Indique enfermedad crónica</label>
              <q-input
                v-model="ficha.salud.enfermedad_cronica"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>

            <!-- Alergias -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Alergias</label>
              <q-input
                v-model="ficha.salud.alergias"
                hint="Separe con comas para registrar varias alergias"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Lugar atencion -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Lugar de atención</label>
              <option-group-component
                v-model="ficha.salud.lugar_atencion"
                :disable="disabled"
                :options="optionsLugaresAtencion"
              />
            </div>

            <!-- familiar_cercano_dependiente_discapacitado -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Tiene familiar dependiente con discapacidad?</label
              >
              <option-group-component
                v-model="ficha.salud.tiene_familiar_dependiente_discapacitado"
                :disable="disabled"
              />
            </div>

            <!-- Nombre Familiar cercano discapacitado -->
            <div
              class="col-12 col-md-3"
              v-if="ficha.salud.tiene_familiar_dependiente_discapacitado"
            >
              <label class="q-mb-sm block">Nombre del familiar</label>
              <q-input
                v-model="ficha.salud.nombre_familiar_dependiente_discapacitado"
                placeholder="Obligatorio"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>

            <!-- Parentesco familiar discapacitado -->
            <div
              class="col-12 col-md-3 q-mb-md col-sm-3"
              v-if="ficha.salud.tiene_familiar_dependiente_discapacitado"
            >
              <label class="q-mb-sm block">Parentesco</label>
              <q-select
                v-model="ficha.salud.parentesco_familiar_discapacitado"
                :options="parentescos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="
                  !!v$.salud.parentesco_familiar_discapacitado.$errors.length
                "
                @blur="v$.salud.parentesco_familiar_discapacitado.$touch"
                error-message="Debes seleccionar un parentesco"
                use-input
                input-debounce="0"
                :option-value="v => v.value"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.salud.parentesco_familiar_discapacitado
                      .$errors"
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

            <div
              class="col-12 col-md-6 col-sm-12"
              v-if="ficha.salud.tiene_familiar_dependiente_discapacitado"
            >
              <q-btn
                color="primary"
                @click="
                  agregarDiscapacidad(
                    ficha.salud.discapacidades_familiar_dependiente
                  )
                "
                class="col-12 col-md-3 full-width"
                >Agregar discapacidad
              </q-btn>
              <essential-table
                :configuracionColumnas="[
                  ...configuracionColumnasDiscapacidades,
                  accionesTabla
                ]"
                :datos="ficha.salud.discapacidades_familiar_dependiente"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :permitir-editar-celdas="true"
                :mostrar-header="false"
                :grid="false"
                :accion1="
                  btnEliminarDefault(
                    ficha.salud.discapacidades_familiar_dependiente
                  )
                "
                :alto-fijo="false"
                :ajustarCeldas="true"
              >
              </essential-table>
            </div>
          </div>
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
                v-model="ficha.ambiente_social_familiar.problemas"
                type="checkbox"
                :options="optionsProblemasSociales"
                :disable="disabled"
              />
            </div>

            <!-- Observaciones -->
            <div class="col-12 col-md-12 q-mb-md col-sm-12">
              <label class="q-mb-sm block">Observaciones</label>
              <q-input
                v-model="ficha.ambiente_social_familiar.observaciones"
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
              />
            </div>

            <!-- conocimientos  -->
            <div class="col-12 col-md-6 " v-if="ficha.tiene_capacitaciones">
              <label class="q-mb-sm block">¿Tiene algún tipo de conocimiento sobre estos temas?</label>
              <option-group-component
                v-model="ficha.conocimientos"
                :options="optionsConocimientos"
                type="checkbox"
                :disable="disabled"
                :horizontal="false"
              />
            </div>

            <!-- capacitaciones -->
            <div class="col-12 col-md-6  " v-if="ficha.tiene_capacitaciones">
              <label class="q-mb-sm block">¿Ha recibido capacitaciones o algún curso de estas instituciones?</label>
              <option-group-component
                v-model="ficha.capacitaciones"
                :options="optionsCapacitaciones"
                type="checkbox"
                :disable="disabled"
                :horizontal="false"
              />
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
              <div v-for="error of v$.conclusiones.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>

          </q-input>
        </div>

      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./FichaSocioeconomicaPage.ts" />
