import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

// type funcion = (param) => void

export interface CustomActionPrompt {
  titulo: string,
  mensaje: string
  accion: (param) => void
  defecto?: string
  tipo?: string
  entidad?: any
}

