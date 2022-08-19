// Dependencias
import { configuracionColumnasTiposElementos } from '../domain/configuracionColumnasTiposElementos'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { TipoElemento } from '../domain/TipoElemento'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const tipoElemento = reactive(new TipoElemento())

    const datos = [
      {
        id: 1,
        nombre: 'POSTE',
      },
      {
        id: 2,
        nombre: 'CAJA',
      },
      {
        id: 3,
        nombre: 'AMERICANO',
      },
      {
        id: 4,
        nombre: 'RADIO BASE',
      },
      {
        id: 5,
        nombre: 'NODO',
      },
    ]

    function enviar() {
      //
    }
    return {
      tipoElemento,
      datos,
      configuracionColumnas: configuracionColumnasTiposElementos,
    }
  },
})
