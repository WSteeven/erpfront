import { QSpinnerGears, QSpinnerHourglass, useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef, Ref } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  $q = useCargandoStore().$q ?? useQuasar()

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
    // this.mensaje.value = 'Cargando...'
  }

  activar(): void {
    // this.store.activarCargando()
    this.$q.loading.show({
      spinner: QSpinnerGears,
      message: '<span class="text-white text-italic">La operación está en progreso.<br/><br/><small class="text-white text-italic q-py-xs q-px-sm bg-light-green rounded-card">Espere por favor...</small></span>',
      html: true,
      spinnerColor: 'white',
      customClass: 'bg-desenfoque-loading',
      // backgroundColor: 'white',
    })
  }

  establecerMensaje(mensaje: string): void {
    // this.mensaje.value = mensaje
  }

  desactivar(): void {
    // this.store.desactivarCargando()
    this.$q.loading.hide()
  }
}
