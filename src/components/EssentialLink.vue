<template>
  <q-item
    v-if="!children"
    clickable
    tag="a"
    :to="link"
    active-class="my-menu-link"
    exact
  >
    <q-item-section v-if="icon" avatar class="q-pa-sm">
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item
    v-else
    clickable
    tag="a"
    active-class="my-menu-link"
    exact
    :label="title"
    :icon="icon"
  >
    <q-item
      v-for="child in children"
      :key="child.title"
      tag="a"
      :to="child.link"
      active-class="my-menu-link"
      exact
    >
      <q-item-section v-if="child.icon" avatar class="q-pa-sm">
        <q-icon :name="child.icon" size="xs" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ child.title }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuOption } from 'pages/shared/menu/MenuOption'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },

    children: {
      type: Object as () => MenuOption[],
      required: false,
    },
  },
})
</script>

<style lang="scss">
.my-menu-link {
  background: rgba($primary, 0.1);
  border-right: 3px solid $primary;

  i {
    color: $primary;
  }

  .q-item__label {
    font-weight: bold;
  }
}
</style>
