import {computed, ComputedRef, reactive, Ref, ref, UnwrapRef} from "vue"
import {acciones} from "@config/utils.config"
import {ColumnConfig} from "@/@app/shared/componentes/tablas/types"

export class Referencias<T> {
  tabs: Ref
  validador: Ref
  filtros: {[key: string]: any}
  listado: Ref<any[]>
  fields!: Ref<ColumnConfig<T>[]>
  accion: Ref<string>
  disabled: ComputedRef<boolean>
  listadosAuxiliares: UnwrapRef<any>
  errors: Ref

  constructor() {
    this.errors = ref()
    // referencia para manipular los tabs
    this.tabs = ref()
    // referencia para ejecutar las validaciones
    this.validador = ref()
    // referencia para obtener listados
    this.listadosAuxiliares = reactive({})
    // filtros por defecto
    this.filtros = reactive({
      search: null,
      fields: null,
    })
    // referencia de listado
    this.listado = ref([])

    // accion actual de la vista
    this.accion = ref(acciones.nuevo)
    // boolean para desactivar la edicion en formularios
    this.disabled = computed(() => {
      return [acciones.eliminar, acciones.consultar].includes(this.accion.value)
    })
  }
}
