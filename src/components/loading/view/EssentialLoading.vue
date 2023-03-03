<template>
  <!-- <transition name="fade" mode="out-in"> -->
  <!--  -->
  <section v-show="status.estaCargando.value" class="loading-background">
    <q-spinner-cube size="4em" color="primary" class="q-mb-md" />
    <b class="text-primary">Cargando...</b>
  </section>
  <!-- </transition> -->
</template>

<script setup>
import { StatusEssentialLoading } from '../application/StatusEssentialLoading'

const status = new StatusEssentialLoading()
</script>
