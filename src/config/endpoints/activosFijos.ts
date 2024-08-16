import { Endpoint } from 'shared/http/domain/Endpoint'

export const activosFijos = {
  entregas_activos_fijos: new Endpoint('activos-fijos/entregas'),
  ingresos_activos_fijos: new Endpoint('activos-fijos/ingresos'),
  activos_fijos: new Endpoint('activos-fijos/activos-fijos'),
  stock_responsables_activos_fijos: new Endpoint('activos-fijos/stock-responsables-activos-fijos'),
  seguimiento_consumo_activos_fijos: new Endpoint('activos-fijos/seguimiento-consumo-activos-fijos'),
  activos_fijos_asignados: new Endpoint('activos-fijos/activos-fijos-asignados'),
  categorias_motivos_consumo_activos_fijos: new Endpoint('activos-fijos/categorias-motivos-consumo-activos-fijos'),
  motivos_consumo_activos_fijos: new Endpoint('activos-fijos/motivos-consumo-activos-fijos'),
  transferencias_activos_fijos: new Endpoint('activos-fijos/transferencias-activos-fijos'),
}
