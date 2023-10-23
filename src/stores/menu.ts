import { useAuthenticationStore } from './authentication'
import { MenuOption } from 'shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const store = useAuthenticationStore()

  // State
  const links: Ref<MenuOption[]> = computed(() => [
    {
      header: 'Modulos',
    },
    {
      title: 'Inicio',
      icon: 'bi-house-fill',
      link: '/',
      can: true, //!store.can('puede.ver.trabajo_asignado'),
    },
    {
      title: 'Trabajo agendado',
      link: 'trabajo-agendado',
      icon: 'bi-ui-checks-grid',
      can: true,//store.esTecnicoLider,// store.can('puede.ver.trabajo_asignado'),
    },
    {
      title: 'Notificaciones',
      icon: 'bi-bell-fill',
      link: 'notificaciones',
      can: true
    },
    /*******************
     * Modulo de tareas
     *******************/
    {
      title: 'Proyectos y tareas',
      icon: 'bi-pin-angle-fill',
      can: store.can('puede.ver.modulo_tareas'),
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.dashboard_tareas'),
        },
        {
          title: 'Monitor',
          link: 'monitor-subtareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.monitor_subtareas'),
        },
        {
          title: 'Proyectos',
          link: 'proyectos',
          icon: 'bi-circle',
          can: store.can('puede.ver.proyectos'),
        },
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tareas'),
        },
        {
          title: 'Materiales de técnicos',
          link: 'materiales-empleados',
          icon: 'bi-circle',
          can: store.can('puede.ver.materiales_empleados'),
        },
        {
          title: 'Movilización entre trabajos',
          link: 'reporte-movilizacion-subtarea',
          icon: 'bi-circle',
          can: store.can('puede.ver.reporte_movilizacion_subtarea'),
        },
        {
          title: 'Clientes finales',
          link: 'clientes-finales',
          icon: 'bi-circle',
        },
        {
          title: 'Reportes',
          link: 'reportes-modulo-tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.reportes_modulo_tareas'),
        },
      ],
    },
    /********************
     * Modulo de tickets
     ********************/
    {
      title: 'Tickets',
      icon: 'bi-ticket-perforated-fill',
      can: store.can('puede.ver.tickets'),
      children: [
        {
          title: 'Dashboard',
          link: 'dashboard-tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.tickets'),
        },
        {
          title: 'Crear ticket',
          link: 'tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.tickets'),
        },
        {
          title: 'Tickets asignados para mi',
          link: 'tickets-asignados',
          icon: 'bi-circle',
          can: store.can('puede.ver.tickets_asignados'),
        },
        {
          title: 'Categorías tipos de tickets',
          link: 'categorias-tipos-tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.categorias_tipos_tickets') || store.user.es_responsable_departamento,
        },
        {
          title: 'Tipos de tickets',
          link: 'tipos-tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_tickets') || store.user.es_responsable_departamento,
        },
        {
          title: 'Motivos de pausas',
          link: 'motivos-pausas-tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.motivos_pausas_tickets'),
        },
        {
          title: 'Motivos de cancelaciones',
          link: 'motivos-cancelados-tickets',
          icon: 'bi-circle',
          can: store.can('puede.ver.motivos_cancelados_tickets'),
        },
      ]
    },
    /********************
    * Modulo medico
    ********************/
    {
      title: 'Médico',
      icon: 'bi-heart-pulse-fill',
      // can: store.can('puede.ver.modulo_medico'),
      children: [
        {
          title: 'Gestionar pacientes',
          link: 'gestionar-pacientes',
          icon: 'bi-circle',
          can: store.can('puede.ver.gestionar_pacientes'),
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
      icon: 'bi-building-fill',
      can: store.can('puede.ver.modulo_bodega'),
      children: [
        {
          title: 'Categorías',
          link: 'categorias',
          can: store.esActivosFijos, //store.esBodeguero,//can('puede.ver.categorias'),
          icon: 'bi-circle',
        },
        {
          title: 'Control de Stock',
          link: 'control-stock',
          can: store.esBodeguero || store.can('puede.acceder.control_stock'),
          icon: 'bi-circle',
        },
        {
          title: 'Empleados',
          link: 'empleados',
          icon: 'bi-person-lines-fill',
          can: store.can('puede.ver.empleados') && store.esBodeguero
        },
        {
          title: 'Marcas',
          link: 'marcas',
          can: store.esActivosFijos,//store.can('puede.ver.marcas'),
          icon: 'bi-circle',
        },
        {
          title: 'Modelos',
          link: 'modelos',
          can: store.esActivosFijos,//store.can('puede.ver.modelos'),
          icon: 'bi-circle',
        },
        {
          title: 'Productos',
          link: 'productos',
          icon: 'bi-circle',
          can: store.esBodeguero, //store.can('puede.ver.productos'),
        },
        {
          title: 'Detalles de productos',
          link: 'detalles',
          icon: 'bi-circle',
          // can: store.esBodeguero,// can('puede.ver.detalles'),
          can: store.can('puede.acceder.detalles'),
        },
        {
          title: 'Inventario',
          link: 'inventarios',
          icon: 'bi-circle',
          can: store.can('puede.ver.inventarios') || store.esCoordinador || store.esCoordinadorBackup || store.esRecursosHumanos || store.esTecnicoLider,
        },
        {
          title: 'Productos en Perchas',
          link: 'productos-perchas',
          icon: 'bi-circle',
          // can: store.can('puede.ver.productos_perchas'),
          can: false,
        },
        {
          title: 'Devoluciones',
          link: 'devoluciones',
          can: store.can('puede.ver.devoluciones'),
          icon: 'bi-circle',
        },
        {
          title: 'Pedidos',
          link: 'pedidos',
          can: store.can('puede.ver.pedidos'),
          icon: 'bi-circle',
        },
        {
          title: 'Preingresos de Materiales',
          link: 'preingresos-materiales',
          can: store.can('puede.acceder.preingresos_materiales') || true,
          icon: 'bi-circle',
        },

        {
          title: 'Ingreso de materiales',
          link: 'transacciones-ingresos',
          can: store.can('puede.acceder.transacciones_ingresos') || store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: 'Egreso de materiales',
          link: 'transacciones-egresos',
          // can: store.can('puede.ver.transacciones_egresos'),
          can: store.can('puede.acceder.transacciones_egresos') || store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: 'Transferencias',
          link: 'transferencias',
          can: store.can('puede.acceder.transferencias') || store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: 'Traspasos',
          link: 'traspasos',
          can: store.can('puede.ver.traspasos'),
          icon: 'bi-circle',
        },
        {
          title: 'Comprobantes',
          icon: 'bi-folder',
          children: [
            {
              title: 'Mis comprobantes',
              link: 'gestionar-egresos',
              icon: 'bi-file-text',
            },
            {
              title: 'Todos los comprobantes',
              link: 'egresos-filtrados',
              icon: 'bi-files',
              can: store.esBodeguero || store.esContabilidad || store.esCoordinador || store.esGerente || store.can('puede.ver.comprobantes_egresos')
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-clipboard2-data-fill',
          can: store.esAdministrador || store.esBodeguero || store.esContabilidad || store.can('puede.ver.reportes_bodega'),
          children: [
            {
              title: 'Reporte de ingresos',
              link: 'reporte-ingresos',
              icon: 'bi-dash',
              can: true,
            },
            {
              title: 'Reporte de egresos',
              link: 'reporte-egresos',
              icon: 'bi-dash',
              can: true,
            },
            {
              title: 'Reporte de pedidos',
              link: 'reporte-pedidos',
              icon: 'bi-dash',
              can: true,
            },
            {
              title: 'Reporte de transferencias',
              link: 'reporte-transferencias',
              icon: 'bi-dash',
              can: false,
            },
            {
              title: 'Reporte de inventario',
              link: 'reporte-inventario',
              icon: 'bi-dash',
            },
            {
              title: 'Kardex',
              link: 'kardex',
              icon: 'bi-dash',
            },
          ]
        },
      ],
    },
    //Modulo Fondos Rotativos
    {
      title: 'Fondos Rotativos',
      icon: 'fa-solid fa-cash-register',
      can: store.can('puede.ver.fondo'),
      children: [
        {
          title: 'Gastos',
          icon: 'bi-circle',
          children: [
            {
              title: 'Registrar Gastos',
              link: 'gasto',
              icon: 'bi-circle',
              can: store.can('puede.ver.gasto'),
            },
            {
              title: 'Solicitar Fondos',
              link: 'gasto-coordinador',
              icon: 'bi-circle',
              can: store.can('puede.ver.gasto_coordinador'),
            },
            {
              title: 'Autorizar Gasto',
              link: 'autorizar-gasto',
              icon: 'bi-circle',
              can: true//store.can('puede.ver.autorizar_gasto'),
            },
          ],
        },

        {
          title: 'Detalle Fondos',
          icon: 'bi-list-task',
          can: store.can('puede.ver.menu.detalle_fondo'),
          children: [{
            title: 'Detalle',
            link: 'detalle_fondo',
            icon: 'bi-circle',
            can: store.can('puede.ver.detalle_fondo'),
          },
          {
            title: 'SubDetalle',
            link: 'sub_detalle_fondo',
            icon: 'bi-circle',
            can: store.can('puede.ver.sub_detalle_fondo'),
          }]
        },
        {
          title: 'Solicitudes de fondos',
          icon: 'bi-circle',
          can: store.can('puede.ver.menu.solicitud_fondo'),
          children: [
            {
              title: 'Motivo',
              link: 'motivo-gasto',
              icon: 'bi-circle',
              can: store.can('puede.ver.motivo_gasto'),
            },
          ]
        },
        {
          title: 'Saldo',
          icon: 'bi-cash',
          can: store.can('puede.ver.menu.saldos'),
          children: [
            {
              title: 'Acreditacion',
              link: 'acreditacion',
              icon: 'bi-circle',
              can: store.can('puede.ver.acreditacion'),
            },
            {
              title: 'Umbral',
              link: 'umbral-fondos-rotativos',
              icon: 'bi-circle',
              can: store.can('puede.ver.umbral_fondos_rotativos'),
            },
            {
              title: 'Acreditacion Semana',
              link: 'acreditacion-semana',
              icon: 'bi-circle',
              can: store.can('puede.ver.acreditacion_semana'),
            },
            {
              title: 'Transferencia',
              link: 'transferencia',
              icon: 'bi-circle',
              can: true//store.can('puede.ver.transferencia'),
            },
            {
              title: 'Autorizar Transferencia',
              link: 'autorizar-transferencia',
              icon: 'bi-circle',
              can: true,
            },
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-clipboard2-data-fill',
          children: [
            {
              title: 'Fondo Rotativo',
              link: 'reporte-fondo-fecha',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_fondo_fecha'),
            },
            {
              title: 'Autorizaciones',
              link: 'reporte-autorizaciones',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_autorizaciones'),
            },
            {
              title: 'Saldo Actual',
              link: 'reporte-saldo-actual',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_saldo_actual'),
            },
            {
              title: 'Saldo Consolidado',
              link: 'reporte-consolidado',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_consolidado'),
            },
            {
              title: 'Saldo Consolidado con Filtro',
              link: 'reporte-consolidado-filtrado',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_consolidado_filtrado'),
            },
            {
              title: 'Solicitud de Fondos',
              link: 'reporte-solicitud-fondo',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_solicitud_fondo'),
            },
            {
              title: 'Contabilidad',
              link: 'reporte-contabilidad',
              icon: 'bi-circle',
              can: store.can('puede.ver.reporte_contabilidad'),
            }
          ]
        },


      ]
    },
    //Modulo Recursos Humanos
    {
      title: 'RR HH',
      icon: 'bi-people',
      can: store.can('puede.ver.modulo_recursos_humanos'),
      children: [
        {
          title: 'Empleados',
          link: 'empleados',
          icon: 'bi-circle',
          can: store.can('puede.ver.empleados'),
        },
        {
          title: 'Cargos',
          link: 'cargos',
          icon: 'bi-circle',
          can: store.can('puede.ver.cargos'),
        },
        {
          title: 'Departamentos',
          link: 'departamentos',
          icon: 'bi-circle',
          can: store.can('puede.ver.departamentos'),
        },
        {
          title: 'Grupos técnicos',
          link: 'grupos',
          icon: 'bi-circle',
          can: store.can('puede.ver.grupos'),
        },
        {
          title: 'Permiso',
          link: 'permiso-nomina',
          icon: 'bi-circle',
          can: store.can('puede.ver.permiso_nomina'),
        },
        {
          title: 'Rol de Pagos',
          link: 'rol-pago-mes',
          icon: 'bi-circle',
          can: store.can('puede.ver.rol_pago_mes'),
        },
        {
          title: 'Licencia Empleado',
          link: 'licencia-empleado',
          icon: 'bi-person-vcard-fill',
          can: store.can('puede.ver.licencia_empleado'),
        },
        {
          title: 'Vacaciones',
          link: 'vacacion',
          icon: 'bi-umbrella',
          can: store.can('puede.ver.vacacion'),
        },
        {
          title: 'Familiares',
          link: 'familiares',
          icon: 'bi-people',
          can: store.can('puede.ver.familiares'),
        },
        {
          title: 'Descuentos Generales',
          link: 'descuentos-generales',
          icon: 'bi-circle',
          can: store.can('puede.acceder.descuentos_generales'),
        },
        {
          title: 'Multas',
          link: 'multa',
          icon: 'bi-circle',
          can: store.can('puede.acceder.multa'),
        },
        {
          title: 'Conceptos de Ingresos',
          link: 'concepto-ingreso',
          icon: 'bi-circle',
          can: store.can('puede.acceder.concepto_ingreso'),
        },
        {
          title: 'Extension Conyugal',
          link: 'extension-conyugal',
          icon: 'fa-solid fa-people-arrows',
          can: store.can('puede.ver.extension_conyugal'),
        },
        {
          title: 'Prestamos',
          icon: 'fa-solid fa-hand-holding-dollar',
          can: true,//store.can('puede.ver.prestamo_empresarial'),
          children: [
            {
              title: 'Prestamos Empresariales',
              link: 'prestamo-empresarial',
              icon: 'bi-building',
              can: store.can('puede.ver.prestamo_empresarial'),
            },
            {
              title: 'Prestamos Hipotecario',
              link: 'prestamo-hipotecario',
              icon: 'bi-house',
              can: store.can('puede.ver.prestamo_hipotecario'),
            },
            {
              title: 'Prestamos Quirorafario',
              link: 'prestamo-quirorafario',
              icon: 'fa-solid fa-hands-holding',
              can: store.can('puede.ver.prestamo_quirorafario'),
            },
            {
              title: 'Solicitud de Prestamos Empresariales',
              link: 'solicitud-prestamo-empresarial',
              icon: 'fa-solid fa-file-signature',
              can: store.can('puede.ver.solicitud_prestamo_empresarial'),
            },
          ]
        },



      ],
    },

    //Modulo de Vehículos
    {
      title: 'Vehículos',
      icon: 'garage',
      can: store.esAdministrador || store.can('puede.ver.modulo_vehiculos'),
      children: [
        {
          title: 'Combustibles',
          link: 'combustibles',
          icon: 'bi-fuel-pump-fill',
          can: store.can('puede.ver.combustibles'),
        },
        {
          title: 'Control diario',
          link: 'control-vehiculos',
          icon: 'bi-card-checklist',
          can: store.can('puede.ver.bitacoras_vehiculos'),
        },
        {
          title: 'Vehículos',
          link: 'vehiculos',
          icon: 'bi-car-front-fill',
          can: store.can('puede.ver.vehiculos'),
        },
      ]
    },
    //Modulo Activos Fijos
    {
      title: 'Activos fijos',
      icon: 'bi-list-check',
      can: store.can('puede.ver.modulo_activos_fijos'),
      children: [
        {
          title: 'Control de activos',
          link: 'activos-fijos',
          icon: 'bi-circle',
          can: store.can('puede.ver.activos_fijos'),
        },
      ],
    },
    /*********************************************************
     * Modulo de compras y proveedores
     *********************************************************/
    {
      title: 'Compras y proveedores',
      icon: 'bi-bag-fill',
      can: store.can('puede.ver.modulo_compras') || store.esAdministrador,
      children: [
        {
          title: 'Empresas',
          link: 'empresas',
          icon: 'bi-building-fill-gear',
          can: store.can('puede.acceder.empresas') || store.esAdministrador,
        },
        {
          title: 'Bancos',
          link: 'bancos',
          icon: 'bi-bank',
          can: store.can('puede.acceder.bancos') || store.esAdministrador,
        },
        {
          title: 'Proveedores',
          link: 'proveedores',
          icon: 'bi-boxes',
          can: store.can('puede.ver.proveedores') || store.esAdministrador,
        },
        {
          title: 'Datos Bancarios de Proveedores',
          link: 'datos-bancarios-proveedores',
          icon: 'bi-bank2',
          can: store.can('puede.ver.contactos_proveedores') || store.esAdministrador,
        },
        {
          title: 'Contactos de Proveedores',
          link: 'contactos-proveedores',
          icon: 'bi-people-fill',
          can: store.can('puede.ver.contactos_proveedores') || store.esAdministrador,
        },
        {
          title: 'Criterios de Calificacion de Proveedores',
          link: 'criterios-calificaciones',
          icon: 'bi-list-check',
          can: store.can('puede.ver.criterios_calificaciones') || store.esAdministrador,
        },
        {
          title: 'Categorias Tipo Oferta',
          link: 'categorias-ofertas',
          icon: 'bi-circle',
          can: store.can('puede.ver.categorias_ofertas') || store.esAdministrador,
        },
        {
          title: 'Preordenes de Compras',
          link: 'preordenes-compras',
          icon: 'bi-list',
          can: store.can('puede.ver.preordenes_compras') || store.esAdministrador,
        },
        {
          title: 'Ordenes de Compras',
          link: 'ordenes-compras',
          icon: 'bi-cart-plus',
          can: store.can('puede.ver.ordenes_compras') || store.esAdministrador,
        },
        {
          title: 'Reportes',
          icon: 'bi-clipboard2-data-fill',
          can: store.esAdministrador || store.esCompras || store.can('puede.ver.reportes_proveedores'),
          children: [
            {
              title: 'Reporte de Proveedores',
              link: 'reporte-proveedores',
              icon: 'bi-boxes',
              can: true || store.can('puede.ver.reporte_proveedores'),
            }
          ]
        },
        {
          title: 'Logs',
          icon: 'bi-file-text',
          can: store.esAdministrador,
          children: [
            {
              title: 'Contactos de Proveedores',
              link: 'logs-contactos-proveedores',
              icon: 'bi-person-fill-add',
              can: true,
            }
          ]
        },
      ]
    },
    {
      title: 'Ventas',
      icon: 'sell',
      can: store.can('puede.ver.modulo_ventas') || store.esAdministrador,
      children: [
        {
          title: 'Proformas',
          link: 'proformas',
          icon: 'bi-circle',
          can: store.can('puede.ver.proformas') || store.esAdministrador,
        },
        {
          title: 'Prefacturas',
          link: 'prefacturas',
          icon: 'bi-circle',
          can: store.can('puede.ver.prefacturas') || store.esAdministrador,
        },
      ]
    },
    {
      header: 'Administración',
      can: false,// store.can('puede.ver.modulo_administracion') && store.esActivosFijos,
    },
    {
      title: 'Configuracion General',
      link: 'configuracion',
      icon: 'bi-house-gear-fill',
      can: store.can('puede.ver.configuracion_general') || store.esAdministrador,
    },
    {
      title: 'Geografía General',
      icon: 'bi-globe-americas',
      can: store.esAdministrador,
      children: [
        {
          title: 'Provincias',
          link: 'provincias',
          icon: 'bi-circle',
          can: store.can('puede.acceder.provincias'),
        },
        {
          title: 'Cantones',
          link: 'cantones',
          icon: 'bi-circle',
          can: store.can('puede.acceder.cantones'),
        },
        {
          title: 'Parroquias',
          link: 'parroquias',
          icon: 'bi-circle',
          can: store.can('puede.acceder.parroquias'),
        },
      ]
    },
    {
      title: 'Proyectos y tareas',
      icon: 'bi-pin-angle-fill',
      can: store.esJefeTecnico || store.esAdministrador,
      children: [
        {
          title: 'Tipos de trabajos',
          link: 'tipos-trabajos',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_trabajos'),
        },
        {
          title: 'Causas intervenciones',
          link: 'causas-intervenciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.causas_intervenciones'),
        },
        {
          title: 'Motivos de trabajo pausado',
          link: 'motivos-pausas',
          icon: 'bi-circle',
          can: store.can('puede.ver.motivos_pausas'),
        },
        {
          title: 'Motivos de trabajo suspendido',
          link: 'motivos-suspendidos',
          icon: 'bi-circle',
          can: store.can('puede.ver.motivos_suspendidos'),
        },
        {
          title: 'Rutas para tareas',
          link: 'rutas-tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.rutas_tareas'),
        },
      ]
    },
    {
      title: 'Bodega',
      icon: 'bi-building-fill',
      can: store.can('puede.ver.modulo_administracion'),
      children: [
        {
          title: 'Autorizaciones',
          link: 'autorizaciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.autorizaciones') && store.esActivosFijos,
        },
        {
          title: 'Condiciones de productos',
          link: 'condiciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.condiciones') && store.esActivosFijos,
        },
        {
          title: 'Codigos de productos',
          link: 'codigos-clientes',
          icon: 'bi-circle',
          can: store.can('puede.ver.codigos_clientes') && store.esActivosFijos,
        },
        {
          title: 'Estados de transacciones',
          link: 'estados-transacciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.estados_transacciones') && store.esActivosFijos,
        },
        {
          title: 'Hilos',
          link: 'hilos',
          icon: 'bi-circle',
          can: store.can('puede.ver.hilos'),
        },
        {
          title: 'Tipos de Fibras',
          link: 'tipos-fibras',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_fibras'),
        },
        {
          title: 'Motivos',
          link: 'motivos',
          can: store.can('puede.ver.motivos') && store.esActivosFijos,
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de Transacciones',
          link: 'tipos-transacciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_transacciones') && false,
        },
        {
          title: 'Perchas',
          link: 'perchas',
          icon: 'bi-circle',
          can: store.can('puede.ver.perchas'),
        },
        {
          title: 'Pisos',
          link: 'pisos',
          icon: 'bi-circle',
          can: store.can('puede.ver.pisos'),
        },
        {
          title: 'Sucursales',
          link: 'sucursales',
          icon: 'bi-circle',
          can: store.can('puede.acceder.sucursales') || store.esActivosFijos,
        },
        {
          title: 'Ubicaciones',
          link: 'ubicaciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.ubicaciones'),
        },
        {
          title: 'Unidades de medida',
          link: 'unidades-medidas',
          icon: 'bi-circle',
          can: store.can('puede.ver.unidades_medidas') && store.esActivosFijos,
          // can: true,
        },
      ]
    },
    {
      title: 'Clientes',
      link: 'clientes',
      icon: 'bi-person-circle',
      can: store.can('puede.ver.clientes'),
    },
    {
      title: 'Roles y Permisos',
      icon: 'bi-person-fill-gear',
      can: store.esAdministrador,
      children: [
        {
          title: 'Roles',
          link: 'roles',
          icon: 'bi-person-badge-fill',
          can: store.esAdministrador || store.can('puede.ver.roles'),
        },
        {
          title: 'Permisos',
          link: 'permisos',
          icon: 'bi-key-fill',
          can: store.esAdministrador || store.can('puede.ver.permisos'),
        },
        {
          title: 'Permisos en roles',
          link: 'permisos-roles',
          icon: 'bi-person-fill-check',
          can: store.esAdministrador || store.can('puede.ver.permisos_roles'),
        },
        {
          title: 'Permisos de usuarios',
          link: 'permisos-usuarios',
          icon: 'bi-person-fill-lock',
          can: store.esAdministrador || store.can('puede.ver.permisos_usuarios'),
        },
      ]
    },


    /* {
      header: 'Sistema',
    },
    {
      title: 'Perfil',
      icon: 'bi-person-fill',
      link: 'perfil',
    },
    {
      title: 'Configuración',
      icon: 'bi-gear-fill',
      children: [
        {
          title: 'Imprimir / Exportar',
          link: 'tareas',
          icon: 'bi-circle',
        },
        {
          title: 'Empresa',
          link: 'control-progresivas',
          icon: 'bi-circle',
        },
      ],
    }, */
  ])

  return {
    links,
  }
})
