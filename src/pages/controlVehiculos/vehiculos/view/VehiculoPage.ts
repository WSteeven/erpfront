//Dependencias
import { configuracionColumnasVehiculos } from '../domain/configuracionColumnasVehiculos'
import { required, maxLength, minLength, requiredIf } from 'shared/i18n-validators';
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue';

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Vehiculo } from '../domain/Vehiculo';
import { VehiculoController } from '../infraestructure/VehiculoController';
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController';
import { ModeloController } from 'pages/bodega/modelos/infraestructure/ModeloController';
import { CombustibleController } from 'pages/controlVehiculos/combustible/infraestructure/CombustibleController';
import { acciones, maskFecha } from 'config/utils';
import { opciones_traccion_vehiculos, tiposCategoriasVehiculos } from 'config/vehiculos.utils';
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController';
import { computed } from 'vue';
import { useAuthenticationStore } from 'stores/authentication';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { SeguroVehicularController } from 'pages/controlVehiculos/seguros/infraestructure/SeguroVehicularController';
import { obtenerFechaActual } from 'shared/utils';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ComportamientoModalesVehiculos } from '../application/ComportamientoModalesVehiculos';
import { TipoVehiculoController } from 'pages/controlVehiculos/tiposVehiculos/infraestructure/TipoVehiculoController';

export default defineComponent({
    components: { TabLayout, GestorArchivos, ModalesEntidad, LabelAbrirModal, },
    setup() {
        const mixin = new ContenedorSimpleMixin(Vehiculo, new VehiculoController(), new ArchivoController())
        const { entidad: vehiculo, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()

        const modales = new ComportamientoModalesVehiculos()

        /************************
         * Stores
         ***********************/
        const cargando = new StatusEssentialLoading()
        const store = useAuthenticationStore()

        const idVehiculo = ref()
        const refArchivo = ref()

        const { seguros, filtrarSeguros,
            marcas, filtrarMarcas,
            modelos, filtrarModelos,
            combustibles, filtrarCombustibles,
            tiposVehiculos, filtrarTiposVehiculos
        } = useFiltrosListadosSelects(listadosAuxiliares)

        const mostrarLabelModal = computed(() => accion.value === acciones.nuevo || accion.value === acciones.editar)
        cargarVista(async () => {
            await obtenerListados({
                marcas: {
                    controller: new MarcaController(),
                    params: { campos: 'id,nombre' }
                },
                modelos: {
                    controller: new ModeloController(),
                    params: { campos: 'id,nombre,marca_id' }
                },
                combustibles: {
                    controller: new CombustibleController(),
                    params: { campos: 'id,nombre' }
                },
                tipos_vehiculos: new TipoVehiculoController(),
                seguros: {
                    controller: new SeguroVehicularController(),
                    params: {
                        estado: 1,
                        'fecha_caducidad[operator]': '>',
                        'fecha_caducidad[value]': obtenerFechaActual(maskFecha),
                    }
                },
            })
            marcas.value = listadosAuxiliares.marcas
            modelos.value = listadosAuxiliares.modelos
            combustibles.value = listadosAuxiliares.combustibles
            seguros.value = listadosAuxiliares.seguros
            tiposVehiculos.value = listadosAuxiliares.tipos_vehiculos
        })

        //Reglas de validacion
        const reglas = {
            placa: { required },
            propietario: { required },
            num_motor: { required },
            num_chasis: { required },
            anio_fabricacion: { required, maximo: maxLength(4) },
            cilindraje: { required, maximo: maxLength(4) },
            rendimiento: { required, maximo: maxLength(2) },
            modelo: { required },
            combustible: { required },
            tipo: { required },
            tipo_vehiculo: { required },
            prendador: { requiredIf: requiredIf(() => vehiculo.tiene_gravamen) },
            traccion: { required },
            aire_acondicionado: { required },
            capacidad_tanque: { required },
            conductor_externo: { requiredIf: requiredIf(() => vehiculo.tipo == 'ALQUILADO') },
            identificacion_conductor_externo: { requiredIf: requiredIf(() => vehiculo.tipo == 'ALQUILADO') },
        }
        const v$ = useVuelidate(reglas, vehiculo)
        setValidador(v$.value)

        /*********************************
         * Hooks
        *********************************/
        onReestablecer(async () => {
            console.log(accion.value)
            console.log('Presionaste cancelar')

            refArchivo.value.limpiarListado() //se borra listado de archivos
        })
        onConsultado(() => {
            setTimeout(() => {
                refArchivo.value.listarArchivosAlmacenados(vehiculo.id)
            }, 1);
        })

        onGuardado((id: number) => {
            idVehiculo.value = id
            setTimeout(() => {
                subirArchivos()
            }, 1)
        })
        onModificado((id: number) => {
            idVehiculo.value = id
            setTimeout(() => {
                subirArchivos()
            }, 1)
        })


        /*********************************
         * Funciones
        *********************************/
        function guardado(data) {
            if (data.formulario === 'SeguroVehicularPage') {
                listadosAuxiliares.seguros.push(data.modelo)
            }
        }
        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        async function recargarSeguros() {
            cargando.activar()
            listadosAuxiliares.seguros = (await new SeguroVehicularController().listar({
                'estado': 1,
                'fecha_caducidad[operator]': '>',
                'fecha_caducidad[value]': obtenerFechaActual(maskFecha),
            })).result
            seguros.value = listadosAuxiliares.seguros
            cargando.desactivar()
        }
        function seleccionarModelo(val) {
            modelos.value = listadosAuxiliares.modelos.filter((v) => v.marca_id === val)
            vehiculo.modelo = ''
            if (modelos.value.length < 1) {
                vehiculo.modelo = ''
            }
            if (modelos.value.length === 1) {
                vehiculo.modelo = modelos.value[0]['id']
            }
        }
        function seleccionarMarca(val) {
            const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
            if (encontrado.length > 0) {
                marcas.value = listadosAuxiliares.marcas.filter((v) => v.id === encontrado[0]['marca_id'])
                vehiculo.marca = encontrado[0]['marca_id']
            }
        }




        return {
            mixin, vehiculo, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasVehiculos,
            refArchivo,
            idVehiculo,
            mostrarLabelModal,
            store,
            modales,
            //listados
            seguros, filtrarSeguros,
            marcas, filtrarMarcas,
            modelos, filtrarModelos,
            combustibles, filtrarCombustibles,
            opciones_traccion_vehiculos,
            tiposVehiculos, filtrarTiposVehiculos,
            tiposCategoriasVehiculos,

            //funciones
            recargarSeguros,
            seleccionarMarca,
            seleccionarModelo,
            guardado,



        }
    }
})
