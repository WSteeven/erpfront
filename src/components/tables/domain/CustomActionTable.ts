export interface CustomActionTable {
  titulo: string
  accion: (param) => void
  visible?: (param) => boolean
  color?: string
  icono?: string
}
