import { useAuthenticationStore } from './authentication'
import { MenuOption } from 'src/shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'
import seleccionContratacionPersonal from './menus/rrhh/seleccionContratacionPersonal'
import trabajoSocial from 'stores/menus/rrhh/trabajoSocial'
import controlPersonal from 'stores/menus/rrhh/controlPersonal'
import vehiculos from './menus/vehiculos/vehiculos'
import menuSeguridad from './menus/seguridad/menuSeguridad'
import comprasProveedores from 'stores/menus/comprasProveedores/comprasProveedores';
import ventasClaro from 'stores/menus/claro/ventasClaro';
import telconet from 'stores/menus/appenate/telconet';
import menuBodega from 'stores/menus/bodega/menuBodega';
import menuFondosRotativos from 'stores/menus/fondosRotativos/menuFondosRotativos';
import menuConecel from 'stores/menus/claro/menuConecel';

export const useMenuStore = defineStore('menu', () => {
  const store = useAuthenticationStore()

  // State
  const links: Ref<MenuOption[]> = computed(() => [
    {
      header: 'Modulos'
    },
    {
      title: 'Inicio',
      icon: 'bi-house-door',
      link: '/',
      can: true //!store.can('puede.acceder.trabajo_asignado'),
    },
    {
      title: 'Trabajo agendado',
      link: 'trabajo-agendado',
      icon: 'bi-list-ol',
      can: true //store.esTecnicoLider,// store.can('puede.acceder.trabajo_asignado'),
    },
    {
      title: 'Notificaciones',
      icon: 'bi-bell',
      link: 'notificaciones',
      can: true
    },
    /*******************
     * Modulo de tareas
     *******************/
    {
      title: 'Proyectos y tareas',
      icon: 'bi-clipboard',
      can: store.can('puede.acceder.modulo_tareas'),
      module: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-tareas',
          icon: 'bi-bar-chart',
          can: store.can('puede.acceder.dashboard_tareas')
        },
        {
          title: 'Monitor',
          link: 'monitor-subtareas',
          icon: 'bi-eye',
          can: store.can('puede.acceder.monitor_subtareas')
        },
        {
          title: 'Proyectos',
          link: 'proyectos',
          icon: 'bi-folder',
          can: store.can('puede.acceder.proyectos')
        },
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-check2-circle',
          can: store.can('puede.acceder.tareas')
        },
        {
          title: 'Alimentación grupos',
          link: 'alimentacion-grupo',
          icon: 'bi-check2-circle',
          can: store.can('puede.acceder.alimentacion_grupo')
        },
        {
          title: 'Movilización entre trabajos',
          link: 'reporte-movilizacion-subtarea',
          icon: 'bi-truck',
          can: store.can('puede.acceder.reporte_movilizacion_subtarea')
        },
        {
          title: 'Clientes finales',
          link: 'clientes-finales',
          icon: 'bi-people',
          can: store.can('puede.acceder.clientes_finales')
        },
        ...telconet.value,
        {
          title: 'Centro de Costos',
          icon: 'bi-wallet2',
          can: store.can('puede.acceder.centros_costos'),
          children: [
            {
              title: 'Centro de Costos',
              link: 'centros-costos',
              icon: 'bi-piggy-bank',
              can: store.can('puede.acceder.centros_costos')
            },
            {
              title: 'Subcentro de Costos',
              link: 'subcentros-costos',
              icon: 'bi-piggy-bank',
              can: store.can('puede.acceder.subcentros_costos')
            }
          ]
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          can: store.can('puede.acceder.configuracion_modulo_tareas'),
          children: [
            {
              title: 'Nodos',
              link: 'nodos',
              icon: 'bi-plus-circle',
              can: store.can('puede.acceder.nodos')
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can: store.can('puede.acceder.reportes_modulo_tareas'),
          children: [
            {
              title: 'Reportes materiales utilizados',
              link: 'reportes-materiales-utilizados',
              icon: 'bi-journal-check',
              can: store.can('puede.acceder.reportes_materiales_utilizados')
            },
            {
              title: 'Reportes tareas finalizadas',
              link: 'reportes-modulo-tareas',
              icon: 'bi-clipboard-check',
              can: store.can('puede.acceder.reportes_modulo_tareas')
            },{
              title: 'Reporte de Asistencia de Técnicos',
              link: 'reporte-asistencia-tecnicos',
              icon: 'bi-clipboard-check',
              // can: store.can('puede.acceder.reporte_asistencia_tecnicos')
              can: true
            }
          ]
        }
      ]
    },
    /********************
     * Modulo de conecel
     ********************/
      // ...menuConecel.value,
    /********************
     * Modulo de tickets
     ********************/
    {
      title: 'Tickets',
      icon: 'bi-tags',
      can: store.can('puede.acceder.modulo_tickets'),
      module: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-tickets',
          icon: 'bi-bar-chart',
          can: store.can('puede.acceder.dashboard_tickets')
        },
        {
          title: 'Crear ticket',
          link: 'tickets',
          icon: 'bi-plus-circle',
          can: store.can('puede.acceder.tickets')
        },
        {
          title: 'Tickets asignados para mi',
          link: 'tickets-asignados',
          icon: 'bi-person-check',
          can: store.can('puede.acceder.tickets_asignados')
        },
        {
          title: 'Categorías tipos de tickets',
          link: 'categorias-tipos-tickets',
          icon: 'bi-tag',
          can:
            store.can('puede.acceder.categorias_tipos_tickets') ||
            store.user.es_responsable_departamento
        },
        {
          title: 'Tipos de tickets',
          link: 'tipos-tickets',
          icon: 'bi-tags',
          can:
            store.can('puede.acceder.tipos_tickets') ||
            store.user.es_responsable_departamento
        },
        {
          title: 'Motivos de pausas',
          link: 'motivos-pausas-tickets',
          icon: 'bi-pause',
          can: store.can('puede.acceder.motivos_pausas_tickets')
        },
        {
          title: 'Motivos de cancelaciones',
          link: 'motivos-cancelados-tickets',
          icon: 'bi-x-circle',
          can: store.can('puede.acceder.motivos_cancelados_tickets')
        }
      ]
    },

    /*****************************************************************************
     * MÓDULO DE BODEGA.
     * Toda la estructura de pedidos, devoluciones y despachos de materiales
     *****************************************************************************/
      ...menuBodega.value,

    // Modulo Fondos Rotativos
      ...menuFondosRotativos.value,

    //Modulo Recursos Humanos
    {
      title: 'RR HH',
      icon: 'bi-people',
      can: store.can('puede.acceder.modulo_recursos_humanos'),
      module: true,
      children: [
        {
          title: 'Empleados',
          link: 'empleados',
          icon: 'bi-person-badge',
          can: store.can('puede.acceder.empleados')
        },
        {
          title: 'Cargos',
          link: 'cargos',
          icon: 'bi-person-badge',
          can: store.can('puede.acceder.cargos')
        },
        {
          title: 'Departamentos',
          link: 'departamentos',
          icon: 'bi-diagram-3',
          can: store.can('puede.acceder.departamentos')
        },
        {
          title: 'Grupos técnicos',
          link: 'grupos',
          icon: 'bi-people',
          can: store.can('puede.acceder.grupos')
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          can: store.can('puede.acceder.configuracion_modulo_rrhh'),
          children: [
            {
              title: 'Tipos de licencias',
              link: 'tipos-licencias',
              icon: 'bi-box',
              can: store.can('puede.acceder.tipos_licencias')
            },
            {
              title: 'Bancos',
              link: 'bancos',
              icon: 'bi-bank',
              can: store.can('puede.acceder.bancos') || store.esAdministrador
            },
          ]
        },
      ]
    },

    /*****************************************
     * MODULO DE INTRANET
     *****************************************/


    /*****************************************
     * MODULO DE VEHICULOS
     *****************************************/
    // ...vehiculos.value,

    /*********************************************************
     * Modulo de compras y proveedores
     *********************************************************/
    // ...comprasProveedores.value,

    /*********************************************************
     * Modulo de Administración
     *********************************************************/
    {
      header: 'Administración',
      can: false // store.can('puede.acceder.modulo_administracion') && store.esActivosFijos,
    },
    {
      title: 'Log de auditorías',
      link: 'auditorias',
      icon: 'bi-journal-check',
      can: store.can('puede.acceder.auditorias') // || store.esAdministrador,
    },
    {
      title: 'Configuracion Sistema',
      icon: 'bi-gear',
      children: [
        {
          title: 'Configuracion General',
          link: 'configuracion',
          icon: 'bi-gear-wide-connected',
          can:
              store.can('puede.acceder.configuracion_general') ||
              store.esAdministrador
        },
        // {
        //   title: 'Plantillas Base',
        //   link: 'plantillas-base',
        //   icon: 'bi-card-list',
        //   can: store.can('puede.acceder.plantillas_base')
        // },
        // {
        //   title: 'Plantillas Capacitaciones',
        //   link: 'plantillas-capacitaciones',
        //   icon: 'bi-card-list',
        //   can: store.can('puede.acceder.plantillas_capacitaciones')
        // }
      ]
    },
    {
      title: 'Geografía General',
      icon: 'bi-globe-americas',
      can: store.esAdministrador,
      children: [
        {
          title: 'Provincias',
          link: 'provincias',
          icon: 'bi-map',
          can: store.can('puede.acceder.provincias')
        },
        {
          title: 'Cantones',
          link: 'cantones',
          icon: 'bi-map',
          can: store.can('puede.acceder.cantones')
        },
        {
          title: 'Parroquias',
          link: 'parroquias',
          icon: 'bi-map',
          can: store.can('puede.acceder.parroquias')
        }
      ]
    },
    {
      title: 'Proyectos y tareas',
      icon: 'fa-solid fa-tasks',
      can: store.esJefeTecnico || store.esAdministrador,
      children: [
        {
          title: 'Tipos de trabajos',
          link: 'tipos-trabajos',
          icon: 'bi-list-check',
          can: store.can('puede.acceder.tipos_trabajos')
        },
        {
          title: 'Causas intervenciones',
          link: 'causas-intervenciones',
          icon: 'bi-flag',
          can: store.can('puede.acceder.causas_intervenciones')
        },
        {
          title: 'Motivos de trabajo pausado',
          link: 'motivos-pausas',
          icon: 'bi-pause-circle',
          can: store.can('puede.acceder.motivos_pausas')
        },
        {
          title: 'Motivos de trabajo suspendido',
          link: 'motivos-suspendidos',
          icon: 'bi-x-circle',
          can: store.can('puede.acceder.motivos_suspendidos')
        },
        {
          title: 'Rutas para tareas',
          link: 'rutas-tareas',
          icon: 'bi-map',
          can: store.can('puede.acceder.rutas_tareas')
        }
      ]
    },
    {
      title: 'Bodega',
      icon: 'bi-building',
      can: store.can('puede.acceder.modulo_administracion'),
      module: true,
      children: [
        {
          title: 'Autorizaciones',
          link: 'autorizaciones',
          icon: 'bi-check-circle',
          can: store.can('puede.acceder.autorizaciones') && store.esActivosFijos
        },
        {
          title: 'Condiciones de productos',
          link: 'condiciones',
          icon: 'bi-box-seam',
          can: store.can('puede.acceder.condiciones') && store.esActivosFijos
        },
        {
          title: 'Codigos de productos',
          link: 'codigos-clientes',
          icon: 'bi-upc-scan',
          can:
            store.can('puede.acceder.codigos_clientes') && store.esActivosFijos
        },
        {
          title: 'Estados de transacciones',
          link: 'estados-transacciones',
          icon: 'bi-circle',
          can:
            store.can('puede.acceder.estados_transacciones') &&
            store.esActivosFijos
        },
        {
          title: 'Hilos',
          link: 'hilos',
          icon: 'bi-threads',
          can: store.can('puede.acceder.hilos')
        },
        {
          title: 'Tipos de Fibras',
          link: 'tipos-fibras',
          icon: 'bi-gear',
          can: store.can('puede.acceder.tipos_fibras')
        },
        {
          title: 'Motivos',
          link: 'motivos',
          can: store.can('puede.acceder.motivos') && store.esActivosFijos,
          icon: 'bi-question-circle'
        },
        {
          title: 'Tipos de Transacciones',
          link: 'tipos-transacciones',
          icon: 'bi-arrows-collapse',
          can: store.can('puede.acceder.tipos_transacciones') && false
        },

        {
          title: 'Sucursales',
          link: 'sucursales',
          icon: 'bi-building',
          can: store.can('puede.acceder.sucursales') || store.esActivosFijos
        },
        {
          title: 'Unidades de medida',
          link: 'unidades-medidas',
          icon: 'bi-rulers',
          can:
            store.can('puede.acceder.unidades_medidas') && store.esActivosFijos
          // can: true,
        }
      ]
    },
    {
      title: 'Clientes',
      link: 'clientes',
      icon: 'bi-people',
      can: store.can('puede.acceder.clientes')
    },
    {
      title: 'Cuentas Bancarias Empresariales',
      link: 'cuentas-bancarias',
      icon: 'bi-bank',
      can: store.can('puede.acceder.cuentas_bancarias')
    },
    {
      title: 'Roles y Permisos',
      icon: 'bi-person-gear',
      can: store.esAdministrador,
      children: [
        {
          title: 'Roles',
          link: 'roles',
          icon: 'bi-person-badge',
          can: store.esAdministrador || store.can('puede.acceder.roles')
        },
        {
          title: 'Permisos',
          link: 'permisos',
          icon: 'bi-key',
          can: store.esAdministrador || store.can('puede.acceder.permisos')
        },
        {
          title: 'Permisos en roles',
          link: 'permisos-roles',
          icon: 'bi-person-badge',
          can:
            store.esAdministrador || store.can('puede.acceder.permisos_roles')
        },
        {
          title: 'Permisos de usuarios',
          link: 'permisos-usuarios',
          icon: 'bi-person-lock',
          can:
            store.esAdministrador ||
            store.can('puede.acceder.permisos_usuarios')
        }
      ]
    }


  ])

  return {
    links
  }
})
