import { TabOption } from "components/tables/domain/TabOption"

export const opciones_tipo_contribuyente = [
  { value: 'NATURAL', label: 'NATURAL' },
  { value: 'PRIVADA', label: 'PRIVADA' },
  { value: 'PUBLICA', label: 'PUBLICA' },
]

export const opciones_tipo_negocio = [
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
export const tiposOfertas={
  bienes:'BIENES',
  servicios:'SERVICIOS',
}

export const likertCalificacion = [
  { label: 'MUY BUENO', value: '5' },
  { label: 'BUENO', value: '4' },
  { label: 'NORMAL', value: '3' },
  { label: 'MALO', value: '2' },
  { label: 'MUY MALO', value: '1' },
]

export const tabOptionsOrdenCompra: TabOption[]=[
  {label: 'Sin Autorizador', value: '0'},
  {label: 'Autorizadas', value: '1'},
  {label: 'Canceladas', value: '2'}
]

export const estadosCalificacionProveedor = {
  vacio: 'SIN CONFIGURAR',
  pendiente: 'SIN CALIFICAR',
  calificado: 'CALIFICADO',
  parcial: 'PARCIAL',

}