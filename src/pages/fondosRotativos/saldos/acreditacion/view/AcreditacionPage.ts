import { defineComponent, reactive ,ref, watchEffect} from 'vue'
import { Acreditacion } from '../domain/Acreditacion'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AcreditacionController } from '../infrestructure/AcreditacionController'
import { configuracionColumnasAcreditacion } from '../domain/configuracionColumnasAcreditacion'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { TipoSaldoController } from 'pages/fondosRotativos/tipo_saldo/infrestructure/TipoSaldoController'
import axios, { AxiosResponse, Method, ResponseType } from 'axios'


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
    const mixin = new ContenedorSimpleMixin(Acreditacion, new AcreditacionController())
    const { entidad: acreditacion, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_fondo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      id_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      descripcion_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      saldo_anterior: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
     saldo_depositado: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      monto: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      saldo_actual: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, acreditacion)
    setValidador(v$.value)
   const usuarios= ref([]);
   const tiposFondos= ref([]);
   const tiposSaldos= ref([]);
   usuarios.value=listadosAuxiliares.usuarios

   cargarVista(async () => {
    await obtenerListados({
      usuarios: {
        controller: new UsuarioController(),
        params: { campos: 'id,name' },
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
  watchEffect(() => acreditacion.saldo_actual =parseFloat(acreditacion.saldo_anterior!==null?acreditacion.saldo_anterior.toString():'0') + parseFloat(acreditacion.monto!==null?acreditacion.monto.toString():'0'))
    return {
      mixin,
      acreditacion,
      disabled, accion, v$,
      usuarios,
      tiposFondos,
      tiposSaldos,
      saldo_anterior,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposSaldos,
      watchEffect,
      configuracionColumnas: configuracionColumnasAcreditacion,
    }
  }
})


