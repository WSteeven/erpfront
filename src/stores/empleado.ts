import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useEmpleadoStore = defineStore('empleadoStore', () => {
    const idEmpleado = ref()
    const infoEmpleado = ref(false)
    const empleado = reactive(new Empleado())
    async function getEmpleado() {
        const { result } = await new EmpleadoController().listar({ id: idEmpleado.value })
        empleado.hydrate(result[0])
    }

    async function cargarEmpleado() {
        await getEmpleado()
    }
    return {
        empleado,
        idEmpleado,
        infoEmpleado,
        cargarEmpleado
    }
})
