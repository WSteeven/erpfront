// Dependencias
import { configuracionColumnasControlMaterialSubtarea } from '../domain/configuracionColumnasControlMaterialSubtarea'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ControlMaterialSubtarea } from '../domain/ControlMaterialSubtarea'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ControlMaterialSubtareaController } from '../infraestructure/ControlMaterialSubtareaController'
import { accionesTabla } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const { confirmar, prompt } = useNotificaciones()

    async function obtenerMateriales() {
      const { result } = await new ControlMaterialSubtareaController().consultar(4)
      console.log(result)
      materiales.value = result.listadoProductosSeleccionados
    }

    obtenerMateriales()

    const materiales = ref([])

    const agregarMaterial: CustomActionTable = {
      titulo: 'Seleccionar material',
      accion: () => {
        //
      },
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad usada',
      icono: 'bi-pencil',
      accion: ({ entidad, posicion }) => {
        prompt('Ingresa la cantidad',
          (data) => {
            entidad.cantidad_usada = data
            console.log(parseInt(entidad.cantidades) - parseInt(entidad.cantidad_usada))
            entidad.cantidad_devuelta = parseInt(entidad.cantidades) - parseInt(entidad.cantidad_usada)

          },
          entidad.cantidades
        )
      },
      visible: () => true
    }

    function eliminarMaterial() {
      //
    }

    function guardar() {
      //
    }

    return {
      columnas: [...configuracionColumnasControlMaterialSubtarea, accionesTabla],
      materiales,
      agregarMaterial,
      eliminarMaterial,
      ControlMaterialSubtarea,
      guardar,
      botonEditarCantidad,
    }
  }
})
