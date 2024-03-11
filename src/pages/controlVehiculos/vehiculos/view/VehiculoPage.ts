//Dependencias
import { configuracionColumnasVehiculos } from '../domain/configuracionColumnasVehiculos'
import { required, maxLength, minLength } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Vehiculo } from '../domain/Vehiculo';
import { VehiculoController } from '../infraestructure/VehiculoController';
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController';
import { ModeloController } from 'pages/bodega/modelos/infraestructure/ModeloController';
import { CombustibleController } from 'pages/controlVehiculos/combustible/infraestructure/CombustibleController';
import { acciones, maskFecha } from 'config/utils';
import { opciones_traccion_vehiculos } from 'config/vehiculos.utils';
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController';
import { computed } from 'vue';
import { useAuthenticationStore } from 'stores/authentication';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { SeguroVehicularController } from 'pages/controlVehiculos/seguros/infraestructure/SeguroVehicularController';
import { obtenerFechaActual } from 'shared/utils';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';

export default defineComponent({
    components: { TabLayout, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(Vehiculo, new VehiculoController(), new ArchivoController())
        const { entidad: vehiculo, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()

        /************************
         * Stores
         ***********************/
        const cargando = new StatusEssentialLoading()

        const idVehiculo = ref()
        const refArchivo = ref()

        const opciones_marcas = ref([])
        const opciones_modelos = ref([])
        const opciones_combustibles = ref([])

        const {seguros, filtrarSeguros}= useFiltrosListadosSelects(listadosAuxiliares) 

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
                }
            })
        })

        //Reglas de validacion
        const reglas = {
            placa: { required },
            num_motor: { required },
            num_chasis: { required },
            anio_fabricacion: { required, maximo: maxLength(4) },
            cilindraje: { required, maximo: maxLength(4) },
            rendimiento: { required, maximo: maxLength(2) },
            modelo: { required },
            combustible: { required },
            traccion: { required },
            aire_acondicionado: { required },
            capacidad_tanque: { required },
        }
        const v$ = useVuelidate(reglas, vehiculo)
        setValidador(v$.value)

        /*********************************
         * Hooks
        *********************************/
        onReestablecer(async () => {
            console.log(accion.value)
            reset()
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
        function reset() {
            // refCilindraje.value.resetValidation()
        }
        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        async function recargarSeguros() {
            cargando.activar()
            listadosAuxiliares.seguros = (await new SeguroVehicularController().listar({
                'estado': 1,
                'fecha_caducidad[operator]': '<=',
                'fecha_caducidad[value]': obtenerFechaActual(maskFecha),
            })).result
            seguros.value = listadosAuxiliares.seguros
            cargando.desactivar()
        }



        //cargar datos en listados
        opciones_marcas.value = listadosAuxiliares.marcas
        opciones_modelos.value = listadosAuxiliares.modelos
        opciones_combustibles.value = listadosAuxiliares.combustibles

        return {
            mixin, vehiculo, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasVehiculos,
            refArchivo,
            idVehiculo,
            mostrarLabelModal,
            //listados
            opciones_marcas,
            opciones_modelos,
            opciones_combustibles,
            opciones_traccion_vehiculos,
            filtroCombustibles(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_combustibles.value = listadosAuxiliares.combustibles
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_combustibles.value = listadosAuxiliares.combustibles.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroMarcas(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_marcas.value = listadosAuxiliares.marcas
                        opciones_modelos.value = listadosAuxiliares.modelos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_marcas.value = listadosAuxiliares.marcas.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroModelos(val, update) {
                if (val === '') {
                    update(() => {
                        // opciones_modelos.modelos = listadosAuxiliares.modelos
                        // console.log('modelos recibidos', opciones_modelos.value)
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_modelos.value = listadosAuxiliares.modelos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                    // console.log(listadosAuxiliares.modelos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1))
                })
            },
            seleccionarModelo(val) {
                console.log('seleccionar modelo: ', val)
                opciones_modelos.value = listadosAuxiliares.modelos.filter((v) => v.marca_id === val)
                console.log(opciones_modelos.value)
                vehiculo.modelo = ''
                if (opciones_modelos.value.length < 1) {
                    vehiculo.modelo = ''
                }
                if (opciones_modelos.value.length === 1) {
                    vehiculo.modelo = opciones_modelos.value[0]['id']
                }
            },
            seleccionarMarca(val) {
                console.log('seleccionar marca: ', val)
                const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
                if (encontrado.length > 0) {
                    opciones_marcas.value = listadosAuxiliares.marcas.filter((v) => v.id === encontrado[0]['marca_id'])
                    vehiculo.marca = encontrado[0]['marca_id']
                }
                // })
            },
            //funciones
            recargarSeguros,
            seguros, filtrarSeguros,



        }
    }
})
