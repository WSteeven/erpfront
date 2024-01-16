<template>
  <q-page padding>
    <div class="text-center text-shadow q-py-md">
      <div class="text-subtitle2 q-mb-md">{{ fecha }}</div>
      <div class="text-subtitle1 q-mb-md">
        Bienvenido, {{ store.nombreUsuario }}.
      </div>
      <div v-if="store.user?.grupo" class="text-subtitle2 q-mb-md">
        Grupo, {{ store.user.grupo }}.
      </div>

      <lottie-player
        :animationData="loginJson"
        background="transparent"
        :speed="1"
        style="width: 400px; height: 400px"
        loop
        autoplay
      ></lottie-player>

      <q-btn
        color="primary"
        href="https://drive.google.com/drive/folders/1Zv3eTjramxByFRht-L5Gz_nrulgFE32V?usp=sharing_eip_m&ts=64386770"
        target="_blank"
        no-caps
        push
        glossy
        >Manuales de usuario</q-btn
      >
      <!--<q-chip
        v-if="store.esCoordinador || store.esTecnicoLider"
        icon="bi-check"
        color="white"
        >16 Trabajos finalizados</q-chip
      > -->
    </div>

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./TableroPersonalPage.ts"></script>
