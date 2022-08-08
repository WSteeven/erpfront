<template>
  <transition name="fade" mode="out-in">
    <section v-show="cargando.estaCargando.value" class="loading-background">
      <div class="loading-logo">
        <img src="img/logo.svg" alt="Logo" />
      </div>
      <div class="points">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </section>
  </transition>
</template>
<script lang="ts" src="./cargando.page.ts"></script>

<style lang="scss" scoped>
.loading-background {
  position: absolute;
  top: 0;
  background-color: #fff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  .points {
    display: flex;
    align-items: flex-start;
    gap: 10px;

    :nth-child(1) {
      background-color: rgba($color: $primary, $alpha: 0.5);
      width: 14px;
      height: 14px;
    }
    :nth-child(2) {
      background-color: rgba($color: $primary, $alpha: 0.7);
      width: 20px;
      height: 20px;
    }
    :nth-child(3) {
      background-color: rgba($color: $primary, $alpha: 0.9);
      width: 14px;
      height: 14px;
    }
  }
}
</style>
