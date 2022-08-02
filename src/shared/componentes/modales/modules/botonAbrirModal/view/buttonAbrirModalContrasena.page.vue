<template>
  <!-- <label>
    {{ label }}
    <a :id="label" class="pointer" v-bind="$attrs" v-on="$listeners">
      <feather-icon
        :color="contrasenaSegura.value ? 'green' : 'red'"
        :icon="
          contrasenaSegura.value ? `${iconos.correcto}` : `${iconos.incorrecto}`
        "
      />
    </a>
    <b-tooltip
      :delay="{show: 1000, hide: 50}"
      :target="label"
      :title="'abrir el modal de ' + label"
      triggers="hover"
    />
  </label> -->
  <div></div>
</template>

<script lang="ts">
/* import {iconos} from "@config/utils.config"
import {defineComponent} from "@vue/composition-api"
import {BTooltip} from "bootstrap-vue"

export default defineComponent({
  components: {BTooltip},
  props: {
    label: String,
    contrasenaSegura: Object
  },
  setup() {
    return {
      iconos
    }
  }
}) */
</script>
