<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Justificaciones de Atrasos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-page class="q-pa-md">
          <q-card class="q-pa-md">

            <!-- Contenido del formulario -->
            <q-card-section>
              <div class="row q-col-gutter-md">
                <!-- Empleado -->
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Empleado</label>
                  <q-input
                    v-model="justificacion.empleado_id"
                    outlined
                    dense
                    readonly
                    hint="Nombre del empleado"
                  />
                </div>

                <!-- Minutos y Segundos de atraso -->
                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Minutos de Atraso</label>
                  <q-input
                    v-model="justificacion.minutos_atraso"
                    outlined
                    dense
                    readonly
                    hint="Minutos de atraso calculados"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <label class="q-mb-sm block">Segundos de Atraso</label>
                  <q-input
                    v-model="justificacion.segundos_atraso"
                    outlined
                    dense
                    readonly
                    hint="Segundos de atraso calculados"
                  />
                </div>

                <!-- Requiere Justificación -->
                <div class="col-12 col-md-3">
                  <br />
                  <q-toggle
                    v-model="justificacion.requiere_justificacion"
                    label="¿Requiere Justificación?"
                    color="positive"
                    :disable="disabled"
                  />
                </div>

                <!-- Justificación -->
                <div class="col-12" v-if="justificacion.requiere_justificacion">
                  <label class="q-mb-sm block">Justificación de Atraso</label>
                  <essential-editor
                    v-model="justificacion.justificacion"
                    :disable="disabled"
                  ></essential-editor>
                </div>
              </div>
            </q-card-section>

            <!-- Botones de Acción -->
            <q-card-actions align="right">
              <q-btn label="Guardar" color="primary" @click="guardar" />
            </q-card-actions>
          </q-card>
        </q-page>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./JustificacionPage.ts" lang="ts"></script>
