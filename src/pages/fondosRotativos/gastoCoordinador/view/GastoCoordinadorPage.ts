import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import {  GastoCoordinadores } from '../domain/GastoCoordinadores'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoCoordinadoresController } from '../infrestructure/GastoCoordinadoresController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { validarIdentificacion } from 'shared/validadores/validaciones'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'

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
    const mixin = new ContenedorSimpleMixin(GastoCoordinadores, new GastoCoordinadoresController())
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar } =
      mixin.useComportamiento()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const mostrarListado = ref(true)
    if (fondoRotativoStore.id_gasto) {
      consultar({ id: fondoRotativoStore.id_gasto })
      mostrarListado.value = false
    }

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_gasto: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      lugar: {
        required: true,
      },
      aut_especial: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      cantidad: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      valor_u: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      motivo:{
        required: true,
      },
      total: {
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

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)
    const cantones = ref([])
    const autorizacionesEspeciales = ref([])
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
          controller: new UsuarioAutorizadoresController(),
          params: { campos: 'id,name' },
        },
        sub_detalles: {
          controller: new SubDetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
        proyectos: {
          controller: new ProyectoController(),
          params: { campos: 'id,nombre,codigo_proyecto' },
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id' },
        },
        subTareas: {
          controller: new SubtareaController(),
          params: { campos: 'id,codigo_sub_tarea,titulo,tarea_id' },
        },
      })
      cantones.value = listadosAuxiliares.cantones
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales

    })

    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarAutorizacionesEspeciales(val, update) {
      if (val === '') {
        update(() => {
          autorizacionesEspeciales.value =
            listadosAuxiliares.autorizacionesEspeciales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        autorizacionesEspeciales.value =
          listadosAuxiliares.autorizacionesEspeciales.filter(
            (v) => v.usuario.toLowerCase().indexOf(needle) > -1
          )
      })
    }
      // - Filtro Lugares
    function filtrarCantones(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    watchEffect(() => (gasto.total = gasto.cantidad! * gasto.valor_u!))

    return {
      mixin,
      gasto,
      cantones,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      watchEffect,
      filtrarAutorizacionesEspeciales,
      filtrarCantones,
    }
  },
})
