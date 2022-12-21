<template>
  <q-btn
    v-if="scope.pagesNumber > 2"
    icon="first_page"
    color="grey-8"
    round
    dense
    flat
    :disable="scope.isFirstPage"
    @click="scope.firstPage"
  />

  <q-btn
    icon="chevron_left"
    color="secondary"
    round
    dense
    class="q-mr-xs"
    :flat="scope.isFirstPage"
    :disable="scope.isFirstPage"
    @click="scope.prevPage"
  />

  <q-btn
    icon="chevron_right"
    color="secondary"
    round
    dense
    :flat="scope.isLastPage"
    :disable="scope.isLastPage"
    @click="scope.nextPage"
  />

  <q-btn
    v-if="scope.pagesNumber > 2"
    icon="last_page"
    color="grey-8"
    round
    dense
    flat
    :disable="scope.isLastPage"
    @click="scope.lastPage"
  />
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
