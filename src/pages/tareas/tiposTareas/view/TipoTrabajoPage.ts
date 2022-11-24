// Dependencias
import { configuracionColumnasImagenesAdicionales } from '../domain/configuracionColumnasImagenesAdicionales'
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { configuracionColumnasCamposAdicionales } from '../domain/configuracionColumnasCamposAdicionales'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
// import { useOrquestadorSelectorClientes } from '../application/OrquestadorSelectorClientes'
import { TipoTrabajoController } from '../infraestructure/TipoTrabajoController'
import { TipoTrabajo } from '../domain/TipoTrabajo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ImagenesAdicionales } from '../domain/ImagenesAdicionales'
import { CamposAdicionales } from '../domain/CamposAdicionales'
import { accionesTabla } from 'config/utils'

export default defineComponent({
  components: {
    TabLayout,
    EssentialSelectableTable,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTrabajo,
      new TipoTrabajoController()
    )
    const { entidad: tipoTarea, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { onBeforeGuardar, onConsultado, onBeforeModificar } = mixin.useHooks()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
      })
      clientes.value = listadosAuxiliares.clientes
    })

    const rules = {
      cliente: { required },
      nombre: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTarea)
    setValidador(v$.value)

    // Filtro clientes principales
    const clientes = ref()
    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    function previsualizar(jajaja: string) {
      console.log(jajaja)
    }

    const agregarImagenAdicional: CustomActionTable = {
      titulo: 'Agregar etiqueta de imagen',
      accion: () => {
        tipoTarea.imagenes_adicionales.push(new ImagenesAdicionales())
      },
    }

    const botonHabilitarFormulario: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-eye',
      color: 'positive',
      visible: ({ entidad }) => !entidad.activo,
      accion: ({ entidad, posicion }) => {
        entidad.activo = true
        actualizarElementoImagen(posicion, entidad)
      },
    }

    const botonDeshabilitarFormulario: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-eye-slash',
      color: 'negative',
      visible: ({ entidad }) => entidad.activo,
      accion: ({ entidad, posicion }) => {
        entidad.activo = false
        actualizarElementoImagen(posicion, entidad)
      },
    }

    function eliminarImagenAdicional({ posicion }) {
      tipoTarea.imagenes_adicionales.splice(posicion, 1)
    }

    const agregarCampoAdicional: CustomActionTable = {
      titulo: 'Agregar campo',
      accion: () => {
        tipoTarea.campos_adicionales.push(new CamposAdicionales())
      },
    }

    function eliminarCampoAdicional({ posicion }) {
      tipoTarea.campos_adicionales.splice(posicion, 1)
    }

    const botonActivarCampo: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-eye',
      color: 'positive',
      visible: ({ entidad }) => !entidad.activo,
      accion: ({ entidad, posicion }) => {
        entidad.activo = true
        actualizarElementoCampo(posicion, entidad)
      },
    }

    const botonDesactivarCampo: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-eye-slash',
      color: 'negative',
      visible: ({ entidad }) => entidad.activo,
      accion: ({ entidad, posicion }) => {
        entidad.activo = false
        actualizarElementoCampo(posicion, entidad)
      },
    }

    function actualizarElementoImagen(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        tipoTarea.imagenes_adicionales.splice(posicion, 1, entidad)
        tipoTarea.imagenes_adicionales = [...tipoTarea.imagenes_adicionales]
      }
    }

    function actualizarElementoCampo(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        tipoTarea.campos_adicionales.splice(posicion, 1, entidad)
        tipoTarea.campos_adicionales = [...tipoTarea.campos_adicionales]
      }
    }

    onBeforeGuardar(() => {
      tipoTarea.imagenes_adicionales = JSON.stringify(tipoTarea.imagenes_adicionales)
      tipoTarea.campos_adicionales = JSON.stringify(tipoTarea.campos_adicionales)
    })

    onBeforeModificar(() => {
      tipoTarea.imagenes_adicionales = JSON.stringify(tipoTarea.imagenes_adicionales)
      tipoTarea.campos_adicionales = JSON.stringify(tipoTarea.campos_adicionales)
    })

    onConsultado(() => {
      tipoTarea.imagenes_adicionales = tipoTarea.imagenes_adicionales ? JSON.parse(tipoTarea.imagenes_adicionales) : []
      tipoTarea.campos_adicionales = tipoTarea.campos_adicionales ? JSON.parse(tipoTarea.campos_adicionales) : []
      tipoTarea.requiere_imagenes = !!tipoTarea.imagenes_adicionales.length
      tipoTarea.requiere_campos_adicionales = !!tipoTarea.campos_adicionales.length
    })


    return {
      // mixin
      mixin,
      tipoTarea,
      disabled,
      accion,
      v$,
      configuracionColumnasImagenes: [...configuracionColumnasImagenesAdicionales, accionesTabla],
      configuracionColumnasCampos: [...configuracionColumnasCamposAdicionales, accionesTabla],
      configuracionColumnasTiposTareas,
      filtrarClientes,
      clientes,
      previsualizar,
      agregarImagenAdicional,
      botonHabilitarFormulario,
      botonDeshabilitarFormulario,
      ImagenesAdicionales,
      CamposAdicionales,
      eliminarImagenAdicional,
      agregarCampoAdicional,
      eliminarCampoAdicional,
      botonActivarCampo,
      botonDesactivarCampo,
    }
  },
})
