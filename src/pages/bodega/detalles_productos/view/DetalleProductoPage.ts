//Dependencias
import { configuracionColumnasDetallesProductos } from "../domain/configuracionColumnasDetallesProductos";
import { numeric, required, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { DetalleProductoController } from "../infraestructure/DetalleProductoController";
import { DetalleProducto } from "../domain/DetalleProducto";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
//Controladores para los selects
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";
import { MarcaController } from "pages/bodega/marcas/infraestructure/MarcaController";
import { ModeloController } from "pages/bodega/modelos/infraestructure/ModeloController";
import { TipoFibraController } from "pages/administracion/tipos_fibras/infraestructure/TipoFibraController";
import { HiloController } from "pages/administracion/hilos/infraestructure/HiloController";
import { SpanController } from "pages/administracion/span/infraestructure/SpanController";
import { RamController } from "../modules/computadoras/modules/ram/infraestructure/RamController";
import { DiscoController } from "../modules/computadoras/modules/disco/infraestructure/DiscoController";
import { ProcesadorController } from "../modules/computadoras/modules/procesador/infraestructure/ProcesadorController";

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(DetalleProducto, new DetalleProductoController())
        const { entidad: detalle, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()


        const opciones_productos = ref([]);
        const opciones_marcas = ref([]);
        const opciones_modelos = ref([]);
        const opciones_spans = ref([]);
        const opciones_fibras = ref([]);
        const opciones_hilos = ref([]);
        const opciones_rams = ref([]);
        const opciones_discos = ref([]);
        const opciones_procesadores = ref([]);

        //Obtener los listados
        cargarVista(() => {
            obtenerListados({
                productos: new ProductoController(),
                marcas: new MarcaController(),
                modelos: new ModeloController(),
                spans: new SpanController(),
                fibras: new TipoFibraController(),
                hilos: new HiloController(),

                rams: new RamController(),
                discos: new DiscoController(),
                procesadores: new ProcesadorController(),
            })
        })

        //Reglas de validacion
        const reglas = {
            producto: { required },
            descripcion: { required },
            marca: { required },
            modelo: { required },
            serial: {
                requiredIfSerial: requiredIf(function () { return detalle.tiene_serial ? detalle.tiene_serial : false }),
                requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false })
            },
            span: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? true : false }) },
            tipo_fibra: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }) },
            hilos: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }) },
            punta_inicial: {
                requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }),
                numerico: numeric
            },
            punta_final: {
                requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }),
                numerico: numeric
            },
            punta_corte: { numeric },
            procesador: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },
            ram: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },
            disco: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },

            /* color: {
                // requiredIfAdicionales: requiredIf(function () { return detalle.tiene_adicionales }),
                requiredIfContiene: requiredIf(function () { return detalle.color.length > 0 ? true : false })
            },
            talla: {
                // requiredIfAdicionales: requiredIf(function () { return detalle.tiene_adicionales }),
                requiredIfContiene: requiredIf(function () { return detalle.talla.length > 0 ? true : false })
            },
            capacidad: {
                // requiredIfAdicionales: requiredIf(function () { return detalle.tiene_adicionales }),
                requiredIfContiene: requiredIf(function () { return detalle.capacidad.length > 0 ? true : false })
            }, */
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, detalle)
        setValidador(v$.value)

        //Configurar los listados
        opciones_hilos.value = listadosAuxiliares.hilos
        opciones_marcas.value = listadosAuxiliares.marcas
        opciones_marcas.value = listadosAuxiliares.marcas
        opciones_modelos.value = listadosAuxiliares.modelos
        opciones_modelos.value = listadosAuxiliares.modelos
        opciones_hilos.value = listadosAuxiliares.hilos
        opciones_spans.value = listadosAuxiliares.spans
        opciones_fibras.value = listadosAuxiliares.fibras
        opciones_productos.value = listadosAuxiliares.productos
        opciones_discos.value = listadosAuxiliares.discos
        opciones_procesadores.value = listadosAuxiliares.procesadores
        opciones_rams.value = listadosAuxiliares.rams

        return {
            mixin, detalle, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasDetallesProductos,
            //listados
            opciones_hilos,
            opciones_marcas,
            opciones_spans,
            opciones_fibras,
            opciones_modelos,
            opciones_productos,
            opciones_discos,
            opciones_procesadores,
            opciones_rams,
            useVuelidate,



            //filtros
            seleccionarModelo(val) {
                opciones_modelos.value = listadosAuxiliares.modelos.filter((v) => v.marca.indexOf(val) > -1)
                // console.log('seleccionar modelo: ', val)
                // console.log(opciones_modelos.value)
                detalle.modelo = ''
                if (opciones_modelos.value.length < 1) {
                    detalle.modelo = ''
                }
                if (opciones_modelos.value.length == 1) {
                    detalle.modelo = opciones_modelos.value[0]['id']
                }
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

            seleccionarMarca(val) {
                // console.log('valor recibido antes de todo','dexson')
                console.log(val)
                if (val === '') {
                    opciones_modelos.value = listadosAuxiliares.modelos
                    // console.log('valor recibido primer if', val)
                    const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
                    // console.log('encontrado', encontrado)

                    return
                }
                // update(()=>{
                // console.log('valor recibido', val)
                const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
                // console.log('encontrado', encontrado)
                if (encontrado.length > 0) {
                    // console.log('encontrado en el if')
                    // console.log(listadosAuxiliares.marcas.filter((v) => v.id === encontrado.id))
                    opciones_marcas.value = listadosAuxiliares.marcas.filter((v) => v.nombre === encontrado[0]['marca'])
                    detalle.marca = encontrado[0]['marca']
                }
                // })
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
            filtroProcesadores(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_procesadores.value = listadosAuxiliares.procesadores
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_procesadores.value = listadosAuxiliares.procesadores.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroRams(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_rams.value = listadosAuxiliares.rams
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_rams.value = listadosAuxiliares.rams.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroDiscos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_discos.value = listadosAuxiliares.discos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_discos.value = listadosAuxiliares.discos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },

            filterProductos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_productos.value = listadosAuxiliares.productos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },

            actualizarCategoria(val) {
                const producto = listadosAuxiliares.productos.filter((v) => v.id === val)
                detalle.categoria = producto[0]['categoria']
            }
        }
    }
})
