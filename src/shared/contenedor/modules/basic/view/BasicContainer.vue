<template>
  <q-page :padding="!$q.screen.xs">
    <transition name="scale" mode="out-in">
      <slot name="modales" />
    </transition>
    <q-card class="rounded bg-desenfoque border-blue custom-shadow">
      <slot name="contenido" />
    </q-card>
  </q-page>
</template>

<script setup></script>
