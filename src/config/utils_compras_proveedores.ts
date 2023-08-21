import { TabOption } from "components/tables/domain/TabOption"

export const opcionesTipoContribuyente = [
  { value: 'NATURAL', label: 'NATURAL' },
  { value: 'PRIVADA', label: 'PRIVADA' },
  { value: 'PUBLICA', label: 'PUBLICA' },
]

export const opcionesTipoNegocio = [
  { value: 'RIMPE CON IVA', label: 'RIMPE CON IVA' },
  { value: 'RIMPE SIN IVA', label: 'RIMPE SIN IVA' },
]
export const opcionesTipoContacto = [
  { value: 'TECNICO', label: 'TÉCNICO' },
  { value: 'FINANCIERO', label: 'FINANCIERO' },
  { value: 'COMERCIAL', label: 'COMERCIAL' },
]
export const opcionesForma = [
  { value: 'CONTADO', label: 'CONTADO' },
  { value: 'CREDITO', label: 'CREDITO' },
  { value: 'TRANSFERENCIA', label: 'TRANSFERENCIA' },
  { value: 'CHEQUE', label: 'CHEQUE' },
  { value: 'CANJE', label: 'CANJE' },
]
export const opcionesTiempo = [
  { value: '7 DIAS', label: '7 DIAS' },
  { value: '15 DIAS', label: '15 DIAS' },
  { value: '30 DIAS', label: '30 DIAS' },
]

export const opcionesOfertas = [
  { value: 1, label: 'BIENES' },
  { value: 2, label: 'SERVICIOS' },
]
export const opcionesUnidadesMedida = [
  { value: 1, label: 'UNIDAD' },
  { value: 2, label: 'KILOGRAMO' },
  { value: 3, label: 'METRO' },
  { value: 4, label: 'METRO' },
  { value: 5, label: 'KILOMETRO' },
  { value: 6, label: 'KILOMETRO CUBICO' },
  { value: 7, label: 'LITRO' },
  { value: 8, label: 'KIT' },
]
export const tiposOfertas = {
  bienes: 'BIENES',
  servicios: 'SERVICIOS',
}

export const likertCalificacion = [
  { label: 'MUY BUENO', value: '5' },
  { label: 'BUENO', value: '4' },
  { label: 'NORMAL', value: '3' },
  { label: 'MALO', value: '2' },
  { label: 'MUY MALO', value: '1' },
]

export const tabOptionsPrefactura: TabOption[] = [
  { label: 'Creadas', value: '2' }, //estado CREADO
  { label: 'Anuladas', value: '4' }, //estado ANULADO
]
export const tabOptionsOrdenCompra: TabOption[] = [
  { label: 'Pendientes', value: '1' }, //autorizacion PENDIENTE
  { label: 'Autorizadas', value: '2' }, //autorizacion APROBADO
  { label: 'Canceladas', value: '3' }  //autorizacion CANCELADO
]
export const tabOptionsProformas: TabOption[] = [
  { label: 'Pendientes', value: '1' }, //autorizacion PENDIENTE
  { label: 'Autorizadas', value: '2' }, //autorizacion APROBADO
  { label: 'Canceladas', value: '3' },  //autorizacion CANCELADO
  { label: 'Completadas', value: '4' }, //estado ANULADO
  { label: 'Anuladas', value: '5' }  //autorizacion CANCELADO
]
export const tabOptionsPreordenCompra: TabOption[] = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Completa', value: 'COMPLETA' },
  { label: 'Anulada', value: 'NO REALIZADA' }
]

export const estadosCalificacionProveedor = {
  vacio: 'SIN CONFIGURAR',
  pendiente: 'SIN CALIFICAR',
  calificado: 'CALIFICADO',
  parcial: 'PARCIAL',
}