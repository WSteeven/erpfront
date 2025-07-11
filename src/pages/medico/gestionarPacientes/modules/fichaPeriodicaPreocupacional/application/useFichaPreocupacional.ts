import {
    configuracionColumnasAntecedenteTrabajoAnterior
} from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/configuracionColumnasAntecedenteTrabajoAnterior';
import {TipoFactorRiesgo} from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/TipoFactorRiesgo';
import {
    configuracionColumnasFrPuestoTrabajoActual
} from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/configuracionColumnasFrPuestoTrabajoActual';
import {
    CategoriaFactorRiesgo
} from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/CategoriaFactorRiesgo';
import {ref} from 'vue';

export function useFichaPreocupacional(medicoStore, listadosAuxiliares) {

    const mostrarTablaAntecedenteTrabajoAnteriorReactive = ref(false)
    const mostrarTablaFrPuestoTrabajoActualReactive = ref(false)
    const configuracionColumnasFrPuestoTrabajoActualReactive = ref(
        configuracionColumnasFrPuestoTrabajoActual
    )
    const configuracionColumnasAntecedenteTrabajoAnteriorReactive = ref(
        configuracionColumnasAntecedenteTrabajoAnterior
    )

    const configurarColumnasAntecedenteTrabajoAnterior = async () => {
        configuracionColumnasAntecedenteTrabajoAnteriorReactive.value = [
            ...configuracionColumnasAntecedenteTrabajoAnterior
        ]

        // console.log(listadosAuxiliares.tiposFactoresRiesgos)
        await listadosAuxiliares.tiposFactoresRiesgos.forEach(
            (tipo: TipoFactorRiesgo) => {
                configuracionColumnasAntecedenteTrabajoAnteriorReactive.value.push({
                    name: tipo.id + '' ?? '',
                    field: tipo.id + '' ?? '',
                    label: !!tipo.nombre ? 'R.' + tipo.nombre : '',
                    align: 'left',
                    type: 'boolean',
                    editable: true
                })
            }
        )

        // console.log(configuracionColumnasAntecedenteTrabajoAnteriorReactive.value)
        mostrarTablaAntecedenteTrabajoAnteriorReactive.value = true
    }

    const configurarColumnasFrPuestoTrabajoActual = async () => {
        // Columnas
        configuracionColumnasFrPuestoTrabajoActualReactive.value = [
            ...configuracionColumnasFrPuestoTrabajoActual
        ]

        await listadosAuxiliares.tiposFactoresRiesgos.forEach(
            (tipo: TipoFactorRiesgo) => {
                configuracionColumnasFrPuestoTrabajoActualReactive.value.push({
                    name: tipo.nombre ?? '',
                    field: tipo.nombre ?? '',
                    label: tipo.nombre ?? '',
                    align: 'left',
                    sortable: true,
                    type: 'select_multiple',
                    editable: true,
                    options: listadosAuxiliares.categoriasFactoresRiesgos
                        .filter(
                            (categoria: CategoriaFactorRiesgo) =>
                                categoria.tipo_factor_riesgo === tipo.id
                        )
                        .map((categoria: CategoriaFactorRiesgo) => {
                            return {
                                label: categoria.nombre,
                                value: categoria.id
                            }
                        })
                })
            }
        )

        mostrarTablaFrPuestoTrabajoActualReactive.value = true
    }

    return {
        mostrarTablaAntecedenteTrabajoAnteriorReactive,mostrarTablaFrPuestoTrabajoActualReactive,
        configuracionColumnasFrPuestoTrabajoActualReactive,
        configuracionColumnasAntecedenteTrabajoAnteriorReactive,
        configurarColumnasAntecedenteTrabajoAnterior,
        configurarColumnasFrPuestoTrabajoActual,

    }
}