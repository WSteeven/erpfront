<template>
  <q-page padding>
    <q-pa-xs-md>

      <q-row>
        <q-carousel animated v-model="slide" navigation infinite :autoplay="autoplay" arrows
          transition-prev="slide-right" transition-next="slide-left" @mouseenter="autoplay = false"
          @mouseleave="autoplay = true">
          <q-carousel-slide :name="1"
            img-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu9oEYyY5HK3BpL2GsAOV6wHrbHb1FkoTGu2pKqXKNlw&s">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Primera Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="2"
            img-src="https://media.licdn.com/dms/image/C5622AQGTv_MeiL8E9A/feedshare-shrink_800/0/1652387694729?e=2147483647&v=beta&t=VUJzxfpA4GRO2jKQ2pWDXnR8LNfh6IuirXfr1dZvODU">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Segunda Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="3"
            img-src="https://media.licdn.com/dms/image/C4D22AQHURssxoX0FAQ/feedshare-shrink_800/0/1643980715005?e=2147483647&v=beta&t=HLwKY4gOCsBPIBzusmztCrpCckmg858lLRvzotJFOK8">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Tercer Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="4"
            img-src="https://media.licdn.com/dms/image/C4E22AQFcGv81a4EkZg/feedshare-shrink_800/0/1640622491601?e=2147483647&v=beta&t=h-G900B6dvVy8Lp45OlGGSqA3foD5opmAFBmgeIYGgo">
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">Cuarta Noticia</div>
              <div class="text-subtitle1">JPCONSTRUCRED</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-row>
      <br>
      <div class="row justify-end">
        <q-col class="col">
          <q-input v-model="search" filled type="search" hint="" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-col>
        <q-col>
        </q-col>
      </div>
      <q-row>
        <q-col>
          col 1.
        </q-col>
        <q-col>
          col 2.
        </q-col>
        <q-col>
          col 3.
        </q-col>
      </q-row>
    </q-pa-xs-md>
  </q-page>
</template>

<style></style>

<script src="./TableroPersonalPage.ts"></script>
