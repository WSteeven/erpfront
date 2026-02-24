//Dependencias
import { configuracionColumnasClientes } from '../domain/configuracionColumnasClientes'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { acciones, rolesSistema } from 'config/utils'

//Components
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Cliente } from '../domain/Cliente'
import { ClienteController } from '../infraestructure/ClienteController'
import { computed, defineComponent, ref } from 'vue'
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController'
import { Parroquia } from 'sistema/parroquia/domain/Parroquia'
import { ComportamientoModalesCliente } from '../application/ComportamientoModalesCliente'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad, SelectorImagen, NoOptionComponent, ErrorComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(Cliente, new ClienteController())
    const {
      entidad: cliente,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()

    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo)
    const modales = new ComportamientoModalesCliente()

    const parroquiasAux = ref([])
    const {
      empleados,
      filtrarEmpleados,
      empresas,
      filtrarEmpresas,
      cantones,
      filtrarCantones, parroquias
    } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      obtenerListados({
        empresas: new EmpresaController(),
        cantones: new CantonController(),
        parroquias: new ParroquiaController(),
        empleados: {
          controller: new EmpleadoRoleController(),
          params: {
            roles: [
              rolesSistema.coordinador,
              rolesSistema.coordinadorBackup,
              rolesSistema.jefe_tecnico
            ]
          }
        }
      })
    })

    /**************************************************************
     * Validaciones
     **************************************************************/
    const reglas = {
      empresa: { required },
      parroquia: { required },
      requiere_bodega: { required },
      estado: { required },
      coordinadores: { required }
    }
    const v$ = useVuelidate(reglas, cliente)
    setValidador(v$.value)

    async function guardado() {
      const { result } = await new EmpresaController().listar()
      empresas.value = result
    }

    //llenar listados
    empresas.value = listadosAuxiliares.empresas
    cantones.value = listadosAuxiliares.cantones
    parroquias.value = listadosAuxiliares.parroquias

    return {
      mixin,
      cliente,
      disabled,
      v$,
      configuracionColumnas: configuracionColumnasClientes,

      //listados
      cantones,
      parroquias,
filtrarCantones,

      //modal
      modales,
      mostrarLabelModal,
      guardado,

      //filtros
      cantonSeleccionado(val) {
        parroquiasAux.value = listadosAuxiliares.parroquias.filter(
          v => v.canton_id === val
        )
        parroquias.value = parroquiasAux.value
      },
      filtrarParroquia(val, update) {
        if (val == '') {
          update(() => {
            parroquias.value = parroquiasAux.value
          })
          return
        }
        update(() => {
          parroquias.value = parroquiasAux.value.filter(
            (v: Parroquia) =>
              v.parroquia.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        })
      },
      ordenarLista,
      // listados
      empleados,
      filtrarEmpleados,
      empresas,
      filtrarEmpresas
    }
  }
})
