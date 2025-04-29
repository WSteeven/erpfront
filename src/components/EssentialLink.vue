<template>
  <div v-if="can">
    <!-- No tiene submenus -->
    <q-item
      v-if="!children"
      clickable
      tag="a"
      :to="link"
      active-class="link-active"
      :class="{ 'border-left q-ml-lg': hasParent }"
      class="text-color-drawer"
      exact
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" size="xs" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Tiene submenus -->
    <q-expansion-item
      v-else
      clickable
      tag="a"
      active-class="link-active"
      exact
      :class="{
        'bg-desenfoque border-white rounded q-mb-xs': false,
        'border-left q-ml-lg': hasParent
      }"
    >
      <template #header>
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon" size="xs" class="text-color-drawer" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-color-drawer-bold textf-bold">{{
            title
          }}</q-item-label>
        </q-item-section>
      </template>

      <div v-for="child in children" :key="child.title">
        <EssentialLink
          :title="child.title ?? ''"
          :link="child.link"
          :icon="child.icon"
          :children="child.children"
          :can="child.can"
          hasParent
        ></EssentialLink>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    children: {
      type: Object as () => MenuOption[],
      required: false
    },
    can: { type: Boolean, default: true },
    hasParent: { type: Boolean, default: false }
  }
})
</script>
