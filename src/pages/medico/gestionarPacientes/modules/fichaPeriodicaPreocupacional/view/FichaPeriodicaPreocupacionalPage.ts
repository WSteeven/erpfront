import { configuracionColumnasResultadoExamenPreocupacional } from '../domain/configuracionColumnasResultadoExamenPreocupacional'
import { configuracionColumnasRevisionActualOrganoSistema } from '../domain/configuracionColumnasRevisionActualOrganoSistema'
import { configuracionColumnasAntecedenteTrabajoAnterior } from '../domain/configuracionColumnasAntecedenteTrabajoAnterior'
import { configuracionColumnasResultadoHabitoToxico } from '../domain/configuracionColumnasResultadoHabitoToxico'
import { configuracionColumnasFrPuestoTrabajoActual } from '../domain/configuracionColumnasFrPuestoTrabajoActual'
import { configuracionColumnasAntecedenteFamiliar } from '../domain/configuracionColumnasAntecedenteFamiliar'
import { configuracionColumnasMedicacionHabitual } from '../domain/configuracionColumnasMedicacionHabitual'
import { configuracionColumnasActividadFisica } from '../domain/configuracionColumnasActividadFisica'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla, maskFecha, tipos_sangre } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { encontrarUltimoIdListado } from 'shared/utils'
import { defineComponent, reactive } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { ref } from 'vue'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { FichaPeriodicaPreocupacionalController } from '../infraestructure/FichaPeriodicaPreocupacionalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoAntecedenteFamiliarController } from '../infraestructure/TipoAntecedenteFamiliarController'
import { CategoriaFactorRiesgoController } from '../infraestructure/CategoriaFactorRiesgoController'
import { OrientacionSexualController } from '../infraestructure/OrientacionSexualController'
import { TipoHabitoToxicoController } from '../infraestructure/TipoHabitoToxicoController'
import { TipoFactorRiesgoController } from '../infraestructure/TipoFactorRiesgoController'
import { IdentidadGeneroController } from '../infraestructure/IdentidadGeneroController'
import { TipoAntecedenteController } from '../infraestructure/TipoAntecedenteController'
import { ResultadoExamenPreocupacional } from '../domain/ResultadoExamenPreocupacional'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { SistemaOrganoController } from '../infraestructure/SistemaOrganoController'
import { ReligionController } from '../infraestructure/ReligionController'
import { RevisionActualOrganoSistema } from '../domain/RevisionActualOrganoSistema'
import { AntecedenteTrabajoAnterior } from '../domain/AntecedenteTrabajoAnterior'
import { TipoAntecedenteFamiliar } from '../domain/TipoAntecedenteFamiliar'
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
import { RegionCuerpoController } from '../infraestructure/RegionCuerpoController'
import { CategoriaExamenFisicoController } from '../infraestructure/CategoriaExamenFisicoController'

export default defineComponent({
  name: 'fichas_periodicas_preocupacionales',
  components: {
    SimpleLayout,
    EssentialTable,
  },
  setup() {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()

    /************
     * Variables
     ************/
    const { confirmar } = useNotificaciones()
    const configuracionColumnasFrPuestoTrabajoActualReactive = ref(configuracionColumnasFrPuestoTrabajoActual)
    const mostrarTablaFrPuestoTrabajoActualReactive = ref(false)
    const tipoFilaFrPuestoTrabajoActual = new FrPuestoTrabajoActual()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaPeriodicaPreocupacional, new FichaPeriodicaPreocupacionalController())
    const { entidad: fichaPeriodica, listadosAuxiliares, disabled, accion } = mixin.useReferencias()
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
        regionesCuerpo: new RegionCuerpoController(),
        categoriasExamenesFisicos: new CategoriaExamenFisicoController(),
      })

      fichaPeriodica.resultados_examenes_preocupacionales = listadosAuxiliares.tiposAntecedentes.map((tipo: TipoAntecedente) => {
        const res = new ResultadoExamenPreocupacional()
        res.tipo_antecedente = tipo.nombre
        res.tipo_antecedente_id = tipo.id
        return res
      })

      fichaPeriodica.resultados_habitos_toxicos = listadosAuxiliares.tiposHabitosToxicos.map((tipo: TipoHabitoToxico) => {
        const res = new ResultadoHabitoToxico()
        res.tipo_habito_toxico = tipo.nombre
        return res
      })


      fichaPeriodica.antecedentes_familiares = listadosAuxiliares.tiposAntecedentesFamiliares.map((tipo: TipoAntecedenteFamiliar) => {
        const res = new AntecedenteFamiliar()
        res.tipo_antecedente_familiar = tipo.nombre
        res.tipo_antecedente_familiar_id = tipo.id
        return res
      })

      fichaPeriodica.revisiones_actuales_organos_sistemas = listadosAuxiliares.sistemasOrganos.map((tipo: SistemaOrgano) => {
        const rev = new RevisionActualOrganoSistema()
        rev.organo_sistema = tipo.nombre
        return rev
      })

      // Columnas
      configuracionColumnasFrPuestoTrabajoActualReactive.value = [...configuracionColumnasFrPuestoTrabajoActual]
      // configuracionColumnasReactive.value = [...configuracionColumnasFrPuestoTrabajoActual]

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

      fichaPeriodica.fr_puestos_trabajos_actuales.push(JSON.parse(JSON.stringify(tipoFilaFrPuestoTrabajoActual)))
    })

    /******************
     * Botones tablas
     ******************/
    const btnEliminarActividadFisica: CustomActionTable<ActividadFisica> = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.actividades_fisicas?.splice(posicion, 1))
    }

    const btnEliminarMedicacionHabitual: CustomActionTable<ResultadoHabitoToxico> = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.resultados_habitos_toxicos?.splice(posicion, 1))
    }

    const btnEliminarAntecedenteTrabajoAnterior: CustomActionTable<AntecedenteTrabajoAnterior> = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.antecedentes_trabajos_anteriores?.splice(posicion, 1))
    }

    /* const btnEliminarAntecedenteFamiliar: CustomActionTable<AntecedenteFamiliar> = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => confirmar('¿Está seguro de continuar?', () => fichaPeriodica.antecedentes_familiares?.splice(posicion, 1))
    } */

    /************
     * Funciones
     ************/
    const insertarFilaActividadFisica = () => {
      const actividadFisica = new ActividadFisica()
      actividadFisica.id = fichaPeriodica.actividades_fisicas?.length ? encontrarUltimoIdListado(fichaPeriodica.actividades_fisicas) + 1 : 1
      fichaPeriodica.actividades_fisicas.push(actividadFisica)
    }

    const insertarFilaMedicacionHabitual = () => {
      const medicacionHabitual = new MedicacionHabitual()
      medicacionHabitual.id = fichaPeriodica.medicacion_habituales?.length ? encontrarUltimoIdListado(fichaPeriodica.medicacion_habituales) + 1 : 1
      fichaPeriodica.medicacion_habituales.push(medicacionHabitual)
    }

    const insertarFilaAntecedenteTrabajoAnterior = () => {
      const antecedenteTrabajoAnterior = new AntecedenteTrabajoAnterior()
      antecedenteTrabajoAnterior.id = fichaPeriodica.antecedentes_trabajos_anteriores?.length ? encontrarUltimoIdListado(fichaPeriodica.antecedentes_trabajos_anteriores) + 1 : 1
      fichaPeriodica.antecedentes_trabajos_anteriores.push(antecedenteTrabajoAnterior)
    }

    /* const insertarFilaAntecedenteFamiliar = () => {
      const antecedenteFamiliar = new AntecedenteFamiliar()
      antecedenteFamiliar.id = fichaPeriodica.antecedentes_familiares?.length ? encontrarUltimoIdListado(fichaPeriodica.antecedentes_familiares) + 1 : 1
      fichaPeriodica.antecedentes_familiares.push(antecedenteFamiliar)
    } */

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

      // return [1] //item
    }

    const configurarParametrosDefecto = () => {
      // fichaPeriodica.antecedente_gineco_obstetrico.vida_sexual_activa = false
      /*fichaPeriodica.religion = 1
      fichaPeriodica.orientacion_sexual = 1
      fichaPeriodica.identidad_genero = 1*/
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      // Antecedentes familiares
      fichaPeriodica.antecedentes_familiares = fichaPeriodica.antecedentes_familiares.filter((antecedente: AntecedenteFamiliar) => antecedente.descripcion).map((antecedente: AntecedenteFamiliar) => {
        antecedente.tipo_antecedente_familiar = antecedente.tipo_antecedente_familiar_id
        return antecedente
      })

      // resultados_examenes_preocupacionales
      fichaPeriodica.resultados_examenes_preocupacionales = fichaPeriodica.resultados_examenes_preocupacionales.filter((resultado: ResultadoExamenPreocupacional) => resultado.tiempo || resultado.resultado).map((resultado: ResultadoExamenPreocupacional) => {
        resultado.tipo_antecedente = resultado.tipo_antecedente_id
        return resultado
      })

      // Fr_puestos_trabajos_actuales
      const tipos = listadosAuxiliares.tiposFactoresRiesgos.map((tipo: TipoFactorRiesgo) => tipo.nombre)
      fichaPeriodica.fr_puestos_trabajos_actuales = fichaPeriodica.fr_puestos_trabajos_actuales.map((item: FrPuestoTrabajoActual) => {
        item.detalle_categ_factor_riesgo_fr_puesto_trab_act = extraerIdCategoriasFactorRiesgo(item, tipos)
        return item
      })

      fichaPeriodica.revisiones_actuales_organos_sistemas = fichaPeriodica.revisiones_actuales_organos_sistemas.filter((rev: RevisionActualOrganoSistema) => rev.descripcion)
    })

    /*******
     * Init
     *******/
    insertarFilaActividadFisica()
    insertarFilaMedicacionHabitual()
    insertarFilaAntecedenteTrabajoAnterior()
    insertarFilaAntecedenteTrabajoAnterior()
    configurarParametrosDefecto()
    listar()

    return {
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
      insertarFilaAntecedenteTrabajoAnterior,
      // insertarFilaAntecedenteFamiliar,
      insertarFilaFrPuestoTrabajoActualReactive,
      btnEliminarActividadFisica,
      btnEliminarMedicacionHabitual,
      btnEliminarAntecedenteTrabajoAnterior,
      // btnEliminarAntecedenteFamiliar,
      accionesTabla,
      mostrarTablaFrPuestoTrabajoActualReactive,
      mostrarMasculino: medicoStore.empleado?.genero === 'M',
      mostrarFemenino: medicoStore.empleado?.genero === 'F',
    }
  }
})
