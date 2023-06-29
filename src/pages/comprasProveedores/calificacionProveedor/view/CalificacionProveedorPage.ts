// Dependencies
import { defineComponent, ref } from "vue";

//Components
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Entidad } from "shared/entidad/domain/entidad";
import { CalificacionProveedorController } from "../infraestructure/CalificacionProveedorController";
import { CriterioCalificacionController } from "pages/comprasProveedores/criteriosCalificaciones/infraestructure/CriterioCalificacionController";
import { configuracionColumnasCriteriosCalificaciones } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificaciones";
import { CalificacionProveedor } from "../domain/CalificacionProveedor";
import { useOrquestadorSelectorCriterios } from "../application/OrquestadorSelectorCriterios";
import { useProveedorStore } from "stores/comprasProveedores/proveedor";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";
import { tiposOfertas } from "config/utils_compras_proveedores";
import { quitarItemDeArray } from "shared/utils";
// Logic and controllers

export default defineComponent({
    components: { EssentialSelectableTable },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        const { entidad: calificacion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()

        /**************************************************************
         * Stores
         **************************************************************/
        const proveedorStore = useProveedorStore()
        //Orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaCriterio,
            listado: listadoCriterios,
            listar: listarCriterios,
            limpiar: limpiarCriterio,
            seleccionar: seleccionarCriterio
        } = useOrquestadorSelectorCriterios(calificacion, 'calificacion_proveedor')
        /************************************************************** 
         * Variables
         **************************************************************/
        const ofertas = ref([])
        const criteriosBienes = ref<any>([])
        const criteriosServicios = ref<any>([])

        cargarVista(async () => {
            obtenerListados({
                // criterios: {
                //     controller: new CriterioCalificacionController(),
                //     params: { departamento_id: proveedorStore.idDepartamento },
                // }
                ofertas: new OfertaProveedorController(),
                criterios: new CriterioCalificacionController(),
            })
        })

        return {
            step: ref(1),
            columnasCriterios: configuracionColumnasCriteriosCalificaciones,
            
            //listados
            criterios: listadosAuxiliares.criterios, //tabla general 
            criteriosBienes, //tabla de criterios de bienes
            criteriosServicios, //tabla de criterios de servicios
            ofertas: listadosAuxiliares.ofertas,

            proveedor: proveedorStore.proveedor,

            selected: ref([]),
            criterioSeleccionado(fila){
                console.log(fila)
                if(fila.added){
                    if(fila.rows[0].oferta==tiposOfertas.bienes){
                        criteriosBienes.value.push(fila.rows[0])
                    }
                    if(fila.rows[0].oferta==tiposOfertas.servicios){
                        criteriosServicios.value.push(fila.rows[0])
                    }
                }else{
                    if(fila.rows[0].oferta==tiposOfertas.bienes){
                        criteriosBienes.value = criteriosBienes.value.filter((v)=>v!=fila.rows[0])
                    }
                    if(fila.rows[0].oferta==tiposOfertas.servicios){
                        criteriosServicios.value = criteriosServicios.value.filter((v)=>v.id!==fila.rows[0].id)
                    }
                }
            },

            //orquestador
            seleccionarCriterio,
            //pagination
            initialPagination: {
                sortBy: 'desc',
                descending: false,
                page: 1,
                rowsPerPage: 15
                // rowsNumber: xx if getting data from a server
              },
        }
    }
})