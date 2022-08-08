<template>
  <q-item clickable tag="a" :to="link" active-class="my-menu-link" exact>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss">
.my-menu-link {
  color: white;
  background: $primary;
  border-radius: 4px;
  box-shadow: 0 0 10px 1px rgba($primary, 0.5);
}
</style>
