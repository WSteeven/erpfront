import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { OficinaBiometrico } from 'controlPersonal/oficinaBiometrico/domain/OficinaBiometrico'
import { OficinaBiometricoController } from 'controlPersonal/oficinaBiometrico/infraestructure/OficinaBiometricoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ordenarLista } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { configuracionColumnasOficinasBiometrico } from 'controlPersonal/oficinaBiometrico/domain/configuracionColumnasOficinasBiometrico'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

export default defineComponent({
  components: { ErrorComponent, NoOptionComponent, TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      OficinaBiometrico,
      new OficinaBiometricoController()
    )
    const {
      entidad: oficina,
      accion,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    
    const tabDefecto = ref('1') // Por defecto "Activos"

    const { cantones, filtrarCantones } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cantones: new CantonController()
      })

      cantones.value = listadosAuxiliares.cantones
    })

    const reglas = {
      nombre: { required },
      canton: { required },
      // descripcion: { required },
      // direccion: { required },
      // direccion_ip: { required }
    }
    const v$ = useVuelidate(reglas, oficina)
    setValidador(v$.value)

    async function filtrar(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    return {
      mixin,
      accion,
      disabled,oficina,
      v$,
      tabDefecto,
      tabOptions: tabOptionsProveedoresInternacionales,
      configuracionColumnas: configuracionColumnasOficinasBiometrico,
      cantones,

      filtrar,
      filtrarCantones,
      ordenarLista
    }
  }
})
