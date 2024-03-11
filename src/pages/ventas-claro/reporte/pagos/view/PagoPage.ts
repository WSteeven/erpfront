import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo, ordernarListaString } from 'shared/utils'
import { Pagos } from '../domain/Pagos'
import { PagosController } from '../infrestructure/PagosController'
import { maskFecha } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { Vendedor } from 'pages/ventas-claro/vendedores/domain/Vendedor'
import { required } from 'shared/i18n-validators'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const fondosStore = useFondoRotativoStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Pagos, new PagosController())
    const {
      entidad: pago,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()


      const {vendedores_claro:vendedores,filtrarVendedoresClaro: filtrarVendedores} = useFiltrosListadosSelects(listadosAuxiliares)
      cargarVista(async () => {
        await obtenerListados({
          vendedores: {
            controller: new VendedorController(),
            params: {
              // campos: 'id',
            },
          },
        })
        vendedores.value = listadosAuxiliares.vendedores
      })

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_inicio: {
        required,
      },
      fecha_fin: {
        required,
      },
      vendedor: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, pago)
    setValidador(v$.value)
    /*********
     * Filtros
     **********/
    async function generar_reporte(valor: Pagos, tipo: string): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename =
          'reporte_semanal_pago_del_' +
          valor.fecha_inicio +
          '_al_' +
          valor.fecha_fin
        const url_excel =
          apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.pago)
        imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
      }
    }
    function ordenarVendedores() {
      vendedores.value.sort((a: Vendedor, b: Vendedor) =>
        ordernarListaString(a.empleado_info!, b.empleado_info!)
      )
    }

    return {
      mixin,
      pago,
      disabled,
      accion,
      v$,
      maskFecha,
      ordenarVendedores,
      filtrarVendedores,
      vendedores,
      generar_reporte,
      watchEffect,
    }
  },
})
