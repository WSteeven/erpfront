// Dependencias
import { configuracionColumnasAlimentacionGrupo } from '../domain/configuracionColumnasAlimentacionGrupo'
import { minValue, required, helpers } from 'shared/i18n-validators'
import { acciones, maskFecha } from 'config/utils'
import { computed, defineComponent } from 'vue'
import { format } from '@formkit/tempo'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { AlimentacionGrupoController } from '../infraestructure/AlimentacionGrupoController'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { AlimentacionGrupo } from '../domain/AlimentacionGrupo'
import { useAuthenticationStore } from 'stores/authentication'
import useVuelidate from '@vuelidate/core'
import { LocalStorage } from 'quasar'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const authenticationStore = useAuthenticationStore()

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
        const { onBeforeGuardar, onConsultado, onBeforeModificar } = mixin.useHooks()

        cargarVista(async () => {
            await obtenerListados({
                grupos: {
                    controller: new GrupoController(),
                    params: { campos: 'id,nombre', activo: 1, coordinador_id: mostrarTodosGrupos ? null : authenticationStore.user.id }
                },
                tareas: [],
                subdetalles: []
            })

            listadosAuxiliares.tareas = await (await new TareaController().filtrar('f_params[orderBy][field]=id&f_params[orderBy][type]=DESC&f_params[limit]=50')).result
            listadosAuxiliares.subdetalles = obtenerSubdetallesAlimentacion()
            subdetalles.value = listadosAuxiliares.subdetalles
            tareas.value = listadosAuxiliares.tareas
        })

        /***********
         * Computed
         ***********/
        // const noSePuedeEditar = accion.value === acciones.editar

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

        function optionsFecha(date) {
            const today = new Date()

            const diaSemana = today.getDay()
            // Verificar si el día actual es sábado
            let sabadoAnterior = ''
            if (diaSemana === 6) {
                sabadoAnterior = format(
                    new Date(today.setDate(today.getDate() - ((today.getDay() + 2) % 7))),
                    'YYYY/MM/DD'
                )
            } else {
                sabadoAnterior = format(
                    new Date(today.setDate(today.getDate() - (today.getDay() % 7))),
                    'YYYY/MM/DD'
                )
            }
            const sabadoSiguiente = format(new Date(siguienteSabado()), 'YYYY/MM/DD')
            const fecha_actual = format(new Date(), 'YYYY/MM/DD')

            return (
                date >= sabadoAnterior &&
                date <= sabadoSiguiente &&
                date <= fecha_actual
            )
        }// titulo - una opcion en tipo alimentacion

        function siguienteSabado() {
            const fecha = new Date() // Obtenemos la fecha actual
            const diaSemana = fecha.getDay() // Obtenemos el día de la semana (0-6, siendo 0 domingo)
            // Calculamos los días que faltan hasta el próximo sábado
            const diasFaltantes = 6 - diaSemana
            // Sumamos los días faltantes a la fecha actual para obtener el próximo sábado
            fecha.setDate(fecha.getDate() + diasFaltantes)
            // Retornamos la fecha formateada como una cadena de texto
            return fecha
        }

        const agregarGrupo = () => {
            alimentacion.alimentacion_grupos.push(new AlimentacionGrupo()) // nilson moca macas - juan vargas 
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
            consultado: computed(() => accion.value === acciones.editar || accion.value === acciones.consultar)
        }
    }
})