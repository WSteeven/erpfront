// Dependencias
import { configuracionColumnasImagenesAdicionales } from '../domain/configuracionColumnasImagenesAdicionales'
import { configuracionColumnasCamposAdicionales } from '../domain/configuracionColumnasCamposAdicionales'
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { TipoTrabajoController } from '../infraestructure/TipoTrabajoController'
import { ImagenesAdicionales } from '../domain/ImagenesAdicionales'
import { CamposAdicionales } from '../domain/CamposAdicionales'
import { TipoTrabajo } from '../domain/TipoTrabajo'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTrabajo,
      new TipoTrabajoController()
    )
    const { entidad: tipoTarea, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
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
      eliminarImagenAdicional,
      agregarCampoAdicional,
      eliminarCampoAdicional,
      botonActivarCampo,
      botonDesactivarCampo,
      // Instanciables
      ImagenesAdicionales,
      CamposAdicionales,
    }
  },
})
