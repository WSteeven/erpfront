import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Fondo } from '../domain/Fondo'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FondoController } from '../infrestructure/FondoController'
import { configuracionColumnasFondo } from '../domain/configuracionColumnasFondo'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Fondo, new FondoController())
    const { entidad: fondo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
    * Validaciones
    **************/
    const reglas = {
      fecha_viat: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      lugar: {
        required: true
      },
      num_tarea: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      RUC: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      factura: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      aut_especial: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      detalle: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      sub_detalle: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      cant: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      valor_u: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      total: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      comprobante1: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      comprobante2: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      observacion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },

    }

    const v$ = useVuelidate(reglas, fondo)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    const cantones = ref([]);
    const detalles = ref([]);
    const autorizacionesEspeciales = ref([]);
    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' },
        },
        detalles: {
          controller: new DetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        autorizacionesEspeciales: {
          controller: new UsuarioController(),
          params: { campos: 'id,name' },
        },
      })

      cantones.value = listadosAuxiliares.cantones
      detalles.value = listadosAuxiliares.detalles
      autorizacionesEspeciales.value = listadosAuxiliares.autorizacionesEspeciales
      // console.log(listadosAuxiliaresautorizacionesEspeciales)
    })





    /*********
   * Filtros
   **********/
    // - Filtro clientes corporativos

    function filtrarAutorizacionesEspeciales(val, update) {
      if (val === '') {
        update(() => {
          autorizacionesEspeciales.value = listadosAuxiliares.autorizacionesEspeciales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        autorizacionesEspeciales.value = listadosAuxiliares.autorizacionesEspeciales.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    watchEffect(() => fondo.total = fondo.cant * fondo.valor_u)

    return {
      mixin,
      fondo,
      cantones,
      detalles,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasFondo,
      autorizacionesEspeciales,
      filtrarAutorizacionesEspeciales,
      listadosAuxiliares,
      computed
    }

  }
})


