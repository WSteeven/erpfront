import { defineComponent, ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { configuracionColumnasOrganigrama } from '../domain/configuracionColumnasOrganigrama';

import { OrganigramaController } from '../infraestructure/OrganigramaController';
import { Organigrama } from '../domain/Organigrama';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { tabOptionsOrganigrama } from 'config/utils';

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Organigrama,
      new OrganigramaController()
    );
    const {
      entidad: organigrama,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias();
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento();
    const { onReestablecer } = mixin.useHooks();

    const empleados = ref<{ id: number; nombre: string; nombre_cargo: string }[]>([]);
    const tipos = ref<string[]>(['interno', 'externo']);
    const departamentos = ref<string>('');

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            //activo: 1
          }
        }
      });
      empleados.value = listadosAuxiliares.empleados;

      console.log('Empleados cargados:', empleados.value);
    });

    onReestablecer(() => {
      organigrama.empleado_id = null;
      organigrama.cargo = '';
    });

    watch(
      () => organigrama.empleado_id,
      nuevoEmpleadoId => {
        const empleadoSeleccionado = empleados.value.find(
          emp => emp.id === nuevoEmpleadoId
        );

        console.log('Empleado seleccionado:', empleadoSeleccionado);

        if (empleadoSeleccionado) {
          organigrama.cargo = empleadoSeleccionado.nombre_cargo || ''; // Asignar el nombre_cargo directamente
          console.log('Cargo asignado:', organigrama.cargo);
        } else {
          organigrama.cargo = ''; // Reiniciar el campo cargo si no hay empleado seleccionado
        }
      }
    );

    const reglas = computed(() => ({
      empleado_id: { required },
      cargo: { required },
      tipo: { required },
      departamento: { required },
      nivel: { required },
      jefe_id: { required: false } // Hacer opcional
    }));

    const v$ = useVuelidate(reglas, organigrama);
    setValidador(v$.value);

    function filtrarOrganigrama(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false);
    }

    return {
      mixin,
      disabled,
      organigrama,
      configuracionColumnas: configuracionColumnasOrganigrama,
      tabOptionsOrganigrama,
      v$,
      accion,
      filtrarOrganigrama,
      empleados,
      tipos,
      departamentos
    };
  }
});
