// Dependencias
import { configuracionColumnasCentroCostos } from '../domain/configuracionColumnasCentroCostos'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CentroCosto } from '../domain/CentroCostos'
import { CentroCostoController } from '../infraestructure/CentroCostosController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { title } from 'process'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CambiarEstadoCentroCosto } from '../application/CambiarEstadoCentroCosto'

//Logica y controladores


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(CentroCosto, new CentroCostoController())
        const { entidad: centro, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                clientes: {
                    controller: new ClienteController(),
                    params: { campos: 'id,empresa_id', estado: 1 }
                }
            })
            clientes.value = listadosAuxiliares.clientes
        })


        const reglas = {
            nombre: { required },
        }

        const v$ = useVuelidate(reglas, centro)
        setValidador(v$.value)

        const btnDesactivarCentroCosto: CustomActionTable = {
            titulo: 'Desactivar',
            icono: 'bi-toggle2-off',
            color: 'negative',
            tooltip: 'Desactivar',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de desactivar este centro de costos?', async () => {
                    try {
                        const { result } = await new CambiarEstadoCentroCosto().anular(entidad.id)
                        console.log(result)
                        notificarCorrecto('Desactivado correctamente')
                    } catch (error: any) {
                        notificarError('No se pudo desactivar el proveedor!')
                    }
                })
            }, visible: ({ entidad }) => entidad.activo
        }

        const btnActivarCentroCosto: CustomActionTable = {
            titulo: 'Activar',
            icono: 'bi-toggle2-on',
            color: 'positive',
            tooltip: 'Desactivar',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de desactivar este centro de costos?', async () => {
                    try {
                        const { result } = await new CambiarEstadoCentroCosto().anular(entidad.id)
                        console.log(result)
                        notificarCorrecto('Desactivado correctamente')
                    } catch (error: any) {
                        notificarError('No se pudo desactivar el proveedor!')
                    }
                })
            }, visible: ({ entidad }) => !entidad.activo
        }

        return {
            v$, mixin, centro, disabled,
            configuracionColumnas: configuracionColumnasCentroCostos,

            clientes, filtrarClientes,
            btnDesactivarCentroCosto,
            btnActivarCentroCosto,

        }

    }
})