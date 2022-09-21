//Dependencias
import { configuracionColumnasInventario } from "../domain/configuracionColumnasInventario";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { InventarioController } from "../infraestructure/InventarioController";
import { Inventario } from "../domain/Inventario";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
//Controladores para los selects
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { CondicionController } from "pages/administracion/condiciones/infraestructure/CondicionController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const {entidad: inventario, disabled, accion, listadosAuxiliares}=mixin.useReferencias()
        const {setValidador, obtenerListados, cargarVista}=mixin.useComportamiento()

        //Obtener los listados
        cargarVista(()=>{
            obtenerListados({
                productos: new ProductoController(),
                detalles: new DetalleProductoController(),
                clientes: new ClienteController(),
                condiciones: new CondicionController(),
                sucursales: new SucursalController(),
            })
        })

        //Reglas de validacion
        const reglas = {
            cantidad: {required},
            /* condicion:{required},
            detalle:{required},
            propietario:{required},
            sucursal:{required}, */
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$=useVuelidate(reglas, inventario)
        setValidador(v$.value)

        //Configurar los listados para los selects
        const opciones_productos = listadosAuxiliares.productos
        const opciones_detalles = listadosAuxiliares.detalles
        const opciones_clientes = listadosAuxiliares.clientes
        const opciones_condiciones = listadosAuxiliares.condiciones
        const opciones_sucursales = listadosAuxiliares.sucursales

        return {
            mixin, inventario, disabled, accion, v$,
            configuracionColumnas:configuracionColumnasInventario,
            //listados
            opciones_productos,
            opciones_detalles,
            opciones_clientes,
            opciones_condiciones,
            opciones_sucursales,
            filtroProductos(val){
                opciones_detalles.detalles = listadosAuxiliares.detalles.filter((v)=>v.producto.indexOf(val)>-1)
            },
            filterDetalles(val, update){
                if(val===''){
                    update(()=>{
                        opciones_detalles.detalles = listadosAuxiliares.detalles
                    })
                    return
                }
                update(()=>{
                    const needle = val.toLowerCase()
                    opciones_detalles.detalles = listadosAuxiliares.detalles.filter((v)=>v.descripcion.toLowerCase().indexOf(needle)>-1)
                })
            },
        }
    }
})
