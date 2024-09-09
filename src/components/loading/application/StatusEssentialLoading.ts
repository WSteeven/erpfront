import { useQuasar, QSpinnerOval } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  $q = useCargandoStore().$q ?? useQuasar()

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
    // this.mensaje.value = 'Cargando...'
  }

  waitBackground = 'bg-desenfoque' //this.$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-4'
  activar(): void {
    this.$q?.loading?.show({
      delay: 400, // ms
      spinner: QSpinnerOval,
      spinnerColor: 'white',
      message: '<span class="text-white">La operación está en progreso.<br/><br/><small class="text-grey-8 text-bold q-py-xs q-px-sm ' + this.waitBackground + ' rounded-card">Espere por favor...</small></span>',
      html: true,
    })
    // console.log(this.store.cargando)
    this.store.cargando = true
  }

  // establecerMensaje(mensaje: string): void {
    // this.mensaje.value = mensaje
  // }

  desactivar(): void {
    this.$q.loading.hide()
    this.store.cargando = false
  }
  async cargarConsulta(callback: () => Promise<any>): Promise<any> {
    try {
      this.activar()
      return await callback()
    } catch (e) {
      throw e
    } finally {
      this.desactivar()
    }
  }
}
