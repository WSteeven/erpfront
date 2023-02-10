import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useSelector } from 'components/tables/application/selector'
import { Categoria } from 'pages/bodega/categorias/domain/Categoria'
import { Producto } from '../domain/Producto'
import { endpoints } from 'config/api'
import { Ref, ref } from 'vue'

export function useOrquestadorSelectorCategorias(
    entidad: Producto,
    endpoint: keyof typeof endpoints
) {
    const refListadoSeleccionable = ref() // referencia para llamar a los metodos del listado
    const listado: Ref<EntidadAuditable[]> = ref([]) //listado con resultados de búsqueda
    const criterioBusqueda = ref()

    const singleSelector = {
        refListadoSeleccionable: refListadoSeleccionable,
        listadoSeleccionable: listado,
        endpoint: endpoint,
        limpiar: () => {
            entidad.categoria = null
            criterioBusqueda.value = null
        },
        seleccionar: (categoria: Categoria) => {
            entidad.categoria = categoria.id
            criterioBusqueda.value = categoria.nombre
        },
    }

    const selector = useSelector(singleSelector)

    const listar = () => selector.listar(criterioBusqueda.value)

    const limpiar = () => singleSelector.limpiar()

    const seleccionar = (id: number) => selector.seleccionar(id)

    return {
        refListadoSeleccionable,
        listado,
        listar,
        limpiar,
        seleccionar,
        criterioBusqueda
    }
}