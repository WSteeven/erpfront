// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { tabTrabajoAsignado, accionesTabla, estadosSubtareas } from 'config/utils'
import { defineComponent, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ConfirmarDialog from 'pages/tareas/trabajoAsignado/view/ConfirmarDialog.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { CambiarEstadoSubtarea } from 'pages/tareas/controlTareas/modules/subtareasListadoContent/application/CambiarEstadoSubtarea'
import { SubtareaAsignadaController } from '../modules/subtareasAsignadas/infraestructure/TipoTrabajoController'
import { ComportamientoModalesTrabajoAsignado } from '../application/ComportamientoModalesTrabajoAsignado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
	components: {
		EssentialTableTabs,
		ModalesEntidad,
		ConfirmarDialog,
	},
	setup() {
		const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

		const { listado } = mixin.useReferencias()
		const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

		const mostrarDialogPlantilla = ref(false)

		const store = useTrabajoAsignadoStore()
		const authenticationStore = useAuthenticationStore()
		const modales = new ComportamientoModalesTrabajoAsignado()

		const botonVer: CustomActionTable = {
			titulo: 'Visualizar',
			icono: 'bi-eye',
			accion: async ({ entidad }) => {
				store.idSubtareaSeleccionada = entidad.id
				modales.abrirModalEntidad('SubtareaAsignadaPage')
			},
		}

		const botonIniciar: CustomActionTable = {
			titulo: 'Iniciar',
			icono: 'bi-play',
			color: 'positive',
			visible: ({ entidad }) => [estadosSubtareas.ASIGNADO].includes(entidad.estado) || (entidad.estado === estadosSubtareas.SUSPENDIDO && entidad.es_primera_asignacion),
			accion: ({ entidad, posicion }) => {
				confirmar('¿Está seguro de iniciar el trabajo?', async () => {
					const { result } = await new CambiarEstadoSubtarea().ejecutar(entidad.id)
					entidad.estado = estadosSubtareas.EJECUTANDO
					entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
					notificarCorrecto('Trabajo iniciado exitosamente!')
					actualizarElemento(posicion, entidad)
				})
			}
		}

		const botonPausar: CustomActionTable = {
			titulo: 'Pausar',
			icono: 'bi-pause',
			color: 'positive',
			visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO,
			accion: async ({ entidad, posicion }) => {
				confirmar('¿Está seguro de pausar la subtarea?', () => {
					prompt('Ingrese el motivo de la pausa', (data) => {
						new CambiarEstadoSubtarea().pausar(entidad.id, data)
						entidad.estado = estadosSubtareas.PAUSADO
						notificarCorrecto('Trabajo pausado exitosamente!')
						actualizarElemento(posicion, entidad)
					})
				})
			},
		}

		const botonReanudar: CustomActionTable = {
			titulo: 'Reanudar',
			icono: 'bi-play',
			color: 'positive',
			visible: ({ entidad }) => entidad.estado === estadosSubtareas.PAUSADO,
			accion: async ({ entidad, posicion }) => {
				confirmar('¿Está seguro de reanudar el trabajo?', () => {
					new CambiarEstadoSubtarea().reanudar(entidad.id)
					entidad.estado = estadosSubtareas.EJECUTANDO
					notificarCorrecto('Trabajo ha sido reanudado exitosamente!')
					actualizarElemento(posicion, entidad)
				})
			}
		}

		const botonFormulario: CustomActionTable = {
			titulo: 'Formulario',
			icono: 'bi-card-text',
			color: 'indigo',
			visible: ({ entidad }) => [estadosSubtareas.EJECUTANDO, estadosSubtareas.REALIZADO].includes(entidad.estado),
			accion: async ({ entidad }) => {
				confirmar('¿Está seguro de abrir el formulario?', () => {
					store.idSubtareaSeleccionada = entidad.id
					modales.abrirModalEntidad('SeleccionFormularioPage')
				})
			}
		}

		const botonSuspender: CustomActionTable = {
			titulo: 'Suspender',
			icono: 'bi-x-diamond',
			color: 'negative',
			visible: ({ entidad }) => entidad.estado === estadosSubtareas.ASIGNADO,
			accion: async ({ entidad, posicion }) => {
				confirmar('¿Está seguro de suspender el trabajo?', () => {
					prompt('Ingrese el motivo de la suspención', async (data) => {
						const { result } = await new CambiarEstadoSubtarea().suspender(entidad.id, data)
						entidad.estado = estadosSubtareas.SUSPENDIDO
						entidad.fecha_hora_suspendido = result.fecha_hora_suspendido
						notificarCorrecto('Trabajo suspendido exitosamente!')
						actualizarElemento(posicion, entidad)
					})
				})
			},
		}

		const botonRealizar: CustomActionTable = {
			titulo: 'Realizado',
			icono: 'bi-check',
			color: 'positive',
			visible: ({ entidad }) => entidad.estado === estadosSubtareas.EJECUTANDO,
			accion: ({ entidad, posicion }) => {
				confirmar('¿Está seguro de que completó el trabajo?', async () => {
					const { result } = await new CambiarEstadoSubtarea().realizar(entidad.id)
					entidad.estado = estadosSubtareas.REALIZADO
					entidad.fecha_hora_realizado = result.fecha_hora_realizado
					actualizarElemento(posicion, entidad)
					notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
				})
			}
		}

		function actualizarElemento(posicion: number, entidad: any): void {
			if (posicion >= 0) {
				listado.value.splice(posicion, 1, entidad);
				listado.value = [...listado.value];
			}
		}

		const subtareaAsignada = new SubtareaAsignadaController()
		let estadoSeleccionado = ''

		async function aplicarFiltro(tabSeleccionado) {
			if (tabSeleccionado !== estadoSeleccionado) {
				const { result } = await subtareaAsignada.listar({ estado: tabSeleccionado }) //grupo_id: grupo_id,
				listado.value = result
				estadoSeleccionado = tabSeleccionado
			}
		}

		aplicarFiltro('ASIGNADO')

		const listadoModales = modales.getModales()

		function plantillaSeleccionada(plantilla: keyof typeof listadoModales) {
			mostrarDialogPlantilla.value = false
			modales.abrirModalEntidad(plantilla)
		}

		return {
			listado,
			configuracionColumnasSubtareas,
			botonIniciar,
			botonVer,
			tabTrabajoAsignado,
			aplicarFiltro,
			accionesTabla,
			modales,
			mostrarDialogPlantilla,
			plantillaSeleccionada,
			botonPausar,
			botonReanudar,
			botonFormulario,
			botonSuspender,
			botonRealizar,
			fecha: date.formatDate(Date.now(), 'dddd, DD MMMM YYYY'),
			authenticationStore,
		}
	}
})
