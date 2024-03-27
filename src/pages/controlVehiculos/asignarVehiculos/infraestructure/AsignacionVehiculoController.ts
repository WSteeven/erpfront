export class AsignacionVehiculoController extends TransacccionSimpleController<AsignacionVehiculo>{
    constructor(){
        super(endpoints.asignaciones_vehiculos)
    }
}