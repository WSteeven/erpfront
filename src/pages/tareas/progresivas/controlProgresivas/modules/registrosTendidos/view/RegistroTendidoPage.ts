// Dependencias
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos } from 'config/utils'
import { required } from '@vuelidate/validators'
import { defineComponent, reactive } from "vue"
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/transacciones/modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

// Logica y controladores
import { RegistroTendido } from "../domain/RegistrosTendido"
import { useOrquestadorSelectorDetalles } from "../application/OrquestadorSelectorDetalles"
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
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
            name: 'cantidades',
            field: 'cantidades',
            label: 'Cantidades',
            align: 'left',
            sortable: false,
        },
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'center'
        },
        ]

        const { confirmar, prompt } = useNotificaciones()

        function eliminar({ entidad, posicion }) {
            confirmar('¿Esta seguro de continuar?',
                () =>
                    tendido.listadoProductosSeleccionados.splice(posicion, 1))
        }

        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
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

        return {
            tendido,
            tiposElementos,
            propietariosElementos,
            estadoElementos,
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