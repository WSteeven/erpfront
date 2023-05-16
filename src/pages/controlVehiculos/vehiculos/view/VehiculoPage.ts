//Dependencias
import { configuracionColumnasVehiculos } from '../domain/configuracionColumnasVehiculos'
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Vehiculo } from '../domain/Vehiculo';
import { VehiculoController } from '../infraestructure/VehiculoController';
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController';
import { ModeloController } from 'pages/bodega/modelos/infraestructure/ModeloController';
import { CombustibleController } from 'pages/controlVehiculos/combustible/infraestructure/CombustibleController';
import { acciones } from 'config/utils';

// Logica y controladores

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Vehiculo, new VehiculoController())
        const { entidad: vehiculo, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()

        const opciones_marcas = ref([])
        const opciones_modelos = ref([])
        const opciones_combustibles = ref([])
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
        //cargar datos en listados
        opciones_marcas.value = listadosAuxiliares.marcas
        opciones_modelos.value = listadosAuxiliares.modelos
        opciones_combustibles.value = listadosAuxiliares.combustibles

        // Hooks

        //Reglas de validacion
        const reglas = {
            placa: { required },
            num_motor: { required },
            num_chasis: { required },
            anio_fabricacion: { required },
            cilindraje: { required },
            modelo: { required },
            combustible: { required },
        }
        const v$ = useVuelidate(reglas, vehiculo)
        setValidador(v$.value)


        return {
            mixin, vehiculo, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasVehiculos,
            //listados
            opciones_marcas,
            opciones_modelos,
            opciones_combustibles,
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
        }
    }
})