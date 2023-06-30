import { QSpinnerBars, QSpinnerDots, QSpinnerGears, QSpinnerGrid, QSpinnerHourglass, QSpinnerIos, QSpinnerOrbit, QSpinnerRadio, useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef, Ref } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  $q = useCargandoStore().$q ?? useQuasar()
  // $q = useQuasar()
  // mensaje: Ref<string> = 'Cargando'

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
    // this.mensaje.value = 'Cargando...'
  }

  activar(): void {
    // this.store.activarCargando()
    this.$q.loading.show({
      spinner: QSpinnerOrbit,
      message: 'La operación está en progreso.<br/><span class="text-blue-grey-2 text-italic">Espere por favor...</span>',
      html: true,
      spinnerColor: 'white',
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
