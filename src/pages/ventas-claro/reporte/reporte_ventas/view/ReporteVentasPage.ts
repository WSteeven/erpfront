import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { ReporteVentas } from '../domain/ReporteVentas'
import { ReporteVentasController } from '../infrestructure/ReporteVentasController'
import { maskFecha } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useCargandoStore } from 'stores/cargando'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import {
  required,
} from 'shared/i18n-validators'
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
    const mixin = new ContenedorSimpleMixin(
      ReporteVentas,
      new ReporteVentasController()
    )
    const {
      entidad: reporte_ventas,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      mes: {
        required
      },
    }

    const v$ = useVuelidate(reglas, reporte_ventas)
    setValidador(v$.value)
    const usuarios = ref([])
    const usuariosInactivos = ref()
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    usuarios.value = listadosAuxiliares.usuarios
    const is_month = ref(false)

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
      usuariosInactivos.value =
        LocalStorage.getItem('usuariosInactivos') == null
          ? []
          : JSON.parse(LocalStorage.getItem('usuariosInactivos')!.toString())
      listadosAuxiliares.usuariosInactivos = usuariosInactivos.value
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
    })
    /*********
     * Filtros
     **********/

    async function generar_reporte(
      valor: ReporteVentas,
      tipo: string
    ): Promise<void> {
      if (await v$.value.$validate()) {
        const axios = AxiosHttpRepository.getInstance()
        const filename = 'reporte_semanal_reporte_ventas_del_' + valor.mes
        const url_excel =
          apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_ventas)
        imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
      }
    }
    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }

    return {
      mixin,
      reporte_ventas,
      disabled,
      accion,
      v$,
      maskFecha,
      usuarios,
      usuariosInactivos,
      tiposFondos,
      tiposFondoRotativoFechas,
      is_month,
      checkValue,
      generar_reporte,
      watchEffect,
    }
  },
})
