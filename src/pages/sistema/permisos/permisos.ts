// import {ColumnConfig} from '@template/shared/components/tables/types'

export interface Permisos {
  menus: Menu[]
  grupos: string[]
  catalogos: Catalogos
  permisos: Record<string, any>
  transacciones: PermisosTransaccion[]
  error?: string
}

export interface Catalogos {
  negocios: Catalogo<any>
  clientes: Catalogo<any>
  proveedores: Catalogo<any>
  productos: Catalogo<any>
  categorias_productos: Catalogo<any>
  perfil_usuario: Catalogo<any>
}

export interface Catalogo<T> {
  fields: T[]
  pk: string
  orderby: string
  orientation: string
}

export interface Fields {
  field: string
  label: string
  width: number
  align: string
  format: string
  print: boolean
  type: string
  group: boolean
  operation: string
  orden: number
  hide?: boolean
}

export interface PermisosTransaccion {
  id: number
  codigo: string
  crear: boolean
  ver: boolean
  modificar: boolean
  eliminar: boolean
  anular: boolean
  reversar: boolean
  restaurar: boolean
  aprobar: boolean
  no_aprobar: boolean
  imprimir: boolean
  autorizar: boolean
  enviar_correo: boolean
  habilitar_edicion: boolean
  grupo: number
  transaccion: number
}

export interface Menu {
  header?: string
  title?: string
  route: string | null
  icon?: string
  tag?: string
  tagVariant?: string
  disabled?: boolean
  children?: Menu[]
  params?: Parametros
}

export interface Parametros {
  configuracion: number
  documento?: string
}
