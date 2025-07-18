import { useAuthenticationStore } from './authentication'
import { MenuOption } from 'src/shared/menu/MenuOption'
import { defineStore } from 'pinia'
import { computed, Ref } from 'vue'
import seleccionContratacionPersonal from './menus/rrhh/seleccionContratacionPersonal'
import trabajoSocial from 'stores/menus/rrhh/trabajoSocial'
import controlPersonal from 'stores/menus/rrhh/controlPersonal'
import vehiculos from './menus/vehiculos/vehiculos'
import menuSeguridad from './menus/seguridad/menuSeguridad'
import comprasProveedores from 'stores/menus/comprasProveedores/comprasProveedores'
import telconet from 'stores/menus/appenate/telconet'
import menuBodega from 'stores/menus/bodega/menuBodega';
import menuFondosRotativos from 'stores/menus/fondosRotativos/menuFondosRotativos';

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
        }
      ]
    },

    /*****************************************************************************
     * MÓDULO DE BODEGA.
     * Toda la estructura de pedidos, devoluciones y despachos de materiales
     *****************************************************************************/
      ...menuBodega.value,
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
            },
            {
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
        ...controlPersonal.value,
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
            }
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
        }
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
