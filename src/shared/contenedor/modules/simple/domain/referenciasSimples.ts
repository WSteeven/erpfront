import {Catalogos, Permisos} from "@/@app/sistema/permisos/permisos"
import {computed, Ref, ref} from "vue"
import {useStore} from "vuex"
import {Referencias} from "../../../domain/Referencias/referencias"

export class ReferenciasSimples<T> extends Referencias<T> {
  private store = useStore()
  refImportarExcel: Ref = ref()
  catalogo: keyof Catalogos

  constructor(catalogo: keyof Catalogos) {
    super()
    this.catalogo = catalogo
    // fields de la entidad actual
    this.fields = this.obtenerFields(catalogo)
  }

  private obtenerFields(catalogo: keyof Catalogos) {
    return computed(() => {
      let permisos: Permisos = this.store.state.permisos.permisos
      if (permisos) {
        return permisos.catalogos[catalogo].fields
      }
      this.store.dispatch("permisos/consultarPermisos")
      permisos = this.store.state.permisos.permisos
      return permisos.catalogos[catalogo].fields
    })
  }
}
