//Dependencias
import { configuracionColumnasEtapa } from 'pages/gestionTrabajos/proyectos/modules/etapas/domain/configuracionColumnasEtapas';
import { defineComponent } from 'vue';


//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { EtapaController } from '../infraestructure/EtapaController';
import { Etapa } from '../domain/Etapa';
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController';
import { rolesSistema } from 'config/utils';
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';


export default defineComponent({
  components: { TabLayout, EssentialTable },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Etapa, new EtapaController())
    const { entidad: etapa, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoRoleController(),
          params: { roles: [rolesSistema.coordinador, rolesSistema.supervisor] }
        },
        proyectos: { controller: new ProyectoController(), params: { finalizado: 0 } }
      })
      empleados.value = listadosAuxiliares.empleados
      proyectos.value = listadosAuxiliares.proyectos
    })

    const reglas = {
      nombre: { required },
      proyecto: { required },
      responsable: { required },
    }
    const v$ = useVuelidate(reglas, etapa)

    /********
     * Hooks
     ********/
    onGuardado(() => {
      emit('cerrar-modal', false)
      emit('guardado', 'Etapa')
    })

    /***************************
     * Funciones
     ***************************/
    function actualizarResponsable() {
      const proyectoSeleccionado = proyectos.value.filter((v) => v.id === etapa.proyecto)
      etapa.responsable = proyectoSeleccionado[0].coordinador_id ? proyectoSeleccionado[0].coordinador_id : null
    }

    const { empleados, filtrarEmpleados, ordenarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
    const { proyectos, filtrarProyectos } = useFiltrosListadosTarea(listadosAuxiliares)

    return {
      mixin, etapa, disabled, accion, v$,
      configuracionColumnas: configuracionColumnasEtapa,

      //funciones
      actualizarResponsable,


      //listados
      empleados, filtrarEmpleados, ordenarEmpleados,
      proyectos, filtrarProyectos,

    }
  }
})
