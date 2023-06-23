type funcion = (param) => void
export interface CustomActionTable {
  titulo: string | funcion
  accion: (param) => void
  visible?: (param) => boolean
  color?: string | funcion
  icono?: string | funcion
}

