<template>
  <div class="input-group">
    <input
      class="form-control"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :type="verContrasena.tipoInputContrasena.value"
      :placeholder="placeholder"
    />
    <i
      class="input-group-text cursor-pointer"
      :class="verContrasena.iconoMostrarContrasena.value"
      @click="verContrasena.cambiarVisibilidadContrasena()"
    >
    </i>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {VerContrasena} from "@componentes/passwordInput/application/verContrasena.application"

export default defineComponent({
  name: "PasswordInput",
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      required: false,
      default: "Ingrese su contraseña",
    },
  },
  setup() {
    const verContrasena = new VerContrasena()

    return {verContrasena}
  },
})
</script>
