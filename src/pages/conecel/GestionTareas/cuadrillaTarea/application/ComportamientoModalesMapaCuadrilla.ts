import {ComportamientoModales} from 'components/modales/application/ComportamientoModales';
import {MapaCuadrillaModales} from 'pages/conecel/GestionTareas/cuadrillaTarea/domain/MapaCuadrillaModales';

export class ComportamientoModalesMapaCuadrilla extends ComportamientoModales<MapaCuadrillaModales>{
    constructor() {
        super(new MapaCuadrillaModales())
    }
}