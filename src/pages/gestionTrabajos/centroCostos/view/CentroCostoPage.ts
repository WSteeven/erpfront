// Dependencias
import { configuracionColumnasCentroCostos } from '../domain/configuracionColumnasCentroCostos'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CentroCosto } from '../domain/CentroCostos'
import { CentroCostoController } from '../infraestructure/CentroCostosController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { CambiarEstadoCentroCosto } from '../application/CambiarEstadoCentroCosto'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

//Logica y controladores


export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(CentroCosto, new CentroCostoController())
    const { entidad: centro, disabled, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { confirmar, notificarCorrecto, notificarError } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        clientes: {
          controller: new ClienteController(),
          params: { campos: 'id,empresa_id', estado: 1 }
        }
      })
      clientes.value = listadosAuxiliares.clientes
    })


    const reglas = {
      nombre: { required },
    }

    const v$ = useVuelidate(reglas, centro)
    setValidador(v$.value)

    const btnDesactivarCentroCosto: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar este centro de costos?', async () => {
          try {
            cargando.activar()
            const { result, response } = await new CambiarEstadoCentroCosto().anular(entidad.id)
            listado.value.splice(posicion, 1, response.data.modelo)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el centro de costo!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => entidad.activo
    }

    const btnActivarCentroCosto: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Desactivar',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar este centro de costos?', async () => {
          try {
            cargando.activar()
            const { result, response } = await new CambiarEstadoCentroCosto().anular(entidad.id)
            listado.value.splice(posicion, 1, response.data.modelo)
            notificarCorrecto('Desactivado correctamente')
          } catch (error: any) {
            notificarError('No se pudo desactivar el centro de costo!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => !entidad.activo
    }

    return {
      v$, mixin, centro, disabled,
      configuracionColumnas: configuracionColumnasCentroCostos,

      clientes, filtrarClientes,
      btnDesactivarCentroCosto,
      btnActivarCentroCosto,

    }

  }
})
