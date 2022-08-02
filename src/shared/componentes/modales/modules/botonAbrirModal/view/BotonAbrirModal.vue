<template>
  <legend class="bv-no-focus-ring col-form-label pt-0" tabindex="-1">
    {{ label }}
    <a :id="label" class="pointer" v-bind="$attrs" v-on="$attrs">
      <i class="bi bi-plus-circle" />
    </a>
    <!-- <b-tooltip
      :delay="{show: 1000, hide: 50}"
      :target="label"
      :title="'abrir el modal de ' + label"
      triggers="hover"
    /> -->
  </legend>
  <div></div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
// import {BTooltip} from "bootstrap-vue"

export default defineComponent({
  name: "BotonAbrirModal",
  components: {},
  props: {label: String},
})
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  color: $texto;
}
</style>
