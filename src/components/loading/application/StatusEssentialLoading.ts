import { QSpinnerIos, QSpinnerHourglass, useQuasar, QSpinnerBars } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef, Ref } from 'vue'
// import imagen from 'src/assets/loading.gif'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  $q = useCargandoStore().$q ?? useQuasar()

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
    // this.mensaje.value = 'Cargando...'
  }

  // imagen = 'google.gif'
  // spinner = '<div class="text-center q-mx-auto full-width"><img src="' + imagen + '"/></div>'
  waitBackground = 'bg-grey-8' //this.$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'
  activar(): void {
    // this.store.activarCargando()
    this.$q.loading.show({
      spinner: QSpinnerBars,
      spinnerColor: 'white',
      message: '<span class="text-white text-italic">La operación está en progreso.<br/><br/><small class=" text-italic text-bold q-py-xs q-px-sm ' + this.waitBackground + ' rounded-card">Espere por favor...</small></span>',
      html: true,
      // backgroundColor: this.$q.dark.isActive ? 'grey-10' : 'white',
      // customClass: 'bg-body',
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
