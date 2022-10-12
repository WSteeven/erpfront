import { Hidratable } from 'shared/entidad/domain/Hidratable'

export class TableroPersonal extends Hidratable {
  usuarios: number
  usuariosConectados: number
  usuariosConectadosDia: number
  usuariosConectadosMes: number
  usuarioConPlanesPagados: number
  usuarioConPlanesNoPagados: number
  serviciosActivos: number
  planesActivos: number
  pedidos: number
  reportes: number

  constructor() {
    super()
    this.usuarios = 0
    this.usuariosConectados = 0
    this.usuariosConectadosDia = 0
    this.usuariosConectadosMes = 0
    this.usuarioConPlanesPagados = 0
    this.usuarioConPlanesNoPagados = 0
    this.serviciosActivos = 0
    this.planesActivos = 0
    this.pedidos = 0
    this.reportes = 0
  }
}