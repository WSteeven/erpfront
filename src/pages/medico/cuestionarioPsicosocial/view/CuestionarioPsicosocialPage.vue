<template>
  <div class="row full-width border-bottom-black-2px q-pb-sm q-mb-md">
    <div class="col-4 text-left">
      <q-img
        src="~assets/img/cuestionarios/psicosocial/fpsico.png"
        class="full-width"
        height="100px"
        fit="contain"
      ></q-img>
    </div>
    <div class="col-8 text-bold text-right text-bold text-h6 q-pt-lg q-mb-md">
      CUESTIONARIO DE EVALUACIÓN <br />
      DE RIESGOS PSICOSOCIALES
    </div>
  </div>

  <div class="row q-mb-lg">
    <div class="col-7 q-mx-auto q-my-xl border-black text-justify q-pa-sm">
      {{ objetivo }}
      <div class="text-bold">
        {{ 'ES IMPRESCINDIBLE RESPONDER A TODAS LAS PREGUNTAS' }}
      </div>
    </div>

    <!-- <div v-if="mensaje" class="col-12 text-positive text-bold text-h5">
      <div class="q-mb-md">{{ mensaje }}</div>
      <q-rating
        :model-value="5"
        name="bi-star-fill"
        maz="5"
        color="amber"
      ></q-rating>
    </div> -->
  </div>
  <!-- <q-page
    class="bg-white q-pa-lg q-mt-sm"
    :class="!$q.screen.xs && !$q.screen.sm ? 'centrar-card' : 'row'"
  >
    <div class="row full-width border-bottom-black-2px q-pb-sm q-mb-md">
      <div class="col-6">
        <q-img
          src="~assets/img/fpsico.png"
          class="full-width"
          width="100"
        ></q-img>
      </div>
      <div class="col-6 text-bold text-right text-bold q-mb-md">
        CUESTIONARIO DE EVALUACIÓN DE RIESGOS PSICOSOCIALES
      </div>
    </div>

    <div class="row q-mb-lg">
      <div class="col-7 q-mx-auto q-my-xl border-black text-justify q-pa-sm">
        {{ objetivo }}
        <div class="text-bold">
          {{ 'ES IMPRESCINDIBLE RESPONDER A TODAS LAS PREGUNTAS' }}
        </div>
      </div>

      <div
        v-if="mensaje"
        class="col-12 text-positive text-bold text-center text-h5"
      >
        <div class="q-mb-md">{{ mensaje }}</div>
        <q-rating
          :model-value="5"
          name="bi-star-fill"
          maz="5"
          color="amber"
        ></q-rating>
      </div>

      <div
        v-for="item in listadosAuxiliares.preguntas"
        :key="item.id"
        class="col-12 text-bold q-mb-md"
      >
        <label class="q-mb-sm block">{{
          item.codigo + '.- ' + item.pregunta
        }}</label>
        <q-option-group
          v-if="item.cuestionario[0].respuesta"
          v-model="item.respuesta"
          :options="mapearCuestionario(item.cuestionario)"
          color="primary"
          dense
        />
        <q-input
          v-else
          v-model="item.respuesta"
          placeholder="Obligatorio"
          outlined
          dense
        >
        </q-input>
      </div>
    </div>

    <div class="row justify-center">
      <button-submits
        v-if="listadosAuxiliares.preguntas.length"
        :accion="accion"
        label-guardar="Guardar respuestas y enviar"
        :permitirCancelar="false"
        @guardar="guardarCuestionario()"
      />
    </div>
  </q-page> -->
</template>

<!-- <script src="./CuestionarioPsicosocialPage.ts"></script> -->
<script setup lang="ts">
const objetivo =
  'El objetivo de este cuestionario es conocer algunos aspectos sobre las condiciones psicosociales en tu trabajo. El cuestionario es anónimo y se garantiza la confidencialidad de las respuestas. Con el fin de que la información que se obtenga sea útil es necesario que contestes sinceramente a todas las preguntas. Si hay alguna pregunta sin contestar el cuestionario no será válido. Tras leer atentamente cada pregunta así como sus opciones de respuesta, marca en cada caso la respuesta que consideres más adecuada, señalando una sola respuesta por cada pregunta.'
</script>

<!-- <style scoped>
.centrar-card {
  display: block;
  justify-content: center;
  align-items: center;
  margin-left: 20%;
  margin-right: 20%;
}
</style> -->
