import { configuracionColumnasResultadoExamenPreocupacional } from '../domain/configuracionColumnasResultadoExamenPreocupacional'
import { configuracionColumnasRevisionActualOrganoSistema } from '../domain/configuracionColumnasRevisionActualOrganoSistema'
import { configuracionColumnasAntecedenteTrabajoAnterior } from '../domain/configuracionColumnasAntecedenteTrabajoAnterior'
import { configuracionColumnasResultadoHabitoToxico } from '../domain/configuracionColumnasResultadoHabitoToxico'
import { configuracionColumnasAntecedenteFamiliar } from '../domain/configuracionColumnasAntecedenteFamiliar'
import { configuracionColumnasMedicacionHabitual } from '../domain/configuracionColumnasMedicacionHabitual'
import { configuracionColumnasActividadFisica } from '../domain/configuracionColumnasActividadFisica'
import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'
import {
  encontrarUltimoIdListado,
  imprimirArchivo,
  mapearOptionsSelect
} from 'shared/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { acciones, accionesTabla, maskFecha, tipos_sangre } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { helpers, required } from 'shared/i18n-validators'
import { apiConfig, endpoints } from 'config/api'
import { useMedicoStore } from 'stores/medico'
import { computed, defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import ExamenFisicoRegionalComponent from 'medico/gestionarPacientes/modules/seccionesFichas/examenFisicoRegional/ExamenFisicoRegionalComponent.vue'
import AptitudMedicaTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/aptitudMedicaTrabajo/AptitudMedicaTrabajo.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { InformacionDefectoFichaPreocupacionalController } from '../infraestructure/InformacionDefectoFichaPreocupacionalController'
import { FichaPeriodicaPreocupacionalController } from '../infraestructure/FichaPeriodicaPreocupacionalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoAntecedenteFamiliarController } from '../infraestructure/TipoAntecedenteFamiliarController'
import { CategoriaFactorRiesgoController } from '../infraestructure/CategoriaFactorRiesgoController'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { OrientacionSexualController } from '../infraestructure/OrientacionSexualController'
import { TipoHabitoToxicoController } from '../infraestructure/TipoHabitoToxicoController'
import { TipoFactorRiesgoController } from '../infraestructure/TipoFactorRiesgoController'
import { IdentidadGeneroController } from '../infraestructure/IdentidadGeneroController'
import { ResultadoExamenPreocupacional } from '../domain/ResultadoExamenPreocupacional'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { SistemaOrganoController } from '../infraestructure/SistemaOrganoController'
import { RevisionActualOrganoSistema } from '../domain/RevisionActualOrganoSistema'
import { AntecedenteTrabajoAnterior } from '../domain/AntecedenteTrabajoAnterior'
import { TipoAntecedenteFamiliar } from '../domain/TipoAntecedenteFamiliar'
import { ReligionController } from '../infraestructure/ReligionController'
import { ResultadoHabitoToxico } from '../domain/ResultadoHabitoToxico'
import { FrPuestoTrabajoActual } from '../domain/FrPuestoTrabajoActual'
// import { ExamenFisicoRegional } from '../../seccionesFichas/domain/ExamenFisicoRegional'
import { AntecedenteFamiliar } from '../domain/AntecedenteFamiliar'
import { MedicacionHabitual } from '../domain/MedicacionHabitual'
import { TipoFactorRiesgo } from '../domain/TipoFactorRiesgo'
import { TipoHabitoToxico } from '../domain/TipoHabitoToxico'
import { ActividadFisica } from '../domain/ActividadFisica'
import { SistemaOrgano } from '../domain/SistemaOrgano'
import { ConstanteVital } from '../../seccionesFichas/domain/ConstanteVital'
import { ExamenFisicoRegional } from '../../seccionesFichas/examenFisicoRegional/domain/ExamenFisicoRegional'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { ArchivoController } from 'subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import ErrorComponent from 'components/ErrorComponent.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { upperCase } from 'lodash'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { useFichaPreocupacional } from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/application/useFichaPreocupacional'
import { ExamenOrganoReproductivoController } from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/ExamenOrganoReproductivoController'
import { ExamenOrganoReproductivo } from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/ExamenOrganoReproductivo'

export default defineComponent({
  name: 'fichas_preocupacionales',
  methods: { upperCase },
  components: {
    OptionGroupComponent,
    ErrorComponent,
    GestorArchivos,
    SimpleLayout,
    EssentialTable,
    ContantesVitales,
    AptitudMedicaTrabajo,
    ExamenFisicoRegionalComponent
  },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const authenticationStore = useAuthenticationStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    /************
     * Variables
     ************/
    const refArchivo = ref()
    const { confirmar } = useNotificaciones()

    const tipoFilaFrPuestoTrabajoActual = new FrPuestoTrabajoActual()
    const tipoFilaAntecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()
    const { notificarAdvertencia } = useNotificaciones()
    const examenesFisicosRegionalesAuxiliar = ref()

    /****************
     * Controladores
     ****************/
    const informacionDefectoFicha =
      new InformacionDefectoFichaPreocupacionalController()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      FichaPeriodicaPreocupacional,
      new FichaPeriodicaPreocupacionalController(),
      new ArchivoController()
    )
    const {
      entidad: fichaPreocupacional,
      listadosAuxiliares,
      disabled,
      accion
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onReestablecer,
      onBeforeModificar,
      onConsultado,
      onGuardado
    } = mixin.useHooks()

    const {
      configurarColumnasFrPuestoTrabajoActual,
      configurarColumnasAntecedenteTrabajoAnterior,
      configuracionColumnasFrPuestoTrabajoActualReactive,
      configuracionColumnasAntecedenteTrabajoAnteriorReactive,
      mostrarTablaAntecedenteTrabajoAnteriorReactive,
      mostrarTablaFrPuestoTrabajoActualReactive,
      transformarAntecedentesEmpleosAnteriores
    } = useFichaPreocupacional(medicoStore, listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        religiones: new ReligionController(),
        orientacionesSexuales: new OrientacionSexualController(),
        identidadesGeneros: new IdentidadGeneroController(),
        tiposAntecedentes: {
          controller: new ExamenOrganoReproductivoController(),
          params: { tipo: medicoStore.empleado?.genero }
        },
        tiposHabitosToxicos: new TipoHabitoToxicoController(),
        tiposAntecedentesFamiliares: new TipoAntecedenteFamiliarController(),
        categoriasFactoresRiesgos: new CategoriaFactorRiesgoController(),
        tiposFactoresRiesgos: new TipoFactorRiesgoController(),
        sistemasOrganos: new SistemaOrganoController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 }
        },
        antecedentes_familiares: [],
        habitos_toxicos: [],
        revisiones_actuales_organos_sistemas: [],
        examenes_realizados: []
      })

      listadosAuxiliares.examenes_realizados =
        listadosAuxiliares.tiposAntecedentes.map(
          (tipo: ExamenOrganoReproductivo, index) => {
            const res = new ResultadoExamenPreocupacional()
            res.id = index
            res.examen = tipo.examen
            res.examen_id = tipo.id
            return res
          }
        )

      listadosAuxiliares.habitos_toxicos =
        listadosAuxiliares.tiposHabitosToxicos.map(
          (tipo: TipoHabitoToxico, index) => {
            const res = new ResultadoHabitoToxico()
            res.id = index
            res.tipo_habito_toxico = tipo.nombre
            res.tipo_habito_toxico_id = tipo.id
            return res
          }
        )

      listadosAuxiliares.antecedentes_familiares =
        listadosAuxiliares.tiposAntecedentesFamiliares.map(
          (tipo: TipoAntecedenteFamiliar) => {
            const res = new AntecedenteFamiliar()
            res.tipo_antecedente_familiar = tipo.nombre
            res.tipo_antecedente_familiar_id = tipo.id
            return res
          }
        )

      listadosAuxiliares.revisiones_actuales_organos_sistemas =
        listadosAuxiliares.sistemasOrganos.map((tipo: SistemaOrgano) => {
          const rev = new RevisionActualOrganoSistema()
          rev.organo = tipo.nombre
          rev.organo_id = tipo.id
          return rev
        })

      await configurarColumnasFrPuestoTrabajoActual()
      await configurarColumnasAntecedenteTrabajoAnterior()

      configurarFilaFrPuestoTrabajoActual()
      configurarFilaAntecedenteTrabajoAnterior()

      // insertarFilaFrPuestoTrabajoActualReactive()
      // insertarFilaAntecedenteTrabajoAnterior()

      // Consultar ficha
      if (medicoStore.idFichaPreocupacional)
        await consultar({ id: medicoStore.idFichaPreocupacional })
    })

    /******************
     * Botones tablas
     ******************/
    const btnEliminarActividadFisica: CustomActionTable<ActividadFisica> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) =>
        confirmar('¿Está seguro de continuar?', () =>
          fichaPreocupacional.actividades_fisicas?.splice(posicion, 1)
        )
    }

    const btnEliminarMedicacionHabitual: CustomActionTable<ResultadoHabitoToxico> =
      {
        titulo: '',
        icono: 'bi-x',
        color: 'negative',
        accion: ({ posicion }) =>
          confirmar('¿Está seguro de continuar?', () =>
            fichaPreocupacional.medicaciones?.splice(posicion, 1)
          )
      }

    const btnEliminarAntecedenteTrabajoAnterior: CustomActionTable<AntecedenteTrabajoAnterior> =
      {
        titulo: '',
        icono: 'bi-x',
        color: 'negative',
        accion: ({ posicion }) =>
          confirmar('¿Está seguro de continuar?', () =>
            fichaPreocupacional.antecedentes_empleos_anteriores?.splice(
              posicion,
              1
            )
          )
      }

    const btnEliminarFrPuestoTrabajoActual: CustomActionTable<FrPuestoTrabajoActual> =
      {
        titulo: '',
        icono: 'bi-x',
        color: 'negative',
        accion: ({ posicion }) =>
          confirmar('¿Está seguro de continuar?', () =>
            fichaPreocupacional.fr_puestos_trabajos_actuales?.splice(
              posicion,
              1
            )
          )
      }

    /************
     * Funciones
     ************/
    const { cargos, filtrarCargos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    const insertarFilaActividadFisica = () => {
      if (fichaPreocupacional.actividades_fisicas.length > 0)
        return notificarAdvertencia(
          'Solo puede ingresar un máximo de una actividad'
        )

      const actividadFisica = new ActividadFisica()
      actividadFisica.id = fichaPreocupacional.actividades_fisicas?.length
        ? encontrarUltimoIdListado(fichaPreocupacional.actividades_fisicas) + 1
        : 1
      fichaPreocupacional.actividades_fisicas.push(actividadFisica)
    }

    const insertarFilaMedicacionHabitual = () => {
      if (fichaPreocupacional.medicaciones.length > 2)
        return notificarAdvertencia(
          'Solo puede ingresar un máximo de tres medicamentos'
        )

      const medicacionHabitual = new MedicacionHabitual()
      medicacionHabitual.id = fichaPreocupacional.medicaciones?.length
        ? encontrarUltimoIdListado(fichaPreocupacional.medicaciones) + 1
        : 1
      fichaPreocupacional.medicaciones.push(medicacionHabitual)
    }

    const insertarFilaAntecedenteTrabajoAnterior = () => {
      /* const antecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()
                                                                                                                                                            antecedenteTrabajoAnterior.id = fichaPreocupacional.antecedentes_empleos_anteriores?.length ? encontrarUltimoIdListado(fichaPreocupacional.antecedentes_empleos_anteriores) + 1 : 1
                                                                                                                                                            fichaPreocupacional.antecedentes_empleos_anteriores.push(antecedenteTrabajoAnterior) */
      const fila = JSON.parse(
        JSON.stringify(tipoFilaAntecedenteTrabajoAnterior)
      )
      fila.id = fichaPreocupacional.antecedentes_empleos_anteriores?.length
        ? encontrarUltimoIdListado(
            fichaPreocupacional.antecedentes_empleos_anteriores
          ) + 1
        : 1
      fichaPreocupacional.antecedentes_empleos_anteriores.push(fila)
    }

    const insertarFilaFrPuestoTrabajoActualReactive = () => {
      const fila = JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual))
      fila.id = fichaPreocupacional.fr_puestos_trabajos_actuales?.length
        ? encontrarUltimoIdListado(
            fichaPreocupacional.fr_puestos_trabajos_actuales
          ) + 1
        : 1
      fichaPreocupacional.fr_puestos_trabajos_actuales.push(fila)
    }

    const extraerIdCategoriasFactorRiesgo = (
      item: FrPuestoTrabajoActual,
      tipos: string[]
    ) => {
      return tipos.reduce((acumulador, categoria) => {
        if (item[categoria]) {
          return [...acumulador, ...item[categoria]]
        }
        return acumulador
      }, [])

      // return [1] //item
    }

    const consultarInformacionDefectoFicha = async () => {
      const { response } = await informacionDefectoFicha.listar({
        registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen
      })
      fichaPreocupacional.motivo_consulta = response.data.modelo.motivo_consulta
      fichaPreocupacional.recomendaciones_tratamiento =
        response.data.modelo.recomendaciones_tratamiento
      fichaPreocupacional.enfermedad_actual =
        response.data.modelo.enfermedad_actual
      fichaPreocupacional.cargo = response.data.modelo.cargo
    }

    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.fichas_preocupacionales_imprimir) +
        '/' +
        fichaPreocupacional.id
      const filename =
        'ficha_preocupacional_' +
        fichaPreocupacional.id +
        '_' +
        fichaPreocupacional.empleado +
        '_' +
        Date.now()
      await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) =>
      fichaPreocupacional.constante_vital.hydrate(constanteVital)
    const hidratarAptitudMedica = (aptitudMedica: AptitudMedica) =>
      fichaPreocupacional.aptitud_medica.hydrate(aptitudMedica)
    const hidratarExamenFisicoRegional = (examen: ExamenFisicoRegional[]) =>
      (examenesFisicosRegionalesAuxiliar.value = examen)

    const configurarFilaFrPuestoTrabajoActual = () => {
      listadosAuxiliares.tiposFactoresRiesgos.forEach(
        (tipo: TipoFactorRiesgo) => {
          tipoFilaFrPuestoTrabajoActual[tipo.nombre ?? ''] = null
        }
      )

      // fichaPreocupacional.fr_puestos_trabajos_actuales.push(JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual)))
    }

    const configurarFilaAntecedenteTrabajoAnterior = () => {
      listadosAuxiliares.tiposFactoresRiesgos.forEach(
        (tipo: TipoFactorRiesgo) => {
          tipoFilaAntecedenteTrabajoAnterior[tipo.id + '' ?? ''] = false
        }
      )
    }
    /********
     * Hooks
     ********/
    onBeforeModificar(() => {
      fichaPreocupacional.registro_empleado_examen =
        medicoStore.idRegistroEmpleadoExamen ?? null

      fichaPreocupacional.habitos_toxicos =
        listadosAuxiliares.habitos_toxicos.filter(
          (resultado: ResultadoHabitoToxico) =>
            resultado.cantidad ||
            resultado.tiempo_consumo_meses ||
            resultado.tiempo_abstinencia_meses
        )

      if (
        examenesFisicosRegionalesAuxiliar.value !== undefined &&
        examenesFisicosRegionalesAuxiliar.value.length > 0
      ) {
        fichaPreocupacional.examenes_fisicos_regionales =
          examenesFisicosRegionalesAuxiliar.value
      }

      // Antecedentes familiares
      fichaPreocupacional.antecedentes_familiares = [
        ...listadosAuxiliares.antecedentes_familiares.filter(
          (antecedente: AntecedenteFamiliar) => antecedente.descripcion
        )
      ]

      // Fr_puestos_trabajos_actuales
      const tipos = listadosAuxiliares.tiposFactoresRiesgos.map(
        (tipo: TipoFactorRiesgo) => tipo.nombre
      )
      fichaPreocupacional.fr_puestos_trabajos_actuales =
        fichaPreocupacional.fr_puestos_trabajos_actuales.map(
          (item: FrPuestoTrabajoActual) => {
            item.detalle_categ_factor_riesgo_fr_puesto_trab_act =
              extraerIdCategoriasFactorRiesgo(item, tipos)
            item.categorias =
              item.detalle_categ_factor_riesgo_fr_puesto_trab_act

            return item
          }
        )

      fichaPreocupacional.revisiones_actuales_organos_sistemas =
        listadosAuxiliares.revisiones_actuales_organos_sistemas
          .filter((rev: RevisionActualOrganoSistema) => rev.descripcion)
          .map((rev: RevisionActualOrganoSistema) => {
            return {
              organo_id: rev.organo_id,
              descripcion: rev.descripcion
            }
          })

      // resultados_examenes_preocupacionales
      fichaPreocupacional.examenes_realizados =
        listadosAuxiliares.examenes_realizados
          .filter(
            (resultado: ResultadoExamenPreocupacional) =>
              resultado.tiempo || resultado.resultado
          )
          .map((resultado: ResultadoExamenPreocupacional) => {
            // resultado.examen_id = resultado.examen_id
            return resultado
          })

      fichaPreocupacional.antecedentes_empleos_anteriores =
        transformarAntecedentesEmpleosAnteriores(
          fichaPreocupacional.antecedentes_empleos_anteriores
        )
    })
    onBeforeGuardar(() => {
      fichaPreocupacional.registro_empleado_examen =
        medicoStore.idRegistroEmpleadoExamen ?? null
      fichaPreocupacional.examenes_fisicos_regionales =
        examenesFisicosRegionalesAuxiliar.value

      // Antecedentes familiares
      fichaPreocupacional.antecedentes_familiares = [
        ...listadosAuxiliares.antecedentes_familiares.filter(
          (antecedente: AntecedenteFamiliar) => antecedente.descripcion
        )
      ]

      // resultados_examenes_preocupacionales
      fichaPreocupacional.examenes_realizados =
        listadosAuxiliares.examenes_realizados
          .filter(
            (resultado: ResultadoExamenPreocupacional) =>
              resultado.tiempo || resultado.resultado
          )
          .map((resultado: ResultadoExamenPreocupacional) => {
            // resultado.examen_id = resultado.examen_id
            return resultado
          })

      // Fr_puestos_trabajos_actuales
      const tipos = listadosAuxiliares.tiposFactoresRiesgos.map(
        (tipo: TipoFactorRiesgo) => tipo.nombre
      )
      fichaPreocupacional.fr_puestos_trabajos_actuales =
        fichaPreocupacional.fr_puestos_trabajos_actuales.map(
          (item: FrPuestoTrabajoActual) => {
            item.detalle_categ_factor_riesgo_fr_puesto_trab_act =
              extraerIdCategoriasFactorRiesgo(item, tipos)
            item.categorias =
              item.detalle_categ_factor_riesgo_fr_puesto_trab_act
            return item
          }
        )

      fichaPreocupacional.revisiones_actuales_organos_sistemas =
        listadosAuxiliares.revisiones_actuales_organos_sistemas
          .filter((rev: RevisionActualOrganoSistema) => rev.descripcion)
          .map((rev: RevisionActualOrganoSistema) => {
            return {
              organo_id: rev.organo_id,
              descripcion: rev.descripcion
            }
          })
      // fichaPreocupacional.revisiones_actuales_organos_sistemas = fichaPreocupacional.revisiones_actuales_organos_sistemas.filter((rev: RevisionActualOrganoSistema) => rev.descripcion)

      // ResultadoHabitoToxico
      fichaPreocupacional.habitos_toxicos =
        listadosAuxiliares.habitos_toxicos.filter(
          (resultado: ResultadoHabitoToxico) =>
            resultado.cantidad ||
            resultado.tiempo_consumo_meses ||
            resultado.tiempo_abstinencia_meses
        )

      fichaPreocupacional.antecedentes_empleos_anteriores =
        transformarAntecedentesEmpleosAnteriores(
          fichaPreocupacional.antecedentes_empleos_anteriores
        )
    })

    onReestablecer(() => {
      refArchivo.value.limpiarListado()
      fichaPreocupacional.numero_archivo =
        authenticationStore.user.identificacion
      emit('cerrar-modal')
    })

    onConsultado(async (entidad) => {
      accion.value = acciones.consultar
      // Habitos toxicos
      listadosAuxiliares.habitos_toxicos = fichaPreocupacional.habitos_toxicos

      // Revisiones actuales organos sistemas
      // listadosAuxiliares.revisiones_actuales_organos_sistemas = fichaPreocupacional.revisiones_actuales_organos_sistemas
      listadosAuxiliares.revisiones_actuales_organos_sistemas =
        listadosAuxiliares.revisiones_actuales_organos_sistemas.map(
          (revision: RevisionActualOrganoSistema) => {
            // console.log(revision)
            const antecedenteAux =
              fichaPreocupacional.revisiones_actuales_organos_sistemas.find(
                (antecedenteLleno: RevisionActualOrganoSistema) =>
                  antecedenteLleno.organo_id === revision.organo_id
              )

            if (antecedenteAux) {
              revision.descripcion = antecedenteAux.descripcion
            }
            return revision
          }
        )

      // Antecedentes familiares
      listadosAuxiliares.antecedentes_familiares =
        listadosAuxiliares.antecedentes_familiares.map(
          (antecedente: AntecedenteFamiliar) => {
            const antecedenteAux =
              fichaPreocupacional.antecedentes_familiares.find(
                (antecedenteLleno: AntecedenteFamiliar) =>
                  antecedenteLleno.tipo_antecedente_familiar_id ===
                  antecedente.tipo_antecedente_familiar_id
              )

            if (antecedenteAux) {
              antecedente.descripcion = antecedenteAux.descripcion
              antecedente.parentesco = antecedenteAux.parentesco
            }
            return antecedente
          }
        )

      // Antecedentes empleos anteiores
      fichaPreocupacional.antecedentes_empleos_anteriores =
        fichaPreocupacional.antecedentes_empleos_anteriores.map(
          (antecedente: AntecedenteTrabajoAnterior) => {
            // const riesgos = antecedente.tipos_riesgos_ids?.reduce(
            //   (acc, tipo_riesgo_id: number) => {
            //     acc[tipo_riesgo_id.toString()] = true
            //     return acc
            //   },
            //   {}
            // )
            // listadosAuxiliares.tiposFactoresRiesgos
            const riesgosSeleccionados = antecedente.tipos_riesgos_ids || []
            // Crear objeto completo con todos los tipos de riesgo: true o false
            const riesgos: Record<string, boolean> = {}

            listadosAuxiliares.tiposFactoresRiesgos.forEach(
              (tipo: TipoFactorRiesgo) => {
                const id = tipo.id
                riesgos[id.toString()] = riesgosSeleccionados.includes(id)
              }
            )

            // Crear un nuevo objeto con los campos de riesgos y otros campos
            const newItem: AntecedenteTrabajoAnterior | any = {
              ...antecedente,
              ...riesgos
            }
            // delete newItem.tipos_riesgos_ids // Eliminar el campo tipos_riesgos_ids del nuevo objeto

            return newItem
          }
        )

      setTimeout(async () => {
        await refArchivo.value.listarArchivosAlmacenados(entidad.id)
      }, 1)

      fichaPreocupacional.grupo_sanguineo =
        fichaPreocupacional.grupo_sanguineo ?? medicoStore.empleado.tipo_sangre

      listadosAuxiliares.examenes_realizados =
        listadosAuxiliares.examenes_realizados.map(examen => {
          const examenEncontrado = fichaPreocupacional.examenes_realizados.find(
            examen_realizado => examen_realizado.examen_id === examen.examen_id
          )
          return { ...examen, ...examenEncontrado }
        })

      await configurarColumnasFrPuestoTrabajoActual()
      await configurarColumnasAntecedenteTrabajoAnterior()

      configurarFilaFrPuestoTrabajoActual()
      configurarFilaAntecedenteTrabajoAnterior()
    })

    onGuardado((id: number) => (medicoStore.idFichaPreocupacional = id))

    /*********
     * Reglas
     *********/
    const reglas = {
      antecedentes_empleos_anteriores: {
        $each: helpers.forEach({
          empresa: { required },
          puesto_trabajo: { required },
          actividades: { required },
          tiempo_trabajo: { required },
          observaciones: { required }
        })
      },
      cargo: { required },
      religion: { required },
      orientacion_sexual: { required },
      identidad_genero: { required },
      lateralidad: { required },
      antecedente_personal: {
        hijos_vivos: { required },
        hijos_muertos: { required }
      },
      constante_vital: {
        presion_arterial: { required },
        temperatura: { required },
        frecuencia_cardiaca: { required },
        saturacion_oxigeno: { required },
        frecuencia_respiratoria: { required },
        peso: { required },
        talla: { required },
        indice_masa_corporal: { required },
        perimetro_abdominal: { required }
      }
    }

    const v$ = useVuelidate(reglas, fichaPreocupacional)
    setValidador(v$.value)

    /*******
     * Init
     *******/
    // insertarFilaActividadFisica()
    // insertarFilaMedicacionHabitual()
    // insertarFilaAntecedenteTrabajoAnterior()
    // insertarFilaAntecedenteTrabajoAnterior()
    consultarInformacionDefectoFicha()
    // listar()
    fichaPreocupacional.numero_archivo = authenticationStore.user.identificacion

    const subirFichaMedicaFirmada = async () => {
      await refArchivo.value.subir()
    }
    const quieroSubirArchivos = computed(
      () => refArchivo.value?.quiero_subir_archivos
    )
    const btnEditarFicha = () => {
      accion.value = acciones.editar
    }
    const btnCancelarEditarFicha = () => {
      notificarAdvertencia(
        'Recuerda que no se guardarán los cambios realizados'
      )
      accion.value = acciones.consultar
    }

    return {
      v$,
      mixin,
      disabled,
      accion,
      acciones,
      refArchivo,
      subirFichaMedicaFirmada,
      quieroSubirArchivos,
      fichaPreocupacional,
      listadosAuxiliares,
      tipos_sangre,
      maskFecha,
      configuracionColumnasResultadoExamenPreocupacional,
      configuracionColumnasResultadoHabitoToxico,
      configuracionColumnasActividadFisica,
      configuracionColumnasMedicacionHabitual,
      configuracionColumnasAntecedenteTrabajoAnterior,
      configuracionColumnasAntecedenteFamiliar,
      configuracionColumnasFrPuestoTrabajoActualReactive,
      configuracionColumnasRevisionActualOrganoSistema,
      insertarFilaActividadFisica,
      insertarFilaMedicacionHabitual,
      insertarFilaAntecedenteTrabajoAnterior,
      mapearOptionsSelect,
      cargos,
      filtrarCargos,
      hidratarConstanteVital,
      hidratarAptitudMedica,
      hidratarExamenFisicoRegional,
      descargarPdf,
      // insertarFilaAntecedenteFamiliar,
      insertarFilaFrPuestoTrabajoActualReactive,
      btnEliminarActividadFisica,
      btnEliminarMedicacionHabitual,
      btnEliminarAntecedenteTrabajoAnterior,
      btnEliminarFrPuestoTrabajoActual,
      // btnEliminarAntecedenteFamiliar,
      accionesTabla,
      mostrarTablaFrPuestoTrabajoActualReactive,
      mostrarTablaAntecedenteTrabajoAnteriorReactive,
      configuracionColumnasAntecedenteTrabajoAnteriorReactive,
      mostrarMasculino: medicoStore.empleado?.genero === 'M',
      mostrarFemenino: medicoStore.empleado?.genero === 'F',
      mostrarDescargarPdf: authenticationStore.esMedico,
      btnEditarFicha,
      btnCancelarEditarFicha
    }
  }
})
