<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="col-12 col-md-3">
          <!-- Fecha de inicio -->
          <label class="q-mb-sm block">Fecha Entrevista</label>
          <q-input
            v-model="entrevista.fecha_hora"
            placeholder="Obligatorio"
            :error="!!v$.fecha_hora.$errors.length"
            :disable="disabled"
            @blur="v$.fecha_hora.$touch"
            readonly
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <div class="q-gutter-md row items-start">
                    <q-date
                      v-model="entrevista.fecha_hora"
                      :mask="mask"
                      :options="optionsFecha"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                    <q-time
                      v-model="entrevista.fecha_hora"
                      :mask="mask"
                      :hourOptions="hourOptions"
                      :minuteOptions="minuteOptions"
                      color="primary"
                    />
                  </div>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_hora.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <!-- Fecha de inicio -->
          <label class="q-mb-sm block">Duración (minutos)</label>
          <q-input
            v-model="entrevista.duracion"
            type="number"
            step="5"
            placeholder="Duración de la entrevista (minutos)"
            :error="!!v$.duracion.$errors.length"
            :disable="disabled"
            @blur="v$.duracion.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.duracion.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <!-- Boton guardar -->
        <q-btn color="primary" no-caps push @click="agendar()">
          <q-icon name="bi-save" size="xs" class="q-pr-sm" />
          <span>Guardar</span>
        </q-btn>

        <q-btn color="negative" no-caps push @click="cancelar()">
          <q-icon name="bi-x" size="xs" class="q-pr-sm" />
          <span>Cancelar</span>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script src="./EntrevistarPage.ts" />
