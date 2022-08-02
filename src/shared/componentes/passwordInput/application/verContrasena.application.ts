import {computed, ComputedRef, ref} from "vue"

export class VerContrasena {
  public tipoInputContrasena = ref<"text" | "password">("password")
  public iconoMostrarContrasena: ComputedRef<"bi-eye" | "bi-eye-slash">

  constructor() {
    this.iconoMostrarContrasena = computed(() =>
      this.tipoInputContrasena.value === "password" ? "bi-eye" : "bi-eye-slash"
    )
  }

  cambiarVisibilidadContrasena(): void {
    this.tipoInputContrasena.value =
      this.tipoInputContrasena.value === "password" ? "text" : "password"
  }
}
