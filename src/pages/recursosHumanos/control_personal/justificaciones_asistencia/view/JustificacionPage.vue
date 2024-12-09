<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Justificaciones"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-page class="q-pa-md">
          <q-card class="q-pa-md">
            <!-- Título -->
            <q-card-section>
              <div class="text-h6 text-primary">Justificación de Atrasos</div>
            </q-card-section>

            <!-- Contenido del formulario -->
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <!-- Empleado -->
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Empleado</label>
                  <q-input
                    v-model="justificacion.empleadoId"
                    outlined
                    dense
                    readonly
                    hint="Nombre del empleado"
                  />
                </div>

                <!-- Horas de atraso -->
                <div class="col-12 col-md-6">
                  <label class="q-mb-sm block">Horas de Atraso</label>
                  <q-input
                    v-model="justificacion.horasAtraso"
                    outlined
                    dense
                    readonly
                    hint="Horas de atraso calculadas"
                  />
                </div>

                <!-- Justificación -->
                <div class="col-12">
                  <label class="q-mb-sm block">Justificación</label>
                  <q-input
                    v-model="justificacion.justificacion"
                    type="textarea"
                    outlined
                    dense
                    autogrow
                    hint="Escriba la justificación"
                  />
                </div>
              </div>
            </q-card-section>

            <!-- Botones de Acción -->
            <q-card-actions align="right">
              <q-btn
                label="Guardar"
                color="primary"
                @click="guardar"
              />
            </q-card-actions>
          </q-card>
        </q-page>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./JustificacionPage.ts" lang="ts"></script>
