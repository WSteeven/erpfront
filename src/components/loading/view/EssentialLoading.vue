<template>
  <!-- <transition name="fade" mode="out-in"> -->
  <!--  -->
  <section v-show="status.estaCargando.value" class="loading-background">
    <q-spinner-dots size="4em" color="primary" />
  </section>
  <!-- </transition> -->
</template>

<script setup>
import { StatusEssentialLoading } from '../application/StatusEssentialLoading'

const status = new StatusEssentialLoading()
</script>

<style>
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}
</style>
