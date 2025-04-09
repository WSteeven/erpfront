type funcion<T> = (param) => void

export interface CustomActionPrompt<T = any> {
  titulo?: string,
  mensaje: string
  accion: (param) => void
  defecto?: string | number | null
  tipo?: string
  validacion?: funcion<T>
  items?: any[]
  requerido?: boolean
  placeholder?: string
}

