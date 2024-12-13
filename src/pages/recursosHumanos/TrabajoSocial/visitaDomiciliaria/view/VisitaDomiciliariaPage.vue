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
            <div class="col-12 col-md-4 col-sm-6">
              <label for="q-mb-xl block">Genograma</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="visita.imagen_genograma"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="data => (visita.imagen_genograma = data)"
              ></selector-imagen>
            </div>

            <!-- imagen_croquis -->
            <div class="col-12 col-md-4 col-sm-6">
              <label for="q-mb-xl block">Croquis</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="visita.imagen_croquis"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="data => (visita.imagen_croquis = data)"
              ></selector-imagen>
            </div>

            <!-- imagen_visita_domiciliaria -->
            <div class="col-12 col-md-4 col-sm-6">
              <label for="q-mb-xl block">Fotografía visita Domiciliaria</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="visita.imagen_visita_domiciliaria"
                :disable="disabled"
                :alto="'300px'"
                @update:model-value="data => (visita.imagen_visita_domiciliaria = data)"
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
                  <div
                    v-for="error of v$.salud.frecuencia_asiste_medico.$errors"
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

            <!-- Practica actividad_fisica -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >¿Practica actividad fisica o deporte?</label
              >
              <option-group-component
                v-model="visita.salud.practica_deporte"
                :disable="disabled"
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
                  <div
                    v-for="error of v$.salud.frecuencia_practica_deporte
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
          </div>
        </q-expansion-item>

        <!-- 5. Economia Familiar -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="5. ECONOMIA FAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12 text-center text-h6">
              <b>INGRESOS</b>
            </div>
            <div class="col-12">
              <essential-table
                :datos="visita.economia_familiar.ingresos"
                :configuracion-columnas="
                  [acciones.nuevo, acciones.editar].includes(accion)
                    ? [...configuracionColumnasIngresos, accionesTabla]
                    : configuracionColumnasIngresos
                "
                :titulo="null"
                :alto-fijo="false"
                :permitirBuscar="false"
                permitirEditarModal
                :permitir-consultar="false"
                :permitir-editar="false"
                :permitir-eliminar="false"
                :mostrarCantidadElementos="true"
                :accion1-header="btnAgregarIngreso"
                :accion1="btnEliminarDefault(visita.economia_familiar.ingresos)"
                :permitirEditarCeldas="true"
              />
            </div>
            <!-- Total de ingresos -->
            <div class="col-12 col-md-12 text-right">
              <label class="q-mb-sm text-h6 block"
                ><strong>Total de Ingresos: </strong>
                {{ visita.economia_familiar.total_ingresos }}</label
              >
            </div>

            <div class="col-12 text-center text-h6">
              <b>EGRESOS</b>
            </div>
            <!-- Vivienda -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Vivienda</label>
              <q-input
                v-model="visita.economia_familiar.eg_vivienda"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Servicios Básicos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Servicios Básicos</label>
              <q-input
                v-model="visita.economia_familiar.eg_servicios_basicos"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Educación -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Educación</label>
              <q-input
                v-model="visita.economia_familiar.eg_educacion"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Salud -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Salud</label>
              <q-input
                v-model="visita.economia_familiar.eg_salud"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Vestimenta -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Vestimenta</label>
              <q-input
                v-model="visita.economia_familiar.eg_vestimenta"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Alimentación -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Alimentación</label>
              <q-input
                v-model="visita.economia_familiar.eg_alimentacion"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Transporte -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Transporte</label>
              <q-input
                v-model="visita.economia_familiar.eg_transporte"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Préstamos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Préstamos</label>
              <q-input
                v-model="visita.economia_familiar.eg_prestamos"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Otros Gastos -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Otros Gastos</label>
              <q-input
                v-model="visita.economia_familiar.eg_otros_gastos"
                placeholder="Obligatorio"
                type="number"
                :disable="disabled"
                outlined
                dense
              />
            </div>

            <!-- Total de egresos -->
            <div class="col-12 col-md-12 text-right">
              <label class="q-mb-sm text-h6 block"
              ><strong>Total de Egresos: </strong>
                {{ visita.economia_familiar.total_egresos }}</label
              >
            </div>

            <!-- Total general -->
            <div class="col-12 col-md-12 text-right">
              <label class="q-mb-sm text-h6 block"
              ><strong>{{visita.economia_familiar.total<0? 'Déficit':'Superávit'}}: </strong>
                {{ Math.abs(visita.economia_familiar.total) }}</label
              >
            </div>

          </div>
        </q-expansion-item>

        <!-- 6. Vivienda -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="6. VIVIENDA"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
        <informacion-vivienda :vivienda="visita.vivienda"  :accion="accion" :disable="disabled" />
         <div class="row border-grey rounded-4 q-pa-xs q-ma-sm">
           <div class="col-12 text-center text-h6">
             <b>SERVICIOS BASICOS</b>
           </div>
          <servicios-basicos :servicio_basico="visita.servicios_basicos"/>
         </div>
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
              <div v-for="error of v$.diagnostico_social.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Observaciones del visitador social -->
        <div class="col-12 col-md-12 q-mb-md col-sm-12">
          <label class="q-mb-sm block">Observaciones del Visitador Social</label>
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
              <div v-for="error of v$.observaciones.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./VisitaDomiciliariaPage.ts" />
<script setup lang="ts"></script>
