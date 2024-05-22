import { configuracionColumnasResultadoExamenPreocupacional } from '../domain/configuracionColumnasResultadoExamenPreocupacional'
import { configuracionColumnasRevisionActualOrganoSistema } from '../domain/configuracionColumnasRevisionActualOrganoSistema'
import { configuracionColumnasAntecedenteTrabajoAnterior } from '../domain/configuracionColumnasAntecedenteTrabajoAnterior'
import { configuracionColumnasResultadoHabitoToxico } from '../domain/configuracionColumnasResultadoHabitoToxico'
import { configuracionColumnasFrPuestoTrabajoActual } from '../domain/configuracionColumnasFrPuestoTrabajoActual'
import { configuracionColumnasAntecedenteFamiliar } from '../domain/configuracionColumnasAntecedenteFamiliar'
import { configuracionColumnasMedicacionHabitual } from '../domain/configuracionColumnasMedicacionHabitual'
import { configuracionColumnasActividadFisica } from '../domain/configuracionColumnasActividadFisica'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { encontrarUltimoIdListado, imprimirArchivo, mapearOptionsSelect } from 'shared/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { acciones, accionesTabla, maskFecha, tipos_sangre } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { useMedicoStore } from 'stores/medico'
import { defineComponent, ref, watchEffect } from 'vue'
import useVuelidate from '@vuelidate/core'
import {
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf,
} from 'shared/i18n-validators'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import AptitudMedicaTrabajo from 'medico/gestionarPacientes/modules/seccionesFichas/aptitudMedicaTrabajo/AptitudMedicaTrabajo.vue'
import ExamenFisicoRegionalComponent from 'medico/gestionarPacientes/modules/seccionesFichas/examenFisicoRegional/ExamenFisicoRegionalComponent.vue'

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
import { TipoAntecedenteController } from '../infraestructure/TipoAntecedenteController'
import { ResultadoExamenPreocupacional } from '../domain/ResultadoExamenPreocupacional'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { SistemaOrganoController } from '../infraestructure/SistemaOrganoController'
import { RevisionActualOrganoSistema } from '../domain/RevisionActualOrganoSistema'
import { AntecedenteTrabajoAnterior } from '../domain/AntecedenteTrabajoAnterior'
import { TipoAntecedenteFamiliar } from '../domain/TipoAntecedenteFamiliar'
import { ReligionController } from '../infraestructure/ReligionController'
import { CategoriaFactorRiesgo } from '../domain/CategoriaFactorRiesgo'
import { ResultadoHabitoToxico } from '../domain/ResultadoHabitoToxico'
import { FrPuestoTrabajoActual } from '../domain/FrPuestoTrabajoActual'
import { AntecedenteFamiliar } from '../domain/AntecedenteFamiliar'
import { MedicacionHabitual } from '../domain/MedicacionHabitual'
import { TipoFactorRiesgo } from '../domain/TipoFactorRiesgo'
import { TipoHabitoToxico } from '../domain/TipoHabitoToxico'
import { TipoAntecedente } from '../domain/TipoAntecedente'
import { ActividadFisica } from '../domain/ActividadFisica'
import { SistemaOrgano } from '../domain/SistemaOrgano'
import { ConstanteVital } from '../domain/ConstanteVital'
import { AptitudMedica } from '../../seccionesFichas/aptitudMedicaTrabajo/domain/AptitudMedica'
import { ExamenFisicoRegional } from '../domain/ExamenFisicoRegional'
import { watch } from 'fs'
import { computed } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'

export default defineComponent({
  name: 'fichas_preocupacionales',
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
    const mostrarTablaFrPuestoTrabajoActualReactive = ref(false)
    const tipoFilaFrPuestoTrabajoActual = new FrPuestoTrabajoActual()

    /****************
     * Controladores
     ****************/
    const informacionDefectoFicha = new InformacionDefectoFichaPreocupacionalController()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaPeriodicaPreocupacional, new FichaPeriodicaPreocupacionalController())
    const { entidad: fichaPreocupacional, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, editarParcial, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        religiones: new ReligionController(),
        orientacionesSexuales: new OrientacionSexualController(),
        identidadesGeneros: new IdentidadGeneroController(),
        tiposAntecedentes: {
          controller: new TipoAntecedenteController(),
          params: { genero: medicoStore.empleado?.genero },
        },
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
        resultados_habitos_toxicos: [],
        revisiones_actuales_organos_sistemas: [],
      })

      fichaPreocupacional.examenes_realizados = listadosAuxiliares.tiposAntecedentes.map((tipo: TipoAntecedente) => {
        const res = new ResultadoExamenPreocupacional()
        res.examen = tipo.nombre
        res.examen_id = tipo.id
        return res
      })

      listadosAuxiliares.resultados_habitos_toxicos = listadosAuxiliares.tiposHabitosToxicos.map((tipo: TipoHabitoToxico) => {
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

      /* watchEffect(() => {
        if (fichaPreocupacional.revisiones_actuales_organos_sistemas) {
          listadosAuxiliares.revisiones_actuales_organos_sistemas = listadosAuxiliares.revisiones_actuales_organos_sistemas.map((item) => {
            const encontrado = fichaPreocupacional.revisiones_actuales_organos_sistemas.find((rev) => rev.organo_id === item.id)
            if (encontrado) {
              item.descripcion = encontrado.descripcion
            }
          })
        }
      }) */

      /* fichaPreocupacional.revisiones_actuales_organos_sistemas = listadosAuxiliares.sistemasOrganos.map((tipo: SistemaOrgano) => {
        const rev = new RevisionActualOrganoSistema()
        rev.organo = tipo.nombre
        return rev
      }) */

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

      listadosAuxiliares.tiposFactoresRiesgos.forEach((tipo: TipoFactorRiesgo) => {
        tipoFilaFrPuestoTrabajoActual[tipo.nombre ?? ''] = null
      })

      fichaPreocupacional.fr_puestos_trabajos_actuales.push(JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual)))
    })

    /******************
     * Botones tablas
     ******************/
    const btnEliminarActividadFisica: CustomActionTable<ActividadFisica> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPreocupacional.actividades_fisicas?.splice(posicion, 1))
    }

    const btnEliminarMedicacionHabitual: CustomActionTable<ResultadoHabitoToxico> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPreocupacional.resultados_habitos_toxicos?.splice(posicion, 1))
    }

    const btnEliminarAntecedenteTrabajoAnterior: CustomActionTable<AntecedenteTrabajoAnterior> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPreocupacional.antecedentes_trabajos_anteriores?.splice(posicion, 1))
    }

    const btnEliminarFrPuestoTrabajoActual: CustomActionTable<FrPuestoTrabajoActual> = {
      titulo: '',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPreocupacional.fr_puestos_trabajos_actuales?.splice(posicion, 1))
    }

    /************
     * Funciones
     ************/
    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)

    const insertarFilaActividadFisica = () => {
      const actividadFisica = new ActividadFisica()
      actividadFisica.id = fichaPreocupacional.actividades_fisicas?.length ? encontrarUltimoIdListado(fichaPreocupacional.actividades_fisicas) + 1 : 1
      fichaPreocupacional.actividades_fisicas.push(actividadFisica)
    }

    const insertarFilaMedicacionHabitual = () => {
      const medicacionHabitual = new MedicacionHabitual()
      medicacionHabitual.id = fichaPreocupacional.medicacion_habituales?.length ? encontrarUltimoIdListado(fichaPreocupacional.medicacion_habituales) + 1 : 1
      fichaPreocupacional.medicacion_habituales.push(medicacionHabitual)
    }

    const insertarFilaAntecedenteTrabajoAnterior = () => {
      const antecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()
      antecedenteTrabajoAnterior.id = fichaPreocupacional.antecedentes_trabajos_anteriores?.length ? encontrarUltimoIdListado(fichaPreocupacional.antecedentes_trabajos_anteriores) + 1 : 1
      fichaPreocupacional.antecedentes_trabajos_anteriores.push(antecedenteTrabajoAnterior)
    }

    const insertarFilaFrPuestoTrabajoActualReactive = () => {
      const fila = JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual))
      fila.id = fichaPreocupacional.fr_puestos_trabajos_actuales?.length ? encontrarUltimoIdListado(fichaPreocupacional.fr_puestos_trabajos_actuales) + 1 : 1
      fichaPreocupacional.fr_puestos_trabajos_actuales.push(fila)
    }

    const extraerIdCategoriasFactorRiesgo = (item: FrPuestoTrabajoActual, tipos: string[]) => {
      return tipos.reduce((acumulador, categoria) => {
        if (item[categoria]) {
          return [...acumulador, ...item[categoria]];
        }
        return acumulador;
      }, []);

      // return [1] //item
    }

    const consultarInformacionDefectoFicha = async () => {
      const { response } = await informacionDefectoFicha.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
      fichaPreocupacional.motivo_consulta = response.data.modelo.motivo_consulta
      fichaPreocupacional.recomendaciones_tratamiento = response.data.modelo.recomendaciones_tratamiento
      fichaPreocupacional.enfermedad_actual = response.data.modelo.enfermedad_actual
    }

    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.fichas_preocupacionales_imprimir) + '/' + fichaPreocupacional.id
      const filename = 'ficha_preocupacional_' + fichaPreocupacional.id + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => fichaPreocupacional.constante_vital.hydrate(constanteVital)
    const hidratarAptitudMedica = (aptitudMedica: AptitudMedica) => fichaPreocupacional.aptitud_medica.hydrate(aptitudMedica)
    const hidratarExamenFisicoRegional = (examen: ExamenFisicoRegional[]) => fichaPreocupacional.examenes_fisicos_regionales = examen

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      fichaPreocupacional.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null

      // Antecedentes familiares
      fichaPreocupacional.antecedentes_familiares = [...listadosAuxiliares.antecedentes_familiares.filter((antecedente: AntecedenteFamiliar) => antecedente.descripcion)]
      /*.map((antecedente: AntecedenteFamiliar) => {
        antecedente.tipo_antecedente_familiar = antecedente.tipo_antecedente_familiar_id
        return antecedente
      })*/

      // resultados_examenes_preocupacionales
      fichaPreocupacional.examenes_realizados = fichaPreocupacional.examenes_realizados.filter((resultado: ResultadoExamenPreocupacional) => resultado.tiempo || resultado.resultado).map((resultado: ResultadoExamenPreocupacional) => {
        resultado.examen_id = resultado.examen_id
        return resultado
      })

      // Fr_puestos_trabajos_actuales
      const tipos = listadosAuxiliares.tiposFactoresRiesgos.map((tipo: TipoFactorRiesgo) => tipo.nombre)
      fichaPreocupacional.fr_puestos_trabajos_actuales = fichaPreocupacional.fr_puestos_trabajos_actuales.map((item: FrPuestoTrabajoActual) => {
        item.detalle_categ_factor_riesgo_fr_puesto_trab_act = extraerIdCategoriasFactorRiesgo(item, tipos)
        return item
      })

      fichaPreocupacional.revisiones_actuales_organos_sistemas = listadosAuxiliares.revisiones_actuales_organos_sistemas.filter((rev: RevisionActualOrganoSistema) => rev.descripcion).map((rev: RevisionActualOrganoSistema) => {
        return {
          organo_id: rev.organo_id,
          descripcion: rev.descripcion,
        }
      })
      // fichaPreocupacional.revisiones_actuales_organos_sistemas = fichaPreocupacional.revisiones_actuales_organos_sistemas.filter((rev: RevisionActualOrganoSistema) => rev.descripcion)

      // ResultadoHabitoToxico
      fichaPreocupacional.resultados_habitos_toxicos = listadosAuxiliares.resultados_habitos_toxicos.filter((resultado: ResultadoHabitoToxico) => resultado.cantidad || resultado.tiempo_consumo_meses || resultado.tiempo_abstinencia_meses)
    })

    onReestablecer(() => {
      fichaPreocupacional.numero_archivo = authenticationStore.user.identificacion
      emit('cerrar-modal')
    })

    onConsultado(() => {
      accion.value = acciones.consultar

      // listadosAuxiliares.revisiones_actuales_organos_sistemas = fichaPreocupacional.revisiones_actuales_organos_sistemas
      /*.map((rev: RevisionActualOrganoSistema) => {
        return {
          organo_id: rev.organo_id,
          organo: rev.organo,
          descripcion: rev.descripcion,
        }
      })*/
    })

    onGuardado((id: number) => medicoStore.idFichaPreocupacional = id)

    /*********
     * Reglas
     *********/
    const reglas = {
      cargo: { required },
      religion: { required },
      orientacion_sexual: { required },
      identidad_genero: { required },
      lateralidad: { required },
      antecedente_personal: {
        hijos_vivos: { required },
        hijos_muertos: { required },
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
        perimetro_abdominal: { required },
      }
    }

    const v$ = useVuelidate(reglas, fichaPreocupacional)
    setValidador(v$.value)

    /*******
     * Init
     *******/
    insertarFilaActividadFisica()
    insertarFilaMedicacionHabitual()
    insertarFilaAntecedenteTrabajoAnterior()
    // insertarFilaAntecedenteTrabajoAnterior()
    consultarInformacionDefectoFicha()
    // listar()
    fichaPreocupacional.numero_archivo = authenticationStore.user.identificacion
    if (medicoStore.idFichaPreocupacional) consultar({ id: medicoStore.idFichaPreocupacional })

    return {
      v$,
      mixin,
      disabled,
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
      mostrarMasculino: medicoStore.empleado?.genero === 'M',
      mostrarFemenino: medicoStore.empleado?.genero === 'F',
      mostrarDescargarPdf: authenticationStore.esMedico,
    }
  }
})
