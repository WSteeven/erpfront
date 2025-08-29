<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-sm" v-if="tieneEvaluacionCreada">
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
        <!-- Observación -->
        <div
          class="col-12 col-md-6"
          v-if="accion !== acciones.nuevo || evaluacion.observacion"
        >
          <label class="q-mb-sm block">Observación</label>
          <q-input
            type="textarea"
            v-model="evaluacion.observacion"
            placeholder="Opcional"
            outlined
            :disable="disabled"
            dense
            autogrow
          />
        </div>
        <div class="col-12 col-md-3">
          <label class="block q-mb-sm">&nbsp;</label>
          <q-btn
            v-if="evaluacion.completado"
            no-caps
            unelevated
            no-wrap
            @click="descargarEvaluacionResuelta"
            color="positive"
          >
            <q-tooltip class="bg-dark"
              >Descargar Resultados de Evaluación
            </q-tooltip>
            <q-icon name="bi-download" class="q-pr-sm" size="xs" />
            <span>Descargar resultados</span>
          </q-btn>
        </div>
      </div>
      <div class="row q-col-gutter-xs" v-else>
        <div class="col-12">
          <callout-component
            mensaje="No tienes una evaluación de personalidad creada"
            tipo="info"
          />
        </div>
        <div class="col-12">
          <small
            >Por favor da clic en el botón aquí abajo para habilitar la
            <strong>Evaluación de Personalidad</strong>
          </small>
        </div>
        <div class="col-12">
          <q-btn
            push
            no-caps
            @click="enviarEvaluacionPostulante"
            color="secondary"
          >
            Crear Evaluación
          </q-btn>
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <div class="row q-gutter-xs">
          <q-btn
            v-if="accion === acciones.consultar"
            push
            no-caps
            @click="() => (accion = acciones.editar)"
            color="secondary"
          >
            <q-tooltip class="bg-dark"> Editar</q-tooltip>
            <q-icon name="bi-pencil-square" class="q-pr-sm" size="xs" />
            <span>Editar</span>
          </q-btn>
        </div>

        <ButtonSubmits
          :accion="accion"
          @editar="editar(evaluacion)"
          @cancelar="reestablecer"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script src="./EvaluacionPersonalidadPage.ts" />
