import { computed, defineComponent, reactive, Ref, ref, watchEffect } from 'vue'
import { Gasto } from '../domain/Gasto'

// Componentes

import SelectorImagen from 'components/SelectorImagen.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { LocalStorage, useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoController } from '../infrestructure/GastoController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { TareaController } from 'tareas/infraestructure/TareaController'
import { GastoPusherEvent } from '../application/GastoPusherEvent'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { SubDetalleFondo } from 'pages/fondosRotativos/subDetalleFondo/domain/SubDetalleFondo'
import { useNotificaciones } from 'shared/notificaciones'
import { AprobarGastoController } from 'pages/fondosRotativos/autorizarGasto/infrestructure/AprobarGastoController'
import { useAuthenticationStore } from 'stores/authentication'
import { emit } from 'process'
import { maskFecha, tabAutorizarGasto, estadosGastos } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    const authenticationStore = useAuthenticationStore()
    const usuario = authenticationStore.user
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, new GastoController())
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar, listar } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const aprobarController = new AprobarGastoController()

    const esFactura = ref(true)
    const mostrarListado = ref(true)
    const mostrarAprobacion = ref(false)

    if (fondoRotativoStore.id_gasto) {
      consultar({ id: fondoRotativoStore.id_gasto })
      mostrarListado.value = false
      mostrarAprobacion.value = true
    }
    const visualizarAutorizador = computed(() => {
      return authenticationStore.can('puede.ver.campo.autorizador')
      /*return usuario.roles.findIndex((rol) => rol === 'TECNICO') > -1
        ? true
        : false*/
    })

    const esCombustibleEmpresa = computed(() => {
      if (gasto.detalle == null) {
        return false
      }
      if (gasto.sub_detalle == null) {
        return false
      }
      if (parseInt(gasto.detalle !== null ? gasto.detalle : '') === 6) {
        return (
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 96) >
          -1 ||
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 97) >
          -1 ||
          gasto.sub_detalle!.findIndex((subdetalle) => subdetalle === 24) > -1
        )
      } else {
        return false
      }
    })
    const numFacturaObjeto = [
      {
        detalle: 16,
        cantidad: 22,
        mascara: '###-###-##############',
      },
      {
        detalle: 10,
        cantidad: 17,
        mascara: '###-###-#########',
      },
    ]
    const cantidadPermitidaFactura = computed(() => {
      let cantidad = 17

      if (esFactura.value === false) {
        cantidad = 0
      }
      const index = numFacturaObjeto
        .map((object) => object.detalle)
        .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
      cantidad =
        numFacturaObjeto[index] !== undefined
          ? numFacturaObjeto[index].cantidad
          : 15
      return cantidad
    })
    const mostarPlaca = computed(() => {
      return parseInt(gasto.detalle !== null ? gasto.detalle : '') == 16 ||
        parseInt(gasto.detalle !== null ? gasto.detalle : '') == 24
        ? true
        : false
    })
    const mascaraFactura = computed(() => {
      let mascara = '###-###-#############'
      const index = numFacturaObjeto
        .map((object) => object.detalle)
        .indexOf(parseInt(gasto.detalle !== null ? gasto.detalle : ''))
      mascara =
        numFacturaObjeto[index] !== undefined
          ? numFacturaObjeto[index].mascara
          : '###-###-#########'
      return mascara
    })

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_viat: {
        required,
      },
      lugar: {
        required,
      },
      num_tarea: {
        required,
      },
      proyecto: {
        required,
      },
      ruc: {
        minLength: minLength(13),
        maxLength: maxLength(13),
        required: requiredIf(() => esFactura.value),
      },
      factura: {
        minLength: minLength(cantidadPermitidaFactura),
        required: requiredIf(() => esFactura.value),
      },
      /*beneficiarios: {
        required: required
      },*/
      aut_especial: {
        required: requiredIf(() => visualizarAutorizador.value),
      },
      num_comprobante: {
        maxLength: maxLength(17),
      },
      detalle: {
        required,
      },
      sub_detalle: {
        required,
      },
      cantidad: {
        required,
      },
      valor_u: {
        required,
      },
      total: {
        required,
      },
      comprobante1: {
        required: requiredIf(() => gasto.comprobante1 !== gasto.comprobante2),
      },
      comprobante2: {
        required: requiredIf(() => gasto.comprobante2 !== gasto.comprobante1),
      },
      kilometraje: {
        requiredIfdetalle: esCombustibleEmpresa,
      },
      vehiculo: {
        requiredIfdetalle: esCombustibleEmpresa,
      },
      observacion: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    const cantones = ref([])
    const detalles = ref([])
    const sub_detalles = ref([])
    const proyectos = ref([])
    const autorizacionesEspeciales: Ref<Empleado[]> = ref([])
    const tareas = ref([])
    const vehiculos = ref([])
    const beneficiarios = ref([])

    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        autorizacionesEspeciales: {
          controller: new UsuarioAutorizadoresController(),
          params: { campos: 'id,name' },
        },
        proyectos: {
          controller: new ProyectoController(),
          params: { campos: 'id,nombre,codigo_proyecto', finalizado: 0 },
        },
        tareas: {
          controller: new TareaController(),
          params: {
            //campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
            formulario: true,
          },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            id: usuario.jefe_id,
            estado: 1,
          },
        },
        beneficiarios: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          },
        },
        vehiculos: {
          controller: new VehiculoController(),
          params: {
            campos: 'id,placa',
          },
        },
      })
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales
      beneficiarios.value = listadosAuxiliares.beneficiarios
      listadosAuxiliares.proyectos.unshift({ id: 0, nombre: 'Sin Proyecto' })
      proyectos.value = listadosAuxiliares.proyectos
      tareas.value = listadosAuxiliares.tareas
      vehiculos.value = listadosAuxiliares.vehiculos
      autorizacionesEspeciales.value.unshift(listadosAuxiliares.empleados[0])
    })
    cantones.value =
      LocalStorage.getItem('cantones') == null
        ? []
        : JSON.parse(LocalStorage.getItem('cantones')!.toString())
    detalles.value =
      LocalStorage.getItem('detalles') == null
        ? []
        : JSON.parse(LocalStorage.getItem('detalles')!.toString())
    sub_detalles.value =
      LocalStorage.getItem('sub_detalles') == null
        ? []
        : JSON.parse(LocalStorage.getItem('sub_detalles')!.toString())
    listadosAuxiliares.cantones = cantones.value
    listadosAuxiliares.detalles = detalles.value
    listadosAuxiliares.sub_detalles = sub_detalles.value

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
        console.log(
          listadosAuxiliares.autorizacionesEspeciales.filter((v) => {
            console.log(v.nombres.toLowerCase())

            v.nombres.toLowerCase().indexOf(needle) > -1
          })
        )

        autorizacionesEspeciales.value =
          listadosAuxiliares.autorizacionesEspeciales.filter(
            (v) =>
              v.nombres.toLowerCase().indexOf(needle) > -1 ||
              v.apellidos.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    //filtro beneficiarios
    function filtrarBeneficiarios(val, update) {
      if (val === '') {
        update(() => {
          beneficiarios.value = listadosAuxiliares.beneficiarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        beneficiarios.value = listadosAuxiliares.beneficiarios.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
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
    function optionsFechaGasto(date) {
      const today = new Date()

      const diaSemana = today.getDay()
      // Verificar si el día actual es sábado
      let sabadoAnterior = ''
      if (diaSemana === 6) {
        sabadoAnterior = convertir_fecha(
          new Date(today.setDate(today.getDate() - ((today.getDay() + 2) % 7)))
        )
      } else {
        sabadoAnterior = convertir_fecha(
          new Date(today.setDate(today.getDate() - ((today.getDay() + 1) % 7)))
        )
      }
      const sabadoSiguiente = convertir_fecha(new Date(siguienteSabado()))
      console.log(sabadoAnterior + ' al ' + sabadoSiguiente)
      return date >= sabadoAnterior && date <= sabadoSiguiente
    }
    function siguienteSabado() {
      const fecha = new Date() // Obtenemos la fecha actual
      const diaSemana = fecha.getDay() // Obtenemos el día de la semana (0-6, siendo 0 domingo)
      // Calculamos los días que faltan hasta el próximo sábado
      const diasFaltantes = 6 - diaSemana
      // Sumamos los días faltantes a la fecha actual para obtener el próximo sábado
      fecha.setDate(fecha.getDate() + diasFaltantes)
      // Retornamos la fecha formateada como una cadena de texto
      return fecha
    }
    // - Filtro Lugares
    function convertir_fecha(fecha: Date) {
      const day = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate()
      const month =
        fecha.getMonth() + 1 < 10
          ? '0' + (fecha.getMonth() + 1)
          : fecha.getMonth() + 1
      const year = fecha.getFullYear()
      return year + '/' + month + '/' + day
    }
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
    /**Filtro de Sub detalles */
    function filtarSubdetalles(val, update) {
      if (val === '') {
        update(() => {
          sub_detalles.value = listadoSubdetalles.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        sub_detalles.value = listadoSubdetalles.value.filter((v) => {
          v.descripcion.toLowerCase().indexOf(needle) > -1
        })
      })
    }
    /**Filtro de proyectos */
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
    /**Filtrar Vehiculos */
    function filtrarVehiculos(val, update) {
      if (val === '') {
        update(() => {
          vehiculos.value = listadosAuxiliares.vehiculos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        vehiculos.value = listadosAuxiliares.vehiculos.filter(
          (v) => v.placa.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    /**Filtro de Tareas */
    function filtrarTareas(val, update) {
      if (val === '') {
        update(() => {
          tareas.value = listadoTareas.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tareas.value = listadoTareas.value.filter(
          (v) =>
            v.codigo_tarea.toLowerCase().indexOf(needle) > -1 ||
            v.titulo.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    listadosAuxiliares.tareas.unshift({
      id: 0,
      titulo: 'Sin Tarea',
      codigo_tarea: ' ',
    })
    const listadoTareas = computed(() => {
      if (gasto.proyecto == 0) {
        return listadosAuxiliares.tareas.filter(
          (tarea: Tarea) => tarea.proyecto_id === null || tarea.id == 0
        )
      }
      return listadosAuxiliares.tareas.filter(
        (tarea: Tarea) => tarea.proyecto_id === gasto.proyecto || tarea.id == 0
      )
    })

    const listadoSubdetalles = computed(() => {
      if (gasto.detalle == '0') {
        return listadosAuxiliares.sub_detalles
      }
      return listadosAuxiliares.sub_detalles.filter(
        (subdetalle: SubDetalleFondo) =>
          subdetalle.id_detalle_viatico === gasto.detalle
      )
    })
    function cambiar_proyecto() {
      gasto.num_tarea = null
    }
    function cambiar_detalle() {
      gasto.sub_detalle = null
    }

    function tiene_factura_subdetalle() {
      let tieneFactura = false

      for (let index = 0; index < gasto.sub_detalle!.length; index++) {
        const id_subdetalle = gasto.sub_detalle![index]
        const subdetalleEncontrado = listadoSubdetalles.value.find((v) => v.id === id_subdetalle)
        if (subdetalleEncontrado.tiene_factura) {
          tieneFactura = true
          break
        }
      }
      esFactura.value = tieneFactura
      console.log('tiene_factura', esFactura.value);
    }
    /*********
     * Pusher
     *********/

    const gastoPusherEvent = new GastoPusherEvent()
    gastoPusherEvent.start()

    watchEffect(() => {
      gasto.total = gasto.cantidad! * gasto.valor_u!
      if (gasto.sub_detalle !== null) {
        tiene_factura_subdetalle()
      }
    })
    function existeComprobante() {
      gasto.factura = null
      gasto.ruc = null
    }
    async function recargar_detalle(tipo: string) {
      switch (tipo) {
        case 'detalle':
          const detalles = (
            await new DetalleFondoController().listar({
              campos: 'id,descripcion',
            })
          ).result
          LocalStorage.set('detalles', JSON.stringify(detalles))
          setTimeout(
            () =>
              setInterval(() => {
                detalles.value =
                  LocalStorage.getItem('detalles') == null
                    ? []
                    : JSON.parse(LocalStorage.getItem('detalles')!.toString())
                listadosAuxiliares.detalles = detalles.value
              }, 100),
            250
          )

          break
        case 'sub_detalle':
          const sub_detalles = (
            await new SubDetalleFondoController().listar({
              campos: 'id,descripcion',
            })
          ).result
          LocalStorage.set('sub_detalles', JSON.stringify(sub_detalles))
          setTimeout(
            () =>
              setInterval(() => {
                sub_detalles.value =
                  LocalStorage.getItem('sub_detalles') == null
                    ? []
                    : JSON.parse(
                      LocalStorage.getItem('sub_detalles')!.toString()
                    )
                listadosAuxiliares.sub_detalles = sub_detalles.value
              }, 100),
            250
          )

          break
      }
    }
    function aprobar_gasto(entidad, tipo_aprobacion: string) {
      switch (tipo_aprobacion) {
        case 'aprobar':
          const data: CustomActionPrompt = {
            titulo: 'Aprobar gasto',
            mensaje: 'Ingrese motivo de aprobación',
            accion: async (data) => {
              try {
                entidad.detalle_estado = data
                await aprobarController.aprobarGasto(entidad)
                notificarCorrecto('Se aprobado Gasto Exitosamente')
                emit('cerrar-modal')
              } catch (e: any) {
                notificarError(
                  'No se pudo aprobar, debes ingresar un motivo para la anulación'
                )
              }
            },
          }
          prompt(data)
          break
        case 'rechazar':
          confirmar('¿Está seguro de rechazar el gasto?', () => {
            const data: CustomActionPrompt = {
              titulo: 'Rechazar gasto',
              mensaje: 'Ingrese motivo de aprobación',
              accion: async (data) => {
                try {
                  entidad.detalle_estado = data
                  await aprobarController.rechazarGasto(entidad)
                  notificarAdvertencia('Se rechazado Gasto Exitosamente')
                  emit('cerrar-modal')
                } catch (e: any) {
                  notificarError(
                    'No se pudo rechazar, debes ingresar un motivo para la anulación'
                  )
                }
              },
            }
            prompt(data)
          })
        default:
          break
      }
    }
    let tabActualGasto = '3'

    function filtrarGasto(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabActualGasto = tabSeleccionado
    }
    return {
      mixin,
      gasto,
      authenticationStore,
      cantones,
      detalles,
      esFactura,
      sub_detalles,
      proyectos,
      tareas,
      usuario,
      disabled,
      accion,
      v$,
      tabAutorizarGasto,
      maskFecha,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      visualizarAutorizador,
      esCombustibleEmpresa,
      vehiculos,
      watchEffect,
      filtrarAutorizacionesEspeciales,
      tiene_factura_subdetalle,
      filtrarCantones,
      filtrarDetalles,
      filtarSubdetalles,
      filtrarBeneficiarios,
      filtrarProyectos,
      existeComprobante,
      filtrarTareas,
      filtrarGasto,
      filtrarVehiculos,
      aprobar_gasto,
      cambiar_detalle,
      cambiar_proyecto,
      optionsFechaGasto,
      recargar_detalle,
      mascaraFactura,
      listadosAuxiliares,
      listadoSubdetalles,
      beneficiarios,
      mostrarListado,
      mostarPlaca,
      listadoTareas,
    }
  },
})
