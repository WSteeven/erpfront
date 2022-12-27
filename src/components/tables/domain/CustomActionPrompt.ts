type funcion = (param) => void

export interface CustomActionPrompt {
  titulo?: string,
  mensaje: string
  accion: (param) => void
  defecto?: string
  tipo?: string
  validacion?: funcion
}

