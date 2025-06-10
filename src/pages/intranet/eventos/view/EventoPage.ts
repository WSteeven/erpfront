import { defineComponent, ref } from 'vue';
import { Evento } from '../domain/Evento';
import { EventoController } from '../infraestructure/EventoController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import EssentialCalendar from 'components/qalendar/EssentialCalendar.vue';
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue';
import { acciones } from '../../../../config/utils';
import { useCargandoStore } from 'stores/cargando';
import { TipoEventoController } from 'pages/intranet/tiposEventos/infraestructure/TipoEventoController';


export default defineComponent({
  components: { EssentialCalendar, ButtonSubmits },
  setup() {
    const mixin = new ContenedorSimpleMixin(Evento, new EventoController())
    const { entidad: evento, accion, listado, listadosAuxiliares } = mixin.useReferencias()
    const {  cargarVista, obtenerListados, listar, consultar, editar, guardar, eliminar, reestablecer } = mixin.useComportamiento()
    const { onReestablecer, onBeforeGuardar, onGuardado, onBeforeModificar, onModificado } = mixin.useHooks()
    const clickedEvent = ref()
    const tipos = ref([])
    const componentePadreCargado = ref(false)

    cargarVista(async () => {
      await listar()
      await obtenerListados({
        tipos: new TipoEventoController()
      })

      tipos.value = listadosAuxiliares.tipos

      componentePadreCargado.value = true
    })

    onBeforeGuardar(() => componentePadreCargado.value = false)
    onGuardado(() => componentePadreCargado.value = true)
    onBeforeModificar(() => componentePadreCargado.value = false)
    onModificado(() => componentePadreCargado.value = true)
    onReestablecer(() => {
      componentePadreCargado.value = false
      setTimeout(() => componentePadreCargado.value = true, 100)
      // componentePadreCargado.value = true
    })


    async function consultarEvento() {
      // console.log("data?", clickedEvent.value)
      evento.id = clickedEvent.value
      accion.value = acciones.editar
      await consultar(evento)
    }
    async function eventoClicked(data) {
      // console.log("eventoClicked", data.clickedEvent)
      clickedEvent.value = data.clickedEvent.id
      evento.id = data.clickedEvent.id
    }

    async function eliminarEvento() {
      accion.value = acciones.eliminar
      await consultar(evento)
    }

    return {
      evento, accion, listado,
      tipos,
      componentePadreCargado,
      consultarEvento, eliminarEvento, eventoClicked,
      editar, guardar, eliminar, reestablecer,
      acciones,
      storeCargando: useCargandoStore(),
    };
  },
})
