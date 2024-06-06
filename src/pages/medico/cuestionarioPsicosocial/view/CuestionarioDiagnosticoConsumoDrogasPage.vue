<template>
  <div class="row justify-between full-width">
    <q-img
      src="~assets/img/cuestionarios/alcohol_drogas/ministerio_salud_publica.png"
      width="200px"
      fit="contain"
    ></q-img>
    <q-img
      src="~assets/img/cuestionarios/alcohol_drogas/ministerio_trabajo_logo.png"
      width="200px"
      fit="contain"
    ></q-img>
    <q-img
      src="~assets/img/cuestionarios/alcohol_drogas/secretaria_tecnica_drogas_logo.png"
      width="200px"
      fit="contain"
    ></q-img>
  </div>

  <div class="row full-width border-bottom-black-2px q-pb-sm q-mb-md">
    <div class="col-12 text-bold text-center text-h6 q-pt-lg q-mb-md">
      DIAGNÓSTICO INICIAL PROGRAMA INTEGRAL DE REDUCCIÓN Y PREVENCIÓN DEL USO Y
      CONSUMO DE DROGAS EN EMPRESAS E INSTITUCIONES PÚBLICAS Y PRIVADAS
    </div>
  </div>
  <!--  <q-page
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
        CUESTIONARIO DE DIAGNOSTICO DE CONSUMO DE DROGAS
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
          v-if="item.cuestionario[0].respuesta !== null"
          v-model="item.respuesta"
          :options="mapearCuestionario(item.cuestionario)"
          color="primary"
          dense
        />
        <q-input
          v-if="item.cuestionario[0].respuesta === null"
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

<script setup></script>
<!-- <script src="./CuestionarioDiagnosticoConsumoDrogasPage.ts"></script> -->

<style scoped>
.centrar-card {
  display: block;
  justify-content: center;
  align-items: center;
  margin-left: 20%;
  margin-right: 20%;
}
</style>
