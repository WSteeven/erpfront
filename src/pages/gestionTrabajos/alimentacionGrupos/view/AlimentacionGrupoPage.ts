// Dependencias
import { configuracionColumnasAlimentacionGrupo } from '../domain/configuracionColumnasAlimentacionGrupo'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { minValue, required, helpers } from 'shared/i18n-validators'
import { AlimentacionGrupoPropsData } from '../domain/AlimentacionGrupoPropsData'
import { AlimentacionGrupo } from '../domain/AlimentacionGrupo'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones, maskFecha } from 'config/utils'
import { computed, defineComponent, UnwrapRef } from 'vue'
import useVuelidate from '@vuelidate/core'
import { LocalStorage } from 'quasar'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { AlimentacionGrupoController } from '../infraestructure/AlimentacionGrupoController'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { obtenerFechaHoraActual, optionsFecha } from 'shared/utils'

export default defineComponent({
    props: {
        datos: Object as () => UnwrapRef<AlimentacionGrupoPropsData>,
    },
    components: { TabLayout },
    emits: ['guardado', 'cerrar-modal'],
    setup(props, { emit }) {
        /**********
         * Stores
         **********/
        const authenticationStore = useAuthenticationStore()
        const data = computed(() => props.datos)
        console.log(data.value)

        /*************
         * Variables
         *************/
        const PRECIO_ALIMENTACION = 3
        const mostrarTodosGrupos = authenticationStore.esJefeTecnico || authenticationStore.esCoordinadorBackup

        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(AlimentacionGrupo, new AlimentacionGrupoController())
        const { entidad: alimentacion, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onBeforeGuardar, onConsultado, onBeforeModificar, onReestablecer, onGuardado } = mixin.useHooks()

        cargarVista(async () => {
            await obtenerListados({
                grupos: {
                    controller: new GrupoController(),
                    params: { campos: 'id,nombre', activo: 1, coordinador_id: mostrarTodosGrupos ? null : authenticationStore.user.id }
                },
                tareas: {
                    controller: new TareaController(),
                    params: {
                        campos: 'id,codigo_tarea,titulo,cliente_id',
                        'f_params[orderBy][field]': 'id',
                        'f_params[orderBy][type]': 'DESC',
                        'f_params[limit]': 100
                    }
                },
                subdetalles: []
            })

            listadosAuxiliares.subdetalles = obtenerSubdetallesAlimentacion()
            subdetalles.value = listadosAuxiliares.subdetalles
            tareas.value = listadosAuxiliares.tareas
        })

        /*********
         * Reglas
         *********/
        const reglas = {
            fecha: { required },
            alimentacion_grupos: {
                $each: helpers.forEach({
                    grupo_id: { required },
                    cantidad_personas: { required, minValue: minValue(1) },
                    tarea_id: { required },
                    tipo_alimentacion_id: { required },
                }),
            }
        }

        const v$ = useVuelidate(reglas, alimentacion)
        setValidador(v$.value)

        /************
         * Funciones
         ************/
        const { grupos, filtrarGrupos, tareas, filtrarTareasTitulo, subdetalles, filtrarSubdetalles } = useFiltrosListadosSelects(listadosAuxiliares)

        const agregarGrupo = () => {
            console.log(data.value)
            const alimentacionGrupo = new AlimentacionGrupo()
            alimentacionGrupo.grupo_id = props.datos?.idGrupo
            alimentacionGrupo.tarea_id = props.datos?.idTarea
            alimentacion.alimentacion_grupos.push(alimentacionGrupo)
        }

        const obtenerSubdetallesAlimentacion = () => {
            const listado = LocalStorage.getItem('sub_detalles') ? JSON.parse(LocalStorage.getItem('sub_detalles')!.toString()) : []
            return listado.filter((subdetalle: SubDetalleFondo) => ['ALIMENTACION', 'ALIMENTACIÓN'].includes(subdetalle.detalle_viatico_info ?? ''))
        }

        /*********
         * Hooks
         *********/
        onBeforeGuardar(() => {
            alimentacion.alimentacion_grupos = alimentacion.alimentacion_grupos.map((alimentacionoItem: AlimentacionGrupo) => {
                alimentacionoItem.precio = PRECIO_ALIMENTACION
                alimentacionoItem.fecha = alimentacion.fecha
                alimentacionoItem.subtarea_id = props.datos?.idSubtarea
                alimentacionoItem.tarea_id = props.datos?.idTarea
                return alimentacionoItem
            })
        })

        onBeforeModificar(() => {
            alimentacion.observacion = alimentacion.alimentacion_grupos[0].observacion
            alimentacion.cantidad_personas = alimentacion.alimentacion_grupos[0].cantidad_personas
            alimentacion.alimentacion_grupos = []
        })

        onConsultado(() => {
            const copiaEntidad = JSON.parse(JSON.stringify(alimentacion))
            copiaEntidad.alimentacion_grupos = []
            alimentacion.alimentacion_grupos = [copiaEntidad]
        })

        onGuardado(() => emit('guardado', 'AlimentacionGrupoPage'))

        onReestablecer(() => {
            alimentacion.hydrate(new AlimentacionGrupo())
            emit('cerrar-modal', false)
        })

        /*******
         * Init
         *******/
        alimentacion.fecha = obtenerFechaHoraActual('YYYY-MM-DD')

        return {
            v$,
            mixin,
            disabled,
            maskFecha,
            alimentacion,
            optionsFecha,
            configuracionColumnasAlimentacionGrupo,
            agregarGrupo,
            tareas,
            filtrarTareasTitulo,
            grupos,
            filtrarGrupos,
            subdetalles,
            filtrarSubdetalles,
            PRECIO_ALIMENTACION,
            noSePuedeEditar: computed(() => accion.value === acciones.editar),
            consultado: computed(() => accion.value === acciones.editar || accion.value === acciones.consultar),
            existeSubtarea: !!props.datos?.idSubtarea, // Seguimiento de subtarea
        }
    }
})
