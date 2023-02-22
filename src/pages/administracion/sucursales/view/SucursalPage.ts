// Dependencias
import { configuracionColumnasSucursales } from '../domain/configuracionColumnasSucursales'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SucursalController } from '../infraestructure/SucursalController'
import { Sucursal } from '../domain/Sucursal'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Sucursal, new SucursalController())
        const { entidad: sucursal, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

        const store = useAuthenticationStore()

        const opciones_empleados = ref([])
        cargarVista(async () => {
            obtenerListados({
                usuarios: await store.listadoUsuarios()
            })
            opciones_empleados.value = listadosAuxiliares.usuarios
        })


        //Reglas de validacion
        const reglas = {
            lugar: { required },
            telefono: { required },
            correo: { required },
        }

        const v$ = useVuelidate(reglas, sucursal)
        setValidador(v$.value)


        return {
            mixin, sucursal, v$, disabled,
            configuracionColumnas: configuracionColumnasSucursales,

            //listados
            opciones_empleados,

            //Filtros
            filtroEmpleados(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.value = listadosAuxiliares.usuarios
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.value = listadosAuxiliares.usuarios.filter((v) => (v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1))
                })
            }
        }
    }
})