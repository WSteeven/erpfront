<template>
  <div class="q-pa-md bg-grey-2">
    <p class="text-h6 text-center text-bold">2024-05-10</p>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        v-for="(evento, index) in eventos"
        :key="index"
        expand-separator
        :label="evento.titulo"
        group="evento"
        :caption="evento.fecha_hora_inicio+' - '+evento.fecha_hora_fin"
      >
        <q-card>
          <div
            class="fit row wrap justify-center items-start content-start q-my-md"
          >
            <q-img
              :src="evento.imagen"
              style="max-width: 500px; height: 250px"
            />
          </div>

          <q-card-section>
            {{ evento.descripcion }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script src="./VisualizarEventoPage.ts"></script>
