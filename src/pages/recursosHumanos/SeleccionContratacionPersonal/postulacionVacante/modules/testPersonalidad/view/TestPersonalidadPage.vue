<template>
  <div v-if="error">
    <div v-if="completado">
      <callout-component :mensaje="mensaje" tipo="info" />
    </div>
    <q-banner v-else class="bg-red-2 text-red">
      No tienes los permisos necesarios para contestar este test.
    </q-banner>
  </div>
  <q-page class="q-pa-md" v-else>
    <div class="row q-col-gutter-md">
      <!-- Mapa lateral -->
      <div class="col-12 col-md-2">
        <q-card class="q-pa-sm">
          <div class="text-subtitle2 q-mb-sm">Mapa del test</div>
          <div class="row q-gutter-xs">
            <q-btn
              v-for="n in preguntasTestPersonalidad.length"
              :key="n"
              :label="n.toString()"
              :color="evaluacion.respuestas[n] ? 'green' : 'grey'"
              :class="
                evaluacion.respuestas[n] ? 'bg-green-1' : 'bg-grey-1'
              "
              flat
              dense
              size="sm"
              @click="irAPagina(Math.floor((n - 1) / preguntasPorPagina))"
            />
          </div>
        </q-card>
        <q-btn
          label="Enviar respuestas"
          color="primary"
          class="full-width q-mt-xl"
          @click="enviarRespuestas()"
          :disable="disable"
        />
      </div>
      <!--      {{respuestasTestPersonalidad}}-->
      <!-- Área de preguntas -->
      <div class="col-12 col-md-10">
        <callout-component
          style="text-align: end; margin-bottom: 12px"
          tipo="info"
          :mensaje="`Tiempo restante: <strong>${formatoTiempo(
            tiempoRestante
          )}</strong>`"
        />
        <!--        <q-banner class="bg-grey-5 text-white q-mb-md text-center">-->
        <!--          Tiempo restante: <strong>{{ formatoTiempo(tiempoRestante) }}</strong>-->
        <!--        </q-banner>-->

        <div
          v-for="(pregunta, index) in preguntasPaginadas"
          :key="index"
          class="q-mb-md"
        >
          <q-card class="q-pa-sm">
            <div class="text-subtitle2">
              {{ pregunta.id }}. {{ pregunta.texto }}
              <div v-if="pregunta.ejemplo" class="text-center q-mt-sm">
                <strong>{{ pregunta.ejemplo }}</strong>
              </div>
            </div>
            <option-group-component
              v-if="componenteCargado"
              v-model="evaluacion.respuestas[pregunta.id]"
              :options="getOpciones(pregunta)"
              :horizontal="false"
              type="radio"
            />
          </q-card>
        </div>

        <!-- Controles de paginación -->
        <div class="row justify-between q-mt-lg">
          <q-btn
            label="Anterior"
            :disable="paginaActual === 0"
            @click="paginaActual--"
          />
          <q-btn
            label="Siguiente"
            :disable="paginaActual >= totalPaginas - 1"
            @click="paginaActual++"
          />
        </div>

        <q-btn
          label="Enviar respuestas"
          color="primary"
          class="full-width q-mt-xl"
          @click="enviarRespuestas"
          :disable="disable"
        />
      </div>
    </div>
  </q-page>
</template>
<script src="./TestPersonalidadPage.ts" />
