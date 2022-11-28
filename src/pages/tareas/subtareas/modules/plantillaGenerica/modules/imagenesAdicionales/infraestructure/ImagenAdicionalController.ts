import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ImagenesAdicionales } from 'pages/tareas/tiposTareas/domain/ImagenesAdicionales'
import { endpoints } from 'config/api'

export class ImagenAdicionalController extends TransaccionSimpleController<ImagenesAdicionales> {
  constructor() {
    super(endpoints.imagenes_adicionales)
  }
}
