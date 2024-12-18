<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Ficha Socioeconomica"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListadoVisitas"
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
          {{ v$.$errors }}
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Colaborador -->
            <div class="col-12 col-md-3 q-mb-md col-sm-3">
              <label class="q-mb-sm block">Colaborador</label>
              <q-select
                v-model="visita.empleado"
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
                  <no-option-component />
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
                v-model="visita.lugar_nacimiento"
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
                v-model="visita.vivienda.telefono"
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
                v-model="visita.canton"
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
                  <no-option-component />
                </template>
              </q-select>
              <!--              </q-input>-->
            </div>

            <!-- En caso de emergencia  -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block"
                >En caso de emergencia llamar a
              </label>
              <q-input
                v-model="visita.contacto_emergencia"
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
                v-model="visita.parentesco_contacto_emergencia"
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
                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- telefono -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Teléfono </label>
              <q-input
                v-model="visita.telefono_contacto_emergencia"
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
        </q-expansion-item>
        <!-- 2. SITUACIÓN SOCIOFAMILIAR -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. SITUACIÓN SOCIOFAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <composicion-familiar
            :mixin="mixin"
            :datos="visita.composicion_familiar"
            :accion="accion"
          />
        </q-expansion-item>

        <!-- 3. GENOGRAMA -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="3. GENOGRAMA, CROQUIS Y FOTOGRAFA VISITA DOMICILIARIA"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Genograma -->
            <div class="col-12 col-md-6 col-sm-12">
              <label for="q-mb-xl block">Genograma</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="visita.imagen_genograma"
                :error="!!v$.imagen_genograma.$errors.length"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="data => (visita.imagen_genograma = data)"
              ></selector-imagen>
            </div>

            <!-- imagen_visita_domiciliaria -->
            <div class="col-12 col-md-6 col-sm-12">
              <label for="q-mb-xl block">Fotografía visita Domiciliaria</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="visita.imagen_visita_domiciliaria"
                placeholder="Obligatorio"
                :error="!!v$.imagen_visita_domiciliaria.$errors.length"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="
                  data => (visita.imagen_visita_domiciliaria = data)
                "
              ></selector-imagen>
            </div>
          </div>
        </q-expansion-item>

        <!-- 4. Salud -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="4. SALUD"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <salud-empleado
            :salud="visita.salud"
            :mixin="mixin"
            :accion="accion"
            :disable="disabled"
          />
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Frecuencia con la que asiste al medico -->
            <div class="col-12 col-md-3 q-mb-md col-sm-6">
              <label class="q-mb-sm block"
                >Frecuencia con que asiste al médico</label
              >
              <q-select
                v-model="visita.salud.frecuencia_asiste_medico"
                :options="opcionesPeriodicidad"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.salud.frecuencia_asiste_medico.$errors.length"
                @blur="v$.salud.frecuencia_asiste_medico.$touch"
                error-message="Debes seleccionar una opción"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component
                    :v$="v$"
                    clave="salud.frecuencia_asiste_medico"
                  />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- Practica actividad_fisica -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Practica actividad fisica o deporte?</label
              >
              <option-group-component
                v-model="visita.salud.practica_deporte"
                :disable="disabled"
                clave="salud.practica_deporte"
                :v$="v$"
                :error="!!v$.salud.practica_deporte.$errors.length"
              />
            </div>

            <!-- Frecuencia con la que asiste al medico -->
            <div
              class="col-12 col-md-3 q-mb-md col-sm-6"
              v-if="visita.salud.practica_deporte"
            >
              <label class="q-mb-sm block"
                >Frecuencia con que lo practica</label
              >
              <q-select
                v-model="visita.salud.frecuencia_practica_deporte"
                :options="opcionesPeriodicidad"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.salud.frecuencia_practica_deporte.$errors.length"
                @blur="v$.salud.frecuencia_practica_deporte.$touch"
                error-message="Debes seleccionar una opción"
                use-input
                input-debounce="0"
                @filter="filtrarEmpleados"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <error-component
                    :v$="v$"
                    clave="salud.frecuencia_practica_deporte"
                  />
                </template>

                <template v-slot:no-option>
                  <no-option-component />
                </template>
              </q-select>
            </div>

            <!-- deporte practicado -->
            <div
              class="col-12 col-md-3 q-mb-md"
              v-if="visita.salud.practica_deporte"
            >
              <label class="q-mb-sm block">Deporte/s que practica </label>
              <q-input
                v-model="visita.salud.deporte_practicado"
                :disable="disabled"
                hint="Separe con comas para registrar varios deportes"
                :error="!!v$.salud.deporte_practicado.$errors.length"
                @blur="v$.salud.deporte_practicado.$touch"
                dense
                outlined
              >
                <template v-slot:error>
                  <error-component :v$="v$" clave="salud.deporte_practicado" />
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>
        <!-- 5. Economia Familiar -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="5. ECONOMIA FAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <economia-familiar
            :economia_familiar="visita.economia_familiar"
            :disabled="disabled"
            :accion="accion"
          />
        </q-expansion-item>

        <!-- 6. Vivienda -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="6. VIVIENDA"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <informacion-vivienda
            :vivienda="visita.vivienda"
            :accion="accion"
            :disable="disabled"
          />
        </q-expansion-item>

        <!-- 11. CROQUIS -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="11. CROQUIS"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <croquis-vivienda :vivienda="visita.vivienda" :disable="disabled" />
        </q-expansion-item>

        <!-- Diagnostico social -->
        <div class="col-12 col-md-12 q-mb-md col-sm-12">
          <label class="q-mb-sm block">Diagnóstico Social</label>
          <q-input
            v-model="visita.diagnostico_social"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.diagnostico_social.$errors.length"
            @blur="v$.diagnostico_social.$touch"
            autogrow
            outlined
            dense
          >
            <template v-slot:error>
              <error-component :v$="v$" clave="diagnostico_social" />
            </template>
          </q-input>
        </div>

        <!-- Observaciones del visitador social -->
        <div class="col-12 col-md-12 q-mb-md col-sm-12">
          <label class="q-mb-sm block"
            >Observaciones del Visitador Social</label
          >
          <q-input
            v-model="visita.observaciones"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.observaciones.$errors.length"
            @blur="v$.observaciones.$touch"
            autogrow
            outlined
            dense
          >
            <template v-slot:error>
              <error-component :v$="v$" clave="observaciones" />
            </template>
          </q-input>
        </div>
        {{ visita }}
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./VisitaDomiciliariaPage.ts" />
<script setup lang="ts"></script>
