<template>
  <tab-layout
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Evaluaciones de Desempeño"
    ajustar-celdas
    :accion1="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Evaluado -->
          <div class="col-12 col-md-4 q-mb-md col-sm-12">
            <label class="q-mb-sm block">Evaluador</label>
            <q-select
              v-model="evaluacion.evaluador"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.evaluador.$errors.length"
              @blur="v$.evaluador.$touch"
              error-message="Debes seleccionar el empleado evaluador"
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
                <error-component clave="evaluador" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Evaluado -->
          <div class="col-12 col-md-4 q-mb-md col-sm-12">
            <label class="q-mb-sm block">Empleado Evaluado</label>
            <q-select
              v-model="evaluacion.evaluado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.evaluado.$errors.length"
              @blur="v$.evaluado.$touch"
              error-message="Debes seleccionar un empleado al que se evalúa"
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
                <error-component clave="evaluado" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Formulario -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Formulario</label>
            <q-select
              v-model="evaluacion.formulario"
              :options="formularios"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-chips
              use-input
              input-debounce="0"
              :error="!!v$.formulario.$errors.length"
              @filter="filtrarFormularios"
              @update:model-value="formularioSeleccionado"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="formulario" :v$="v$" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Calificación</label>
            <q-input v-model="evaluacion.calificacion" disable dense outlined />
          </div>
          <div class="col-12 border-white rounded-4 q-mt-md q-pb-sm q-pr-sm">
            <p><strong>Definiciones de la escala:</strong></p>
            <p>
              <strong> 90 - 100 Excelente:</strong> Desempeño sobresaliente;
              repetidamente contribuye a la organización más allá de los
              requisitos del puesto. Un desempeño de excepcionalmente alta
              calidad y que deja muy poco que desear.
            </p>

            <p>
              <strong> 75 - 89 Muy Bueno:</strong> Desempeño marcado por la
              iniciativa y la ejecución inteligente; no sólo cumple los
              requisitos del trabajo, sino que generalmente contribuye más allá
              de su responsabilidad como individuo. Un desempeño “bueno” indica
              buen juicio, conocimiento, competencia y dominio del trabajo. Buen
              elemento para promoción.
            </p>

            <p>
              <strong> 50 - 74 Aceptable: </strong> Desempeño aceptable que
              maneja la responsabilidad de su trabajo con una competencia
              satisfactoria o adecuada. No es un buen candidato para
              promociones.
            </p>

            <p>
              <strong> 39 - 49 Susceptible de mejoras:</strong> Apenas cumple
              con los mínimos requisitos de desempeño. Necesita de mejoras
              sustanciales para poder proseguir trabajando en la Empresa.
            </p>

            <p>
              <strong> &lt; 38 Deficiente: </strong>Desempeño que no cumple con
              los requisitos mínimos. Ha necesitado la intervención del
              supervisor en repetidas ocasiones para cumplir con el trabajo. Es
              necesaria su separación de la Empresa.
            </p>
            <callout-component
              mensaje="Nota: Las evaluaciones que caen dentro de las categorías “Deficiente o Susceptible de mejoras” deben tener una explicación adicional por escrito, de ser necesario."
              tipo="info"
            />
          </div>
        </div>
        <div class="row justify-center" v-if="evaluacion.formulario">
          <!--              <form-page :id-formulario="evaluacion.formulario" />-->
          <q-card class="col-8 q-pa-md">
            <q-card-section>
              <h5 class="text-center">
                <strong>{{ formulario?.nombre }}</strong>
              </h5>
              <div
                v-for="(field, index) in evaluacion?.respuestas"
                :key="index"
                class="q-mb-md"
              >
                <q-separator />
                <DynamicFields :campo="field" :disable="disabled" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./EvaluacionDesempenoPage.ts" />
