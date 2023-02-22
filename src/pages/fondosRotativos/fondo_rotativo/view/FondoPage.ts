import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { Fondo } from '../domain/Fondo'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FondoController } from '../infrestructure/FondoController'
import { configuracionColumnasFondo } from '../domain/configuracionColumnasFondo'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { validarIdentificacion } from 'shared/validadores/validaciones'
import { ProyectoController } from 'pages/tareas/proyectos/infraestructure/ProyectoController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { FondoRotativoPusherEvent } from '../application/FondoRotativoPusherEvent'

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
    const {
      entidad: fondo,
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
      fecha_viat: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      lugar: {
        required: true,
      },
      num_tarea: {
        required: true,
        minLength: 2,
        maxLength: 25,
      },
      proyecto: {
        required: true,
        minLength: 2,
        maxLength: 25,
      },
      ruc: {
        required: true,
        minLength: 13,
        maxLength: 13,
        helper: helpers.withMessage(
          'El RUC ingresado es Invalido',
          validarIdentificacion
        ),
      },
      factura: {
        required: true,
        minLength: 3,
        maxLength: 15,
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

    const cantones = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales = ref([])
    const tareas = ref([])
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
          params: { campos: 'id,codigo_tarea,detalle,cliente_id,proyecto_id' },
        },
      })
      cantones.value = listadosAuxiliares.cantones
      detalles.value = listadosAuxiliares.detalles
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales
      sub_detalles.value = listadosAuxiliares.sub_detalles
      listadosAuxiliares.proyectos.unshift({ id: 0, nombre: 'Sin Proyecto' })
      proyectos.value = listadosAuxiliares.proyectos
      tareas.value = listadosAuxiliares.tareas
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
    // - Filtro Detalles

    function filtrarDetalles(val, update) {
      if (val === '') {
        update(() => {
          detalles.value = listadosAuxiliares.detalles
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        detalles.value = listadosAuxiliares.detalles.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
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
    function filtarSubdetalles(val, update) {
      if (val === '') {
        update(() => {
          sub_detalles.value = listadosAuxiliares.sub_detalles.filter(
            (v) => v.id_detalle_viatico == fondo.detalle
          )
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        sub_detalles.value = listadosAuxiliares.sub_detalles.filter(
          (v) => v.detalle.indexOf(needle) > -1
        )
      })
    }
    function filtrarProyectos(val, update) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v) =>
            v.codigo_proyecto.toLowerCase().indexOf(needle) > -1 ||
            v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarTareas(val, update) {
      if (fondo.proyecto == 0) {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == null
          )
        })
        return
      }
      if (val === '') {
        update(() => {
          tareas.value = listadosAuxiliares.tareas.filter(
            (v) => v.proyecto_id == fondo.proyecto
          )
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadosAuxiliares.tareas.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.detalle.toLowerCase().indexOf(needle) > -1
        )
      })
    }
     /*********
     * Pusher
     *********/

     const fondoRotativoPusherEvent = new FondoRotativoPusherEvent()
     fondoRotativoPusherEvent.start()

    watchEffect(() => (fondo.total = fondo.cant * fondo.valor_u))

    return {
      mixin,
      fondo,
      cantones,
      detalles,
      sub_detalles,
      proyectos,
      tareas,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasFondo,
      autorizacionesEspeciales,
      watchEffect,
      filtrarAutorizacionesEspeciales,
      filtrarCantones,
      filtrarDetalles,
      filtarSubdetalles,
      filtrarProyectos,
      filtrarTareas,
      listadosAuxiliares,
    }
  },
})
