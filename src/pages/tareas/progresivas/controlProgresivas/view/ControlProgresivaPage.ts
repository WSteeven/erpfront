// Dependencias
import { configuracionColumnasControlProgresivas } from '../domain/configuracionColumnasControlProgresivas'
import {
  tiposElementos,
  propietariosElementos,
  estadoElementos,
} from 'config/utils'
import { obtenerFechaActual } from 'shared/utils'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ControlProgresiva } from '../domain/ControlProgresiva'
import { ComportamientoModalesProgresiva } from '../application/ComportamientoModalesProgresiva'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ControlProgresivaController } from '../domain/ControlProgresivaController'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    LabelAbrirModal,
    ModalesEntidad,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ControlProgresiva,
      new ControlProgresivaController()
    )

    const { entidad: progresiva, disabled, accion } = mixin.useReferencias()

    /*progresiva.codigo_tarea_jp = 'JP000001'
    progresiva.codigo_subtarea_jp = 'JP000001_1'
    progresiva.fecha = obtenerFechaActual()
    progresiva.nombre_proyecto = 'FTTH SARACAY'
    progresiva.grupo = 'MACHALA'
    progresiva.tecnico_responsable = 'FERNANDO AYORA'
    progresiva.tecnico = 'LUIS VACA'*/

    const progresivas: any[] = [
      {
        id: 1,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'JUAN PINCAY',
        codigo_tarea_jp: '4',
        codigo_subtarea_jp: 'QUEVEDO-SANTO DOMINGO',
        propietario_elemento: 'TELCONET',
        fecha: '27/05/2019',
      },
      {
        id: 2,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'DANIEL G',
        codigo_tarea_jp: '5',
        codigo_subtarea_jp: 'SARACAY-LA AVANZADA',
        propietario_elemento: 'CNEL',
        fecha: '23/08/2019',
      },
      {
        id: 3,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'FRANCISCO FERNÁNDEZ',
        codigo_tarea_jp: '6',
        codigo_subtarea_jp: 'BALSAS-PIÑAS',
        propietario_elemento: 'CNEL',
        fecha: '04/09/2019',
      },
      {
        id: 4,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'DANIEL G',
        codigo_tarea_jp: '7',
        codigo_subtarea_jp: 'SARACAY-BALSAS',
        propietario_elemento: 'CNEL',
        fecha: '25/08/2019',
      },
    ]

    function enviar() {
      console.log(progresiva)
    }

    const setBase64 = (file: File) => {
      if (file !== null && file !== undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => (progresiva.imagen = reader.result)
      } else {
        progresiva.imagen = file
      }
    }

    const modalesProgresiva = new ComportamientoModalesProgresiva()

    return {
      mixin,
      progresiva,
      progresivas,
      enviar,
      configuracionColumnasControlProgresivas,
      setBase64,
      modalesProgresiva,
      // listados
      tiposElementos,
      propietariosElementos,
      estadoElementos,
    }
  },
})
