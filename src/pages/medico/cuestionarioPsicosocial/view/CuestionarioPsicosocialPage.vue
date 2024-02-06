<template>
  <q-page padding>
    <q-card class="rounded no-shadow">
      <q-card-section>
        <div class="text-primary text-bold q-mb-md">
          Cuestionario psicosocial
        </div>
        <div class="row">
          <div
            v-for="item in preguntas"
            :key="item.id"
            class="col-12 text-bold q-mb-md"
          >
            <label class="q-mb-sm block">{{item.codigo+'.- '+ item.pregunta }}</label>
           <!-- <q-select
              v-model="item.respuesta"
              :options="item.posibles_respuestas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(i) => i.label"
              :option-value="(i) => i.value"
              emit-value
              map-options
            >
            </q-select>-->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script src="./CuestionarioPsicosocialPage.ts"></script>
