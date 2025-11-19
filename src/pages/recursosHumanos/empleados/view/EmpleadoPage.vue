<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Empleados"
    :tab-options="tabOptions"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarListadoEmpleados"
    :accion1Header="btnImprimirEmpleados"
    :accion1="btnHabilitarEmpleado"
    :accion2="btnDesHabilitarEmpleado"
    :accion3="btnDesvincular"
    :accion4="btnPlanVacaciones"
    :puedeFiltrar="false"
    :puedeExportar="true"
    :forzarListar="false"
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!--<q-card flat bordered class="q-mb-md">-->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información de inicio de sesión"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- usuario -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Usuario</label>
              <q-input
                v-model="empleado.usuario"
                placeholder="Obligatorio"
                :disable="
                  accion === acciones.nuevo ||
                  accion === acciones.consultar ||
                  empleado.generar_usuario
                "
                :error="!!v$.usuario.$errors.length"
                @blur="v$.usuario.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="usuario" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- correo -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                type="email"
                v-model="empleado.email"
                autogrow
                placeholder="Obligatorio"
                :disable="
                  accion === acciones.nuevo ||
                  accion === acciones.consultar ||
                  empleado.generar_usuario
                "
                :error="!!v$.email.$errors.length"
                @blur="v$.email.$touch"
                @update:model-value="v => (empleado.email = v.toLowerCase())"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="email" :v$="v$" />
                </template>
              </q-input>
            </div>

            <!-- Contraseña -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Contraseña</label>
              <q-input
                :type="isPwd ? 'password' : 'text'"
                v-model="empleado.password"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <!-- Estado -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Estado</label>
              <q-toggle
                :label="empleado.estado ? 'ACTIVO' : 'INACTIVO'"
                v-model="empleado.estado"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            <!-- Generar nombre de usuario -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="accion === acciones.editar"
            >
              <label class="q-mb-sm block">Generar Usuario</label>
              <q-toggle
                :label="empleado.generar_usuario ? 'Si' : 'NO'"
                v-model="empleado.generar_usuario"
                @update:model-value="reestablecer_usuario"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
          </div>
          <!--</q-card> -->
        </q-expansion-item>

        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos personales del trabajador"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <!-- Identificación -->
          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Identificación</label>
              <q-input
                v-model="empleado.identificacion"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.identificacion.$errors.length"
                @blur="v$.identificacion.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="identificacion" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Nombres -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Nombres</label>
              <q-input
                v-model="empleado.nombres"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.nombres.$errors.length"
                @blur="v$.nombres.$touch && obtenerUsername()"
                @update:model-value="v => (empleado.nombres = removeTildes(v))"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="nombres" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Apellidos -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Apellidos</label>
              <q-input
                ref="refApellidos"
                v-model="empleado.apellidos"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.apellidos.$errors.length"
                @update:model-value="
                  v => (empleado.apellidos = removeTildes(v))
                "
                @blur="v$.apellidos.$touch && obtenerUsername()"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="apellidos" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Telefono -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                type="tel"
                v-model="empleado.telefono"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.telefono.$errors.length"
                @blur="v$.telefono.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="telefono" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- correo -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Correo Personal</label>
              <q-input
                type="email"
                v-model="empleado.correo_personal"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.correo_personal.$errors.length"
                @blur="v$.correo_personal.$touch"
                @update:model-value="
                  v => (empleado.correo_personal = v.toLowerCase())
                "
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="correo_personal" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!--Tipo de Sangre -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Tipo de Sangre</label>
              <q-select
                v-model="empleado.tipo_sangre"
                :options="tipos_sangre"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Opcional"
                :error="!!v$.tipo_sangre.$errors.length"
                @blur="v$.tipo_sangre.$touch"
                :option-value="v => v.nombre"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="tipo_sangre" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- Estado Civil -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Estado Civil</label>
              <q-select
                v-model="empleado.estado_civil"
                :options="estadosCiviles"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.estado_civil.$touch"
                :error="!!v$.estado_civil.$errors.length"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="estado_civil" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- Genero -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Genero</label>
              <q-toggle
                :label="empleado.genero == 'M' ? 'Masculino' : 'Femenino'"
                v-model="empleado.genero"
                true-value="M"
                false-value="F"
                color="primary"
                keep-color
                icon="fa-solid fa-person"
                unchecked-icon="fa-solid fa-person-dress"
                :disable="disabled"
              />
            </div>
            <!-- Auto Identificacion Etnico -->
            <!-- <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">AutoIdentificacion Etnica</label>
              <q-select
                v-model="empleado.autoidentificacion_etnica"
                :options="autoidentificaciones_etnicas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.autoidentificacion_etnica.$touch"
                :error="!!v$.autoidentificacion_etnica.$errors.length"
                :option-value="(v) => v.value"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.autoidentificacion_etnica.$errors"
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
            </div> -->

            <!-- Orientacion Sexual -->
            <!-- <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Orientacion Sexual</label>
              <q-select
                v-model="empleado.orientacion_sexual"
                :options="orientaciones_sexuales"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.orientacion_sexual.$touch"
                :error="!!v$.orientacion_sexual.$errors.length"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.orientacion_sexual.$errors"
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
            </div> -->

            <!-- Identidad de genero -->
            <!-- <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Identidad de Genero</label>
              <q-select
                v-model="empleado.identidad_genero"
                :options="identidades_genero"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.identidad_genero.$touch"
                :error="!!v$.identidad_genero.$errors.length"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
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
            </div> -->

            <!-- Religion -->
            <!-- <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Religion</label>
              <q-select
                v-model="empleado.religion"
                :options="religiones"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.religion.$touch"
                :error="!!v$.religion.$errors.length"
                :option-value="(v) => v.id"
                :option-label="(v) => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.religion.$errors" :key="error.$uid">
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
            </div> -->

            <!-- Trabajador Sustituto -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block"
                >El trabajador sustituye a algún pariente</label
              >
              <q-toggle
                :label="empleado.trabajador_sustituto ? 'SI' : 'NO'"
                v-model="empleado.trabajador_sustituto"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            <!-- Convencional -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Convencional</label>
              <q-input
                type="tel"
                mask="(xx) xxx xxxx"
                hint="(xx) xxx xxxx"
                fill-mask
                v-model="empleado.convencional"
                placeholder="Obligatorio"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Fecha nacimiento -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Fecha de nacimiento</label>
              <q-input
                v-model="empleado.fecha_nacimiento"
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
                        v-model="empleado.fecha_nacimiento"
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
                  <error-component clave="fecha_nacimiento" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Numero de Cuenta bancarea -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Numero de Cuenta</label>
              <q-input
                v-model="empleado.num_cuenta"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.num_cuenta.$errors.length"
                @blur="v$.num_cuenta.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="num_cuenta" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Banco -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Banco</label>
              <q-select
                v-model="empleado.banco"
                :options="bancos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Obligatorio"
                :error="!!v$.banco.$errors.length"
                @blur="v$.banco.$touch"
                @filter="filtrarBancos"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="banco" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- Canton -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Canton</label>
              <q-select
                v-model="empleado.canton"
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
                :option-value="v => v.id"
                :option-label="v => v.canton"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="canton" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!--Dirección-->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="empleado.direccion"
                placeholder="obligatorio"
                type="textarea"
                :disable="disabled"
                :error="!!v$.direccion.$errors.length"
                autogrow
                @blur="v$.direccion.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="direccion" :v$="v$" />
                </template>
              </q-input>
            </div>

            <!-- Foto de perfil -->
            <div class="col-12 col-md-3 col-sm-3">
              <label for="q-mb-sm block">Foto de perfil</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="empleado.foto_url"
                :comprimir="true"
                :alto="'400px'"
                @update:model-value="data => (empleado.foto_url = data)"
              ></selector-imagen>
            </div>
          </div>
          <div class="col-12 col-md-12 q-ma-sm">
            <q-expansion-item
              class="overflow-hidden q-mb-md expansion"
              label="Datos adicionales"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <!-- Casa propia -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block">La casa donde vive es</label>
                  <q-toggle
                    :label="empleado.casa_propia ? 'PROPIA' : 'ALQUILADA'"
                    v-model="empleado.casa_propia"
                    color="primary"
                    keep-color
                    icon="bi-check2-circle"
                    unchecked-icon="clear"
                    :disable="disabled"
                  />
                </div>
                <!-- Vive con discapacitados -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block"
                    >Convive con personas discapacitadas</label
                  >
                  <q-toggle
                    :label="empleado.vive_con_discapacitados ? 'SI' : 'NO'"
                    v-model="empleado.vive_con_discapacitados"
                    color="primary"
                    keep-color
                    icon="bi-check2-circle"
                    unchecked-icon="clear"
                    :disable="disabled"
                  />
                </div>
                <!-- Casa propia -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block"
                    >Tiene a su cargo personas discapacitadas</label
                  >
                  <q-toggle
                    :label="empleado.responsable_discapacitados ? 'SI' : 'NO'"
                    v-model="empleado.responsable_discapacitados"
                    color="primary"
                    keep-color
                    icon="bi-check2-circle"
                    unchecked-icon="clear"
                    :disable="disabled"
                  />
                </div>
                <!-- Vive con discapacitados -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block">Tiene Discapacidad</label>
                  <q-toggle
                    :label="empleado.tiene_discapacidad ? 'SI' : 'NO'"
                    v-model="empleado.tiene_discapacidad"
                    color="primary"
                    keep-color
                    icon="bi-check2-circle"
                    unchecked-icon="clear"
                    :disable="disabled"
                  />
                </div>
                <!-- Coordenadas -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block"
                    >Coordenadas del lugar donde vive</label
                  >
                  <q-input
                    type="tel"
                    v-model="empleado.coordenadas"
                    :placeholder="
                      accion === 'EDITAR' ? 'Obligatorio' : 'Opcional'
                    "
                    :disable="disabled"
                    :error="!!v$.coordenadas.$errors.length"
                    @blur="v$.coordenadas.$touch"
                    outlined
                    dense
                  >
                    <template v-slot:error>
                      <error-component clave="coordenadas" :v$="v$" />
                    </template>
                  </q-input>
                </div>
                <!-- Talla de zapato -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block">Talla de zapato</label>
                  <q-input
                    v-model="empleado.talla_zapato"
                    :placeholder="
                      empleado.tiene_grupo ? 'Obligatorio' : 'Opcional'
                    "
                    type="number"
                    :disable="disabled"
                    :error="!!v$.talla_zapato.$errors.length"
                    @blur="v$.talla_zapato.$touch"
                    outlined
                    dense
                  >
                    <template v-slot:error>
                      <error-component clave="talla_zapato" :v$="v$" />
                    </template>
                  </q-input>
                </div>
                <!-- Talla de camisa -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block">Talla de camisa</label>
                  <q-select
                    v-model="empleado.talla_camisa"
                    :options="talla_letras"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    :disable="disabled"
                    options-dense
                    dense
                    outlined
                    :input-debounce="0"
                    use-input
                    hint="Opcional"
                    :error="!!v$.talla_camisa.$errors.length"
                    @blur="v$.talla_camisa.$touch"
                    :option-value="v => v.nombre"
                    :option-label="v => v.nombre"
                    emit-value
                    map-options
                  >
                    <template v-slot:error>
                      <error-component clave="talla_camisa" :v$="v$" />
                    </template>

                    <template v-slot:no-option>
                      <no-option-component />
                    </template>
                  </q-select>
                </div>
                <!-- Talla de guantes -->
                <div
                  class="col-12 col-md-3 col-sm-3"
                  v-if="empleado.tiene_grupo"
                >
                  <label class="q-mb-sm block">Talla de guantes</label>
                  <q-input
                    v-model="empleado.talla_guantes"
                    :placeholder="
                      empleado.tiene_grupo ? 'Obligatorio' : 'Opcional'
                    "
                    type="number"
                    :disable="disabled"
                    :error="!!v$.talla_guantes.$errors.length"
                    @blur="v$.talla_guantes.$touch"
                    outlined
                    dense
                  >
                    <template v-slot:error>
                      <error-component clave="talla_guantes" :v$="v$" />
                    </template>
                  </q-input>
                </div>
                <!-- Talla de pantalon -->
                <div class="col-12 col-md-3 col-sm-3">
                  <label class="q-mb-sm block">Talla de pantalon</label>
                  <q-input
                    v-model="empleado.talla_pantalon"
                    :placeholder="
                      empleado.tiene_grupo ? 'Obligatorio' : 'Opcional'
                    "
                    type="number"
                    :error="!!v$.talla_pantalon.$errors.length"
                    @blur="v$.talla_pantalon.$touch"
                    :disable="disabled"
                    outlined
                    dense
                  >
                    <template v-slot:error>
                      <error-component clave="talla_pantalon" :v$="v$" />
                    </template>
                  </q-input>
                </div>
                <div
                  class="col-12 col-md-6 col-sm-12"
                  v-if="empleado.tiene_discapacidad"
                >
                  <q-btn
                    color="primary"
                    @click="agregarDiscapacidad()"
                    class="col-12 col-md-3 full-width"
                    >Agregar discapacidad
                  </q-btn>
                  <essential-table
                    :configuracionColumnas="[
                      ...configuracionColumnasTipoDiscapacidadPorcentajeReactive,
                      accionesTabla
                    ]"
                    :datos="empleado.discapacidades"
                    :permitirConsultar="false"
                    :permitirEliminar="false"
                    :permitirEditar="false"
                    :mostrarBotones="false"
                    :permitir-editar-celdas="true"
                    :mostrar-header="false"
                    :grid="false"
                    :accion1="btnEliminarDiscapacidad"
                    :alto-fijo="false"
                    :ajustarCeldas="true"
                  >
                  </essential-table>
                </div>
              </div>
            </q-expansion-item>
          </div>
        </q-expansion-item>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información laboral"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Jefe -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Jefe inmediato</label>
              <q-select
                v-model="empleado.jefe"
                :options="empleados"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.jefe.$errors.length"
                @blur="v$.jefe.$touch"
                error-message="Debes seleccionar un jefe"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                @popup-show="ordenarLista(empleados, 'nombres')"
                :option-value="v => v.id"
                :option-label="v => v.nombres + ' ' + v.apellidos"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="jefe" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- Acumula fondos de reserva -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">¿Acumula fondos de reserva?</label>
              <q-toggle
                :label="
                  empleado.acumula_fondos_reserva
                    ? 'Acumula Fondos de Reserva'
                    : 'No Acumula Fondos de Reserva'
                "
                v-model="empleado.acumula_fondos_reserva"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            <!-- Estado -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">¿Esta Enrolado?</label>
              <q-toggle
                :label="empleado.esta_en_rol_pago ? 'Enrolado' : 'No enrolado'"
                v-model="empleado.esta_en_rol_pago"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">¿Factura?</label>
              <q-toggle
                :label="empleado.realiza_factura ? 'Factura' : 'No factura'"
                v-model="empleado.realiza_factura"
                color="primary"
                keep-color
                icon="bi-check2-circle"
                unchecked-icon="clear"
                :disable="disabled"
              />
            </div>
            <!-- Area -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Area</label>
              <q-select
                v-model="empleado.area"
                :options="areas"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @blur="v$.area.$touch"
                @filter="filtrarAreas"
                :error="!!v$.area.$errors.length"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="area" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- Departamento -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Departamento</label>
              <q-select
                v-model="empleado.departamento"
                :options="departamentos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @blur="v$.departamento.$touch"
                @filter="filtrarDepartamentos"
                @popup-show="ordenarLista(departamentos, 'nombre')"
                :error="!!v$.departamento.$errors.length"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="departamento" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!--Cargo -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Cargo</label>
              <q-select
                v-model="empleado.cargo"
                :options="cargos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @blur="v$.cargo.$touch"
                @filter="filtrarCargos"
                @popup-show="ordenarLista(cargos, 'nombre')"
                :error="!!v$.cargo.$errors.length"
                error-message="Debes seleccionar un cargo"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="cargo" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- {{ v$.$errors }} -->
            <!-- Roles -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Roles</label>
              <q-select
                v-model="empleado.roles"
                :options="roles"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                use-chips
                outlined
                multiple
                :disable="disabled"
                :readonly="disabled"
                use-input
                input-debounce="0"
                @filter="filtrarRoles"
                @popup-show="ordenarLista(roles, 'name')"
                @update:model-value="verificarRolesSeleccionados"
                :option-value="v => v.name"
                :option-label="v => v.name"
                :error="!!v$.roles.$errors.length"
                error-message="Debes seleccionar uno o varios roles"
                emit-value
                map-options
              >
                <template
                  v-slot:option="{ itemProps, opt, selected, toggleOption }"
                >
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      {{ opt.name }}
                      <q-item-label v-bind:inner-h-t-m-l="opt.nombres" />
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
                  <error-component clave="roles" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- Tipo Contrato -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Tipo Contrato</label>
              <q-select
                v-model="empleado.tipo_contrato"
                :options="tiposContratos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                @blur="v$.tipo_contrato.$touch"
                :error="!!v$.tipo_contrato.$errors.length"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="tipo_contrato" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>
            <!-- Nivel Académico -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Nivel Academico</label>
              <q-select
                v-model="empleado.nivel_academico"
                :options="niveles_academicos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                @blur="v$.nivel_academico.$touch"
                :error="!!v$.nivel_academico.$errors.length"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                :option-value="v => v.nombre"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="nivel_academico" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- Tipo de Titulo -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Título</label>
              <q-input
                v-model="empleado.titulo"
                placeholder="TITULO ACADEMICO"
                :disable="disabled"
                :error="!!v$.titulo.$errors.length"
                @blur="v$.titulo.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="titulo" :v$="v$" />
                </template>
              </q-input>
            </div>

            <!-- Horas pendientes de  -->
            <div
              class="col-12 col-md-3 col-sm-3"
            >
              <label class="q-mb-sm block"
                >Horas pendientes de recuperación o descuento en
                ROL</label
              >
              <q-input
                v-model="empleado.horas_pendientes"
                placeholder="TITULO ACADEMICO"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Fecha Ingreso -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Fecha de Ingreso</label>
              <q-input
                v-model="empleado.fecha_ingreso"
                placeholder="Obligatorio"
                :error="!!v$.fecha_ingreso.$errors.length"
                @blur="v$.fecha_ingreso.$touch"
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
                        v-model="empleado.fecha_ingreso"
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
                  <error-component clave="fecha_ingreso" :v$="v$" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3 q-mb-xl col-sm-3">
              <q-checkbox
                class="q-mt-lg q-pt-md"
                v-model="empleado.modificar_fecha_vinculacion"
                label="Modificar fecha Vinculacion"
                :disable="disabled"
                outlined
                dense
              ></q-checkbox>
            </div>
            <!-- Fecha Vinculacion -->
            <div
              class="col-12 col-md-3 col-sm-3"
              v-if="empleado.modificar_fecha_vinculacion"
            >
              <label class="q-mb-sm block">Fecha de vinculacion</label>
              <q-input
                v-model="empleado.fecha_vinculacion"
                placeholder="Opcional"
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
                        v-model="empleado.fecha_vinculacion"
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
              </q-input>
            </div>

            <!-- Fecha Salida -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Fecha de Salida</label>
              <q-input
                v-model="empleado.fecha_salida"
                placeholder="Opcional"
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
                        v-model="empleado.fecha_salida"
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
            <!-- Antiguedad -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Antiguedad</label>
              <q-input
                v-model="empleado.antiguedad"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <div class="col-12 col-md-3 q-mb-xl col-sm-3">
              <q-checkbox
                class="q-mt-lg q-pt-md"
                v-model="empleado.tiene_grupo"
                label="Pertenece a un grupo"
                :disable="disabled"
                outlined
                dense
              ></q-checkbox>
            </div>

            <!-- Grupo -->
            <div
              v-if="empleado.tiene_grupo"
              class="col-12 col-md-3 col-sm-3 q-mb-md"
            >
              <label class="q-mb-sm block">Grupo</label>
              <q-select
                v-model="empleado.grupo"
                :options="grupos"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                clearable
                use-input
                input-debounce="0"
                :error="!!v$.grupo.$errors.length"
                @blur="v$.grupo.$touch"
                @filter="filtrarGrupos"
                @popup-show="ordenarLista(grupos, 'nombre')"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component clave="grupo" :v$="v$" />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- Salario -->
            <div class="col-12 col-md-3 col-sm-3" v-if="esRecursosHumanos">
              <label class="q-mb-sm block">Salario</label>
              <q-input
                v-model="empleado.salario"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                :error="!!v$.salario.$errors.length"
                @blur="v$.salario.$touch"
                outlined
                dense
              >
                <template v-slot:error>
                  <error-component clave="salario" :v$="v$" />
                </template>
              </q-input>
            </div>
            <!-- Supa-->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Supa</label>
              <q-input
                v-model="empleado.supa"
                placeholder="Opcional"
                type="number"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Firma del empleado -->
            <div class="col-12 col-md-3 col-sm-3">
              <label for="q-mb-xl block">Firma</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="empleado.firma_url"
                :comprimir="false"
                :alto="'80px'"
                @update:model-value="data => (empleado.firma_url = data)"
              ></selector-imagen>
            </div>
            <!-- Telefono de la empresa -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Teléfono empresa</label>
              <q-input
                type="tel"
                mask="##########"
                v-model="empleado.telefono_empresa"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>
            <!-- Extensión -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Extensión</label>
              <q-input
                type="tel"
                mask="####"
                v-model="empleado.extension"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Observacion -->
            <div class="col-12 col-md-3 col-sm-3">
              <label class="q-mb-sm block">Observación</label>
              <q-input
                v-model="empleado.observacion"
                placeholder="opcional"
                type="textarea"
                :disable="disabled"
                autogrow
                outlined
                dense
              />
            </div>
          </div>
        </q-expansion-item>

        <!-- Manejo de archivos -  -->
        <div class="col-12 q-mb-md">
          <gestor-archivos
            ref="refArchivo"
            label="Carpeta Digitalizada del Empleado"
            :mixin="mixin"
            :disable="disabled"
            :listarAlGuardar="true"
            :permitir-eliminar="
              accion == acciones.nuevo || accion == acciones.editar
            "
            :idModelo="idEmpleado"
          >
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubirArchivos && accion != acciones.nuevo"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados
              </q-btn>
            </template>
          </gestor-archivos>
        </div>

        <div class="col-12 col-md-12" v-if="componenteCargado">
          <informacion-licencia
            v-if="mostrarComponenteInformacionLicencia"
            :mixin="mixin"
            :conductor="conductor"
            :identificacion="empleado.identificacion"
            :validar="mostrarComponenteInformacionLicencia"
          />
        </div>

        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Familiares"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <q-btn
              v-if="habilitarBotonAgregarFamiliares"
              color="positive"
              class="q-mx-lg"
              :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
              push
              rounded
              no-caps
              @click="agregarFamiliares()"
            >
              <q-icon
                name="bi-person-fill-add"
                size="xs"
                class="q-pr-sm"
              ></q-icon>
              <span>Agregar Familiares</span>
              <q-tooltip class="bg-dark"
                >Puede modificar o eliminar un familiar desde el panel
                familiares de empleados
              </q-tooltip>
            </q-btn>

            <div class="col-12 col-md-12">
              <essential-table
                v-if="construccionConfiguracionColumnas"
                ref="refFamiliares"
                titulo="Familiares"
                :configuracionColumnas="[
                  ...configuracionColumnasFamiliaresEmpleado,
                  accionesTabla
                ]"
                :datos="empleado.familiares"
                :permitirConsultar="false"
                :permitirEliminar="false"
                :permitirEditar="false"
                :mostrarBotones="false"
                :permitir-editar-celdas="true"
                :mostrar-header="false"
                :grid="false"
                :accion1="btnEliminarFamiliar"
                :alto-fijo="false"
                :ajustarCeldas="true"
              ></essential-table>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
  <modales-entidad
    :mostrar-boton-cerrar-modal="mostrarBotonCerrarModal"
    :comportamiento="modales"
    :mixin-modal="mixin"
    :persistente="!mostrarBotonCerrarModal"
    @guardado="guardado"
  ></modales-entidad>
</template>

<script src="./EmpleadoPage.ts" />
