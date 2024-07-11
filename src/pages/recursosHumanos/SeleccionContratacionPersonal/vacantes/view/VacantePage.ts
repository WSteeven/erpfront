// Dependencias
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import ImagenComprimidaComponent from 'components/ImagenComprimidaComponent.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { acciones, accionesTabla, } from 'config/utils'
import { TipoPuestoTrabajoController } from 'pages/recursosHumanos/seleccion_contratacion_personal/tipo-puesto-trabajo/infraestructure/TipoPuestoTrabajoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { configuracionColumnasPublicacionPuestoTrabajo } from 'pages/recursosHumanos/seleccion_contratacion_personal/publicacion_puesto_trabajo/domain/configuracionColumnasPublicacionPuestoTrabajo'
import { configuracionColumnasConocimientoReactive } from '../../../SeleccionContratacionPersonal/solicitudPuestoTrabajo/domain/configuracionColumnasConocimientoReactive'
import { configuracionColumnasFormacionAcademicaReactive } from '../../../SeleccionContratacionPersonal/solicitudPuestoTrabajo/domain/configuracionColumnasFormacionAcademicaReactive'
import { format } from '@formkit/tempo'
import { AreaConocimientoController } from '../../areasConocimiento/infraestructure/AreaConocimientoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Vacante } from '../domain/Vacante'
import { VacanteController } from '../infraestructure/VacanteController'
import { useAuthenticationStore } from 'stores/authentication'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useSeleccionContratacionStore } from 'stores/recursosHumanos/seleccionContratacion'
import { SolicitudPuestoEmpleoController } from '../../solicitudPuestoTrabajo/infraestructure/SolicitudPuestoEmpleoController'
import { AxiosResponse } from 'axios'
import { ResponseItem } from 'shared/controller/domain/ResponseItem'
import { aniosExperiencia } from 'config/seleccionContratacionPersonal.utils'

export default defineComponent({
    name: 'VacantePage',
    components: { TabLayout, EssentialEditor, EssentialTable, GestorArchivos, ImagenComprimidaComponent },
    setup() {
        const mixin = new ContenedorSimpleMixin(Vacante, new VacanteController())
        const { entidad: vacante, accion, disabled, listadosAuxiliares, } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()

        /***************************************************************************
         * stores
        ****************************************************************************/
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()
        const solicitudStore = useSeleccionContratacionStore()

        /***************************************************************************
         * variables
        ****************************************************************************/
        const anios_experiencia = ref(aniosExperiencia)
        const refArchivo = ref()
        const idPuestoEmpleo = ref()

        const { areasConocimiento, filtrarAreasConocimiento } = useFiltrosListadosSelects(listadosAuxiliares)


        const tipos_puestos_trabajo = ref([])
        const autorizaciones = ref([])

        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        onGuardado((id: number) => {
            idPuestoEmpleo.value = id
            setTimeout(() => {
                subirArchivos()
            }, 1)
        })
        cargarVista(async () => {
            //Verificamos si llegó una solicitud de vacante
            if (solicitudStore.idSolicitudVacante > 0) {
                // consultar la solicitud para empaquetar 
                await consultarSolicitudEmpleado()
                if (solicitudStore.solicitudPersonal) cargarDatosSolicitud()
            }

            await obtenerListados({
                tipos_puestos_trabajo: {
                    controller: new TipoPuestoTrabajoController(),
                    params: {
                        campos: 'id,nombre',
                    },
                },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {
                        campos: 'id,nombre',
                    },
                },
                areasConocimiento: new AreaConocimientoController()
            })
            areasConocimiento.value = listadosAuxiliares.areasConocimiento
            tipos_puestos_trabajo.value = listadosAuxiliares.tipos_puestos_trabajo
            autorizaciones.value = listadosAuxiliares.autorizaciones


        })

        /*****************************************************************************************
         * REGLAS DE VALIDACION
        *****************************************************************************************/
        //Reglas de validacion
        const reglas = {
            nombre: { required },
            tipo_puesto: { required },
            imagen_referencia: { required },
            publicidad: { required },
            fecha_caducidad: { required },
            descripcion: { required },
            anios_experiencia: { required },
            conocimientos: { required },
            formaciones_academicas: { required },
        }

        const v$ = useVuelidate(reglas, vacante)
        setValidador(v$.value)


        /****************************************************************************
         * FUNCIONES
         ****************************************************************************/
        async function consultarSolicitudEmpleado() {
            try {
                cargando.activar()
                const response = await new SolicitudPuestoEmpleoController().consultar(solicitudStore.idSolicitudVacante)
                console.log(response)
                solicitudStore.solicitudPersonal.hydrate(response.result)
            } catch (error) {

            } finally {
                cargando.desactivar()
            }
        }

        function cargarDatosSolicitud() {
            // Cargar datos de solicitud
            vacante.anios_experiencia = solicitudStore.solicitudPersonal.anios_experiencia
            vacante.areas_conocimiento = solicitudStore.solicitudPersonal.areas_conocimiento
            vacante.conocimientos = solicitudStore.solicitudPersonal.conocimientos
            vacante.descripcion = solicitudStore.solicitudPersonal.descripcion ?? ''
            vacante.formaciones_academicas = solicitudStore.solicitudPersonal.formaciones_academicas
            vacante.nombre = solicitudStore.solicitudPersonal.nombre
            vacante.requiere_experiencia = solicitudStore.solicitudPersonal.requiere_experiencia
            vacante.tipo_puesto = solicitudStore.solicitudPersonal.tipo_puesto
        }

        function btnEliminarConocimiento() {
            console.log('eliminar')
        }
        function btnEliminarFormacionAcademica() {
            console.log('eliminar')
        }
        function agregarConocimiento() {
            console.log('agregar')
        }
        function agregarFormacionAcademica() {
            console.log('agregar')
        }
        function optionsFechaCaducidad(date) {

            const fecha_actual = format(new Date(), 'YYYY/MM/DD')

            return (
                date <= fecha_actual
            )
        }

        function filtrarAniosExperiencia(val, update) {
            val = val.toUpperCase()
            update(() => {
                if (val == '') anios_experiencia.value = aniosExperiencia
                else {
                    anios_experiencia.value = aniosExperiencia.filter(v => v.toUpperCase().indexOf(val) > -1)
                }
            })
        }


        /****************************************************************************
         * BOTONES DE TABLA
         ****************************************************************************/



        return {
            removeAccents,
            btnEliminarConocimiento,
            btnEliminarFormacionAcademica,
            agregarConocimiento,
            agregarFormacionAcademica,
            optionsFechaCaducidad,
            vacante,
            mixin,
            disabled,
            accion,
            v$,
            acciones,
            accionesTabla,
            configuracionColumnas: configuracionColumnasPublicacionPuestoTrabajo,
            configuracionColumnasConocimientoReactive,
            configuracionColumnasFormacionAcademicaReactive,
            refArchivo,
            tipos_puestos_trabajo,
            autorizaciones,

            //listados
            areasConocimiento, filtrarAreasConocimiento,

            //funciones


            //botones de tabla

        }
    },
})
