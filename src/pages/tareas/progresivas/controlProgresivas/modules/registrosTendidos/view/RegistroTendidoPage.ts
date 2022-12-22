// Dependencias
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/transacciones/modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension } from 'config/utils'
import { defineComponent, onMounted, reactive, ref } from "vue"
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { useOrquestadorSelectorDetalles } from "../application/OrquestadorSelectorDetalles"
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { RegistroTendido } from "../domain/RegistrosTendido"
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { number } from 'echarts'

export default defineComponent({
    components: {
        SelectorImagen,
        EssentialTable,
        EssentialSelectableTable,
    },
    setup() {
        const tendido = reactive(new RegistroTendido())

        // Reglas de validacion
        const reglas = {
            imagen: { required },
            propietario_elemento: { required },
        }

        const v$ = useVuelidate(reglas, tendido)

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorDetalles(tendido, 'detalles')

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'center'
        }]

        const { confirmar, prompt } = useNotificaciones()

        function eliminar({ entidad, posicion }) {
            confirmar('¿Esta seguro de continuar?',
                () =>
                    tendido.listadoProductosSeleccionados.splice(posicion, 1))
        }

        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad utilizada',
            icono: 'bi-pencil',
            accion: ({ entidad, posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: materiales.value[posicion].cantidad_utilizada,
                    tipo: 'number',
                    validacion: (val) => val > 0 && val <= entidad.cantidad_despachada,
                    accion: (data) => materiales.value[posicion].cantidad_utilizada = data
                }

                prompt(config)
            },
        }

        function obtenerUbicacion(onUbicacionConcedida) {

            const onErrorDeUbicacion = err => {
                console.log("Error obteniendo ubicación: ", err)
            }

            const opcionesDeSolicitud = {
                enableHighAccuracy: true, // Alta precisión
                maximumAge: 0, // No queremos caché
                timeout: 5000 // Esperar solo 5 segundos
            }

            navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud)
        }

        function ubicacionCoordenadaElemento() {
            obtenerUbicacion((ubicacion) => {
                tendido.coordenada_del_elemento_latitud = ubicacion.coords.latitude
                tendido.coordenada_del_elemento_longitud = ubicacion.coords.longitude
            })
        }

        function ubicacionCoordenadaAmericano() {
            obtenerUbicacion((ubicacion) => {
                tendido.coordenada_cruce_americano_latitud = ubicacion.coords.latitude
                tendido.coordenada_cruce_americano_longitud = ubicacion.coords.longitude
            })
        }

        function ubicacionCoordenadaPosteAnclaje1() {
            obtenerUbicacion((ubicacion) => {
                tendido.coordenada_poste_anclaje1_latitud = ubicacion.coords.latitude
                tendido.coordenada_poste_anclaje1_longitud = ubicacion.coords.longitude
            })
        }

        function ubicacionCoordenadaPosteAnclaje2() {
            obtenerUbicacion((ubicacion) => {
                tendido.coordenada_poste_anclaje2_latitud = ubicacion.coords.latitude
                tendido.coordenada_poste_anclaje2_longitud = ubicacion.coords.longitude
            })
        }


        const materiales = ref()
        async function obtenerMateriales() {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina) + '2'
            const response: AxiosResponse = await axios.get(ruta)
            console.log(response)
            materiales.value = response.data.results
        }

        obtenerMateriales()

        return {
            tendido,
            tiposElementos,
            propietariosElementos,
            estadoElementos,
            tiposTension,
            v$,
            materiales,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            eliminar,
            botonEditarCantidad,
            obtenerUbicacion,
            ubicacionCoordenadaElemento,
            ubicacionCoordenadaAmericano,
            ubicacionCoordenadaPosteAnclaje1,
            ubicacionCoordenadaPosteAnclaje2,
            //selector
            refListadoSeleccionableProductos,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasProductos,
        }
    }
})