//Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { maxLength, minLength, numeric, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { opcionesEstados } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import { useNotificacionStore } from 'stores/notificacion'
import { Empleado } from '../domain/Empleado'
import { useQuasar } from 'quasar'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'

export default defineComponent({
    components: { TabLayout, SelectorImagen },
    setup() {
        /*********
        * Stores
        *********/
        useNotificacionStore().setQuasar(useQuasar())

        /***********
        * Mixin
        ************/
        const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
        const { entidad: empleado, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado, onBeforeModificar } = mixin.useHooks()

        const opciones_cantones = ref([])
        const opciones_roles = ref([])
        const opciones_cargos = ref([])
        const opciones_empleados = ref([])
        cargarVista(async () => {
            obtenerListados({
                cantones: new CantonController(),
                cargos: new CargoController(),
                roles: {
                    controller: new RolController(),
                    params: { campos: 'id,name' }
                },
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                grupos: new GrupoController(),
            })
        })

        /*************
        * Validaciones
        **************/
        const reglas = {
            identificacion: {
                required,
                minlength: minLength(10),
                maxlength: maxLength(10),
            },
            telefono: {
                required,
                numeric,
                minlength: minLength(10),
                maxlength: maxLength(10)
            },
            nombres: { required },
            apellidos: { required },
            jefe: { required },
            email: { required },
            usuario: { required },
            fecha_nacimiento: { required },
            cargo: { required },
            roles: { required },
            estado: { required },
            grupo: { required: requiredIf(() => empleado.tiene_grupo) },
        }

        const v$ = useVuelidate(reglas, empleado)
        setValidador(v$.value)

        opciones_cantones.value = listadosAuxiliares.cantones
        opciones_roles.value = listadosAuxiliares.roles
        opciones_cargos.value = listadosAuxiliares.cargos
        opciones_empleados.value = listadosAuxiliares.empleados

        onBeforeModificar(() => {
            if (!empleado.tiene_grupo) empleado.grupo = null
        })

        onConsultado(() => empleado.tiene_grupo = !!empleado.grupo)

        return {
            mixin, empleado, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasEmpleados,
            isPwd: ref(true),
            listadosAuxiliares,
            //listado
            opciones_cantones,
            opciones_roles,
            opciones_cargos,
            opciones_empleados,
            opcionesEstados,

            //  FILTROS
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
            },
            //filtro de cantones
            filtroCantones(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_cantones.value = listadosAuxiliares.cantones
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_cantones.value = listadosAuxiliares.cantones.filter((v) => v.canton.toLowerCase().indexOf(needle) > -1)
                })
            },
            //filtro de cargos
            filtroCargos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_cargos.value = listadosAuxiliares.cargos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_cargos.value = listadosAuxiliares.cargos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            }

        }
    }
})
