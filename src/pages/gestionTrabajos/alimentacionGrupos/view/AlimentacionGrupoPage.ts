// Dependencias
import { configuracionColumnasAlimentacionGrupo } from '../domain/configuracionColumnasAlimentacionGrupo'
import { AlimentacionGrupoPropsData } from '../domain/AlimentacionGrupoPropsData'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { minValue, required, requiredIf, helpers } from 'shared/i18n-validators'
import { obtenerFechaHoraActual, optionsFecha } from 'shared/utils'
import { AlimentacionGrupo } from '../domain/AlimentacionGrupo'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent, UnwrapRef } from 'vue'
import { acciones, maskFecha } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { LocalStorage } from 'quasar'
import { useRoute } from 'vue-router'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { AlimentacionGrupoController } from '../infraestructure/AlimentacionGrupoController'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { useSubtareaStore } from 'stores/subtarea'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { EmpleadoGrupo } from 'pages/gestionTrabajos/subtareas/domain/EmpleadoGrupo'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { DesignadoEmpleadoResponsable } from 'pages/gestionTrabajos/subtareas/application/validaciones/DesignadoEmpleadoResponsable'

export default defineComponent({
    name: 'alimentacion_grupo', // NO BORRAR
    props: {
        datos: Object as () => UnwrapRef<AlimentacionGrupoPropsData>,
    },
    components: { TabLayout, DesignarResponsableTrabajo },
    emits: ['guardado', 'cerrar-modal'],
    setup(props, { emit }) {
        /**********
         * Stores
         **********/
        const authenticationStore = useAuthenticationStore()
        const trabajoAsignadoStore = useTrabajoAsignadoStore()

        /*************
         * Variables
         *************/
        const PRECIO_ALIMENTACION = 3
        const mostrarTodosGrupos = authenticationStore.esJefeTecnico || authenticationStore.esCoordinadorBackup
        const route = useRoute()
        const mostrarFormulario = ['monitor_subtareas', 'tareas'].includes(route.name?.toString() ?? '')

        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(AlimentacionGrupo, new AlimentacionGrupoController())
        const { entidad: alimentacion, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onBeforeGuardar, onConsultado, onBeforeModificar, onReestablecer, onGuardado } = mixin.useHooks()

        // Mixin subtarea
        const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const { entidad: subtarea } = mixinSubtarea.useReferencias()
        const { consultar: consultarSubtarea, editarParcial: editarParcialSubtarea } = mixinSubtarea.useComportamiento()
        const { onConsultado: onConsultadoSubtarea } = mixinSubtarea.useHooks()

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
            },
            grupo: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) },
            empleado: { required: requiredIf(() => subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado) },
        }

        const v$ = useVuelidate(reglas, alimentacion)
        setValidador(v$.value)

        const designadoEmpleadoResponsable = new DesignadoEmpleadoResponsable(subtarea)
        mixin.agregarValidaciones(designadoEmpleadoResponsable)

        /************
         * Funciones
         ************/
        const { grupos, filtrarGrupos, tareas, filtrarTareasTitulo, subdetalles, filtrarSubdetalles } = useFiltrosListadosSelects(listadosAuxiliares)

        const agregarGrupo = () => {
            const alimentacionGrupo = new AlimentacionGrupo()
            alimentacionGrupo.grupo_id = alimentacion.editar_participantes ? alimentacion.grupo : props.datos?.idGrupo
            alimentacionGrupo.tarea_id = props.datos?.idTarea
            alimentacion.alimentacion_grupos.push(alimentacionGrupo)
        }

        const obtenerSubdetallesAlimentacion = () => {
            const listado = LocalStorage.getItem('sub_detalles') ? JSON.parse(LocalStorage.getItem('sub_detalles')!.toString()) : []
            return listado.filter((subdetalle: SubDetalleFondo) => ['ALIMENTACION', 'ALIMENTACIÓN'].includes(subdetalle.detalle_viatico_info ?? ''))
        }

        function seleccionarGrupo(grupo_id: number) {
            subtarea.grupo = grupo_id
            alimentacion.grupo = grupo_id
            alimentacion.alimentacion_grupos.map((ag: AlimentacionGrupo) => ag.grupo_id = grupo_id)
        }

        function seleccionarEmpleado(empleado_id: number, empleado: Empleado) {
            subtarea.empleado = empleado_id
            alimentacion.empleado = empleado_id
            console.log(empleado)
            alimentacion.grupo = empleado.grupo_id
            alimentacion.alimentacion_grupos.map((ag: AlimentacionGrupo) => ag.grupo_id = empleado.grupo_id)
        }

        function seleccionarResponsable(idResponsable: number) {
            subtarea.empleado = idResponsable
            alimentacion.empleado = idResponsable
        }

        function seleccionarModoDesignacion(modo: string) {
            subtarea.modo_asignacion_trabajo = modo
            subtarea.empleado = null
            subtarea.grupo = null
            alimentacion.grupo = null
            alimentacion.empleado = null
        }

        const limpiarSubtarea = () => {
            if (!alimentacion.editar_participantes) {
                subtarea.hydrate(new Subtarea())
                alimentacion.grupo_id = props.datos?.idGrupo
                alimentacion.alimentacion_grupos.map((ag: AlimentacionGrupo) => ag.grupo_id = props.datos?.idGrupo)
            }
        }

        /*********
         * Hooks
         *********/
        onBeforeGuardar(() => {
            alimentacion.alimentacion_grupos = alimentacion.alimentacion_grupos.map((alimentacionoItem: AlimentacionGrupo) => {
                alimentacionoItem.precio = PRECIO_ALIMENTACION
                alimentacionoItem.fecha = alimentacion.fecha
                alimentacionoItem.subtarea_id = props.datos?.idSubtarea
                alimentacionoItem.tarea_id = !!props.datos ? props.datos?.idTarea : alimentacionoItem.tarea_id
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

        onGuardado(() => {
            if (subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo) subtarea.empleados_designados = subtarea.empleados_designados.map((empleado: EmpleadoGrupo) => empleado.id)
            else subtarea.empleados_designados = [subtarea.empleado]
            if (subtarea.id) editarParcialSubtarea(subtarea.id, {
                grupo: subtarea.grupo,
                empleado: subtarea.empleado,
                empleados_designados: subtarea.empleados_designados,
                modo_asignacion_trabajo: subtarea.modo_asignacion_trabajo,
            })
            emit('guardado', 'AlimentacionGrupoPage')
        })

        onReestablecer(() => {
            alimentacion.hydrate(new AlimentacionGrupo())
            emit('cerrar-modal', false)
        })

        onConsultadoSubtarea(() => {
            alimentacion.grupo = subtarea.grupo
            console.log(alimentacion.grupo)
        })

        /*******
         * Init
         *******/
        alimentacion.fecha = obtenerFechaHoraActual('YYYY-MM-DD')
        consultarSubtarea({ id: trabajoAsignadoStore.idSubtareaSeleccionada })

        return {
            v$,
            mixin,
            disabled,
            accion,
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
            mostrarFormulario,
            subtarea,
            seleccionarGrupo,
            seleccionarEmpleado,
            seleccionarResponsable,
            seleccionarModoDesignacion,
            limpiarSubtarea,
        }
    }
})
