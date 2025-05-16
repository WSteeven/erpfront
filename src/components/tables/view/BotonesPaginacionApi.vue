<template>
  <div class="row">
    <!-- v-if="scope.pagesNumber > 2" -->
    <q-btn
      icon="first_page"
      color="primary"
      dense
      flat
      :disable="scope.isFirstPage"
      @click="scope.firstPage"
    />

    <q-btn
      icon="chevron_left"
      color="primary"
      dense
      class="q-mr-xs"
      flat
      :disable="scope.isFirstPage"
      @click="scope.prevPage"
    />

    <q-btn
      icon="chevron_right"
      color="primary"
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.nextPage"
    />

    <!-- v-if="scope.pagesNumber > 2" -->
    <q-btn
      icon="last_page"
      color="primary"
      round
      dense
      flat
      :disable="scope.isLastPage"
      @click="scope.lastPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  scope: {
    type: Object,
    required: true,
  },
})
</script>
