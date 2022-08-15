export class Progresiva {
  id: number | null
  codigo_tarea_jp: string | null
  codigo_subtarea_jp: string | null
  fecha: string | null
  grupo: string | null
  tecnico_responsable: string | null
  tecnico: string | null
  codigo_bobina: string | null
  marca_inicial: number | null
  marca_final: number | null
  // Informacion especifica
  tipo_elemento: string | null //*
  numero_poste: string | null
  propietario_elemento: string | null
  estado_elemento: string | null //*
  progresiva_entrada: string | null //*
  progresiva_salida: string | null
  herraje_instalado: string | null
  guardacabo: string | null
  preformado: string | null
  cintas3_4: string | null
  hebillas3_4: string | null
  tiene_placas_rotulo: boolean
  cantidad_placas_rotulo: number | null
  amarra15cm: string | null
  amarra30cm: string | null
  americano: string | null
  se_instalo_reserva: boolean
  se_instalo_manga: boolean
  poste_tiene_transformador: boolean
  cantidad_transformadores: number | null
  poste_tiene_retenidas: boolean
  cantidad_retenidas: number | null
  observaciones: string | null
  hora: string | null //*
  imagen: string | null //*
  latitud: string | null //*
  longitud: string | null //*

  constructor() {
    this.id = null
    this.codigo_tarea_jp = null
    this.codigo_subtarea_jp = null
    this.fecha = null
    this.grupo = null
    this.tecnico_responsable = null
    this.tecnico = null
    this.codigo_bobina = null
    this.marca_inicial = null
    this.marca_final = null
    // Informacion especifica
    this.tipo_elemento = null // POSTE - CAJA - AMERICANO - RADIO BASE - NODO
    this.numero_poste = null
    this.propietario_elemento = null // NO POSEE - TELCONET - CONECEL - OTECEL - CNEL - CAJA - EMPRESA ELECTRICA QUITO - CNT - NEDETEL
    this.estado_elemento = null // BUENO - MALO
    this.progresiva_entrada = null
    this.progresiva_salida = null
    this.herraje_instalado = null
    this.guardacabo = null
    this.preformado = null
    this.cintas3_4 = null
    this.hebillas3_4 = null
    this.tiene_placas_rotulo = true
    this.cantidad_placas_rotulo = null
    this.amarra15cm = null
    this.amarra30cm = null
    this.americano = null
    this.se_instalo_reserva = true
    this.se_instalo_manga = true
    this.poste_tiene_transformador = true
    this.cantidad_transformadores = 2
    this.poste_tiene_retenidas = true
    this.cantidad_retenidas = 4
    this.observaciones = null
    this.hora = null
    this.imagen = null
    this.latitud = null
    this.longitud = null
  }
}
