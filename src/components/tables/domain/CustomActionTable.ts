type funcion<T> = (param: { entidad: Record<keyof T, any>, posicion: number }) => void
type funcionBoolean<T> = () => boolean
export interface CustomActionTable<T = any> {
  titulo: string | funcion<T>
  tooltip?: string
  accion: (param) => void
  visible?: funcionBoolean<T>
  color?: string | funcion<T>
  icono?: string | funcion<T>
}
