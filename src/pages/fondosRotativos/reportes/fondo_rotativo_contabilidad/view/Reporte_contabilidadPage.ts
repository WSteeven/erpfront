import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { FondoRotativoContabilidad } from '../domain/FondoRotativoContabilidad'
import { FondoRotativoContabilidadController } from '../infrestructure/FondoRotativoContabilidadController'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ConfiguracionColumnasContabilidad } from '../domain/ConfiguracionColumnasContabilidad'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesFondoRotativoContabilidad } from '../application/ComportamientoModalesFondoRotativoContabilidad'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla, maskFecha } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  components: { TabLayout, EssentialTable, ModalEntidad },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const fondoRotativoStore = useFondoRotativoStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      FondoRotativoContabilidad,
      new FondoRotativoContabilidadController()
    )
    const {
      entidad: fondo_rotativo_contabilidad,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista,listar } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_inicio: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_fin: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const opened = ref(false)
    const v$ = useVuelidate(reglas, fondo_rotativo_contabilidad)
    setValidador(v$.value)
    const usuarios = ref([])
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    usuarios.value = listadosAuxiliares.usuarios

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos',estado: 1 },
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
    })
    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarUsuarios(val, update) {
      if (val === '') {
        update(() => {
          usuarios.value = listadosAuxiliares.usuarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        usuarios.value = listadosAuxiliares.usuarios.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    async function abrir_reporte(
      valor: FondoRotativoContabilidad
    ): Promise<void> {
      listar({ usuario: valor.usuario,
         fecha_inicio: valor.fecha_inicio,
          fecha_fin: valor.fecha_fin })

    }
    /**Modales */
    const modales = new ComportamientoModalesFondoRotativoContabilidad()
    const botonVerModalGasto: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        fondoRotativoStore.id_gasto = entidad.id
        fondoRotativoStore.existeFactura = entidad.factura ==null? false:true
        modales.abrirModalEntidad('VisualizarGastoPage')
      }
    }

    return {
      mixin,
      fondo_rotativo_contabilidad,
      ConfiguracionColumnasContabilidad,
      disabled,
      accion,
      v$,
      maskFecha,
      usuarios,
      opened,
      tiposFondos,
      tiposFondoRotativoFechas,
      abrir_reporte,
      filtrarUsuarios,
      watchEffect,
      modales,
      listado,
      botonVerModalGasto,
      accionesTabla,
    }
  },
})
