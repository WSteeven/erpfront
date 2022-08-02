import {computed, nextTick, onMounted, Ref, ref, watch} from "vue"
import {ArgumentosComponente} from "../types"

/**
 * funcion que devuelve los parametros que configura ag-grid
 * @template T tipo de dato
 * @param inst instancia de componente vue
 * @returns value, getValue, args, params, configuracion, columna
 */
export function useAgGridComponent<T>(inst: any | null): any {
  const refInput: Ref<any> = ref()
  // argumentos inyectados por ag-grid
  const args = ref<ArgumentosComponente<T> | undefined>(undefined)
  const value = ref<undefined | number | string>(undefined)
  // valor del data inyectado
  const propValue = computed<any | undefined>(() => args.value?.value)
  // parametros configurados (CellRendererParams)
  const params = computed(() => args.value?.params)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let onChange = () => {}
  const configurarOnChange = (fun: () => void) => {
    onChange = fun
  }
  // funcion requerida para actualizacion de celdas en ag-grid
  const getValue = () => {
    onChange()
    return value.value
  }
  // funcion que actualizar el valor de la celda
  const actualizar = (newValue: any) => {
    value.value = newValue // asignacion local
    // const key = args.value?.params.columna.field as string
    // args.value?.node.setDataValue(key, newValue)
  }
  // si la propiedad inyectada cambia su estado, actualiza el valor local
  watch(propValue, (newValue) => (value.value = newValue))

  /**
   *  contexto de configuracion
   */
  const configuracion = computed(() => params.value?.config)

  /**
   *  parametros de columna
   */
  const columna = computed(() =>
    params.value ? params.value.columna : undefined
  )

  onMounted(() => {
    // inyeccion de argumentos
    args.value = inst?.data.params
    // focus al input numerico
    nextTick(() => {
      if (refInput.value) {
        let input: HTMLElement | undefined
        // elementos directos
        if (refInput.value.focus) input = refInput.value
        // componentes
        else if (refInput.value.$el && refInput.value.$el.focus)
          input = refInput.value.$el
        // llamadas al input
        if (input && input.focus) {
          input.focus()
          if (input.nodeType === Node.TEXT_NODE) {
            setTimeout(
              () => (input as HTMLInputElement).setSelectionRange(0, -1),
              0
            )
          }
        }
      }
    })
  })

  return {
    refInput,
    value,
    getValue,
    configurarOnChange,
    actualizar,
    args,
    params,
    configuracion,
    columna,
  }
}
