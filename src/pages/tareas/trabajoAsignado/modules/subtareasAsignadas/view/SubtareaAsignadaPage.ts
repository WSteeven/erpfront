// Dependencias
import { Subtarea } from "pages/tareas/subtareas/domain/Subtarea"
import { defineComponent, ref } from "vue"
import { tiposTareasTelconet, provincias, ciudades } from 'config/utils'

// import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTecnico'
import { configuracionColumnasTecnico } from 'pages/tareas/subtareas/domain/configuracionColumnasTecnico'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Tecnico } from "pages/tareas/subtareas/domain/Tecnico"
import { useNotificaciones } from "shared/notificaciones"

export default defineComponent({
    components: { EssentialTable },
    setup() {
        /* const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
        const {listado} = mixin.useReferencias()
        const {listar} = mixin.useComportamiento() */
        const pausado = ref(false)
        const { prompt, confirmar } = useNotificaciones()

        const datos: Tecnico[] = [
            {
                id: 1,
                tecnico: 'LUIS DHDHD',
                contacto: '0897564321',
                grupo: 'MACHALA',
                disponibilidad: true,
                observacion: '',

            },
            {
                id: 2,
                tecnico: 'ROBERTO HGHGGF',
                contacto: '0897564321',
                grupo: 'SANTO DOMINGO',
                disponibilidad: true,
                observacion: '',
            },
            {
                id: 3,
                tecnico: 'CARLA AGUIRRE',
                contacto: '0897564321',
                grupo: 'SANTO DOMINGO',
                disponibilidad: false,
                observacion: '',
            },
        ]

        function suspender() {
            confirmar("¿Está seguro de marcar el trabajo como suspendido?", () => {
                //
            })
        }

        function realizar() {
            confirmar("¿Está seguro de marcar el trabajo como realizado?", () => {
                //
            })
        }

        function pausar() {
            pausado.value = !pausado.value

            if (pausado.value) {
                prompt("Ingrese el motivo de la pausa", () => {
                    //
                })
            }
        }

        return {
            subtarea: new Subtarea(),
            tiposTareasTelconet,
            configuracionColumnasTecnico,
            datos,
            suspender,
            realizar,
            provincias, ciudades,
            pausado,
            pausar,
        }
    }
})