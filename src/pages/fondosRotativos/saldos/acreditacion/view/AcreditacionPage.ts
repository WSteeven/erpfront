import { defineComponent, ref, watchEffect} from 'vue'
import { Acreditacion } from '../domain/Acreditacion'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AcreditacionController } from '../infrestructure/AcreditacionController'
import { configuracionColumnasAcreditacion } from '../domain/configuracionColumnasAcreditacion'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { TipoSaldoController } from 'pages/fondosRotativos/tipo_saldo/infrestructure/TipoSaldoController'
import axios from 'axios'
import { acciones, tabAcreditacion } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AcreditacionCancelacionController } from '../infrestructure/AcreditacionCancelacionController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'


export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Acreditacion, new AcreditacionController())
    const { entidad: acreditacion, disabled, accion,listadosAuxiliares,listado } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista,listar} = mixin.useComportamiento()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()

    /*************
    * Validaciones
    **************/
    const reglas = {
      usuario: {
        required
      },
      tipo_fondo: {
        required
      },
      tipo_saldo: {
        required
      },
      id_saldo: {
        required,
      },
      descripcion_acreditacion: {
        required,
      },
      monto: {
        required,
      },
    }
    const v$ = useVuelidate(reglas, acreditacion)
    setValidador(v$.value)
   const usuarios= ref([]);
   const tiposFondos= ref([]);
   const tiposSaldos= ref([]);
   const authenticationStore = useAuthenticationStore()
   usuarios.value=listadosAuxiliares.usuarios
   const acreditacionCancelacionController = new AcreditacionCancelacionController()

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
      tiposSaldos: {
        controller: new TipoSaldoController(),
        params: { campos: 'id,descripcion' },
      },

    })

    usuarios.value = listadosAuxiliares.usuarios
    tiposFondos.value = listadosAuxiliares.tiposFondos
    tiposSaldos.value = listadosAuxiliares.tiposSaldos

  })
  /*********
   * Filtros
   **********/
 // - Filtro AUTORIZACIONES ESPECIALES

 function filtrarUsuarios(val, update) {
  if (val === '') {
    update(() => {
      usuarios.value =
        listadosAuxiliares.usuarios
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    usuarios.value =
      listadosAuxiliares.usuarios.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1
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
function filtrarTiposSaldos(val, update) {
  if (val === '') {
    update(() => {
      tiposSaldos.value = listadosAuxiliares.tiposSaldos
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    tiposSaldos.value = listadosAuxiliares.tiposSaldos.filter(
      (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
    )
  })
}

function saldo_anterior (){

  const axiosHttpRepository = AxiosHttpRepository.getInstance()
  const url_acreditacion =
            apiConfig.URL_BASE +
            '/' +
            axiosHttpRepository.getEndpoint(endpoints.ultimo_saldo)+ acreditacion.usuario;
  axios({
    url: url_acreditacion,
    method: 'GET',
    responseType: 'json',
    headers: {
      'Authorization': axiosHttpRepository.getOptions().headers.Authorization
    }
  }).then((response: HttpResponseGet) => {
    const { data } = response
    if (data) {
      acreditacion.saldo_anterior = data.saldo_actual
    }

  })

}
 function anularAcreditacion(entidad){
  confirmar('¿Está seguro de anular la acreditacion?', () => {
    const data: CustomActionPrompt = {
      titulo: 'Anular Acreditacion',
      mensaje: 'Ingrese motivo de anulacion',
      accion: async (data) => {
        try {
          entidad.descripcion_acreditacion = data
          await acreditacionCancelacionController.anularAcreditacion(entidad)
          notificarAdvertencia('Se anulado Acreditacion Exitosamente')
          filtrarAcreditacion('2')
        } catch (e: any) {
          notificarError(
            'No se pudo anular, debes ingresar un motivo para la anulación'
          )
        }
      },
    }
    prompt(data)
  })
}

const btnEliminarAcreditacion: CustomActionTable = {
  titulo: '',
  icono: 'bi-trash',
  color: 'negative',
  visible: () =>
    authenticationStore.can('puede.eliminar.acreditacion'),
  accion: ({ entidad, posicion }) => {
    accion.value = 'ELIMINAR'
   eliminar_acreditacion({entidad,posicion})

  },
}
async  function eliminar_acreditacion({ entidad, posicion }) {
  try {

    const data: CustomActionPrompt = {
      titulo: 'Eliminar Acreditacion',
      mensaje: 'Ingrese motivo de eliminacion',
      accion: async (data) => {
        entidad.estado = false
        entidad.motivo = data
        entidad.descripcion_acreditacion = data
          await acreditacionCancelacionController.anularAcreditacion(entidad)
          notificarCorrecto('Se ha eliminado Acreditacion')
          listado.value.splice(posicion,1);
      },
    }
    prompt(data)
} catch (e: any) {
  notificarError(
    'No se pudo anular, debes ingresar un motivo para la anulacion'
  )
}
}
let tabActualAcreditacion = '1'

function filtrarAcreditacion(tabSeleccionado: string) {
  listar({ id_estado: tabSeleccionado }, false)
  tabActualAcreditacion = tabSeleccionado
}

  watchEffect(() => acreditacion.saldo_actual =parseFloat(acreditacion.saldo_anterior!==null?acreditacion.saldo_anterior.toString():'0') + parseFloat(acreditacion.monto!==null?acreditacion.monto.toString():'0'))
    return {
      mixin,
      acreditacion,
      disabled,
       accion,
       acciones,
        v$,
      usuarios,
      tiposFondos,
      tiposSaldos,
      saldo_anterior,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposSaldos,
      filtrarAcreditacion,
      btnEliminarAcreditacion,
      tabAcreditacion,
      anularAcreditacion,
      watchEffect,
      configuracionColumnas: configuracionColumnasAcreditacion,
    }
  }
})


