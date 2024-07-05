import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ChecklistVehiculo } from '../modules/checklistVehiculo/domain/ChecklistVehiculo'
import { ChecklistAccesoriosVehiculo } from '../modules/checklistAccesoriosVehiculo/domain/ChecklistAccesoriosVehiculo'
import { ChecklistImagenVehiculo } from '../modules/checklistImagenVehiculo/domain/ChecklistImagenVehiculo'

export class BitacoraVehicular extends EntidadAuditable {
    fecha: string | null
    hora_salida: string | null
    hora_llegada: string | null
    km_inicial: string | null
    imagen_inicial: string | null
    km_final: string | null
    tanque_inicio: number | null
    tanque_final: number | null
    firmada: boolean
    chofer: string | null
    chofer_id: number | null
    vehiculo: string | null
    vehiculo_id: number | null
    actividadesRealizadas: any
    tareas: string | null
    tickets: string | null
    checklistVehiculo: ChecklistVehiculo
    checklistAccesoriosVehiculo: ChecklistAccesoriosVehiculo
    checklistImagenVehiculo: ChecklistImagenVehiculo



    //accesorios del vehículo


    //imagenes del vehículo

    constructor() {
        super()
        this.fecha = null
        this.hora_salida = null
        this.hora_llegada = null
        this.km_inicial = null
        this.imagen_inicial = null
        this.km_final = null
        this.tanque_inicio = null
        this.tanque_final = null
        this.firmada = false
        this.chofer = null
        this.chofer_id = null
        this.vehiculo = null
        this.vehiculo_id = null
        this.actividadesRealizadas = []
        this.tareas = null
        this.tickets = null

        // partes del vehiculo
        this.checklistVehiculo = new ChecklistVehiculo(this.id)
        //accesorios del vehículo
        this.checklistAccesoriosVehiculo = new ChecklistAccesoriosVehiculo(this.id)
        //imagenes del vehículo
        this.checklistImagenVehiculo = new ChecklistImagenVehiculo(this.id)


    }
}