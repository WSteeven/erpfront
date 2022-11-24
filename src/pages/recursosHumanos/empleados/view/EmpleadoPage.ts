//Dependencias
import { configuracionColumnasEmpleados } from "../domain/configuracionColumnasEmpleados";
import { maxLength, minLength, numeric, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

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

        const opciones_sucursales = ref([])
        const opciones_roles = ref([])
        const opciones_empleados = ref([])
        cargarVista(() => {
            obtenerListados({
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
                roles: {
                    controller:new RolController(),
                    params: {campos:'id,name'}
                },
                empleados: {
                    controller:new EmpleadoController(),
                    params: {
                        campos:'id,nombres,apellidos',
                        estado:1
                    }
                },
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
            usuario: { required },
            fecha_nacimiento: { required },
            roles: { required },
            estado: { required },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, empleado)
        setValidador(v$.value)

        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_roles.value = listadosAuxiliares.roles
        opciones_empleados.value = listadosAuxiliares.empleados
        const opciones_estados = [
            { value: 1, label: 'ACTIVO' },
            { value: 0, label: 'INACTIVO' }
        ]
        return {
            mixin, empleado, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasEmpleados,
            isPwd: ref(true),
            //listado 
            opciones_sucursales,
            opciones_roles,
            opciones_empleados,
            opciones_estados,

            //filtro de empleados
            filtroEmpleados(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.value = listadosAuxiliares.empleados
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
                })
            }

        }
    }
})