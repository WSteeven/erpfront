<template>
    <div>
    <div class="bg-grey-2" v-if="eventos.length > 1">
      <p class="text-h6 text-center text-bold">2024-05-10</p>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          v-for="(evento, index) in eventos"
          :key="index"
          expand-separator
          :label="evento.titulo"
          group="evento"
          dense
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
    <div class="row q-col-gutter-sm q-mt-md q-mx-md q-mb-md" v-if="eventos.length === 1">
      <q-card class="my-card">
        <img src="https://cdn.quasar.dev/img/mountains.jpg">
  
        <q-card-section>
          <div class="text-h6">{{ eventos[0].titulo }}</div>
          <div class="text-subtitle2">{{eventos[0].fecha_hora_inicio+' - '+eventos[0].fecha_hora_fin}}</div>
        </q-card-section>
  
        <q-card-section class="q-pt-none">
          {{ eventos[0].descripcion }}
  
        </q-card-section>
      </q-card>
    </div>
    </div>
  </template>
  <script src="./VisualizarEventoPage.ts"></script>
  