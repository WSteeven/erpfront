<template>
  <q-card class="q-mb-lg q-pa-md rounded">
    <div class="text-bold q-mb-lg">Información general</div>
    <DetalleTicket :ticket="ticket"></DetalleTicket>
    <br />
    <q-separator inset class="q-mt-md q-mb-xl"></q-separator>
    <div class="row q-col-gutter-xs">
      <!-- Observacion -->
      <div class="col-12">
        <label class="q-mb-sm block">Observación</label>
        <q-input
          v-model="calificar.observacion"
          placeholder="Obligatorio"
          outlined
          dense
          autogrow
          type="textarea"
          :error="!!v$.observacion.$errors.length"
          @blur="v$.observacion.$touch"
        >
          <template v-slot:error>
            <div v-for="error of v$.observacion.$errors" :key="error.$uid">
              <div>{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <label class="block">Calificación del servicio</label>
      <div class="col-12 q-px-xl q-mb-xl">
        <q-slider
          class="q-mt-xl"
          v-model="calificar.calificacion"
          snap
          color="orange"
          thumb-color="yellow-8"
          :min="1"
          :max="4"
          :step="1.0"
          markers
          marker-labels
          switch-marker-labels-side
        >
          <template v-slot:marker-label-group="{ markerMap }">
            <div class="q-mb-md text-center text-bold">
              {{ labelCalificacion }}
            </div>
            <div
              class="row items-center no-wrap"
              :class="markerMap[calificar.calificacion].classes"
              :style="markerMap[calificar.calificacion].style"
            >
              <q-icon
                v-if="calificar.calificacion === 0"
                size="xs"
                color="yellow-8"
                name="star_outline"
              />

              <template v-else>
                <q-icon
                  v-for="i in Math.floor(calificar.calificacion)"
                  :key="i"
                  size="xs"
                  color="yellow-8"
                  name="star_rate"
                />
              </template>
            </div>
          </template>
        </q-slider>
      </div>
    </div>

    <div class="row q-gutter-sm justify-end">
      <!-- Boton guardar -->
      <q-btn color="positive" no-caps push @click="enviarCalificacion()">
        <q-icon name="bi-stars" size="xs" class="q-pr-sm"></q-icon>
        <span>Calificar ticket</span>
      </q-btn>

      <q-btn color="negative" no-caps push @click="cancelar()">
        <q-icon name="bi-x" size="xs" class="q-pr-sm"></q-icon>
        <span>Cancelar</span>
      </q-btn>
    </div>
  </q-card>
</template>

<script src="./CalificarTicketPage.ts"></script>
