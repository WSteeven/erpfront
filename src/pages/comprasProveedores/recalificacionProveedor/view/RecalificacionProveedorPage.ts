import { computed, defineComponent, ref } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { configuracionColumnasCriteriosCalificaciones } from 'comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificaciones'
import { configuracionColumnasCriteriosCalificacionesConPeso } from 'comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConPeso'
import { configuracionColumnasCriteriosCalificacionesConCalificacion } from 'comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConCalificacion'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CalificacionProveedor } from 'comprasProveedores/calificacionProveedor/domain/CalificacionProveedor'
import { CalificacionProveedorController } from 'comprasProveedores/calificacionProveedor/infraestructure/CalificacionProveedorController'
import { ArchivoController } from 'subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { useNotificaciones } from 'shared/notificaciones'
import { useProveedorStore } from 'stores/comprasProveedores/proveedor'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useBotonesTablaCalificacionProveedor } from 'comprasProveedores/calificacionProveedor/application/BotonesTablaCalificacionProveedor'
import { tiposOfertas } from 'config/utils_compras_proveedores'
import { accionesTabla } from 'config/utils'
import { CriterioCalificacionController } from 'comprasProveedores/criteriosCalificaciones/infraestructure/CriterioCalificacionController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { EssentialTable, GestorArchivos },
  props: { datos: { type: Object, required: true } },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      CalificacionProveedor,
      new CalificacionProveedorController(),
      new ArchivoController()
    )

    const { listadosAuxiliares: listadosAuxiliaresProveedor } =
      props.datos.mixin.useReferencias()
    const { listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const {
      confirmar,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError
    } = useNotificaciones()

    /**************************************************************
     * Stores
     **************************************************************/
    const proveedorStore = useProveedorStore()
    const cargando = new StatusEssentialLoading()
    /**************************************************************
     * Variables
     **************************************************************/
    const refArchivo = ref()
    const disabled = ref(false)
    const step = ref(1)
    const stepper = ref()
    const resultadosCalificacion = ref()
    const idDetalleDepartamentoProveedor = computed(
      () => proveedorStore.idDetalleDepartamento
    )
    const seleccionados = ref([]) //los criterios que son seleccionados en la primera tabla
    const {
      btnCalificarCriterioBien,
      btnCalificarCriterioServicio,
      btnEditarCantidadCriterioBien,
      btnEditarCantidadCriterioServicio,
      btnEliminarCriterioBien,
      btnEliminarCriterioServicio,
      criteriosBienes,
      criteriosServicios,
      listado: listadoSeleccionados
      // btnSubirArchivosBien,
    } = useBotonesTablaCalificacionProveedor(seleccionados)

    cargarVista(async () => {
      await obtenerListados({
        criterios: {
          controller: new CriterioCalificacionController(),
          params: { only_me: true, 'oferta_id[]': estructuraConsultaOferta() }
        }
      })
      estructuraConsultaOferta()
    })

    /**************************************************************
     * FUNCIONES
     **************************************************************/
    function estructuraConsultaOferta() {
      //aqui se sabe que la oferta siempre será bienes y servicios así que se recorre hasta el penultimo digito
      let parametro = ''
      if (proveedorStore.proveedor.tipos_ofrece.length > 1) {
        // console.log('Se ofrecen varios tipos')
      } else {
        // console.log('Se ofrece un tipo')
      }
      proveedorStore.proveedor.tipos_ofrece.forEach((v, index) => {
        if (index === 1) parametro += v
        else parametro += v + '&oferta_id[]='
      })
      // console.log('Se elemento', parametro)
      return parametro
    }

    /**
     * La función `botonNext` se usa para manejar la lógica para avanzar al siguiente paso en un
     * proceso de varios pasos, verificando ciertos criterios antes de permitir que el usuario
     * continúe.
     * @returns nada (indefinido) en la mayoría de los casos. Sin embargo, puede regresar antes de
     * tiempo con una declaración de 'retorno' si se cumplen ciertas condiciones.
     */
    async function botonNext() {
      // console.log(proveedorStore.idDetalleDepartamento)
      // console.log('Clickeaste en Next, actual: ', step.value, ' siguiente step es: ', step.value + 1)
      if (
        criteriosBienes.value.length == 0 &&
        criteriosServicios.value.length == 0
      ) {
        notificarAdvertencia(
          'Debes seleccionar al menos un criterio del listado para poder avanzar.'
        )
        return
      }
      if (step.value == 2) {
        const resultListadoBienes = verificarCriteriosBienes()
        if (resultListadoBienes) {
          stepper.value.next()
          return
        } else return
      }
      if (step.value == 3) {
        const resultListadoServicios = verificarCriteriosServicios()
        if (resultListadoServicios) {
          stepper.value.next()
          return
        } else return
      }
      if (step.value == 4) {
        cargando.activar()
        if (verificarCalificacionesCriterios()) {
          // const { result } = await new DetalleDepartamentoProveedorController().listar({ proveedor_id: proveedorStore.idProveedor, departamento_id: proveedorStore.idDepartamento })
          // console.log(result)
          // detalleDepartamento.value = result
          // console.log(detalleDepartamento.value)
          await confirmar(
            '¿Estás seguro de guardar tu calificación? Una vez realizada no podrás modificarla',
            async () => {
              // console.log('Aqui se guardan los resultados en la base de datos')
              // console.log(criteriosBienes.value, criteriosServicios.value)
              let calificacionBienes = 0
              let calificacionServicios = 0
              let suma = 0
              if (criteriosBienes.value.length > 0)
                calificacionBienes = criteriosBienes.value.reduce(
                  (prev, curr) => prev + parseFloat(curr.calificacion),
                  0
                )
              if (criteriosServicios.value.length > 0)
                calificacionServicios = criteriosServicios.value.reduce(
                  (prev, curr) => prev + parseFloat(curr.calificacion),
                  0
                )
              // console.log(calificacionBienes, calificacionServicios)
              if (calificacionBienes > 0 && calificacionServicios > 0) {
                suma = (calificacionServicios + calificacionBienes) / 2
              } else {
                if (calificacionServicios > 0) suma = calificacionServicios
                if (calificacionBienes > 0) suma = calificacionBienes
              }

              const data = {
                detalle_departamento_proveedor_id:
                  idDetalleDepartamentoProveedor.value,
                proveedor_id: proveedorStore.proveedor.id,
                criterios: [
                  ...criteriosBienes.value,
                  ...criteriosServicios.value
                ],
                calificacion: suma
              }
              const { response, result } = await guardarRecalificacion(data)
              if (response.status == 200) {
                resultadosCalificacion.value = result
                // step.value++
                stepper.value.next()
                return
              } else {
                // step.value--
                stepper.value.previous()
              }
            }
          )
          cargando.desactivar()
          return
        } else {
          cargando.desactivar()
          notificarError(
            '¡Debes calificar todos los criterios para poder avanzar!.'
          )
          return
        }
      }
      if (step.value == 5) {
        emit('cerrar-modal', false)
        emit('guardado', 'RecalificacionProveedorPage') //se  envia a recargar listado de proveedores para que no se muestre el boton
      }
      stepper.value.next()
    }

    async function guardarRecalificacion(data) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.recalificacion_proveedor)
        const response: AxiosResponse = await axios.post(ruta, data)
        return {
          response,
          result: response.data.modelo
        }
      } catch (e) {
        console.error(e)
      } finally {
        cargando.desactivar()
      }
    }

    /**
     * La función 'verificarCriteriosBienes' comprueba si la suma de los pesos asignados a los
     * elementos de una lista es igual a 100.
     * @returns ya sea verdadero o falso. Si la condición `if (sumaCriteriosBienes == 100)` es
     * verdadera, devuelve verdadero. Si la condición `if (criteriosBienes.value.length > 0)` es
     * falsa, también devuelve verdadero. De lo contrario, devuelve falso.
     */
    function verificarCriteriosBienes() {
      let sumaCriteriosBienes = 0
      if (criteriosBienes.value.length > 0) {
        sumaCriteriosBienes = criteriosBienes.value.reduce(
          (prev, curr) => prev + curr.peso,
          0
        )
        if (Number.isNaN(sumaCriteriosBienes)) {
          notificarError('Debes asignar peso a todos los items del listado')
          return false
        }
        if (sumaCriteriosBienes < 100 || sumaCriteriosBienes > 100) {
          notificarAdvertencia('La suma de todos los pesos debe ser igual 100')
          return false
        }
        if (sumaCriteriosBienes == 100) {
          notificarCorrecto(
            'Configuración de pesos para criterios de bienes realizada correctamente'
          )
          return true
        }
      } else {
        return true
      }
    }

    /**
     * La función 'verificarCriteriosServicios' comprueba si la suma de pesos asignados a criterios
     * para servicios es válida.
     * @returns ya sea verdadero o falso. Si la condición `if (sumaCriteriosServicios == 100)` es
     * verdadera, devolverá verdadero. Si alguna de las otras condiciones es verdadera, devolverá
     * falso. Si no se cumple ninguna de las condiciones y se ejecuta el bloque `else`, también
     * devolverá verdadero.
     */
    function verificarCriteriosServicios() {
      let sumaCriteriosServicios = 0
      if (criteriosServicios.value.length > 0) {
        sumaCriteriosServicios = criteriosServicios.value.reduce(
          (prev, curr) => prev + curr.peso,
          0
        )
        if (Number.isNaN(sumaCriteriosServicios)) {
          notificarError('Debes asignar peso a todos los items del listado')
          return false
        }
        if (sumaCriteriosServicios < 100 || sumaCriteriosServicios > 100) {
          notificarAdvertencia('La suma de todos los pesos debe ser igual 100')
          return false
        }
        if (sumaCriteriosServicios == 100) {
          notificarCorrecto(
            'Configuración de pesos para criterios de servicios realizada correctamente'
          )
          return true
        }
      } else {
        return true
      }
    }

    /**
     * La función 'verificarCalificacionesCriterios' comprueba si a todos los criterios de bienes y
     * servicios se les ha asignado una calificación.
     * @returns un valor booleano.
     */
    function verificarCalificacionesCriterios() {
      return (
        criteriosBienes.value.every(v => v.calificacion != null) &&
        criteriosServicios.value.every(v => v.calificacion != null)
      )
    }

    /**
     * La función `criterioSeleccionado` registra la entrada `fila` y agrega o elimina elementos de
     * `criteriosBienes.value` y `criteriosServicios.value` en función de la propiedad `oferta` de
     * cada elemento en `fila.rows`.
     * @param fila - El parámetro 'fila' es un objeto que representa una fila de datos. Contiene
     * una propiedad llamada 'agregado' que indica si la fila se agregó o eliminó. También contiene
     * una propiedad llamada 'filas', que es una matriz de objetos que representan filas
     * individuales dentro de la fila principal.
     */
    function criterioSeleccionado(fila) {
      if (fila.added) {
        fila.rows.forEach(v => {
          if (v.oferta == tiposOfertas.bienes) {
            const posicion = criteriosBienes.value.push(v)
            criteriosBienes.value[posicion - 1].peso = v.ponderacion_referencia
          }
          if (v.oferta == tiposOfertas.servicios) {
            const posicion = criteriosServicios.value.push(v)
            criteriosServicios.value[posicion - 1].peso =
              v.ponderacion_referencia
          }
        })
      } else {
        fila.rows.forEach(element => {
          if (element.oferta == tiposOfertas.bienes)
            criteriosBienes.value = criteriosBienes.value.filter(
              v => v != element
            )
          if (element.oferta == tiposOfertas.servicios)
            criteriosServicios.value = criteriosServicios.value.filter(
              v => v != element
            )
        })
      }
    }

    function subirArchivos() {
      refArchivo.value.subir()
    }

    function cargarArchivos() {
      refArchivo.value.listarArchivosAlmacenados(
        idDetalleDepartamentoProveedor.value
      )
    }

    return {
      mixin,
      disabled,
      step,
      stepper,
      refArchivo,
      accionesTabla,
      ofertas: listadosAuxiliaresProveedor.ofertas,
      proveedor: proveedorStore.proveedor,
      idDetalleDepartamentoProveedor,
      mostrarBotonSubir: computed(
        () => refArchivo.value?.quiero_subir_archivos
      ),
      resultadosCalificacion,
      columnasCriterios: configuracionColumnasCriteriosCalificaciones,
      columnasCriteriosConPeso:
        configuracionColumnasCriteriosCalificacionesConPeso,
      columnasCriteriosConCalificacion:
        configuracionColumnasCriteriosCalificacionesConCalificacion,
      criterios: listadosAuxiliares.criterios, //tabla general
      seleccionados: listadoSeleccionados,
      criterioSeleccionado,
      criteriosServicios,
      criteriosBienes,
      //pagination
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 15
        // rowsNumber: xx if getting data from a server
      },

      // botones
      btnEditarCantidadCriterioBien,
      btnEliminarCriterioBien,
      btnEditarCantidadCriterioServicio,
      btnEliminarCriterioServicio,
      btnCalificarCriterioBien,
      btnCalificarCriterioServicio,

      //funciones
      subirArchivos,
      cargarArchivos,
      botonNext
    }
  }
})
