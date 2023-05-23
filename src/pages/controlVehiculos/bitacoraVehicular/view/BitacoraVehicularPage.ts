//Dependencias
import { configuracionColumnasBitacoraVehicular } from '../domain/configuracionColumnasBitacoraVehicular';
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { BitacoraVehicular } from '../domain/BitacoraVehicular';
import { BitacoraVehicularController } from '../infraestructure/BitacoraVehicularController';
import { acciones } from 'config/utils';
import { ChoferController } from 'pages/recursosHumanos/empleados/infraestructure/ChoferController';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(BitacoraVehicular, new BitacoraVehicularController())
        const { entidad: bitacora, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const opciones_vehiculos = ref([])
        const opciones_choferes = ref([])
        cargarVista(async () => {
            await obtenerListados({
                choferes: new ChoferController(),
                vehiculos: new VehiculoController(),
                /* combustibles: {
                    controller: new CombustibleController(),
                    params: { campos: 'id,nombre' }
                } */
            })
        })
        //cargar datos en listados
        opciones_vehiculos.value = listadosAuxiliares.vehiculos
        opciones_choferes.value = listadosAuxiliares.choferes

        // Hooks

        //Reglas de validacion
        const reglas = {
            fecha: { required },
            hora_salida: { required },
            hora_llegada: { required },
            km_inicial: { required },
            km_final: { required },
            tanque_inicio: { required },
            tanque_final: { required },
            chofer: { required },
            vehiculo: { required },
        }
        const v$ = useVuelidate(reglas, bitacora)
        setValidador(v$.value)


        return {
            mixin, bitacora, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasBitacoraVehicular,
            //listados
            opciones_vehiculos,
            opciones_choferes,
            filtroVehiculos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_vehiculos.value = listadosAuxiliares.vehiculos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_vehiculos.value = listadosAuxiliares.vehiculos.filter((v) => v.placa.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroChoferes(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_choferes.value = listadosAuxiliares.choferes
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_choferes.value = listadosAuxiliares.choferes.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
                })
            },
            TanqueFinalValido: computed(() => bitacora.tanque_final! <= 100 || bitacora.tanque_final! >= 0),

        }
    }
})