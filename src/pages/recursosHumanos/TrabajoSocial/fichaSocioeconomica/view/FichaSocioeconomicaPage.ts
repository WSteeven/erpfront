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
import { required, requiredIf } from 'shared/i18n-validators'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import {
  btnEliminarDefault,
  encontrarUltimoIdListado,
  obtenerUbicacion,
  optionsFecha,
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
import { configuracionColumnasTipoDiscapacidadPorcentaje as configuracionColumnasDiscapacidades } from 'recursosHumanos/empleados/domain/configuracionColumnasTipoDiscapacidadPorcentaje'
import { configuracionColumnasHijos } from 'trabajoSocial/fichaSocioeconomica/domain/configuracionColumnasHijos'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Hijo } from 'trabajoSocial/fichaSocioeconomica/domain/Hijo'
import {
  likertEspaciosFamiliares,
  materiales_predominantes, optionsCapacitaciones, optionsConocimientos,
  optionsLugaresAtencion,
  optionsProblemasSociales,
  optionsServiciosBasicos,
  parentescos,
  tipos_predominantes,
  tipos_viviendas,
  vehiculos
} from 'config/trabajoSocial.utils'
import {
  configuracionColumnasFamiliares
} from 'trabajoSocial/composicion_familiar/domain/configuracionColumnasFamiliares'
import { Familiar } from 'trabajoSocial/composicion_familiar/domain/Familiar'
import {
  TipoDiscapacidadPorcentaje
} from 'recursosHumanos/empleados/domain/TipoDiscapacidadPorcentaje'
import {
  TipoDiscapacidadController
} from 'recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoDiscapacidad } from 'recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'

export default defineComponent({
  components: {
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
    const { notificarAdvertencia, notificarCorrecto } = useNotificaciones()

    const empleadoStore = useEmpleadoStore()
    const tabDefecto = ref('1')

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const empleado = ref(new Empleado())
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        },
        tipos_discapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' }
        }
      })

      // configuracion de listados
      empleados.value = listadosAuxiliares.empleados
      configuracionColumnasDiscapacidades.find(
        (item: ColumnConfig<TipoDiscapacidadPorcentaje>) =>
          item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tipos_discapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
    })
    const reglas = {
      empleado: { required },
      conclusiones: { required },
      conyuge: { nivel_academico: { required } },
      experiencia_previa: {
        fecha_retiro: {
          required: requiredIf(() => ficha.tiene_experiencia_previa)
        }
      },
      vivienda: {
        tipo: { required },
        material_paredes: { required },
        material_techo: { required },
        material_piso: { required },
        comodidad_espacio_familiar: { required }
      },
      situacion_socioeconomica: { vehiculo: { required } },
      salud: {
        parentesco_familiar_discapacitado: {
          required: requiredIf(
            () => ficha.salud?.tiene_familiar_dependiente_discapacitado
          )
        }
      }
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

    return {
      v$,
      ficha,
      mixin,
      accion,
      accionesTabla,
      listadosAuxiliares,
      disabled,
      configuracionColumnas: configuracionColumnasFichaSocioeconomica,
      configuracionColumnasDiscapacidades,
      configuracionColumnasFamiliares,
      configuracionColumnasHijos,
      tabDefecto,
      empleado,
      tabOptions: tabOptionsProveedoresInternacionales,
      maskFecha,
      optionsFecha,

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
      btnEliminarDefault
      // btnEliminarDiscapacidad: btnEliminarDefault(ficha.salud?.discapacidades),
    }
  }
})
