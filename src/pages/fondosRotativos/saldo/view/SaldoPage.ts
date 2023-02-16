import { defineComponent, reactive ,ref, watchEffect} from 'vue'
import { Saldo } from '../domain/Saldo'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SaldoController } from '../infrestructure/SaldoController'
import { configuracionColumnasSaldo } from '../domain/configuracionColumnasSaldo'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { TipoSaldoController } from 'pages/fondosRotativos/tipo_saldo/infrestructure/TipoSaldoController'


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
    const mixin = new ContenedorSimpleMixin(Saldo, new SaldoController())
    const { entidad: saldo, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
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
      saldo_actual: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, saldo)
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
  watchEffect(() => saldo.saldo_actual =parseFloat(saldo.saldo_anterior) + parseFloat(saldo.saldo_depositado))
    return {
      mixin,
      saldo,
      disabled, accion, v$,
      usuarios,
      tiposFondos,
      tiposSaldos,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposSaldos,
      watchEffect,
      configuracionColumnas: configuracionColumnasSaldo,
    }
  }
})


