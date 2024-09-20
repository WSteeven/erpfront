import useVuelidate from '@vuelidate/core';
import { AxiosResponse } from 'axios';
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue';

import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { apiConfig, endpoints } from 'config/api';


import { acciones } from 'config/utils';
import { MaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/MaterialEmpleadoTarea';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { required, maxValue, minValue } from 'shared/i18n-validators';
import { useNotificaciones } from 'shared/notificaciones';
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController';
import { useTransferenciaProductoEmpleadoStore } from 'stores/transferenciaProductoEmpleado';
import { defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
    components: { ButtonSubmits },
    setup(props, { emit }) {

        const registro = reactive(new MaterialEmpleadoTarea())
        const tipo = ref()
        const empleado = ref()
        const resultClientes = ref()
        const clientes = ref()
        const transferenciaProductoEmpleadoStore = useTransferenciaProductoEmpleadoStore()
        const cargando = new StatusEssentialLoading()
        const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        //validaciones
        const reglas = {
            stock_actual: {
                required: required,
                minValue: minValue(1),
                maxValue: maxValue(transferenciaProductoEmpleadoStore.filaAModificar.stock_actual),
            },
            cliente: { required }
        }
        const v$ = useVuelidate(reglas, registro)

        async function consultarClientes() {
            resultClientes.value = (await new ClienteController().listar({ campos: 'id,razon_social', requiere_bodega: 1, estado: 1 })).result
            clientes.value = resultClientes.value
        }

        cargando.cargarConsulta(consultarClientes)


        onMounted(() => {
            registro.id = transferenciaProductoEmpleadoStore.filaAModificar.id
            registro.producto = transferenciaProductoEmpleadoStore.filaAModificar.producto
            registro.detalle_producto = transferenciaProductoEmpleadoStore.filaAModificar.detalle_producto
            registro.detalle_producto_id = transferenciaProductoEmpleadoStore.filaAModificar.detalle_producto_id
            registro.categoria = transferenciaProductoEmpleadoStore.filaAModificar.categoria
            registro.stock_actual = transferenciaProductoEmpleadoStore.filaAModificar.stock_actual
            registro.medida = transferenciaProductoEmpleadoStore.filaAModificar.medida
            registro.serial = transferenciaProductoEmpleadoStore.filaAModificar.serial
            registro.cliente = transferenciaProductoEmpleadoStore.filaAModificar.cliente_id
            registro.cliente_id = transferenciaProductoEmpleadoStore.filaAModificar.cliente_id
            tipo.value = transferenciaProductoEmpleadoStore.filaAModificar.tipo
            empleado.value = transferenciaProductoEmpleadoStore.filaAModificar.empleado
        })

        async function actualizarRegistroMaterialEmpleado() {
            try {
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.actualizar_materiales_empleados)
                const response: AxiosResponse = await axios.post(url, { registro: registro, registroOld: transferenciaProductoEmpleadoStore.filaAModificar, tipo: tipo.value, empleado: empleado.value })
                console.log(response)
                if (response.status = 200) {
                    notificarCorrecto(response.data.mensaje)
                    return true
                } else notificarAdvertencia(response.data.mensaje)
            } catch (error) {
                notificarError('Error al marcar como pagada la matrícula. ' + error)
            }
        }

        function reestablecer() {
            registro.hydrate(new MaterialEmpleadoTarea())
        }
        async function guardar() {
            if (await v$.value.$validate()) {
                console.log('Paso la validacion, toca guardar', registro)
                //Aquí se realiza la modificación
                cargando.cargarConsulta(actualizarRegistroMaterialEmpleado)
                emit('cerrar-modal', false)
                emit('guardado', { formulario: 'CambiarClientePropietarioMaterialPage', tipo: tipo.value })
            }
            console.log('Diste clic en guardar')
            //se guarda el registro, se cierra el modal
        }
        return {
            registro, v$,
            reestablecer, guardar,
            clientes,
            cargando,
            acciones,
            valor: ref()
        }
    }

})
