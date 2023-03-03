// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasObservacion'
import { regiones, atenciones, tiposIntervenciones, causaIntervencion, accionesTabla, acciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, onMounted, Ref, ref, watchEffect } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import TrabajoRealizado from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/TrabajoRealizado'
import Observacion from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/Observacion'
import { EmergenciaController } from '../infraestructure/EmergenciaController'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { CausaIntervencion } from './CausaIntervencion'
import { obtenerTiempoActual } from 'shared/utils'
import { Emergencia } from '../domain/Emergencia'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Emergencia, new EmergenciaController())
    const { entidad: emergencia, accion, listado } = mixin.useReferencias()
    const { guardar, editar, reestablecer, setValidador, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado } = mixin.useHooks()

    /************
     * Variables
     ************/
    const refTrabajos = ref()
    const refObservaciones = ref()

    /************
     * Init
     ************/
    listar({ trabajo_id: trabajoAsignadoStore.idTrabajoSeleccionado })

    watchEffect(() => {
      console.log(listado.value)
      if (listado.value) {
        if (listado.value.length) {

          console.log(listado.value[0])
          const em = new Emergencia()
          em.hydrate(listado.value[0])
          console.log(em)
          emergencia.hydrate(listado.value[1])
        }
        //refTrab
      }
    })

    /***************************
    * Configuracion de columnas
    ****************************/
    const columnasTrabajoRealizado = [
      ...configuracionColumnasTrabajoRealizado,
      accionesTabla
    ]

    const columnasObservacion = [...configuracionColumnasObservacion, accionesTabla]

    const columnasMaterial = [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla]

    /***************
     * Botones tabla
     ***************/
    const agregarActividadRealizada: CustomActionTable = {
      titulo: 'Insertar fila debajo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      accion: async () => {
        const fila: TrabajoRealizado = new TrabajoRealizado()
        const { hora } = await obtenerTiempoActual()
        if (typeof emergencia.trabajo_realizado === 'object') {
          fila.hora = hora
          emergencia.trabajo_realizado.push(fila)
          refTrabajos.value.abrirModalEntidad(fila, emergencia.trabajo_realizado.length - 1)
        }

      }
    }

    const agregarObservacion: CustomActionTable = {
      titulo: 'Insertar fila debajo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      accion: () => {
        const fila: Observacion = new Observacion()

        if (typeof emergencia.observaciones === 'object') {

          emergencia.observaciones.push(fila)
          refObservaciones.value.abrirModalEntidad(fila, emergencia.observaciones.length - 1)
        }
      }
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materiales.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => val >= 0 && val <= entidad.stock_actual,
          accion: (data) => materiales.value[posicion].cantidad_utilizada = data
        }

        prompt(config)
      },
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      regional: { required },
      atencion: { required },
      tipo_intervencion: { required },
      causa_intervencion: { required },
      fecha_reporte_problema: { required },
      hora_reporte_problema: { required },
      fecha_arribo: { required },
      hora_arribo: { required },
      fecha_fin_reparacion: { required },
      hora_fin_reparacion: { required },
      fecha_retiro_personal: { required },
      hora_retiro_personal: { required },
    }

    const v$ = useVuelidate(reglas, emergencia)
    setValidador(v$.value)

    /********
    * Hooks
    *********/
    onConsultado(() => {
      obtenerMateriales().then(() => ajustarCantidadesUtilizadas())
    })

    onBeforeGuardar(() => {
      emergencia.materiales_ocupados = filtrarMaterialesOcupados()
      emergencia.trabajo = trabajoAsignadoStore.idTrabajoSeleccionado
    })

    /************
    * Funciones
    *************/
    const { prompt } = useNotificaciones()

    const eliminarTrabajoRealizado = ({ posicion }) => {
      if (typeof emergencia.trabajo_realizado === 'object') emergencia.trabajo_realizado.splice(posicion, 1)
    }

    const eliminarObservacion = ({ posicion }) => {
      if (typeof emergencia.observaciones === 'object') emergencia.observaciones.splice(posicion, 1)
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: CausaIntervencion) => causa.categoria === emergencia.tipo_intervencion))

    const materiales: Ref<MaterialOcupadoFormulario[]> = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { trabajo_id: trabajoAsignadoStore.idTrabajoSeleccionado })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    obtenerMateriales()

    function filtrarMaterialesOcupados() {
      return materiales.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada') && material.cantidad_utilizada > 0)
    }

    function ajustarCantidadesUtilizadas() {
      const materialesOcupados = emergencia.materiales_ocupados

      for (let i = 0; i < materiales.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesOcupados, materiales.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materiales.value[i].stock_actual = materialesOcupados[indexOcupado].stock_actual
          materiales.value[i].cantidad_utilizada = materialesOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function obtenerIndice(listadoBuscar, id) {
      return listadoBuscar.findIndex((item) => item.detalle_producto_id === id)
    }

    return {
      v$,
      refTrabajos,
      refObservaciones,
      emergencia,
      accion,
      causasIntervencion,
      // columnas
      columnasTrabajoRealizado,
      columnasObservacion,
      columnasMaterial,
      // listados
      materiales,
      agregarActividadRealizada,
      agregarObservacion,
      botonEditarCantidad,
      // config
      regiones,
      atenciones,
      tiposIntervenciones,
      eliminarTrabajoRealizado,
      eliminarObservacion,
      guardar,
      editar,
      reestablecer,
      emit,
    }
  }
})
