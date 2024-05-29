// Dependencies
import { configuracionColumnasMantenimientosCorrectivos } from "../domain/configuracionColumnasMantenimientosCorrectivos";
import { configuracionColumnasMantenimientosPreventivos } from "../domain/configuracionColumnasMantenimientosPreventivos";
import { configuracionColumnasCustodios } from "../domain/configuracionColumnasCustodios";
import { required } from "shared/i18n-validators";
import { defineComponent, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { maskFecha } from "config/utils";
import { AxiosResponse } from "axios";
import { useQuasar } from "quasar";

// Components
import EssentialTable from "components/tables/view/EssentialTable.vue";

// Logica y controladores
import { HistorialVehiculo } from "../domain/HistorialVehiculo";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { HistorialVehiculoController } from "../infraestructura/HistorialVehiculoController";
import { useNotificacionStore } from "stores/notificacion";
import { useCargandoStore } from "stores/cargando";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { imprimirArchivo, notificarErrores, obtenerFechaActual } from "shared/utils";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { apiConfig, endpoints } from "config/api";
import { Vehiculo } from "pages/controlVehiculos/vehiculos/domain/Vehiculo";
import { useNotificaciones } from "shared/notificaciones";
import { historialVehiculos, optionsHistorialVehiculos } from "config/vehiculos.utils";
import { ServicioController } from "pages/controlVehiculos/servicios/infraestructure/ServicioController";

export default defineComponent({
    components: { EssentialTable },
    setup() {

        const mixin = new ContenedorSimpleMixin(HistorialVehiculo, new HistorialVehiculoController())
        const { entidad: historial, listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista, setValidador } = mixin.useComportamiento()
        const { notificarAdvertencia } = useNotificaciones()


        /****************************************
         * Stores
         ****************************************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const cargando = new StatusEssentialLoading()

        const vehiculoSeleccionado = ref()
        const listado = ref()
        const resultados = ref()
        const { vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: new VehiculoController(),
                empleados: new ConductorController(),
                servicios: { controller: new ServicioController(), params: { tipo: 'CORRECTIVO' } }
            })
            historial.fecha_fin = obtenerFechaActual(maskFecha)

            configuracionColumnasMantenimientosCorrectivos.find((item) => item.field === 'servicios')!.options = listadosAuxiliares.servicios.map((v) => { return { label: v.nombre, value: v.id } })
        })
        const reglas = {
            vehiculo: { required },
            fecha_inicio: { required },
            fecha_fin: { required },
            opciones: { required },
        }
        const v$ = useVuelidate(reglas, historial)
        setValidador(v$.value)

        function obtenerVehiculoSeleccionado(val) {
            vehiculoSeleccionado.value = vehiculos.value.filter((v: Vehiculo) => v.id === val)[0]
            console.log(vehiculoSeleccionado.value)
        }

        async function buscarReporte(accion) {
            if (await v$.value.$validate()) {
                try {
                    cargando.activar()
                    const axios = AxiosHttpRepository.getInstance()
                    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.historial_vehiculos) + '/' + historial.vehiculo
                    const filename = 'historial_vehiculo_' + vehiculoSeleccionado.value.placa
                    switch (accion) {
                        case 'excel':
                            historial.accion = 'excel'
                            imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, historial)
                            break
                        case 'pdf':
                            historial.accion = 'pdf'
                            imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, historial)
                            break
                        default:
                            historial.accion = ''
                            const response: AxiosResponse = await axios.post(url, historial)
                            console.log(response)
                            if (response.data.results) {
                                if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                                console.log(response.data.results)
                                resultados.value = response.data.results
                            } else console.log(listado.value)
                    }
                } catch (error) {
                    await notificarErrores(error)
                } finally {
                    cargando.desactivar()
                }
            }
        }



        return {
            historial, v$,
            configuracionColumnasCustodios,
            configuracionColumnasMantenimientosPreventivos,
            configuracionColumnasMantenimientosCorrectivos,
            vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
            opciones: optionsHistorialVehiculos,
            maskFecha,
            resultados,

            buscarReporte,
            obtenerVehiculoSeleccionado,
            optionCliqueada(val) {
                if (historial.opciones[historial.opciones.length - 1] === historialVehiculos.todos)
                    historial.opciones = historial.opciones.filter((v) => v === 'TODOS')
                else
                    historial.opciones = historial.opciones.filter((v) => v !== 'TODOS')
            }
        }
    }
})