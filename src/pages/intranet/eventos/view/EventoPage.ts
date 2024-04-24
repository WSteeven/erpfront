import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { defineComponent, ref } from "vue"
import { EventoController } from "../infraestructure/EventoController"
import { Evento } from "../domain/Evento"



export default defineComponent({
  
  setup(){

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Evento,new EventoController(),
    )

    const {
      entidad: evento,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

      const splitterModel= ref(50)
      const date= ref('2019/02/01')
      const events= ref([ '2019/02/01', '2019/02/05', '2019/02/06' ])
      const tiposEvento=ref( ['Cumpleaños', 'Capacitaciones'])

      function agregarEvento() {
        // Validación de datos del evento

        };


      return{
        mixin,
        evento,
        splitterModel,
        date,
        events,
        tiposEvento,
        agregarEvento,
      }
  },
  
})