import { required, requiredIf } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { computed, defineComponent, ref } from 'vue';
import { Auditoria } from '../domain/Auditoria';
import { AuditoriaController } from '../infraestructure/AuditoriaController';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { useQuasar } from 'quasar';
import useVuelidate from '@vuelidate/core';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { obtenerFechaActual } from 'shared/utils';
import { maskFecha } from 'config/utils';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig } from 'config/api';
import { AxiosResponse } from 'axios';

export default defineComponent({
    components: {},
    setup() {
        const mixin = new ContenedorSimpleMixin(Auditoria, new AuditoriaController())
        const { entidad: auditoria, listado, listadosAuxiliares } = mixin.useReferencias()
        const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

        const cargando = new StatusEssentialLoading()
        const checkAuditable = ref(false)
        const modelosAuditables = ref([])
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: { campos: 'id,nombres,apellidos,cargo_id', estado: 1 }
                }
            })
            await obtenerModelosAuditables()
            auditoria.fecha_fin = obtenerFechaActual(maskFecha)
        })

        const reglas = {
            empleado: { requiredIf: requiredIf(checkAuditable.value) },
            fecha_inicio: { requiredIf: requiredIf(checkAuditable.value) },
            fecha_fin: { requiredIf: requiredIf(checkAuditable.value) },
        }
        const v$ = useVuelidate(reglas, auditoria)
        /***************************
         * Funciones
         ***************************/
        async function consultar() {
            if (await v$.value.$validate()) {
                try {
                    cargando.activar()
                    await listar(auditoria)
                } catch (error) {
                    console.log(error)
                } finally {
                    cargando.desactivar()
                }
            }
        }

        async function obtenerModelosAuditables() {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + 'api/modelos-auditorias'
            const response: AxiosResponse = await axios.get(url)
            listadosAuxiliares.modelosAuditables = response.data.results
            modelosAuditables.value = listadosAuxiliares.modelosAuditables
            console.log(response)
            cargando.desactivar()
        }

        async function filtrarModelosAuditables(val, update) {
            if (val === '') {
                update(() => modelosAuditables.value = listadosAuxiliares.modelosAuditables)
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                modelosAuditables.value = listadosAuxiliares.modelosAuditables.filter((item) => item.toLowerCase().indexOf(needle) > -1)
            })
        }

        const { empleados, filtrarEmpleados, ordenarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
        return {
            mixin, listado, v$,
            maskFecha,
            auditoria,
            checkAuditable,
            //listados
            empleados, filtrarEmpleados, ordenarEmpleados,
            modelosAuditables, filtrarModelosAuditables,

            // functiones
            consultar,

        }
    }
})