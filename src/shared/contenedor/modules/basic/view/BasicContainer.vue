<template>
  <q-page :padding="!$q.screen.xs">
    <q-card class="rounded bg-desenfoque border-blue custom-shadow">
      <slot name="modales" />
      <slot name="contenido" />
    </q-card>
  </q-page>
</template>

<script setup>

</script>
