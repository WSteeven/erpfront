<template>
  <div v-if="can">
    <!-- No tiene submenus -->
    <q-item
      v-if="!children"
      clickable
      tag="a"
      :to="link"
      active-class="link-active"
      exact
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" size="xs" class="color-icono" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Tiene submenus -->
    <q-expansion-item v-else clickable tag="a" active-class="link-active" exact>
      <template #header>
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon" size="xs" class="color-icono" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
      </template>

      <div v-for="child in children" :key="child.title">
        <EssentialLink
          :title="child.title ?? ''"
          :link="child.link"
          :icon="child.icon"
          :children="child.children"
          :can="child.can"
          :class="{'bg-desenfoque border-white rounded q-mb-xs': !!child.children}"
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
    can: { type: Boolean, default: true },
  },
})
</script>
