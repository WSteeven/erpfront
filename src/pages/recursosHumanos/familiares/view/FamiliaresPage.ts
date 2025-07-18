// Dependencias
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Familiares } from '../domain/Familiares'
import { removeAccents } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { FamiliaresController } from '../infraestructure/FamiliaresController'
import { configuracionColumnasFamiliares } from '../domain/configuracionColumnasFamiliares'
import { useFamiliarStore } from 'stores/familiar'
import { parentezcos } from 'config/recursosHumanos.utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: { TabLayout, SelectorImagen, GestorDocumentos },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Familiares,
      new FamiliaresController()
    )

    const {
      entidad: familiares,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar } =
      mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    const familiarStore = useFamiliarStore()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        }
      })
      empleados.value = listadosAuxiliares.empleados
    })
    if (familiarStore.idFamiliarSeleccionada) {
      consultar({ id: familiarStore.idFamiliarSeleccionada })
    } else {
      familiares.hydrate(new Familiares())
    }
    if (familiarStore.idEmpleado) {
      familiares.empleado = familiarStore.idEmpleado
    }
    accion.value = familiarStore.accion

    onGuardado((entidad, data) => {
      emit('cerrar-modal', false)
      emit('guardado', { key: 'EmpleadoPage', model: data.modelo })
    })
    //Reglas de validacion
    const reglas = {
      nombres: { required },
      apellidos: { required },
      parentezco: { required },
      identificacion: { required }
    }
    const v$ = useVuelidate(reglas, familiares)
    setValidador(v$.value)

    return {
      removeAccents,
      mixin,
      familiares,
      parentezcos,
      filtrarEmpleados,
      empleados,
      familiarStore,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasFamiliares
    }
  }
})
