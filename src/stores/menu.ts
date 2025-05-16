import { useAuthenticationStore } from './authentication'
import { MenuOption } from 'src/shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'
import seleccionContratacionPersonal from './menus/rrhh/seleccionContratacionPersonal'
import trabajoSocial from 'stores/menus/rrhh/trabajoSocial'
import vehiculos from './menus/vehiculos/vehiculos'
import menuSeguridad from './menus/seguridad/menuSeguridad'
import comprasProveedores from 'stores/menus/comprasProveedores/comprasProveedores';

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
            },
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
            }
          ]
        }
      ]
    },
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
    /********************
     * Modulo medico
     ********************/
    {
      title: 'Médico',
      icon: 'bi-heart-pulse',
      can: store.can('puede.acceder.modulo_medico'),
      module: true,
      children: [
        {
          title: 'Gestionar pacientes',
          link: 'gestionar-pacientes',
          icon: 'bi-person-hearts',
          can: store.can('puede.acceder.gestionar_pacientes')
        },
        {
          title: 'Cuestionarios',
          link: 'cuestionarios',
          icon: 'bi-file-earmark-text',
          can: store.can('puede.acceder.cuestionarios')
        },
        {
          title: 'Cita médica',
          link: 'citas-medicas',
          icon: 'bi-calendar-check',
          can: store.can('puede.acceder.citas_medicas')
        },
        {
          title: 'Solicitudes de exámenes',
          link: 'solicitudes-examenes',
          icon: 'bi-journal-medical',
          can: store.can('puede.acceder.solicitudes_examenes')
        },
        {
          title: 'Reportes cuestionarios',
          link: 'reportes-cuestionarios',
          icon: 'bi-file-earmark-bar-graph',
          can: store.can('puede.acceder.reportes_cuestionarios')
        },
        {
          title: 'CIE',
          link: 'cie',
          icon: 'bi-journal-bookmark',
          can: store.can('puede.acceder.cies')
        },
        /* {
          title: 'Firmar fichas médicas',
          link: 'firmar-fichas-medicas',
          icon: 'bi-app',
        }, */
        {
          title: 'Configuracion Cuestionario Empleado',
          link: 'configuraciones-cuestionarios-empleados',
          icon: 'bi-gear',
          can: store.can(
            'puede.acceder.configuraciones_cuestionarios_empleados'
          )
        },
        {
          title: 'Laboratorios clínicos',
          link: 'laboratorios-clinicos',
          icon: 'bi-app',
          can: store.can('puede.acceder.laboratorios_clinicos')
        }
      ]
    },
    /********************
     * Modulo Seguridad
     ********************/
    ...menuSeguridad.value,
    /********************
     * Modulo SSO
     ********************/
    {
      title: 'SSO',
      icon: 'bi-hospital',
      can: store.can('puede.acceder.modulo_sso'),
      module: true,
      children: [
        {
          title: 'Incidentes',
          link: 'incidentes',
          icon: 'bi-person-hearts',
          can: store.can('puede.acceder.incidentes')
        },
        {
          title: 'Inspecciones',
          link: 'inspecciones',
          icon: 'bi-person-hearts',
          can: store.can('puede.acceder.inspecciones')
        },
        {
          title: 'Solicitud de descuento',
          link: 'solicitudes-descuentos',
          icon: 'bi-cash-stack',
          can: store.can('puede.acceder.solicitudes_descuentos')
        },
        {
          title: 'Accidentes',
          link: 'accidentes',
          icon: 'personal_injury',
          can: store.can('puede.acceder.accidentes')
        },
        {
          title: 'Certificaciones',
          link: 'certificaciones',
          icon: 'bi-patch-check',
          can: store.can('puede.acceder.certificaciones')
        },
        {
          title: 'Certificaciones empleados',
          link: 'certificaciones-empleados',
          icon: 'bi-patch-check',
          can: store.can('puede.acceder.certificaciones_empleados')
        },
      ]
    },
    /**
     * Modulo de bodega.
     /*****************************************************************************
     * MÓDULO DE BODEGA.
     * Toda la estructura de pedidos, devoluciones y despachos de materiales
     *****************************************************************************/
    {
      title: 'Bodega',
      icon: 'bi-box-seam',
      can: store.can('puede.acceder.modulo_bodega'),
      module: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-bodega',
          can:
            store.esBodeguero ||
            store.esCoordinadorBodega ||
            store.can('puede.acceder.dashboard_bodega'),
          icon: 'bi-bar-chart'
        },
        {
          title: 'Productos de empleados',
          link: 'productos-empleados',
          icon: 'bi-box-seam',
          can: store.can('puede.acceder.materiales_empleados')
        },
        {
          title: 'Transferencia de productos',
          link: 'transferencia-producto-empleado',
          icon: 'bi-arrow-left-right',
          can: store.can('puede.acceder.transferencia_producto_empleado')
        },
        {
          title: 'Categorías',
          link: 'categorias',
          can: store.esActivosFijos, //store.esBodeguero,//can('puede.acceder.categorias'),
          icon: 'bi-tags'
        },
        {
          title: 'Control de Stock',
          link: 'control-stock',
          can: store.esBodeguero || store.can('puede.acceder.control_stock'),
          icon: 'bi-check2-square'
        },
        {
          title: 'Marcas',
          link: 'marcas',
          can: store.can('puede.acceder.marcas'),
          icon: 'bi-star'
        },
        {
          title: 'Modelos',
          link: 'modelos',
          can: store.can('puede.acceder.modelos'),
          icon: 'bi-diagram-3'
        },
        {
          title: 'Productos',
          link: 'productos',
          icon: 'bi-box',
          can: store.can('puede.acceder.productos')
        },
        {
          title: 'Detalles de productos',
          link: 'detalles',
          icon: 'bi-info-circle',
          // can: store.esBodeguero,// can('puede.acceder.detalles'),
          can: store.can('puede.acceder.detalles')
        },
        {
          title: 'Permisos de Armas',
          link: 'permisos-armas',
          icon: 'bi-app',
          // can: store.esBodeguero,// can('puede.acceder.detalles'),
          can: store.can('puede.acceder.permisos_armas')
        },
        {
          title: 'Inventario',
          link: 'inventarios',
          icon: 'bi-journal-check',
          can:
            store.can('puede.acceder.inventarios') ||
            store.esCoordinador ||
            store.esCoordinadorBackup ||
            store.esRecursosHumanos ||
            store.esTecnicoLider
        },
        {
          title: 'Productos en Perchas',
          link: 'productos-perchas',
          icon: 'bi-boxes',
          // can: store.can('puede.acceder.productos_perchas'),
          can: false
        },
        {
          title: 'Devoluciones',
          link: 'devoluciones',
          can: store.can('puede.acceder.devoluciones'),
          icon: 'bi-arrow-repeat'
        },
        {
          title: 'Pedidos',
          link: 'pedidos',
          can: store.can('puede.acceder.pedidos'),
          icon: 'bi-cart'
        },
        {
          title: 'Preingresos de Materiales',
          link: 'preingresos-materiales',
          can: store.can('puede.acceder.preingresos_materiales') || true,
          icon: 'bi-app'
        },

        {
          title: 'Ingreso de materiales',
          link: 'transacciones-ingresos',
          can:
            store.can('puede.acceder.transacciones_ingresos') ||
            store.esBodeguero,
          icon: 'bi-box-arrow-in-down'
        },
        {
          title: 'Egreso de materiales',
          link: 'transacciones-egresos',
          // can: store.can('puede.acceder.transacciones_egresos'),
          can:
            store.can('puede.acceder.transacciones_egresos') ||
            store.esBodeguero,
          icon: 'bi-box-arrow-up'
        },
        {
          title: 'Transferencias',
          link: 'transferencias',
          can: store.can('puede.acceder.transferencias') || store.esBodeguero,
          icon: 'bi-arrow-left-right'
        },
        {
          title: 'Traspasos',
          link: 'traspasos',
          can: store.can('puede.acceder.traspasos'),
          icon: 'bi-arrow-left-right'
        },
        {
          title: 'Comprobantes',
          icon: 'bi-file-earmark-text',
          children: [
            {
              title: 'Mis comprobantes',
              link: 'gestionar-egresos',
              icon: 'bi-file-earmark-text'
            },
            {
              title: 'Todos los comprobantes',
              link: 'egresos-filtrados',
              icon: 'bi-file-earmark-text',
              can:
                store.esBodeguero ||
                store.esContabilidad ||
                store.esCoordinador ||
                store.esGerente ||
                store.can('puede.acceder.comprobantes_egresos')
            },
            {
              title: 'Aceptar transferencia de productos',
              link: '/aceptar-transferencia-producto',
              icon: 'bi-arrow-left-right',
              can: true, // store.can('puede.acceder.aceptar_transferencia_producto')
            },
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can:
            store.esAdministrador ||
            store.esBodeguero ||
            store.esContabilidad ||
            store.can('puede.acceder.reportes_bodega'),
          children: [
            {
              title: 'Reporte de ingresos',
              link: 'reporte-ingresos',
              icon: 'bi-journal-arrow-up',
              can: true
            },
            {
              title: 'Reporte de egresos',
              link: 'reporte-egresos',
              icon: 'bi-journal-arrow-down',
              can: true
            },
            {
              title: 'Reporte de Uniformes y EPPs',
              link: 'reporte-epps',
              icon: 'bi-journal-arrow-down',
              can: true
            },
            {
              title: 'Reporte de pedidos',
              link: 'reporte-pedidos',
              icon: 'bi-journal-check',
              can: true
            },
            {
              title: 'Reporte de transferencias',
              link: 'reporte-transferencias',
              icon: 'bi-journal-arrow-left-right',
              can: false
            },
            {
              title: 'Reporte de inventario',
              link: 'reporte-inventario',
              icon: 'bi-journal-bar-graph'
            },
            {
              title: 'Kardex',
              link: 'kardex',
              icon: 'bi-journal-text'
            }
          ]
        }
      ]
    },
    /*****************
     * Activos fijos
     *****************/
    {
      title: 'Activos fijos',
      icon: 'bi-building-check',
      can: store.can('puede.acceder.modulo_activos_fijos'),
      children: [
        {
          title: 'Control de activos fijos',
          link: 'control-activos-fijos',
          can: store.can('puede.acceder.control_activos_fijos'),
          icon: 'bi-app'
        },
        {
          title: 'Seguimiento consumo de activos fijos',
          link: 'seguimiento-consumo-activos-fijos',
          can: store.can('puede.acceder.seguimiento_consumo_activos_fijos'),
          icon: 'bi-app'
        },
        {
          title: 'Transferencia de activos fijos',
          link: 'transferencia-activos-fijos',
          can: store.can('puede.acceder.transferencia_activos_fijos'),
          icon: 'bi-app'
        }
      ]
    },
    // Modulo Fondos Rotativos
    {
      title: 'Fondos Rotativos',
      icon: 'bi-cash-coin', // Cambiado de 'bi-cash-stack' a Font Awesome
      can: store.can('puede.acceder.fondo'),
      children: [
        // {
        //   title: 'Gastos',
        //   icon: 'fa-solid fa-receipt', // Cambiado de 'bi-receipt' a Font Awesome
        //   children: [
        {
          title: 'Registrar Gastos',
          link: 'gasto',
          icon: 'fa-solid fa-plus-circle', // Cambiado de 'bi-plus-circle' a Font Awesome
          can: store.can('puede.acceder.gasto')
        },
        {
          title: 'Reactivar gastos rechazados por el sistema',
          link: 'gastos-rechazados-sistema',
          icon: 'bi-toggle-on', // Cambiado de 'bi-plus-circle' a Font Awesome
          can: store.can('puede.acceder.gastos_rechazados_sistema')
        },
        {
          title: 'Configurar Autorizadores Directos',
          link: 'autorizadores-directos',
          icon: 'bi-gear', // Cambiado de 'bi-plus-circle' a Font Awesome
          can: store.can('puede.acceder.autorizadores_directos')
        },
        {
          title: 'Solicitar Fondos',
          link: 'gasto-coordinador',
          icon: 'fa-solid fa-hand-holding-usd', // Cambiado de 'bi-handbag' a Font Awesome
          can: store.can('puede.acceder.gasto_coordinador')
        },
        {
          title: 'Autorizar Gasto',
          link: 'autorizar-gasto',
          icon: 'fa-solid fa-check-circle', // Cambiado de 'bi-check-circle' a Font Awesome
          can: true //store.can('puede.acceder.autorizar_gasto'),
        },
        {
          title: 'Anular Gasto',
          link: 'anular-gasto',
          icon: 'fa-solid fa-times-circle', // Cambiado de 'bi-x-circle' a Font Awesome
          can: store.can('puede.acceder.anular_gasto')
          // }
          // ]
        },

        {
          title: 'Detalle Fondos',
          icon: 'fa-solid fa-book', // Cambiado de 'bi-journal-text' a Font Awesome
          can: store.can('puede.acceder.menu.detalle_fondo'),
          children: [
            {
              title: 'Detalle',
              link: 'detalle_fondo',
              icon: 'fa-solid fa-file-alt', // Cambiado de 'bi-journal-text' a Font Awesome
              can: store.can('puede.acceder.detalle_fondo')
            },
            {
              title: 'SubDetalle',
              link: 'sub_detalle_fondo',
              icon: 'fa-solid fa-file-alt', // Cambiado de 'bi-journal-text' a Font Awesome
              can: store.can('puede.acceder.sub_detalle_fondo')
            }
          ]
        },
        {
          title: 'Solicitudes de fondos',
          icon: 'fa-solid fa-file-invoice', // Cambiado de 'bi-file-earmark-text' a Font Awesome
          can: store.can('puede.acceder.menu.solicitud_fondo'),
          children: [
            {
              title: 'Motivo',
              link: 'motivo-gasto',
              icon: 'fa-solid fa-pencil-alt', // Cambiado de 'bi-pencil' a Font Awesome
              can: store.can('puede.acceder.motivo_gasto')
            }
          ]
        },
        {
          title: 'Saldo',
          icon: 'fa-solid fa-wallet', // Cambiado de 'bi-wallet' a Font Awesome
          can: store.can('puede.acceder.menu.saldos'),
          children: [
            {
              title: 'Acreditacion',
              link: 'acreditacion',
              icon: 'fa-solid fa-university', // Cambiado de 'bi-bank' a Font Awesome
              can: store.can('puede.acceder.acreditacion')
            },
            {
              title: 'Umbral',
              link: 'umbral-fondos-rotativos',
              icon: 'fa-solid fa-arrow-up', // Cambiado de 'bi-arrow-up' a Font Awesome
              can: store.can('puede.acceder.umbral_fondos_rotativos')
            },
            {
              title: 'Acreditacion Semana',
              link: 'acreditacion-semana',
              icon: 'fa-solid fa-calendar-check', // Cambiado de 'bi-calendar-check' a Font Awesome
              can: store.can('puede.acceder.acreditacion_semana')
            },
            {
              title: 'Transferencia',
              link: 'transferencia',
              icon: 'fa-solid fa-exchange-alt', // Cambiado de 'bi-arrow-left-right' a Font Awesome
              can: store.can('puede.acceder.transferencia')
            },
            {
              title: 'Autorizar Transferencia',
              link: 'autorizar-transferencia',
              icon: 'fa-solid fa-check-circle', // Cambiado de 'bi-check-circle' a Font Awesome
              can: store.can('puede.acceder.autorizar_transferencia')
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'fa-solid fa-chart-line', // Cambiado de 'bi-graph-up-arrow' a Font Awesome
          children: [
            {
              title: 'Resumen de valores de FR',
              link: 'reporte-valores-fondos',
              icon: 'fa-solid fa-chart-bar', // Cambiado de 'bi-journal-bar-graph' a Font Awesome
              can:
                store.can('puede.acceder.reporte_valores_fondos_rotativos') ||
                store.esAdministrador
            },
            {
              title: 'Fondo Rotativo',
              link: 'reporte-fondo-fecha',
              icon: 'fa-solid fa-calendar-check', // Cambiado de 'bi-calendar-check' a Font Awesome
              can: store.can('puede.acceder.reporte_fondo_fecha')
            },
            {
              title: 'Autorizaciones',
              link: 'reporte-autorizaciones',
              icon: 'fa-solid fa-check-circle', // Cambiado de 'bi-check2-circle' a Font Awesome
              can: store.can('puede.acceder.reporte_autorizaciones')
            },
            {
              title: 'Saldo Actual',
              link: 'reporte-saldo-actual',
              icon: 'fa-solid fa-book', // Cambiado de 'bi-journal-check' a Font Awesome
              can: store.can('puede.acceder.reporte_saldo_actual')
            },
            {
              title: 'Saldo Consolidado',
              link: 'reporte-consolidado',
              icon: 'fa-solid fa-chart-line', // Cambiado de 'bi-graph-up-arrow' a Font Awesome
              can: store.can('puede.acceder.reporte_consolidado')
            },
            {
              title: 'Saldo Consolidado con Filtro',
              link: 'reporte-consolidado-filtrado',
              icon: 'fa-solid fa-filter', // Cambiado de 'bi-funnel' a Font Awesome
              can: store.can('puede.acceder.reporte_consolidado_filtrado')
            },
            {
              title: 'Solicitud de Fondos',
              link: 'reporte-solicitud-fondo',
              icon: 'fa-solid fa-file-alt', // Cambiado de 'bi-file-earmark-text' a Font Awesome
              can: store.can('puede.acceder.reporte_solicitud_fondo')
            },
            {
              title: 'Contabilidad',
              link: 'reporte-contabilidad',
              icon: 'fa-solid fa-file-invoice', // Cambiado de 'bi-receipt-cutoff' a Font Awesome
              can: store.can('puede.acceder.reporte_contabilidad')
            }
          ]
        },
        {
          title: 'Ajuste de Saldos Fondos Rotativos',
          link: 'ajustes-saldos',
          icon: 'fa-solid fa-money-check-alt', // Cambiado de 'bi-cash' a Font Awesome
          can: store.can('puede.acceder.ajustes_saldos')
        }
      ]
    },

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
          title: 'Planificador',
          link: 'planificadores',
          icon: 'bi-calendar-check',
          can: store.can('puede.acceder.planificadores')
        },
        {
          title: 'Permiso',
          link: 'permiso-nomina',
          icon: 'bi-calendar2-plus',
          can: store.can('puede.acceder.permiso_nomina')
        },
        {
          title: 'Descuentos a Empleados',
          link: 'descuentos',
          icon: 'bi-emoji-frown',
          can: store.can('puede.acceder.descuentos')
        },
        {
          title: 'Nominas y prestamos',
          icon: 'bi-people',
          can: true,
          children: [
            {
              title: 'Multas de Conductores',
              link: 'multas-conductores',
              icon: 'bi-exclamation-octagon',
              can: store.can('puede.acceder.multas_conductores')
            },
            {
              title: 'Rol de Pagos',
              link: 'rol-pago-mes',
              icon: 'bi-journal-check',
              can: store.can('puede.acceder.rol_pago_mes')
            },
            {
              title: 'Licencia Empleado',
              link: 'licencia-empleado',
              icon: 'bi-card-heading',
              can: store.can('puede.acceder.licencia_empleado')
            },
            {
              title: 'Valores para Roles',
              link: 'valores-cargados-roles',
              icon: 'bi-cash-coin',
              can: store.can('puede.acceder.valores_cargados_roles')
            },
            {
              title: 'Solicitud de Vacaciones',
              link: 'solicitudes-vacaciones',
              icon: 'bi-umbrella',
              can: store.can('puede.acceder.solicitudes_vacaciones')
            }, {
              title: 'Registro de Vacaciones',
              link: 'vacaciones',
              icon: 'bi-umbrella',
              can: store.can('puede.acceder.vacaciones')
            },
            {
              title: 'Familiares',
              link: 'familiares',
              icon: 'bi-people',
              can: store.can('puede.acceder.familiares')
            },
            {
              title: 'Extension Conyugal',
              link: 'extension-conyugal',
              icon: 'bi-person-hearts',
              can: store.can('puede.acceder.extension_conyugal')
            },
            {
              title: 'Alimentacion',
              icon: 'bi-shop-window',
              can: store.can('puede.acceder.modulo_alimentacion'),
              children: [
                {
                  title: 'Asignar Alimentacion',
                  link: 'asignar-alimentaciones',
                  icon: 'bi-card-checklist',
                  can: store.can('puede.acceder.asignar_alimentaciones')
                },
                {
                  title: 'Alimentacion',
                  link: 'alimentaciones',
                  icon: 'bi-shop',
                  can: store.can('puede.acceder.alimentaciones')
                }
              ]
            },
            {
              title: 'Prestamos',
              icon: 'bi-wallet2',
              can: store.can('puede.acceder.prestamos_empleados'),
              children: [
                {
                  title: 'Prestamos Empresariales',
                  link: 'prestamo-empresarial',
                  icon: 'bi-building',
                  can: store.can('puede.acceder.prestamo_empresarial')
                },
                {
                  title: 'Prestamos Hipotecario',
                  link: 'prestamo-hipotecario',
                  icon: 'bi-house-door',
                  can: store.can('puede.acceder.prestamo_hipotecario')
                },
                {
                  title: 'Prestamos Quirografario',
                  link: 'prestamos-quirografarios',
                  icon: 'bi-handbag',
                  can: store.can('puede.acceder.prestamos_quirografarios')
                },
                {
                  title: 'Solicitud de Prestamos Empresariales',
                  link: 'solicitud-prestamo-empresarial',
                  icon: 'bi-file-earmark-check',
                  can: store.can('puede.acceder.solicitud_prestamo_empresarial')
                }
              ]
            }
          ]
        },
        ...seleccionContratacionPersonal.value,
        ...trabajoSocial.value,
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          can: store.can('puede.acceder.configuracion_modulo_rrhh'),
          children: [
            {
              title: 'Conceptos de Ingresos',
              link: 'concepto-ingreso',
              icon: 'bi-plus-circle',
              can: store.can('puede.acceder.concepto_ingreso')
            },
            {
              title: 'Descuentos Generales',
              link: 'descuentos-generales',
              icon: 'bi-dash-circle',
              can: store.can('puede.acceder.descuentos_generales')
            },
            {
              title: 'Multas',
              link: 'multa',
              icon: 'bi-exclamation-octagon',
              can: store.can('puede.acceder.multa')
            },
            {
              title: 'Rubro',
              link: 'rubro',
              icon: 'bi-box',
              can: store.can('puede.acceder.rubro')
            },
            {
              title: 'Tipos de licencias',
              link: 'tipos-licencias',
              icon: 'bi-box',
              can: store.can('puede.acceder.tipos_licencias')
            }
          ]
        },
        // Reportes del modulo empleados
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can: store.can('puede.acceder.reportes_rrhh'),
          children: [
            {
              title: 'Reporte de Vacaciones de Empleados',
              link: 'reporte-vacaciones',
              icon: 'bi-sunglasses',
              can: store.can('puede.acceder.reportes_rrhh') || true
            },
          ]
        }
      ]
    },

    /*****************************************
     * MODULO DE INTRANET
     *****************************************/
    {
      title: 'Intranet',
      icon: 'fa-solid fa-info',
      can: store.esAdministrador || store.can('puede.acceder.modulo_intranet'),
      module: true,
      children: [
        {
          title: 'Noticias',
          icon: 'fa-regular fa-newspaper',
          link: '/blog',
          can: store.can('puede.acceder.intra_noticias')
        },
        {
          title: 'Eventos',
          icon: 'bi-calendar-event',
          link: 'eventos',
          can: store.can('puede.acceder.intra_eventos')
        },
        {
          title: 'Categorias',
          link: 'categorias-noticias',
          icon: 'bi-tags',
          can: store.can('puede.acceder.intra_categorias')
        },
        {
          title: 'Etiquetas',
          link: 'etiquetas',
          icon: 'bi-tag',
          can: store.can('puede.acceder.intra_etiquetas')
        },
        {
          title: 'Tipo de Evento',
          link: 'tipos-eventos',
          icon: 'bi-calendar2-event',
          can: store.can('puede.acceder.intra_tipos_eventos')
        },
        /*         {
                  title: 'Organigrama',
                  icon: 'bi-diagram-3',
                  link: 'organigrama',
                  can: store.can('puede.acceder.intra_organigrama')
                }, */
      ]
    },

    /*****************************************
     * MODULO DE VEHICULOS
     *****************************************/
    ...vehiculos.value,

    /*********************************************************
     * Modulo de compras y proveedores
     *********************************************************/
    ...comprasProveedores.value,

    /***********************
     * Modulo de ventas JP
     **********************/
    {
      title: 'Ventas',
      icon: 'fa-solid fa-circle-dollar-to-slot',
      can: store.can('puede.acceder.modulo_ventas') || store.esAdministrador,
      module: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-ventas',
          icon: 'bi-bar-chart',
          can:
            store.can('puede.acceder.dashboard_ventas_empresa') ||
            store.esAdministrador
        },
        {
          title: 'Proformas',
          link: 'proformas',
          icon: 'bi-file-earmark-text',
          can: store.can('puede.acceder.proformas') || store.esAdministrador
        },
        {
          title: 'Prefacturas',
          link: 'prefacturas',
          icon: 'bi-file-earmark-text',
          can: store.can('puede.acceder.prefacturas') || store.esAdministrador
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can:
            store.esAdministrador ||
            store.esCompras ||
            store.can('puede.acceder.reportes_modulo_ventas'),
          children: [
            {
              title: 'Reporte de Prefacturas',
              link: 'reporte-prefacturas',
              icon: 'bi-journal-bar-graph',
              can: true
            }
          ]
        }
      ]
    },
    /*********************************************************
     * Modulo de ventas de claro
     *********************************************************/
    {
      title: 'Ventas de Claro',
      icon: 'img:statics/icons/Claro-Logo.svg', //'bi-c-circle',
      can: store.can('puede.acceder.modulo_ventas_claro'),
      module: true,
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-ventas-claro',
          icon: 'bi-bar-chart',
          can: store.can('puede.acceder.dashboard_ventas')
        },
        {
          title: 'Productos',
          link: 'productos-ventas',
          icon: 'bi-box-seam',
          can: store.can('puede.acceder.productos_ventas')
        },
        {
          title: 'Vendedores',
          link: 'vendedores',
          icon: 'bi-person-badge',
          can: store.can('puede.acceder.vendedores')
        },
        {
          title: 'Clientes',
          link: 'clientes-claro',
          icon: 'bi-people',
          can: store.can('puede.acceder.clientes_claro')
        },
        {
          title: 'Ventas',
          link: 'ventas',
          icon: 'bi-currency-exchange',
          can: store.can('puede.acceder.ventas')
        },
        {
          title: 'Chargeback',
          link: 'chargebacks',
          icon: 'bi-exclamation-circle',
          can: store.can('puede.acceder.chargebacks')
        },
        {
          title: 'Pagos de Comisiones',
          link: 'pagos-comisiones',
          icon: 'bi-cash-stack',
          can: store.can('puede.acceder.pagos_comisiones')
        },
        {
          title: 'Retenciones de Chargebacks',
          link: 'retenciones-chargebacks',
          icon: 'bi-exclamation-circle',
          can: store.can('puede.acceder.retenciones_chargebacks')
        },
        {
          title: 'Bono Mensual Cumplimento',
          link: 'bono-mensual-cumplimiento',
          icon: 'bi-gift',
          can: store.can('puede.acceder.bonos_mensuales_cumplimientos')
        },
        {
          title: 'Bono Trimestral Cumplimiento',
          link: 'bonos-trimestrales-cumplimientos',
          icon: 'bi-gift',
          can: store.can('puede.acceder.bonos_trimestrales_cumplimientos')
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          children: [
            {
              title: 'Planes',
              link: 'planes',
              icon: 'bi-card-list',
              can: store.can('puede.acceder.planes')
            },
            {
              title: 'Umbral de ventas',
              link: 'modalidades',
              icon: 'bi-arrow-up',
              can: store.can('puede.acceder.modalidades')
            },
            {
              title: 'Tipo de ChargeBack',
              link: 'tipos-chargebacks',
              icon: 'bi-tags',
              can: store.can('puede.acceder.tipos_chargebacks')
            },
            {
              title: 'Comisiones',
              link: 'comisiones',
              icon: 'bi-percent',
              can: store.can('puede.acceder.comisiones')
            },
            {
              title: 'Meta de Ventas',
              link: 'umbrales-ventas',
              icon: 'bi-bar-chart-steps',
              can: store.can('puede.acceder.umbrales_ventas')
            },
            {
              title: 'Esquema de Comisiones',
              link: 'esquemas-comisiones',
              icon: 'bi-diagram-3',
              can: store.can('puede.acceder.esquemas_comisiones')
            },
            {
              title: 'Escenario Venta',
              link: 'escenarios-ventas-jp',
              icon: 'bi-card-checklist',
              can: store.can('puede.acceder.escenarios_ventas_jp')
            },
            {
              title: 'Bonos',
              icon: 'bi-gift',
              children: [
                {
                  title: 'Bono de Vendedores',
                  link: 'bonos',
                  icon: 'bi-gift',
                  can: store.can('puede.acceder.bonos')
                },
                {
                  title: 'Bono de Supervisores',
                  link: 'bonos-porcentuales',
                  icon: 'bi-gift',
                  can: store.can('puede.acceder.bonos_porcentuales')
                }
              ]
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          children: [
            {
              title: 'Valores a cobrar para JP',
              link: 'reporte_cobrojp',
              icon: 'bi-cash-coin',
              can: store.can('puede.acceder.reportes_cobrosjp_claro')
            },
            {
              title: 'Pagos',
              link: 'reportes-pagos-claro',
              icon: 'bi-file-earmark-bar-graph',
              can: store.can('puede.acceder.reportes_pagos_claro')
            },
            {
              title: 'Ventas por Vendedor',
              link: 'reportes-ventas-claro',
              icon: 'bi-bar-chart',
              can: store.can('puede.acceder.reportes_ventas_claro')
            }
          ]
        }
      ]
    },
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
      title: 'Configuracion General',
      link: 'configuracion',
      icon: 'bi-gear-wide-connected',
      can:
        store.can('puede.acceder.configuracion_general') ||
        store.esAdministrador
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
          title: 'Perchas',
          link: 'perchas',
          icon: 'bi-box',
          can: store.can('puede.acceder.perchas')
        },
        {
          title: 'Pisos',
          link: 'pisos',
          icon: 'bi-box',
          can: store.can('puede.acceder.pisos')
        },
        {
          title: 'Sucursales',
          link: 'sucursales',
          icon: 'bi-building',
          can: store.can('puede.acceder.sucursales') || store.esActivosFijos
        },
        {
          title: 'Ubicaciones',
          link: 'ubicaciones',
          icon: 'bi-map',
          can: store.can('puede.acceder.ubicaciones')
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

    /* {
      header: 'Sistema',
    },
    {
      title: 'Perfil',
      icon: 'bi-person',
      link: 'perfil',
    },
    {
      title: 'Configuración',
      icon: 'bi-gear',
      children: [
        {
          title: 'Imprimir / Exportar',
          link: 'tareas',
          icon: 'bi-app',
        },
        {
          title: 'Empresa',
          link: 'control-progresivas',
          icon: 'bi-app',
        },
      ],
    }, */
  ])

  return {
    links
  }
})
