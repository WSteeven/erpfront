<template>
  <q-card>
    <q-card-section>
      <div>Aqui se colocan las coordenadas obtenidas:</div>
    </q-card-section>
    <q-card-section>
      <pre>
    {{ mensaje }}
  </pre
      >
    </q-card-section>
    <q-card-section>
      <div class="row rounded-borders q-py-none">
        <!-- Mapa -->
        <div class="col-12">
          <label class="q-mb-sm block">Mapa</label>
          <mapa-component
              ref="refMapa"
              :puntos="puntosMapa"
              :punto-seleccionado="puntoSeleccionado"
              :height="alturaMapa"
              @punto-click="seleccionarPunto"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script src="./CuadrillaPage.ts" />
