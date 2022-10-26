export interface CustomActionTable {
  titulo: string
  accion: (param) => void
  visible?: (param) => boolean
}
