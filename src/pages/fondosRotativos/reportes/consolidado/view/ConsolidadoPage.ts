import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { Consolidado } from '../domain/Consolidado'
import { ConsolidadoController } from '../infrestructure/ConsolidadoController'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { maskFecha } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Consolidado,new ConsolidadoController(),
    )
    const {
      entidad: consolidado,
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
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_saldo: {
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
    const tipos_saldos = ref([
      { value: '1', label: 'Acreditacion' },
      { value: '2', label: 'Gasto' },
      { value: '3', label: 'Consolidado' },
    ]);

    listadosAuxiliares.tipos_saldos = tipos_saldos;
    const v$ = useVuelidate(reglas, consolidado)
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
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1 ||v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    // - Filtro TIPOS FONDOS
    function filtrarTiposFondos(val, update) {
      if (val === '') {
        update(() => {
          tiposFondos.value = listadosAuxiliares.tiposFondos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondos.value = listadosAuxiliares.tiposFondos.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro TIPOS FONDOS
    function filtrarTiposFondoRotativoFechas(val, update) {
      if (val === '') {
        update(() => {
          tiposFondoRotativoFechas.value =
            listadosAuxiliares.tiposFondoRotativoFechas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondoRotativoFechas.value =
          listadosAuxiliares.tiposFondoRotativoFechas.filter(
            (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    //Filtro tipos de reportes
    function filtarTiposSaldos(val, update) {
      if (val === '') {
        update(() => {
          tipos_saldos.value=
            listadosAuxiliares.tipos_saldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_saldos.value =
          listadosAuxiliares.tipos_saldos.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    async function generar_reporte(
      valor: Consolidado,
      tipo: string
    ): Promise<void> {
       const axios = AxiosHttpRepository.getInstance()
      const filename = 'reporte_semanal_gastos_del_' + valor.fecha_inicio + '_al_' +valor.fecha_fin
      switch (tipo) {
        case 'excel':
          const url_excel =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.consolidado_excel)
          imprimirArchivo(url_excel, 'POST', 'blob', 'xlsx', filename, valor)
          break
        case 'pdf':
          const url_pdf =
            apiConfig.URL_BASE +
            '/' +
            axios.getEndpoint(endpoints.consolidado_pdf)
          imprimirArchivo(url_pdf, 'POST', 'blob', 'pdf', filename, valor)
          break
        default:
          break
      }
    }
    return {
      mixin,
      consolidado,
      disabled,
      accion,
      v$,
      maskFecha,
      usuarios,
      tiposFondos,
      tiposFondoRotativoFechas,
      tipos_saldos,
      generar_reporte,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposFondoRotativoFechas,
      filtarTiposSaldos,
      watchEffect,
    }
  },
})
