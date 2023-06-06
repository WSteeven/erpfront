import { Ref, ref } from "vue";

export const useFiltrosListadosSelects = (listadosAuxiliares, entidad?: Ref<any>) => {
    //variables
    const paises = ref([])
    function filtrarPaises(val, update) {
        if (val === '') {
            update(() => paises.value = listadosAuxiliares.paises)
            return
        }
        update(() => {
            const needle = val.toLowerCase()
            paises.value = listadosAuxiliares.paises.filter((v) => v.pais.toLowerCase().indexOf(needle) > -1)
        })
    }

    const provincias = ref([])
    function filtrarProvincias(val, update) {
        if (val === '') {
            update(() => provincias.value = listadosAuxiliares.provincias)
            return
        }
        update(() => {
            const needle = val.toLowerCase()
            if (listadosAuxiliares.provincias) provincias.value = listadosAuxiliares.provincias.filter((v) => v.provincia.toLowerCase().indexOf(needle) > -1)
        })
    }
    const cantones = ref([])
    function filtrarCantones(val, update) {
        if (val === '') update(() => cantones.value = listadosAuxiliares.cantones)

        update(() => {
            const needle = val.toLowerCase()
            if (listadosAuxiliares.cantones) cantones.value = listadosAuxiliares.cantones.filter(
                (v) => v.canton.toLowerCase().indexOf(needle) > -1
            )
        })
    }
    const parroquias = ref([])
    function filtrarParroquias(val, update) {
        if (val === '') update(() => parroquias.value = listadosAuxiliares.parroquias)

        update(() => {
            const needle = val.toLowerCase()
            if (listadosAuxiliares.parroquias) parroquias.value = listadosAuxiliares.parroquias.filter(
                (v) => v.parroquia.toLowerCase().indexOf(needle) > -1
            )
        })
    }
    return {
        paises, filtrarPaises,
        provincias, filtrarProvincias,
        cantones, filtrarCantones,
        parroquias, filtrarParroquias,

    }
}