// Dependencias
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/transacciones/modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension } from 'config/utils'
import { defineComponent, onMounted, reactive } from "vue"
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
                prompt(
                    'Ingresa la cantidad',
                    (data) => {
                        tendido.listadoProductosSeleccionados[posicion].cantidades = data
                    },
                    tendido.listadoProductosSeleccionados[posicion].cantidades
                )
            },
        }

        onMounted(() => {
            const materiales = [
                {
                    producto: 'HERRAJE FIBRA ÓPTICA TIPO A / BASE CON DOBLE',
                    stock_inicial: 120,
                    utilizado: 2,
                },
                {
                    producto: 'ABRAZADERA TIPO A 7"',
                    stock_inicial: 250,
                    utilizado: null,
                },
                {
                    producto: 'HERRAJE B CÓNICO',
                    stock_inicial: 120,
                    utilizado: null,
                },
                {
                    producto: 'HERRAJE TIPO A (BASE DE ARGOLLA)',
                    stock_inicial: 250,
                    utilizado: null,
                },
                {
                    producto: 'ABRAZADERA SIMPLE TIPO a',
                    stock_inicial: 120,
                    utilizado: 12,
                },
                {
                    producto: 'HERRAJE DISPERSIÓN',
                    stock_inicial: 250,
                    utilizado: 4,
                },
                {
                    producto: 'BRAZO TIPO A 1.20 MT',
                    stock_inicial: 120,
                    utilizado: null,
                },
                {
                    producto: 'PREFORMADO AMARILLO',
                    stock_inicial: 250,
                    utilizado: 12,
                },
                {
                    producto: 'GUARDACABO',
                    stock_inicial: 82,
                    utilizado: 30,
                }
            ]
            tendido.listadoProductosSeleccionados = [...materiales]
        })

        return {
            tendido,
            tiposElementos,
            propietariosElementos,
            estadoElementos,
            tiposTension,
            v$,
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            eliminar,
            botonEditarCantidad,
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