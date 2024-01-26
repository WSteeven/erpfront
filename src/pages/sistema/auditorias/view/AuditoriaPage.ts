import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { computed, defineComponent } from "vue";
import { Auditoria } from "../domain/Auditoria";
import { AuditoriaController } from "../infraestructure/AuditoriaController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { useQuasar } from "quasar";
import useVuelidate from '@vuelidate/core';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { obtenerFechaActual } from 'shared/utils';

export default defineComponent({
    components: {},
    setup() {
        const mixin = new ContenedorSimpleMixin(Auditoria, new AuditoriaController())
        const { entidad: auditoria, listado, listadosAuxiliares, } = mixin.useReferencias()
        const { listar, cargarVista, obtenerListados } = mixin.useComportamiento()

        const cargando = new StatusEssentialLoading()

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: { campos: 'id,nombres,apellidos,cargo_id', estado: 1 }
                }
            })
            auditoria.fecha_fin=obtenerFechaActual()
        })

        const reglas = {
            empleado: { required },
            fecha_inicio: { required },
            fecha_fin: { required },
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

        const { empleados, filtrarEmpleados, ordenarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
        return {
            mixin, listado, v$,
            auditoria,
            //listados
            empleados, filtrarEmpleados, ordenarEmpleados,

            // functiones
            consultar,

        }
    }
})