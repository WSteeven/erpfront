<template>
  <q-page padding class="dashboard-background">
    <div class="text-center text-shadow q-py-md">
      <!-- <div class="text-subtitle2 q-mb-md">{{ fecha }}</div> -->
      <div class="text-subtitle1 q-mb-md">
        Bienvenido, {{ store.nombreUsuario }}.
      </div>
      <div v-if="store.user?.grupo" class="text-subtitle2 q-mb-md">
        Grupo, {{ store.user.grupo }}.
      </div>

      <lottie-player v-if="false"
        :animationData="loginJson"
        background="transparent"
        :speed="1"
        style="width: 400px; height: 400px"
        loop
        autoplay
      ></lottie-player>

    </div>

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<style scoped>
.dashboard-background {
  background-image: url('assets/desk.jpeg');
  background-size: 40%;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
<script src="./TableroPersonalPage.ts"></script>
