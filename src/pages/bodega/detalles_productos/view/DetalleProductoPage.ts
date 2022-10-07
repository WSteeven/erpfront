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

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(DetalleProducto, new DetalleProductoController())
        const { entidad: detalle, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        //Obtener los listados
        cargarVista(() => {
            obtenerListados({
                productos: new ProductoController(),
                marcas: new MarcaController(),
                modelos: new ModeloController(),
                spans: new SpanController(),
                fibras: new TipoFibraController(),
                hilos: new HiloController()
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
            punta_final: {
                requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }),
                numerico: numeric
            },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, detalle)
        setValidador(v$.value)

        //Configurar los listados
        const opciones_hilos = listadosAuxiliares.hilos
        const opciones_marcas = listadosAuxiliares.marcas
        opciones_marcas.marcas = listadosAuxiliares.marcas
        const opciones_modelos = listadosAuxiliares.modelos
        opciones_modelos.modelos = listadosAuxiliares.modelos
        opciones_hilos.hilos = listadosAuxiliares.hilos
        const opciones_span = listadosAuxiliares.spans
        const opciones_fibras = listadosAuxiliares.fibras
        const opciones_productos = listadosAuxiliares.productos
        opciones_productos.productos = listadosAuxiliares.productos

        return {
            mixin, detalle, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasDetallesProductos,
            //listados
            opciones_hilos,
            opciones_marcas,
            opciones_span,
            opciones_fibras,
            opciones_modelos,
            opciones_productos,
            useVuelidate,



            //filtros
            seleccionarModelo(val) {
                opciones_modelos.modelos = listadosAuxiliares.modelos.filter((v) => v.marca.indexOf(val) > -1)
                console.log('seleccionar modelo: ',val)
                console.log(opciones_modelos.modelos)
                detalle.modelo = ''
                if (opciones_modelos.modelos.length < 1) {
                    detalle.modelo = ''
                }
                if (opciones_modelos.modelos.length == 1) {
                    detalle.modelo = opciones_modelos.modelos[0]['id']
                }
            },
            filtroModelos(val, update) {
                if (val === '') {
                    update(()=>{
                        // opciones_modelos.modelos = listadosAuxiliares.modelos
                        console.log('modelos recibidos',opciones_modelos.modelos)
                    })
                    return
                }
                update(()=>{
                    const needle = val.toLowerCase()
                    opciones_modelos.modelos = listadosAuxiliares.modelos.filter((v)=>v.nombre.toLowerCase().indexOf(needle)>-1)
                    console.log(listadosAuxiliares.modelos.filter((v)=>v.nombre.toLowerCase().indexOf(needle)>-1))
                })
            },

            seleccionarMarca(val) {
                // console.log('valor recibido antes de todo','dexson')
                console.log(val)
                if (val === '') {
                    opciones_modelos.modelos = listadosAuxiliares.modelos
                    console.log('valor recibido primer if', val)
                    const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
                    console.log('encontrado', encontrado)

                    return
                }
                // update(()=>{
                console.log('valor recibido', val)
                const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
                console.log('encontrado', encontrado)
                if (encontrado.length > 0) {
                    console.log('encontrado en el if')
                    console.log(listadosAuxiliares.marcas.filter((v) => v.id === encontrado.id))
                    opciones_marcas.marcas = listadosAuxiliares.marcas.filter((v) => v.nombre === encontrado[0]['marca'])
                    detalle.marca = encontrado[0]['marca']
                }
                // })
            },
            filtroMarcas(val, update){
                if (val === '') {
                    update(()=>{
                        opciones_marcas.marcas = listadosAuxiliares.marcas
                        opciones_modelos.modelos = listadosAuxiliares.modelos
                    })
                    return
                }
                update(()=>{
                    const needle = val.toLowerCase()
                    opciones_marcas.marcas = listadosAuxiliares.marcas.filter((v)=>v.nombre.toLowerCase().indexOf(needle)>-1)
                })
            },

            filterProductos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_productos.productos = listadosAuxiliares.productos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_productos.productos = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
        }
    }
})
