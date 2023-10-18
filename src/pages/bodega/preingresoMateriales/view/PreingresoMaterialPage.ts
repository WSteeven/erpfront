//Depedencias
import { required } from "shared/i18n-validators";
import { defineComponent, ref } from 'vue'
import { acciones, rolesSistema, tabOptionsPreingresoMateriales } from 'config/utils'
import useVuelidate from '@vuelidate/core'

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PreingresoMaterial } from '../domain/PreingresoMaterial'
import { PreingresoMaterialController } from '../infraestructure/PreingresoMaterialController'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasPreingresosMateriales } from "../domain/configuracionColumnasPreingresosMateriales";
import { useAuthenticationStore } from "stores/authentication";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { EmpleadoRoleController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController";
import { LocalStorage } from "quasar";
import { TareaController } from "pages/gestionTrabajos/tareas/infraestructure/TareaController";
import { configuracionColumnasItemPreingreso } from "../domain/configuracionColumnasItemsPreingreso";
import { useOrquestadorSelectorProductos } from "../application/OrquestadorSelectorProductos";
import { configuracionColumnasProductos } from "pages/comprasProveedores/ordenCompra/domain/configuracionColumnasProductos";


export default defineComponent({
    components: { TabLayoutFilterTabs, TabLayoutFilterTabs2, EssentialSelectableTable, EssentialTable,EssentialPopupEditableTable, ModalesEntidad, SelectorImagen },
    setup() {
        const mixin = new ContenedorSimpleMixin(PreingresoMaterial, new PreingresoMaterialController())
        const { entidad: preingreso, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        const store = useAuthenticationStore()

        //Orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorProductos(preingreso, 'productos')

        const autorizaciones = ref([])
        const coordinadores = ref([])
        const tareas = ref([])
        cargarVista(async () => {
            await obtenerListados({
                coordinadores: { controller: new EmpleadoRoleController(), params: { roles: [rolesSistema.coordinador] } },
                tareas: { controller: new TareaController(), params: {} },

            })
        })
        const reglas = {
            num_guia: { required },
            coordinador: { required },
        }

        const v$ = useVuelidate(reglas, preingreso)
        setValidador(v$.value)

        /*******************************************************************************************
        * Funciones
        ******************************************************************************************/
        function filtrarPreingresos(tab: string) {
            tabSeleccionado.value = tab
            if (tab == '1') puedeEditar.value = true
            else puedeEditar.value = false
            listar({ autorizacion_id: tab, responsable_id: store.user.id })
        }
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => preingreso.listadoProductos.splice(posicion, 1))
        }

        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-trash',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                //: props.propsTable.rowIndex,
                eliminar({ posicion })
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }
        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                console.log(entidad)
                console.log(posicion)
                // ordenCompraStore.idOrden = entidad.id
                // await ordenCompraStore.imprimirPdf()
            },
            visible: () => tabSeleccionado.value > 1 ? true : false
        }

        coordinadores.value = listadosAuxiliares.coordinadores
        autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
        tareas.value = listadosAuxiliares.tareas

        return {
            mixin, preingreso, disabled, accion, v$, acciones,
            configuracionColumnas: configuracionColumnasPreingresosMateriales,
            configuracionColumnasItemPreingreso,
            configuracionColumnasProductos,
            puedeEditar,
            //listados
            coordinadores,
            autorizaciones,
            tareas,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,

            //tabs
            tabOptionsPreingresoMateriales,

            //botones
            btnEliminarFila,
            btnImprimir,


            //funciones
            filtrarPreingresos,
            filtrarTareas(val, update) {
                if (val === '') update(() => tareas.value = listadosAuxiliares.tareas)

                update(() => {
                    const needle = val.toLowerCase()
                    tareas.value = listadosAuxiliares.tareas.filter((v) => v.codigo_tarea.toLowerCase().indexOf(needle) > -1)
                })
            },
        }
    }
})
