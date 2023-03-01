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
      can: !store.can('puede.ver.trabajo_asignado'),
    },
    {
      title: 'Trabajo asignado',
      link: 'trabajo-asignado',
      icon: 'bi-check2-square',
      can: store.can('puede.ver.trabajo_asignado'),
    },
    {
      title: 'Reportes control de materiales',
      link: 'reportes-control-materiales',
      icon: 'bi-table',
      can: store.can('puede.ver.reportes_control_materiales'),
    },
    {
      title: 'Control de asistencia',
      link: 'control-asistencia',
      icon: 'bi-person-check',
    },
    {
      title: 'Tablero',
      icon: 'bi-layers-fill',
      link: '/admin',
    },
    {
      title: 'Gestión de trabajos',
      icon: 'bi-pin-angle',
      can: store.can('puede.ver.modulo_tareas'),
      children: [
        /*{
          title: 'Trabajo asignado',
          link: 'trabajo-asignado',
          icon: 'bi-circle-fill',
          can: store.can('puede.ver.trabajo_asignado'),
        },*/
        {
          title: 'Proyectos',
          link: 'proyectos',
          icon: 'bi-circle',
          can: store.can('puede.ver.proyectos'),
        },
        {
          title: 'Tareas',
          link: 'tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tareas'),
        },
        {
          title: 'Hoja de control',
          link: 'hoja-control-trabajos',
          icon: 'bi-circle',
          can: store.can('puede.ver.hoja_control_trabajos'),
        },
        {
          title: 'Tipos de trabajos',
          link: 'tipos-trabajos',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_trabajos'),
        },
        {
          title: 'Reportes',
          icon: 'bi-circle',
          children: [
            {
              title: 'Control de materiales diario',
              link: 'reportes-control-materiales',
              icon: 'bi-dash',
              can: store.can('puede.ver.reportes_control_materiales'),
            },
            {
              title: 'Control de tendidos',
              link: 'reportes-control-tendidos',
              icon: 'bi-dash',
              can: store.can('puede.ver.reportes_control_tendidos'),
            },
            {
              title: 'Trabajos realizados',
              link: 'reporte-trabajos-realizados',
              icon: 'bi-dash',
              can: store.can('puede.ver.reporte_trabajos_realizados'),
            },
          ],
        },
        /* {
          title: 'Informes',
          link: 'informes',
          icon: 'bi-circle',
        },
        {
          title: 'Control diario de materiales',
          link: 'control-diario-materiales',
          icon: 'bi-circle',
        }, */
        {
          title: 'Control de cambios',
          link: 'control-cambios',
          icon: 'bi-circle',
        },
        {
          title: 'Clientes finales',
          link: 'clientes-finales',
          icon: 'bi-people-fill',
        },
      ],
    },
    {
      title:'Notificaciones',
      icon: 'bi-bell',
      link: 'notificaciones',
      can: true
    },
    {
      title: 'Bodega',
      icon: 'bi-building',
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
          can: store.esActivosFijos,//store.can('puede.ver.control_stock'),
          icon: 'bi-circle',
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
          can: store.esBodeguero,// can('puede.ver.detalles'),
        },
        {
          title: 'Inventario',
          link: 'inventarios',
          icon: 'bi-circle',
          can: store.can('puede.ver.inventarios'),
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
          title: 'Ingreso de materiales',
          link: 'transacciones-ingresos',
          can: store.can('puede.ver.transacciones_ingresos') && store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: store.esBodeguero ? 'Egreso de materiales' : 'Pedidos a bodega',
          link: 'transacciones-egresos',
          // can: store.can('puede.ver.transacciones_egresos'),
          can: store.can('puede.ver.transacciones_ingresos') && store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: 'Transferencias',
          link: 'transferencias',
          can: store.can('puede.ver.transacciones_ingresos') && store.esBodeguero,
          icon: 'bi-circle',
        },
        {
          title: 'Traspasos',
          link: 'traspasos',
          can: store.can('puede.ver.traspasos'),
          icon: 'bi-circle',
        },
        {
          title: 'Reportes',
          icon: 'bi-circle',
          can: store.esBodeguero,
          children: [
            {
              title: 'Reporte de ingresos',
              link: 'reporte-ingresos',
              icon: 'bi-dash',
            },
            {
              title: 'Reporte de egresos',
              link: 'reporte-egresos',
              icon: 'bi-dash',
            },
            {
              title: 'Reporte de transferencias',
              link: 'reporte-transferencias',
              icon: 'bi-dash',
            },
            {
              title: 'Reporte item',
              link: 'reporte-item1',
              icon: 'bi-dash',
            },
            {
              title: 'Reporte item',
              link: 'reporte-item2',
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
      children: [
        {
          title: 'Gastos',
          link: 'gasto',
          icon: 'bi-circle',
          can: store.can('puede.ver.gasto'),
        },
        {
          title: 'Detalle Fondos',
          icon: 'bi-list-task',
          children: [ {
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
          title: 'Saldo',
          icon: 'bi-cash',
          children:[
            {
              title: 'Acreditacion',
              link: 'acreditacion',
              icon: 'bi-circle',
              can: store.can('puede.ver.acreditacion'),
            },
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-clipboard2-data-fill',
          children:[
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
          title: 'Grupos',
          link: 'grupos',
          icon: 'bi-circle',
          can: store.can('puede.ver.grupos'),
        },
      ],
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
    {
      header: 'Administración',
      can: false,// store.can('puede.ver.modulo_administracion') && store.esActivosFijos,
    },
    {
      title: 'Bodega',
      icon: 'bi-ui-checks-grid',
      can: store.can('puede.ver.modulo_administracion'),
      children: [
        {
          title: 'Autorizaciones',
          link: 'autorizaciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.autorizaciones'),
        },
        {
          title: 'Condiciones de productos',
          link: 'condiciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.condiciones'),
        },
        {
          title: 'Codigos de productos',
          link: 'codigos-clientes',
          icon: 'bi-circle',
          can: store.can('puede.ver.codigos_clientes'),
        },
        {
          title: 'Empresas',
          link: 'empresas',
          icon: 'bi-circle',
          can: store.can('puede.ver.empresas'),
        },
        {
          title: 'Estados de transacciones',
          link: 'estados-transacciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.estados_transacciones'),
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
          can: store.can('puede.ver.motivos'),
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de Transacciones',
          link: 'transacciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_transacciones'),
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
          can: store.can('puede.ver.sucursales'),
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
          can: store.can('puede.ver.unidades_medidas'),
          // can: true,
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
