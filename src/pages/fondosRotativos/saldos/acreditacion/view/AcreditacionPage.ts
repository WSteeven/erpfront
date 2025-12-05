import { defineComponent, ref, watchEffect } from 'vue'
import { Acreditacion } from '../domain/Acreditacion'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { maxValue, required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AcreditacionController } from '../infrestructure/AcreditacionController'
import { configuracionColumnasAcreditacion } from '../domain/configuracionColumnasAcreditacion'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { TipoSaldoController } from 'pages/fondosRotativos/tipo_saldo/infrestructure/TipoSaldoController'
import { acciones, maskFecha, tabAcreditacion } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AcreditacionCancelacionController } from '../infrestructure/AcreditacionCancelacionController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { UltimoSaldoController } from 'pages/fondosRotativos/reportes/reporteSaldoActual/infrestucture/UltimoSaldoController'
import { obtenerFechaActual, ordenarLista, sumarFechas } from 'shared/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { endpoints } from 'config/api'
import ErrorComponent from 'components/ErrorComponent.vue';
import NoOptionComponent from 'components/NoOptionComponent.vue';
import {TipoFondo} from 'pages/fondosRotativos/tipoFondo/domain/TipoFondo';
import {TipoSaldo} from 'pages/fondosRotativos/tipo_saldo/domain/TipoSaldo';

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    GestorDocumentos,
    OptionGroupComponent,
    TabLayoutFilterTabs2
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const refArchivo = ref()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Acreditacion,
      new AcreditacionController()
    )
    const mixin2 = new ContenedorSimpleMixin(
      Acreditacion,
      new AcreditacionController()
    ) // mixin alternativo para que no se duplique listado
    const {
      entidad: acreditacion,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
      tabs,
      filtros
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError
    } = useNotificaciones()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: { required },
      tipo_fondo: { required },
      tipo_saldo: { required },
      id_saldo: { required },
      descripcion_acreditacion: { required },
      monto: { maxValue: maxValue(9999), required }
    }
    const v$ = useVuelidate(reglas, acreditacion)
    setValidador(v$.value)
    const modoIndividual = ref(true)

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const tiposFondos = ref([])
    const tiposSaldos = ref([])
    const authenticationStore = useAuthenticationStore()
    const acreditacionCancelacionController =
      new AcreditacionCancelacionController()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' }
        },
        tiposSaldos: {
          controller: new TipoSaldoController(),
          params: { campos: 'id,descripcion' }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposSaldos.value = listadosAuxiliares.tiposSaldos
    })

    /*********
     * Filtros
     **********/
    // - Filtro TIPOS FONDOS
    function filtrarTiposFondos(val: string, update: (fn: () => void) => void) {
      if (val === '') {
        update(() => {
          tiposFondos.value = listadosAuxiliares.tiposFondos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondos.value = listadosAuxiliares.tiposFondos.filter(
          (v:TipoFondo) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro TIPOS FONDOS
    function filtrarTiposSaldos(val: string, update: (fn: () => void) => void) {
      if (val === '') {
        update(() => {
          tiposSaldos.value = listadosAuxiliares.tiposSaldos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposSaldos.value = listadosAuxiliares.tiposSaldos.filter(
          (v:TipoSaldo) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function saldo_anterior() {
      const ultimo_saldo = new UltimoSaldoController()
      if (acreditacion.usuario) {
        const { response } = await ultimo_saldo.consultar(
          parseInt(acreditacion.usuario)
        )
        acreditacion.saldo_anterior = response.data.saldo_actual
      }
    }

    function anularAcreditacion(entidad:Acreditacion) {
      confirmar('¿Está seguro de anular la acreditacion?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Anular Acreditacion',
          mensaje: 'Ingrese motivo de anulacion',
          accion: async data => {
            try {
              cargando.activar()
              entidad.descripcion_acreditacion = data
              await acreditacionCancelacionController.anularAcreditacion(
                entidad
              )
              notificarAdvertencia('Se anulado Acreditacion Exitosamente')
              await filtrarAcreditacion('2')
              accion.value = acciones.nuevo
              acreditacion.hydrate(new Acreditacion())
              cargando.desactivar()
            } catch (e: any) {
              notificarError(
                'No se pudo anular, debes ingresar un motivo para la anulación'
              )
            }
          }
        }
        prompt(data)
      })
    }

    function optionsFecha(date:string) {
      const currentDate = sumarFechas(
        obtenerFechaActual(),
        0,
        0,
        -15,
        'YYYY/MM/DD'
      )
      return date >= currentDate && date <= obtenerFechaActual('YYYY/MM/DD')
    }

    async function subirArchivos() {
      try {
        await refArchivo.value.subir()

        refArchivo.value.quiero_subir_archivos = false
        modoIndividual.value = true
        // retrasar la ejecucion de esta funcion
        setTimeout(async () => {
          refArchivo.value?.limpiarListado()
          tabs.value = 'listado'
          await filtrarAcreditacion('1')
        }, 1000)
      } catch (error) {
        console.error(`Error es: ${error}`)
      }
    }

    const btnEliminarAcreditacion: CustomActionTable = {
      titulo: '',
      icono: 'bi-trash',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.acreditacion'),
      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
        eliminar_acreditacion({ entidad, posicion })
      }
    }

    async function eliminar_acreditacion({ entidad, posicion }) {
      try {
        const data: CustomActionPrompt = {
          titulo: 'Eliminar Acreditacion',
          mensaje: 'Ingrese motivo de eliminacion',
          accion: async data => {
            entidad.estado = false
            entidad.motivo = data
            entidad.descripcion_acreditacion = data
            await acreditacionCancelacionController.anularAcreditacion(entidad)
            notificarCorrecto('Se ha eliminado Acreditacion')
            listado.value.splice(posicion, 1)
          }
        }
        prompt(data)
      } catch (e: any) {
        notificarError(
          'No se pudo anular, debes ingresar un motivo para la anulacion'
        )
      }
    }

    async function filtrarAcreditacion(tabSeleccionado: string) {
      await listar({ id_estado: tabSeleccionado, paginate: true }, false)

      filtros.fields = { id_estado: tabSeleccionado }
    }

    watchEffect(
      () =>
        (acreditacion.saldo_actual =
          parseFloat(
            acreditacion.saldo_anterior !== null
              ? acreditacion.saldo_anterior.toString()
              : '0'
          ) +
          parseFloat(
            acreditacion.monto !== null ? acreditacion.monto.toString() : '0'
          ))
    )

    const options: OptionGroup[] = [
      {
        label: 'INDIVIDUAL',
        value: true
      },
      {
        label: 'POR LOTES',
        value: false
      }
    ]
    return {
      mixin,
      mixin2,
      acreditacion,
      options,
      disabled,
      accion,
      acciones,
      refArchivo,
      v$,
      tiposFondos,
      tiposSaldos,
      maskFecha,
      modoIndividual,
      endpoint: endpoints.acreditaciones_lotes,
      ordenarLista,
      optionsFecha,
      saldo_anterior,
      empleados,
      filtrarEmpleados,
      filtrarTiposFondos,
      filtrarTiposSaldos,
      filtrarAcreditacion,
      btnEliminarAcreditacion,
      tabAcreditacion,
      anularAcreditacion,
      subirArchivos,
      watchEffect,
      configuracionColumnas: configuracionColumnasAcreditacion
    }
  }
})
