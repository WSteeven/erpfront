type funcion = (param) => void
export interface CustomActionTable {
  titulo: string | funcion
  tooltip?: string
  accion: (param) => void
  visible?: (param) => boolean
  color?: string | funcion
  icono?: string | funcion
}

