//Dependencias
import { configuracionColumnasProveedores } from './../domain/configuracionColumnasProveedores'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core';

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { computed, defineComponent, ref } from 'vue';
import { ProveedorController } from '../infraestructure/ProveedorController';
import { Proveedor } from '../domain/Proveedor';
import { acciones } from 'config/utils';
import { ComportamientoModalesProveedores } from '../application/ComportamientoModalesProveedores';
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController';


export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo)
    const modales = new ComportamientoModalesProveedores()

    const opciones_empresas = ref([])
    cargarVista(async () => {
      obtenerListados({
        empresas: new EmpresaController()
      })
    })

    /**************************************************************
     * Validaciones
     **************************************************************/
    const reglas = {
      empresa: { required },
    }
    const v$ = useVuelidate(reglas, proveedor)
    setValidador(v$.value)

    async function guardado() {
      const { result } = await new EmpresaController().listar()
      opciones_empresas.value = result
    }

    //llenar listados
    opciones_empresas.value = listadosAuxiliares.empresas

    return {
      mixin, proveedor, disabled, v$, accion,
      configuracionColumnas: configuracionColumnasProveedores,

      //listado
      opciones_empresas,

      //modal
      modales,
      mostrarLabelModal,
      guardado,


    }

  }
})

