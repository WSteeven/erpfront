import { ComportamientoModales } from 'components/modales/application/ComportamientoModales';
import { SolicitudPuestoEmpleoModales } from '../domain/SolicitudDePersonalModales';

export class ComportamientoModalesSolicitudDePersonal extends ComportamientoModales<SolicitudPuestoEmpleoModales> {
    constructor() {
        super(new SolicitudPuestoEmpleoModales())
    }
}