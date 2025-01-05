import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import ComposicionFamiliar from 'trabajoSocial/composicion_familiar/view/ComposicionFamiliar.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasFichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/configuracionColumnasFichaSocioeconomica'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/FichaSocioeconomica'
import { FichaSocioeconomicaController } from 'trabajoSocial/fichaSocioeconomica/infraestructure/FichaSocioeconomicaController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVuelidate } from '@vuelidate/core'
import { helpers, minValue, required, requiredIf } from 'shared/i18n-validators'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import {
  btnEliminarDefault,
  encontrarUltimoIdListado,
  imprimirArchivo,
  obtenerUbicacion,
  ordenarLista
} from 'shared/utils'
import { useEmpleadoStore } from 'stores/empleado'
import { useNotificaciones } from 'shared/notificaciones'
import {
  acciones,
  accionesTabla,
  maskFecha,
  niveles_academicos
} from 'config/utils'
import { configuracionColumnasHijos } from 'trabajoSocial/fichaSocioeconomica/domain/configuracionColumnasHijos'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Hijo } from 'trabajoSocial/fichaSocioeconomica/domain/Hijo'
import {
  likertEspaciosFamiliares,
  materiales_predominantes,
  optionsCapacitaciones,
  optionsConocimientos,
  optionsLugaresAtencion,
  optionsProblemasSociales,
  optionsServiciosBasicos,
  parentescos,
  tipos_predominantes,
  tipos_viviendas,
  vehiculos
} from 'config/trabajoSocial.utils'
import { configuracionColumnasFamiliares } from 'trabajoSocial/composicion_familiar/domain/configuracionColumnasFamiliares'
import { Familiar } from 'trabajoSocial/composicion_familiar/domain/Familiar'
import { TipoDiscapacidadPorcentaje } from 'recursosHumanos/empleados/domain/TipoDiscapacidadPorcentaje'
import CalloutComponent from 'components/CalloutComponent.vue'
import SaludEmpleado from 'trabajoSocial/salud/view/SaludEmpleado.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import InformacionVivienda from 'trabajoSocial/informacion_vivienda/view/InformacionVivienda.vue'
import CroquisVivienda from 'trabajoSocial/informacion_vivienda/view/CroquisVivienda.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { LocalStorage, useQuasar } from 'quasar'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    CroquisVivienda,
    InformacionVivienda,
    SelectorImagen,
    SaludEmpleado,
    CalloutComponent,
    ComposicionFamiliar,
    OptionGroupComponent,
    TabLayoutFilterTabs2,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      FichaSocioeconomica,
      new FichaSocioeconomicaController()
    )
    const {
      entidad: ficha,
      accion,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { notificarAdvertencia, notificarCorrecto } = useNotificaciones()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    // const cargando = new StatusEssentialLoading()
    const empleadoStore = useEmpleadoStore()
    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados, cantones, filtrarCantones } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const empleado = ref(new Empleado())
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      // configuracion de listados
      empleados.value = listadosAuxiliares.empleados
      listadosAuxiliares.cantones = JSON.parse(
        LocalStorage.getItem('cantones')!.toString()
      )
      cantones.value = listadosAuxiliares.cantones
    })
    /********************************************
     * HOOKS
     ********************************************/
    onReestablecer(async () => {
      empleado.value.hydrate(new Empleado())
    })
    onConsultado(async () => {
      empleadoStore.idEmpleado = ficha.empleado
      await empleadoStore.cargarEmpleado()
      empleado.value = empleadoStore.empleado
    })
    /********************************************
     * REGLAS DE VALIDACIONES
     ********************************************/
    const reglas = {
      empleado: { required },
      lugar_nacimiento: { required },
      canton: { required },
      contacto_emergencia: { required },
      parentesco_contacto_emergencia: { required },
      telefono_contacto_emergencia: { required },
      imagen_rutagrama: {
        required: requiredIf(() => accion.value == acciones.editar)
      },
      vias_transito_regular_trabajo: { required },
      conclusiones: { required },
      conyuge: {
        nombres: { required: requiredIf(() => ficha.tiene_conyuge) },
        apellidos: { required: requiredIf(() => ficha.tiene_conyuge) },
        nivel_academico: { required: requiredIf(() => ficha.tiene_conyuge) },
        edad: { required: requiredIf(() => ficha.tiene_conyuge) },
        profesion: { required: requiredIf(() => ficha.tiene_conyuge) },
        telefono: { required: requiredIf(() => ficha.tiene_conyuge) },
        promedio_ingreso_mensual: {
          required: requiredIf(() => ficha.tiene_conyuge)
        }
      },
      hijos: {
        $each: helpers.forEach({
          nombres_apellidos: { required },
          ocupacion: { required },
          edad: { required, minValue: minValue(0) }
        })
      },
      experiencia_previa: {
        nombre_empresa: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        },
        cargo: { required: requiredIf(() => ficha.tiene_experiencia_previa) },
        antiguedad: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        },
        asegurado_iess: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        },
        telefono: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        },
        fecha_retiro: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        },
        motivo_retiro: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        }
      },
      vivienda: {
        tipo: { required },
        telefono: { required },
        material_paredes: { required },
        material_techo: { required },
        material_piso: { required },
        comodidad_espacio_familiar: { required }
      },
      situacion_socioeconomica: {
        cantidad_personas_aportan: { required },
        cantidad_personas_dependientes: { required },
        familiar_apoya_economicamente: {
          required: requiredIf(
            () =>
              ficha.situacion_socioeconomica
                ?.recibe_apoyo_economico_otro_familiar
          )
        },
        recibe_apoyo_economico_otro_familiar: { required },
        recibe_apoyo_economico_gobierno: { required },
        institucion_apoya_economicamente: {
          required: requiredIf(
            () =>
              ficha.situacion_socioeconomica?.recibe_apoyo_economico_gobierno
          )
        },
        tiene_prestamos: { required },
        cantidad_prestamos: {
          required: requiredIf(
            () => ficha.situacion_socioeconomica?.tiene_prestamos
          )
        },
        entidad_bancaria: {
          required: requiredIf(
            () => ficha.situacion_socioeconomica?.tiene_prestamos
          )
        },
        tiene_tarjeta_credito: { required },
        cantidad_tarjetas_credito: {
          required: requiredIf(
            () => ficha.situacion_socioeconomica?.tiene_tarjeta_credito
          )
        },
        vehiculo: { required },
        tiene_terreno: { required },
        tiene_bienes: { required },
        tiene_ingresos_adicionales: { required },
        ingresos_adicionales: {
          required: requiredIf(
            () => ficha.situacion_socioeconomica?.tiene_ingresos_adicionales
          )
        },
        familiar_externo_apoyado: {
          required: requiredIf(
            () => ficha.situacion_socioeconomica?.apoya_familiar_externo
          )
        }
      },
      problemas_ambiente_social_familiar: { required },
      // salud: {
      //   parentesco_familiar_discapacitado: {
      //     required: requiredIf(
      //       () => ficha.salud?.tiene_familiar_dependiente_discapacitado
      //     )
      //   }
      // },
      tiene_capacitaciones: { required },
      conocimientos: { required: requiredIf(() => ficha.tiene_capacitaciones) },
      capacitaciones: { required: requiredIf(() => ficha.tiene_capacitaciones) }
    }
    const v$ = useVuelidate(reglas, ficha)
    setValidador(v$.value)

    /********************************
     * FUNCIONES
     *******************************/
    async function filtrarListadoFichas(tab: string) {
      tabDefecto.value = tab
      await listar({ estado: tab })
    }

    function obtenerCoordenadas() {
      obtenerUbicacion(ubicacion => {
        ficha.coordenadas =
          ubicacion.coords.latitude + ' ' + ubicacion.coords.longitude
      })
    }

    async function empleadoSeleccionado() {
      const fichaEncontrada = ref()
      empleadoStore.idEmpleado = ficha.empleado
      await empleadoStore.cargarEmpleado()
      empleado.value = empleadoStore.empleado
      if (await empleadoStore.tieneFichaSocioeconomica()) {
        fichaEncontrada.value =
          await empleadoStore.obtenerUltimaFichaSocieconomica()
        console.log(fichaEncontrada.value)
        ficha.hydrate(fichaEncontrada.value)
        accion.value = acciones.editar
        notificarCorrecto(
          'Se ha encontrado una ficha socioeconomica del empleado seleccionado'
        )
      } else {
        notificarAdvertencia(
          'El empleado seleccionado aún no tiene ficha socioeconomica'
        )
      }
    }

    const agregarDiscapacidad = (listado: any) => {
      const discapacidad = new TipoDiscapacidadPorcentaje()
      discapacidad.id = ficha.salud.discapacidades?.length
        ? encontrarUltimoIdListado(ficha.salud.discapacidades) + 1
        : 1
      listado.push(discapacidad)
    }

    function checkTieneCapacitaciones(val) {
      if (val) {
        ficha.conocimientos = []
        ficha.capacitaciones = []
      }
    }

    async function imprimir(id: number, nombre_empleado: string) {
      // cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_fichas_socioeconomicas) +
        id
      const filename = 'Ficha Socioeconomica ' + nombre_empleado
      await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      // cargando.desactivar()
    }

    /********************************
     * BOTONES DE TABLA
     *******************************/
    const btnAgregarFilaHijo: CustomActionTable = {
      titulo: 'Agregar Hijo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar hijo',
      accion: () => {
        const hijo = new Hijo()
        hijo.id = ficha.hijos.length
          ? encontrarUltimoIdListado(ficha.hijos) + 1
          : 1
        ficha.hijos.push(hijo)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    const btnAgregarFilaFamiliar: CustomActionTable = {
      titulo: 'Agregar Familiar',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar familiar',
      accion: () => {
        const familiar = new Familiar()
        ficha.composicion_familiar.push(familiar)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    const btnImprimir: CustomActionTable<FichaSocioeconomica> = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        await imprimir(entidad.id, entidad.empleado)
      }
    }

    return {
      v$,
      ficha,
      mixin,
      accion,
      accionesTabla,
      listadosAuxiliares,
      disabled,
      configuracionColumnas: configuracionColumnasFichaSocioeconomica,
      configuracionColumnasFamiliares,
      configuracionColumnasHijos,
      tabDefecto,
      empleado,
      tabOptions: tabOptionsProveedoresInternacionales,
      maskFecha,

      // listados
      likertEspaciosFamiliares,
      optionsServiciosBasicos,
      optionsProblemasSociales,
      optionsConocimientos,
      optionsCapacitaciones,
      optionsLugaresAtencion,
      tipos_predominantes,
      parentescos,
      tipos_viviendas,
      vehiculos,
      obtenerListadoMaterialesPredominantes: tipo => {
        return materiales_predominantes.filter(v => v.tipo == tipo)
      },
      niveles_academicos,
      empleados,
      filtrarEmpleados,
      cantones,
      filtrarCantones,

      //funciones
      checkTieneCapacitaciones,
      filtrarListadoFichas,
      empleadoSeleccionado,
      ordenarLista,
      obtenerCoordenadas,
      agregarDiscapacidad,

      //botones de tabla
      btnAgregarFilaFamiliar,
      btnAgregarFilaHijo,
      btnEliminarDefault,
      btnImprimir
      // btnEliminarDiscapacidad: btnEliminarDefault(ficha.salud?.discapacidades),
    }
  }
})
