//Dependencias
import { configuracionColumnasEmpleados } from "../domain/configuracionColumnasEmpleados";
import { maxLength, minLength, numeric, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'


//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Empleado } from "../domain/Empleado";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { EmpleadoController } from "../infraestructure/EmpleadoController";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { RolController } from "pages/administracion/roles/infraestructure/RolController";

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
        const { entidad: empleado, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

        cargarVista(() => {
            obtenerListados({
                sucursales: new SucursalController(),
                roles: new RolController(),
                empleados: new EmpleadoController(),
            })
        })

        //reglas de validacion
        const reglas = {
            identificacion: {
                required,
                minlength: minLength(10),
                maxlength: maxLength(10)
            },
            telefono: {
                required,
                numeric,
                minlength: minLength(10),
                maxlength: maxLength(10)
            },
            nombres: { required },
            apellidos: { required },
            sucursal: { required },
            jefe: { required },
            email: { required },
            password: { required },
            fecha_nacimiento: { required },
            roles: { required },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, empleado)
        setValidador(v$.value)

        const opciones_sucursales = listadosAuxiliares.sucursales
        const opciones_roles = listadosAuxiliares.roles
        const opciones_empleados = listadosAuxiliares.empleados
        opciones_empleados.empleados = listadosAuxiliares.empleados
        return {
            mixin, empleado, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasEmpleados,
            //listado 
            opciones_sucursales,
            opciones_roles,
            opciones_empleados,

            //filtro de empleados
            filterJefe(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.empleados = listadosAuxiliares.empleados
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.empleados = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 ||v.apellidos.toLowerCase().indexOf(needle)>-1)
                })
            }

        }
    }
})