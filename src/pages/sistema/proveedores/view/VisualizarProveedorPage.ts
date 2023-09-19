//Dependencias
import { configuracionColumnasProveedores } from '../domain/configuracionColumnasProveedores'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
// import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { useNotificaciones } from 'shared/notificaciones'

import { Proveedor } from '../domain/Proveedor'
import { ProveedorController } from '../infraestructure/ProveedorController'
import { Empresa } from 'pages/administracion/empresas/domain/Empresa'
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController'
import { useProveedorStore } from 'stores/comprasProveedores/proveedor'
import { configuracionColumnasContactosProveedores } from 'pages/comprasProveedores/contactosProveedor/domain/configuracionColumnasContactosProveedores'
import { configuracionColumnasDatosBancariosProveedor } from 'pages/comprasProveedores/datosBancariosProveedor/domain/configuracionColumnasDatosBancariosProveedor'
import { ofertas, formasPagos, opcionesTipoContribuyente, opcionesTipoNegocio, tiposEnvios } from 'config/utils_compras_proveedores'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CategoriaOfertaController } from 'pages/comprasProveedores/categoriaOfertas/infraestructure/CategoriaOfertaController'
import { DepartamentoController } from '../modules/departamentos/infraestructure/DepartamentoController'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'

export default defineComponent({
    components: { TabLayout, EssentialTable, GestorArchivos },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        const mixinEmpresas = new ContenedorSimpleMixin(Empresa, new EmpresaController(), new ArchivoController())
        const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
        const { entidad: proveedor, listadosAuxiliares, accion } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()
        const { notificarError, notificarCorrecto, confirmar, prompt } = useNotificaciones()
        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const statusLoading = new StatusEssentialLoading()
        const proveedorStore = useProveedorStore()
        // const categorias = ref([])
        // const departamentos = ref([])
        //variables
        const refArchivo = ref()
        const empresa: Empresa = reactive(new Empresa())
        const esReferido = computed(() => { return !!proveedor.referencia })

        cargarVista(() => {
            obtenerListados({
                categorias: new CategoriaOfertaController(),
                departamentos: new DepartamentoController(),
            })
        })

        onMounted(() => {
            console.log('montado')
            proveedor.hydrate(proveedorStore.proveedor)
            obtenerEmpresa(proveedor.empresa).then(() => refArchivo.value.listarArchivosAlmacenados(empresa.id))

            proveedor.tipo_envio = proveedor.tipo_envio != null ? JSON.parse(proveedor.tipo_envio.toString()) : []
            // proveedor.departamentos = proveedor.related_departamentos.map((v) => v.nombre)
        })

        /***************************
         * Funciones
         ****************************/
        async function obtenerEmpresa(empresaId: number | null) {
            if (empresaId !== null) {
                statusLoading.activar()
                const { result } = await new EmpresaController().consultar(empresaId)
                empresa.hydrate(result)
                proveedor.contactos = empresa.contactos
                statusLoading.desactivar()
            }
        }

        /***************************
         * Configuracion de columnas
         ****************************/
        const columnasContactosProveedor: any = [
            ...configuracionColumnasContactosProveedores,
            // accionesTabla,
        ]
        columnasContactosProveedor.splice(2, 1)

        const columnasDatosBancarios: any = [
            ...configuracionColumnasDatosBancariosProveedor
        ]
        columnasDatosBancarios.splice(0, 1) //se elimina el campo empresa por ser irrelevante en este caso




        return {
            mixinEmpresas,
            mixin, proveedor,
            configuracionColumnas: configuracionColumnasProveedores,
            columnasContactosProveedor, columnasDatosBancarios,
            acciones,
            esReferido,
            //listados
            tiposEnvios,
            formasPagos,
            ofertas,
            opcionesTipoContribuyente,
            opcionesTipoNegocio,
            categorias: listadosAuxiliares.categorias,
            departamentos: listadosAuxiliares.departamentos,

            //stores
            empresa,

            //variables auxiliares
            refArchivo,

        }
    }
})
