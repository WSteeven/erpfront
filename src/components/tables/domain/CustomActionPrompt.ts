type funcion = (param) => void

export interface CustomActionPrompt {
  titulo?: string,
  mensaje: string
  accion: (param) => void
  defecto?: string | number | null
  tipo?: string
  validacion?: funcion
  items?: any[]
  requerido?: boolean
}

