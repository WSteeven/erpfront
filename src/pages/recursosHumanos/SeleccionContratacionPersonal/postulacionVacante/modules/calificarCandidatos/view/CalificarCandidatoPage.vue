<template>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <!-- Precalificar -->
        <div class="col-12 col-md-4 col-sm-3">
          <label class="q-mb-sm block"> Calificar </label>
          <q-select
            v-model="postulacion.calificacion"
            :options="opciones"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :input-debounce="0"
            use-input
            @blur="v$.calificacion.$touch"
            :error="!!v$.calificacion.$errors.length"
          >
            <template v-slot:error>
              <div v-for="error of v$.calificacion.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>
      </div>
      <div class="row q-gutter-sm justify-end">
        <!-- Boton guardar -->
        <q-btn color="primary" no-caps push @click="calificar()">
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
<script src="./CalificarCandidatoPage.ts" />
