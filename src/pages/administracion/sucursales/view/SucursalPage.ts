// Dependencias
import { configuracionColumnasSucursales } from '../domain/configuracionColumnasSucursales'
import { numeric, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ErrorComponent from 'components/ErrorComponent.vue';
import NoOptionComponent from 'components/NoOptionComponent.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SucursalController } from '../infraestructure/SucursalController'
import { Sucursal } from '../domain/Sucursal'
import { useAuthenticationStore } from 'stores/authentication'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { Cliente } from 'sistema/clientes/domain/Cliente'
import { ordernarListaString } from 'shared/utils'

export default defineComponent({
  components: { NoOptionComponent, ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Sucursal, new SucursalController())
    const {
      entidad: sucursal,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()

    //stores
    const store = useAuthenticationStore()

    const clientes = ref([])
    cargarVista(async () => {
      await obtenerListados({
        clientes: {
          controller: new ClienteController(),
          params: {requiere_bodega: 1}
        }
      })
    })

    //Reglas de validacion
    const reglas = {
      lugar: { required },
      telefono: { required },
      correo: { required },
      cliente: { required },
      extension: {
        numeric,
        requiredIfExtension: requiredIf(sucursal.extension !== null)
      }
    }

    const v$ = useVuelidate(reglas, sucursal)
    setValidador(v$.value)

    clientes.value = listadosAuxiliares.clientes

    return {
      mixin,
      sucursal,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasSucursales,

      //listados
      clientes,

      // Filtros
      filtroClientes(val, update) {
        if (val === '') {
          update(() => {
            clientes.value = listadosAuxiliares.clientes
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          clientes.value = listadosAuxiliares.clientes.filter(
            (v: Cliente) => v.razon_social!.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      //ordenamientos
      ordenarClientes() {
        if (store.esBodegueroTelconet)
          clientes.value = clientes.value.filter(
            (v: Cliente) => v.razon_social!.indexOf('TELCONET') > -1
          )
        else
          clientes.value.sort((a: Cliente, b: Cliente) =>
            ordernarListaString(a.razon_social!, b.razon_social!)
          )
      }
    }
  }
})