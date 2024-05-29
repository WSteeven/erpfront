import { configuracionColumnasResultadoExamenPreocupacional } from '../domain/configuracionColumnasResultadoExamenPreocupacional'
import { configuracionColumnasRevisionActualOrganoSistema } from '../domain/configuracionColumnasRevisionActualOrganoSistema'
import { configuracionColumnasAntecedenteTrabajoAnterior } from '../domain/configuracionColumnasAntecedenteTrabajoAnterior'
import { configuracionColumnasResultadoHabitoToxico } from '../domain/configuracionColumnasResultadoHabitoToxico'
import { configuracionColumnasFrPuestoTrabajoActual } from '../domain/configuracionColumnasFrPuestoTrabajoActual'
import { configuracionColumnasAntecedenteFamiliar } from '../domain/configuracionColumnasAntecedenteFamiliar'
import { configuracionColumnasMedicacionHabitual } from '../domain/configuracionColumnasMedicacionHabitual'
import { configuracionColumnasActividadFisica } from '../domain/configuracionColumnasActividadFisica'
import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'
import { encontrarUltimoIdListado, imprimirArchivo, mapearOptionsSelect } from 'shared/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { acciones, accionesTabla, maskFecha, tipos_sangre } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { apiConfig, endpoints } from 'config/api'
import { useMedicoStore } from 'stores/medico'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import ExamenFisicoRegionalComponent from 'medico/gestionarPacientes/modules/seccionesFichas/examenFisicoRegional/ExamenFisicoRegionalComponent.vue'
import AptitudMedicaTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/aptitudMedicaTrabajo/AptitudMedicaTrabajo.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { InformacionDefectoFichaPreocupacionalController } from '../infraestructure/InformacionDefectoFichaPreocupacionalController'
import { FichaPeriodicaController } from '../infraestructure/FichaPeriodicaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoAntecedenteFamiliarController } from '../infraestructure/TipoAntecedenteFamiliarController'
import { CategoriaFactorRiesgoController } from '../infraestructure/CategoriaFactorRiesgoController'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { TipoHabitoToxicoController } from '../infraestructure/TipoHabitoToxicoController'
import { TipoFactorRiesgoController } from '../infraestructure/TipoFactorRiesgoController'
import { ResultadoExamenPreocupacional } from '../domain/ResultadoExamenPreocupacional'
import { FichaPeriodica } from '../domain/FichaPeriodica'
import { SistemaOrganoController } from '../infraestructure/SistemaOrganoController'
import { RevisionActualOrganoSistema } from '../domain/RevisionActualOrganoSistema'
import { AntecedenteTrabajoAnterior } from '../domain/AntecedenteTrabajoAnterior'
import { ConstanteVital } from '../../seccionesFichas/domain/ConstanteVital'
import { TipoAntecedenteFamiliar } from '../domain/TipoAntecedenteFamiliar'
import { ResultadoHabitoToxico } from '../domain/ResultadoHabitoToxico'
import { FrPuestoTrabajoActual } from '../domain/FrPuestoTrabajoActual'
import { CategoriaFactorRiesgo } from '../domain/CategoriaFactorRiesgo'
import { ExamenFisicoRegional } from '../domain/ExamenFisicoRegional'
import { AntecedenteFamiliar } from '../domain/AntecedenteFamiliar'
import { MedicacionHabitual } from '../domain/MedicacionHabitual'
import { TipoFactorRiesgo } from '../domain/TipoFactorRiesgo'
import { TipoHabitoToxico } from '../domain/TipoHabitoToxico'
import { ActividadFisica } from '../domain/ActividadFisica'
import { SistemaOrgano } from '../domain/SistemaOrgano'

export default defineComponent({
  name: 'fichas_periodicas',
  components: {
    SimpleLayout,
    EssentialTable,
    ContantesVitales,
    AptitudMedicaTrabajo,
    ExamenFisicoRegionalComponent,
  },
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const authenticationStore = useAuthenticationStore()

    /************
     * Variables
     ************/
    const { confirmar } = useNotificaciones()
    const configuracionColumnasFrPuestoTrabajoActualReactive = ref(configuracionColumnasFrPuestoTrabajoActual)
    const configuracionColumnasAntecedenteTrabajoAnteriorReactive = ref(configuracionColumnasAntecedenteTrabajoAnterior)
    const mostrarTablaFrPuestoTrabajoActualReactive = ref(false)
    const mostrarTablaAntecedenteTrabajoAnteriorReactive = ref(false)
    const tipoFilaFrPuestoTrabajoActual = new FrPuestoTrabajoActual()
    const tipoFilaAntecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()
    const { notificarAdvertencia } = useNotificaciones()
    const examenesFisicosRegionalesAuxiliar = ref()

    /****************
     * Controladores
     ****************/
    const informacionDefectoFicha = new InformacionDefectoFichaPreocupacionalController()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaPeriodica, new FichaPeriodicaController())
    const { entidad: fichaPeriodica, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, editarParcial, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        // religiones: new ReligionController(),
        // orientacionesSexuales: new OrientacionSexualController(),
        // identidadesGeneros: new IdentidadGeneroController(),
        // tiposAntecedentes: new TipoAntecedenteController(),
        tiposHabitosToxicos: new TipoHabitoToxicoController(),
        tiposAntecedentesFamiliares: new TipoAntecedenteFamiliarController(),
        categoriasFactoresRiesgos: new CategoriaFactorRiesgoController(),
        tiposFactoresRiesgos: new TipoFactorRiesgoController(),
        sistemasOrganos: new SistemaOrganoController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
        antecedentes_familiares: [],
        habitos_toxicos: [],
        revisiones_actuales_organos_sistemas: [],
        examenes_realizados: [],
      })

      /* listadosAuxiliares.examenes_realizados = listadosAuxiliares.tiposAntecedentes.map((tipo: TipoAntecedente) => {
        const res = new ResultadoExamenPreocupacional()
        res.examen = tipo.examen
        res.examen_id = tipo.id
        return res
      }) */

      listadosAuxiliares.habitos_toxicos = listadosAuxiliares.tiposHabitosToxicos.map((tipo: TipoHabitoToxico) => {
        const res = new ResultadoHabitoToxico()
        res.tipo_habito_toxico = tipo.nombre
        res.tipo_habito_toxico_id = tipo.id
        return res
      })

      listadosAuxiliares.antecedentes_familiares = listadosAuxiliares.tiposAntecedentesFamiliares.map((tipo: TipoAntecedenteFamiliar) => {
        const res = new AntecedenteFamiliar()
        res.tipo_antecedente_familiar = tipo.nombre
        res.tipo_antecedente_familiar_id = tipo.id
        return res
      })

      listadosAuxiliares.revisiones_actuales_organos_sistemas = listadosAuxiliares.sistemasOrganos.map((tipo: SistemaOrgano) => {
        const rev = new RevisionActualOrganoSistema()
        rev.organo = tipo.nombre
        rev.organo_id = tipo.id
        return rev
      })

      configurarColumnasFrPuestoTrabajoActual()

      configurarFilaFrPuestoTrabajoActual()

      // Consultar ficha
      if (medicoStore.idFichaPeriodica) consultar({ id: medicoStore.idFichaPeriodica })
    })

    /******************
     * Botones tablas
     ******************/
    const btnEliminarActividadFisica: CustomActionTable<ActividadFisica> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.actividades_fisicas?.splice(posicion, 1))
    }

    const btnEliminarMedicacionHabitual: CustomActionTable<ResultadoHabitoToxico> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.medicaciones?.splice(posicion, 1))
    }

    const btnEliminarFrPuestoTrabajoActual: CustomActionTable<FrPuestoTrabajoActual> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.fr_puestos_trabajos_actuales?.splice(posicion, 1))
    }

    /************
     * Funciones
     ************/
    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)

    const insertarFilaActividadFisica = () => {
      if (fichaPeriodica.actividades_fisicas.length > 0) return notificarAdvertencia('Solo puede ingresar un máximo de una actividad')

      const actividadFisica = new ActividadFisica()
      actividadFisica.id = fichaPeriodica.actividades_fisicas?.length ? encontrarUltimoIdListado(fichaPeriodica.actividades_fisicas) + 1 : 1
      fichaPeriodica.actividades_fisicas.push(actividadFisica)
    }

    const insertarFilaMedicacionHabitual = () => {
      if (fichaPeriodica.medicaciones.length > 2) return notificarAdvertencia('Solo puede ingresar un máximo de tres medicamentos')

      const medicacionHabitual = new MedicacionHabitual()
      medicacionHabitual.id = fichaPeriodica.medicaciones?.length ? encontrarUltimoIdListado(fichaPeriodica.medicaciones) + 1 : 1
      fichaPeriodica.medicaciones.push(medicacionHabitual)
    }

    const insertarFilaFrPuestoTrabajoActualReactive = () => {
      const fila = JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual))
      fila.id = fichaPeriodica.fr_puestos_trabajos_actuales?.length ? encontrarUltimoIdListado(fichaPeriodica.fr_puestos_trabajos_actuales) + 1 : 1
      fichaPeriodica.fr_puestos_trabajos_actuales.push(fila)
    }

    const extraerIdCategoriasFactorRiesgo = (item: FrPuestoTrabajoActual, tipos: string[]) => {
      return tipos.reduce((acumulador, categoria) => {
        if (item[categoria]) {
          return [...acumulador, ...item[categoria]];
        }
        return acumulador;
      }, []);
    }

    const consultarInformacionDefectoFicha = async () => {
      const { response } = await informacionDefectoFicha.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
      fichaPeriodica.motivo_consulta = response.data.modelo.motivo_consulta
      fichaPeriodica.cargo = response.data.modelo.cargo
      fichaPeriodica.recomendaciones_tratamiento = response.data.modelo.recomendaciones_tratamiento
      fichaPeriodica.enfermedad_actual = response.data.modelo.enfermedad_actual
    }

    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_periodicas_imprimir) + '/' + fichaPeriodica.id
      const filename = 'ficha_periodica_' + fichaPeriodica.id + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => fichaPeriodica.constante_vital.hydrate(constanteVital)
    const hidratarAptitudMedica = (aptitudMedica: AptitudMedica) => fichaPeriodica.aptitud_medica.hydrate(aptitudMedica)
    const hidratarExamenFisicoRegional = (examen: ExamenFisicoRegional[]) => examenesFisicosRegionalesAuxiliar.value = examen

    const configurarColumnasFrPuestoTrabajoActual = async () => {
      // Columnas
      configuracionColumnasFrPuestoTrabajoActualReactive.value = [...configuracionColumnasFrPuestoTrabajoActual]

      await listadosAuxiliares.tiposFactoresRiesgos.forEach((tipo: TipoFactorRiesgo) => {
        configuracionColumnasFrPuestoTrabajoActualReactive.value.push({
          name: tipo.nombre ?? '',
          field: tipo.nombre ?? '',
          label: tipo.nombre ?? '',
          align: 'left',
          sortable: true,
          type: 'select_multiple',
          editable: true,
          options: listadosAuxiliares.categoriasFactoresRiesgos.filter((categoria: CategoriaFactorRiesgo) => categoria.tipo_factor_riesgo === tipo.id).map((categoria: CategoriaFactorRiesgo) => {
            return {
              label: categoria.nombre,
              value: categoria.id,
            }
          })
        })
      })

      mostrarTablaFrPuestoTrabajoActualReactive.value = true
    }

    const configurarFilaFrPuestoTrabajoActual = () => {
      listadosAuxiliares.tiposFactoresRiesgos.forEach((tipo: TipoFactorRiesgo) => {
        tipoFilaFrPuestoTrabajoActual[tipo.nombre ?? ''] = null
      })
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      fichaPeriodica.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null
      fichaPeriodica.examenes_fisicos_regionales = examenesFisicosRegionalesAuxiliar.value

      // Antecedentes familiares
      fichaPeriodica.antecedentes_familiares = [...listadosAuxiliares.antecedentes_familiares.filter((antecedente: AntecedenteFamiliar) => antecedente.descripcion)]

      fichaPeriodica.examenes_realizados = listadosAuxiliares.examenes_realizados.filter((resultado: ResultadoExamenPreocupacional) => resultado.tiempo || resultado.resultado).map((resultado: ResultadoExamenPreocupacional) => {
        resultado.examen_id = resultado.examen_id
        return resultado
      })

      // Fr_puestos_trabajos_actuales
      const tipos = listadosAuxiliares.tiposFactoresRiesgos.map((tipo: TipoFactorRiesgo) => tipo.nombre)
      fichaPeriodica.fr_puestos_trabajos_actuales = fichaPeriodica.fr_puestos_trabajos_actuales.map((item: FrPuestoTrabajoActual) => {
        item.detalle_categ_factor_riesgo_fr_puesto_trab_act = extraerIdCategoriasFactorRiesgo(item, tipos)
        return item
      })

      fichaPeriodica.revisiones_actuales_organos_sistemas = listadosAuxiliares.revisiones_actuales_organos_sistemas.filter((rev: RevisionActualOrganoSistema) => rev.descripcion).map((rev: RevisionActualOrganoSistema) => {
        return {
          organo_id: rev.organo_id,
          descripcion: rev.descripcion,
        }
      })

      // ResultadoHabitoToxico
      fichaPeriodica.habitos_toxicos = listadosAuxiliares.habitos_toxicos.filter((resultado: ResultadoHabitoToxico) => resultado.cantidad || resultado.tiempo_consumo_meses || resultado.tiempo_abstinencia_meses)

      fichaPeriodica.antecedentes_empleos_anteriores = fichaPeriodica.antecedentes_empleos_anteriores.map((antecedente: AntecedenteTrabajoAnterior) => {
        const riesgos: number[] = []
        const newItem: AntecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()

        for (const key in antecedente) {
          if (antecedente.hasOwnProperty(key) && !["id", "created_at", "updated_at"].includes(key)) {
            const value = antecedente[key]
            if (typeof value === "boolean" && value === true) {
              riesgos.push(parseInt(key))
            } else {
              newItem[key] = value
            }
          }
        }
        newItem['tipos_riesgos_ids'] = riesgos.length ? riesgos : []

        return newItem
      })

      console.log(fichaPeriodica.antecedentes_empleos_anteriores)
    })

    onReestablecer(() => {
      fichaPeriodica.numero_archivo = authenticationStore.user.identificacion
      emit('cerrar-modal')
    })

    onConsultado(() => {
      accion.value = acciones.consultar

      // Habitos toxicos
      listadosAuxiliares.habitos_toxicos = fichaPeriodica.habitos_toxicos

      // Revisiones actuales organos sistemas
      listadosAuxiliares.revisiones_actuales_organos_sistemas = listadosAuxiliares.revisiones_actuales_organos_sistemas.map((revision: RevisionActualOrganoSistema) => {
        console.log(revision)
        const antecedenteAux = fichaPeriodica.revisiones_actuales_organos_sistemas.find((antecedenteLleno: RevisionActualOrganoSistema) => antecedenteLleno.organo_id === revision.organo_id)
        
        if (antecedenteAux) {
          revision.descripcion = antecedenteAux.descripcion
        }
        return revision
      })

      // Antecedentes familiares
      listadosAuxiliares.antecedentes_familiares = listadosAuxiliares.antecedentes_familiares.map((antecedente: AntecedenteFamiliar) => {
        const antecedenteAux = fichaPeriodica.antecedentes_familiares.find((antecedenteLleno: AntecedenteFamiliar) => antecedenteLleno.tipo_antecedente_familiar_id === antecedente.tipo_antecedente_familiar_id)
        
        if (antecedenteAux) {
          antecedente.descripcion = antecedenteAux.descripcion
          antecedente.parentesco = antecedenteAux.parentesco
        }
        return antecedente
      })

      // Antecedentes empleos anteiores
      fichaPeriodica.antecedentes_empleos_anteriores = fichaPeriodica.antecedentes_empleos_anteriores.map((antecedente: AntecedenteTrabajoAnterior) => {
        const riesgos = antecedente.tipos_riesgos_ids?.reduce((acc, tipo_riesgo_id: number) => {
          acc[tipo_riesgo_id.toString()] = true;
          return acc;
        }, {});

        // Crear un nuevo objeto con los campos de riesgos y otros campos
        const newItem: AntecedenteTrabajoAnterior | any = { ...antecedente, ...riesgos };
        delete newItem.tipos_riesgos_ids; // Eliminar el campo tipos_riesgos_ids del nuevo objeto

        return newItem
      })
    })

    onGuardado((id: number) => medicoStore.idFichaPeriodica = id)

    /*********
     * Reglas
     *********/
    const reglas = {
      cargo: { required },
      constante_vital: {
        presion_arterial: { required },
        temperatura: { required },
        frecuencia_cardiaca: { required },
        saturacion_oxigeno: { required },
        frecuencia_respiratoria: { required },
        peso: { required },
        talla: { required },
        indice_masa_corporal: { required },
        perimetro_abdominal: { required },
      }
    }

    const v$ = useVuelidate(reglas, fichaPeriodica)
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
    fichaPeriodica.numero_archivo = authenticationStore.user.identificacion

    return {
      v$,
      mixin,
      disabled,
      fichaPeriodica,
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
      // insertarFilaAntecedenteTrabajoAnterior,
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
      // btnEliminarAntecedenteTrabajoAnterior,
      btnEliminarFrPuestoTrabajoActual,
      // btnEliminarAntecedenteFamiliar,
      accionesTabla,
      mostrarTablaFrPuestoTrabajoActualReactive,
      mostrarTablaAntecedenteTrabajoAnteriorReactive,
      configuracionColumnasAntecedenteTrabajoAnteriorReactive,
      mostrarMasculino: medicoStore.empleado?.genero === 'M',
      mostrarFemenino: medicoStore.empleado?.genero === 'F',
      mostrarDescargarPdf: authenticationStore.esMedico,
    }
  }
})
