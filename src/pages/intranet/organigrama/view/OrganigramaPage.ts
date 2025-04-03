import { defineComponent, ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasOrganigrama } from '../domain/configuracionColumnasOrganigrama'

import { OrganigramaController } from '../infraestructure/OrganigramaController'
import { Organigrama } from '../domain/Organigrama'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { tabOptionsOrganigrama } from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import MiOrganigramaPage from './MiOrganigramaPage.vue'

export default defineComponent({
  components: { TabLayoutFilterTabs2, MiOrganigramaPage },

  setup() {

    const mixin = new ContenedorSimpleMixin(
      Organigrama,
      new OrganigramaController()
    )

    const {
      entidad: organigrama,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()

    const tipos = ref<string[]>(['interno', 'externo'])
    const departamentos = ref<string>('')



    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    /*****************************************************************************************
     * Hooks
     ****************************************************************************************/
    onReestablecer(() => {
      organigrama.empleado_id = null
      organigrama.cargo = ''
    })


    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1
          }
        }
      })
      empleados.value = listadosAuxiliares.empleados
    })

    const reglas = computed(() => ({
      empleado_id: { required },
      cargo: { required },
      tipo: { required },
      departamento: { required },
      nivel: { required },
      jefe_id: { required: false } // Hacer opcional
    }))

    const v$ = useVuelidate(reglas, organigrama)
    setValidador(v$.value)

    function filtrarOrganigrama(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
    }

    function obtenerCargo() {
      const empleadoSeleccionado = empleados.value.find(
        emp => emp.id === organigrama.empleado_id
      )

      if (empleadoSeleccionado) {
        organigrama.cargo = empleadoSeleccionado.cargo || ''
      } else {
        organigrama.cargo = ''
      }
      console.log('Cargo actualizado:', organigrama.cargo)
    }

    return {
      mixin,
      disabled,
      organigrama,
      configuracionColumnas: configuracionColumnasOrganigrama,
      tabOptionsOrganigrama,
      v$,
      accion,
      filtrarOrganigrama,
      empleados,
      filtrarEmpleados,
      ordenarLista,
      obtenerCargo,

      tipos,
      departamentos
    }
  }
})
