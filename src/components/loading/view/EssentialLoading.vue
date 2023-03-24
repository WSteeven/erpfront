<template>
  <!-- <transition name="fade" mode="out-in"> -->
  <!--  -->
  <section v-show="status.estaCargando.value" class="loading-background">
    <!--<q-spinner-cube size="4em" color="primary" class="q-mb-md" /> -->
    <q-circular-progress
      indeterminate
      size="75px"
      :thickness="0.6"
      color="primary"
      center-color="grey-2"
      class="q-ma-md"
    />
    <b class="text-primary">Espere, por favor...</b>
  </section>
  <!-- </transition> -->
</template>

<script setup>
import { StatusEssentialLoading } from '../application/StatusEssentialLoading'

const status = new StatusEssentialLoading()
</script>
