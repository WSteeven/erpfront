<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs" v-if="tieneEvaluacionCreada">
        <!-- Fecha de creación-->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha Creación</label>
          <q-input
            v-model="evaluacion.created_at"
            placeholder="Obligatorio"
            disable
            readonly
            outlined
            dense
          />
        </div>

        <!-- Fecha de realización-->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha Realización</label>
          <q-input
            v-model="evaluacion.fecha_realizacion"
            placeholder="Obligatorio"
            disable
            readonly
            outlined
            dense
          />
        </div>

        <div class="col-12 col-md-3">
          ¿Enviada al correo?
          <option-group-component v-model="evaluacion.enviada_mail" disable />
        </div>

        <div class="col-12 col-md-3">
          ¿Completada?
          <option-group-component v-model="evaluacion.completado" disable />
        </div>

        <div class="col-12 col-md-3">
          <q-btn
              v-if="evaluacion.completado"
              push
              no-caps
              @click="descargarEvaluacionResuelta"
              color="Positive"
          >
            <q-tooltip class="bg-dark">Descargar Resultados de Evaluación</q-tooltip>
            <q-icon name="bi-download" class="q-pr-sm" size="xs" />
            <span>Descargar</span>
          </q-btn>
        </div>
      </div>
      <div class="row q-col-gutter-xs" v-else>
        <callout-component
          mensaje="No tienes una evaluación de personalidad creada"
          tipo="info"
        />
        <small
          >Por favor da clic en el botón aquí abajo para habilitar la
          <strong>Evaluación de Personalidad</strong>
        </small>
        <q-btn
          push
          no-caps
          @click="enviarEvaluacionPostulante"
          color="secondary"
        >
          Crear Evaluación
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script src="./EvaluacionPersonalidadPage.ts" />
