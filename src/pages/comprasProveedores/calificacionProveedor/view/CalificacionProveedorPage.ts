// Dependencies
import { defineComponent, ref } from "vue";

//Components
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";

// Logic and controllers
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CalificacionProveedorController } from "../infraestructure/CalificacionProveedorController";
import { CriterioCalificacionController } from "pages/comprasProveedores/criteriosCalificaciones/infraestructure/CriterioCalificacionController";
import { configuracionColumnasCriteriosCalificaciones } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificaciones";
import { CalificacionProveedor } from "../domain/CalificacionProveedor";
import { useOrquestadorSelectorCriterios } from "../application/OrquestadorSelectorCriterios";
import { useProveedorStore } from "stores/comprasProveedores/proveedor";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";
import { tiposOfertas } from "config/utils_compras_proveedores";
import { accionesTabla } from "config/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { useNotificaciones } from "shared/notificaciones";
import { configuracionColumnasCriteriosCalificacionesConCalificacion } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConCalificacion";
import { configuracionColumnasCriteriosCalificacionesConPeso } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConPeso";

export default defineComponent({
    components: { EssentialTable, EssentialSelectableTable },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        const { entidad: calificacion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        /**************************************************************
         * Stores
         **************************************************************/
        const proveedorStore = useProveedorStore()
        const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

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
        const step = ref(1)
        const seleccionados = ref([]) //los criterios que son seleccionados en la primera tabla

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

        /************************************************************** 
         * Botones de tabla
         **************************************************************/
        function eliminarBien({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => {
                    criteriosBienes.value.splice(posicion, 1)
                    console.log(entidad, posicion)
                    seleccionados.value.splice(posicion, 1)
                    console.log(seleccionados.value)
                })
        }
        function eliminarServicio({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => criteriosServicios.value.splice(posicion, 1))
            console.log(seleccionados.value)
        }
        const botonEliminarCriterioBien: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminarBien({ entidad, posicion })
            },
            visible: () => true
        }
        const botonEliminarCriterioServicio: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminarServicio({ entidad, posicion })
            },
            visible: () => true
        }
        const botonEditarCantidadCriterioBien: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: criteriosBienes.value[posicion].peso,
                    tipo: 'number',
                    accion: (data) => {
                        criteriosBienes.value[posicion].peso = data
                    },
                }

                prompt(config)
            },
            visible: () => true
        }
        const botonEditarCantidadCriterioServicio: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: criteriosServicios.value[posicion].peso,
                    tipo: 'number',
                    accion: (data) => {
                        criteriosServicios.value[posicion].peso = data
                    },
                }

                prompt(config)
            },
            visible: () => true
        }
        const botonCalificarCriterioBien: CustomActionTable = {
            titulo: 'Calificación',
            icono: 'bi-pencil',
            accion: ({ entidad, posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Califica',
                    mensaje: 'Ingresa una puntuación',
                    defecto: criteriosBienes.value[posicion].puntaje,
                    tipo: 'number',
                    accion: (data) => {
                        criteriosBienes.value[posicion].puntaje = data
                    }
                }
                prompt(config)
            }
        }
        /************************************************************** 
         * Funciones
         **************************************************************/
        /**
         * La función `botonNext` se usa para manejar la lógica para avanzar al siguiente paso en un
         * proceso de varios pasos, verificando ciertos criterios antes de permitir que el usuario
         * continúe.
         * @returns nada (indefinido) en la mayoría de los casos. Sin embargo, puede regresar antes de
         * tiempo con una declaración de "retorno" si se cumplen ciertas condiciones.
         */
        function botonNext() {
            if (step.value == 2) {
                const resultListadoBienes = verificarCriteriosBienes()
                if (resultListadoBienes) {
                    step.value++
                    return
                } else {
                    return
                }
            }
            if (step.value == 3) {
                const resultListadoServicios = verificarCriteriosServicios()
                if (resultListadoServicios) {
                    step.value++
                    return
                } else {
                    return
                }
            }
            step.value++
        }
        function verificarCriteriosBienes() {
            let sumaCriteriosBienes = 0
            if (criteriosBienes.value.length > 0) {
                sumaCriteriosBienes = criteriosBienes.value.reduce((prev, curr) => prev + curr.peso, 0)
                if (Number.isNaN(sumaCriteriosBienes)) {
                    notificarError('Debes asignar peso a todos los items del listado')
                    return false
                }
                if (sumaCriteriosBienes < 100 || sumaCriteriosBienes > 100) {
                    notificarAdvertencia('La suma de todos los pesos debe ser igual 100')
                    return false
                }
                if (sumaCriteriosBienes == 100) {
                    notificarCorrecto('Configuración de pesos para criterios de bienes realizada correctamente')
                    return true
                }
            } else {
                return true
            }
        }
        function verificarCriteriosServicios() {
            let sumaCriteriosServicios = 0
            if (criteriosServicios.value.length > 0) {
                sumaCriteriosServicios = criteriosServicios.value.reduce((prev, curr) => prev + curr.peso, 0)
                if (Number.isNaN(sumaCriteriosServicios)) {
                    notificarError('Debes asignar peso a todos los items del listado')
                    return false
                }
                if (sumaCriteriosServicios < 100 || sumaCriteriosServicios > 100) {
                    notificarAdvertencia('La suma de todos los pesos debe ser igual 100')
                    return false
                }
                if (sumaCriteriosServicios == 100) {
                    notificarCorrecto('Configuración de pesos para criterios de servicios realizada correctamente')
                    return true
                }
            } else {
                return true
            }
        }
        /**
         * La función `criterioSeleccionado` registra la entrada `fila` y agrega o elimina elementos de
         * `criteriosBienes.value` y `criteriosServicios.value` en función de la propiedad `oferta` de
         * cada elemento en `fila.rows`.
         * @param fila - El parámetro "fila" es un objeto que representa una fila de datos. Contiene
         * una propiedad llamada "agregado" que indica si la fila se agregó o eliminó. También contiene
         * una propiedad llamada "filas", que es una matriz de objetos que representan filas
         * individuales dentro de la fila principal. 
         */
        function criterioSeleccionado(fila) {
            console.log(fila)
            if (fila.added) {
                fila.rows.forEach((v) => {
                    if (v.oferta == tiposOfertas.bienes) criteriosBienes.value.push(v)
                    if (v.oferta == tiposOfertas.servicios) criteriosServicios.value.push(v)
                })
            } else {
                fila.rows.forEach((element) => {
                    if (element.oferta == tiposOfertas.bienes)
                        criteriosBienes.value = criteriosBienes.value.filter((v) => v != element)
                    if (element.oferta == tiposOfertas.servicios)
                        criteriosServicios.value = criteriosServicios.value.filter((v) => v != element)
                })
            }
        }



        return {
            step,
            columnasCriterios: configuracionColumnasCriteriosCalificaciones,
            columnasCriteriosConPeso: configuracionColumnasCriteriosCalificacionesConPeso,
            columnasCriteriosConCalificacion: configuracionColumnasCriteriosCalificacionesConCalificacion,
            accionesTabla,
            //botones de tabla
            botonEditarCantidadCriterioBien,
            botonEliminarCriterioBien,
            botonEditarCantidadCriterioServicio,
            botonEliminarCriterioServicio,
            botonCalificarCriterioBien,
            //botones de navegacion
            botonNext,


            //listados
            criterios: listadosAuxiliares.criterios, //tabla general 
            criteriosBienes, //tabla de criterios de bienes
            criteriosServicios, //tabla de criterios de servicios
            ofertas: listadosAuxiliares.ofertas,

            proveedor: proveedorStore.proveedor,

            seleccionados,
            criterioSeleccionado,

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