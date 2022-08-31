// Tipos
export type TipoSeleccion = 'none' | 'single' | 'multiple'

export const acciones = {
  nuevo: 'NUEVO',
  eliminar: 'ELIMINAR',
  consultar: 'CONSULTAR',
  editar: 'EDITAR',
}

export const provincias = ['EL ORO', 'AZUAY', 'CAÑAR', 'CARCHI']
export const ciudades = ['MACHALA', 'PASAJE', 'SANTA ROSA']
export const tiposElementos = [
  'POSTE',
  'CAJA',
  'AMERICANO',
  'RADIO BASE',
  'NODO',
]
export const propietariosElementos = [
  'NO POSEE',
  'TELCONET',
  'CONECEL',
  'OTECEL',
  'CNEL',
  'CAJA',
  'EMPRESA ELECTRICA QUITO',
  'CNT',
  'NEDETEL',
]

export const estadoElementos = ['BUENO', 'MALO']

export const grupos = ['MACHALA', 'SANTO DOMINGO']

export const tiposInstalaciones = ['SUBTERRÁNEA', 'AEREA']

export const tiposTareasTelconet = ['TENDIDO DE FIBRA', 'COLOCACIÓN DE CAJAS']

export const tiposTareasNedetel = ['TENDIDO DE FIBRA', 'COLOCACIÓN DE CAJAS']
