<template>
  <div
    class="bg-white q-pa-lg q-mt-sm"
    :class="!$q.screen.xs ? 'centrar-card' : 'row'"
  >
    <div class="row border-bottom-black-2px q-pb-sm q-mb-md">
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
      <div class="col-7 q-mx-auto q-my-xl border-black q-pa-sm">
        {{ objetivo }}
        <div class="text-bold">
          {{ 'ES IMPRESCINDIBLE RESPONDER A TODAS LAS PREGUNTAS' }}
        </div>
      </div>

      <div
        v-for="item in preguntas"
        :key="item.id"
        class="col-12 text-bold q-mb-md"
      >
        <label class="q-mb-sm block">{{
          item.codigo + '.- ' + item.pregunta
        }}</label>
        <q-option-group
          v-model="item.respuesta"
          :options="mapearArray(item.posibles_respuestas)"
          color="primary"
          dense
        />
      </div>
    </div>

    <div class="row justify-center">
      <button-submits
        :accion="accion"
        label-guardar="Guardar"
        :permitirCancelar="true"
        @guardar="guardarDatos()"
      />
    </div>
  </div>
</template>
<style>
.centrar-card {
  display: block;
  justify-content: center;
  align-items: center;
  margin-left: 25%;
  margin-right: 25%;
}
</style>
<script src="./CuestionarioPsicosocialPage.ts"></script>
