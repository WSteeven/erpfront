type funcion<T> = (param: { entidad: Record<keyof T, any>, posicion: number, identificador?: number }) => void
type funcionBoolean<T> = (param: { entidad: Record<keyof T, any> }) => boolean
export interface CustomActionTable<T = any> {
  titulo: string | funcion<T>
  tooltip?: string
  accion: (param) => void
  visible?: funcionBoolean<T>
  color?: string | funcion<T>
  icono?: string | funcion<T>
}
