import { defineStore } from 'pinia'
import { MenuOption } from 'shared/menu/MenuOption'
import { computed, Ref } from 'vue'
import { useAuthenticationStore } from './authentication'

export const useMenuStore = defineStore('menu', () => {
  const store = useAuthenticationStore()

  function checkRol(rol) {
    return rol == "ADMINISTRATIVO"
  }

  // State
  const links: Ref<MenuOption[]> = computed(() => [
    {
      header: 'Modulos',
    },
    {
      title: 'Inicio',
      icon: 'bi-house',
      link: '/',
    },
    {
      title: 'Tablero',
      icon: 'bi-layers-fill',
      link: '/admin',
    },
    {
      title: 'Tareas',
      icon: 'bi-paperclip',
      can: store.can('puede.ver.modulo_tareas'),
      children: [
        {
          title: 'Trabajo asignado',
          link: 'trabajo-asignado',
          icon: 'bi-circle',
          can: store.can('puede.ver.trabajo_asignado'),
        },
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tareas'),
        },
        {
          title: 'Tipos de trabajos',
          link: 'tipos-trabajos',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_trabajos'),
        },
        {
          title: 'Control de asistencia',
          link: 'control-asistencia',
          icon: 'bi-circle',
        },
        {
          title: 'Solicitud de materiales a bodega',
          link: 'solicitud-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Devolución de materiales a bodega',
          link: 'solicitud-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Tendidos',
          icon: 'bi-circle',
          children: [
            {
              title: 'Control de tendidos',
              link: 'control-tendidos',
              icon: 'bi-dash',
              can: store.can('puede.ver.control_tendidos'),
            },
            {
              title: 'Tipos de elementos',
              link: 'tipos-elementos',
              icon: 'bi-dash',
            },
            {
              title: 'Propietarios de elementos',
              link: 'tipos-tareas',
              icon: 'bi-dash',
            },
          ],
        },
        {
          title: 'Informes',
          link: 'informes',
          icon: 'bi-circle',
        },
        {
          title: 'Control diario de materiales',
          link: 'control-diario-materiales',
          icon: 'bi-circle',
        },
        {
          title: 'Control de cambios',
          link: 'control-cambios',
          icon: 'bi-circle',
        },
      ],
    },
    {
      title: 'Bodega',
      icon: 'bi-ui-checks-grid',
      can: store.can('puede.ver.modulo_bodega'),
      children: [
        {
          title: 'Categorías',
          link: 'categorias',
          can: store.can('puede.ver.categorias'),
          icon: 'bi-circle',
        },
        {
          title: 'Control de Stock',
          link: 'control-stock',
          can: store.can('puede.ver.control_stock'),
          icon: 'bi-circle',
        },
        {
          title: 'Marcas',
          link: 'marcas',
          can: store.can('puede.ver.marcas'),
          icon: 'bi-circle',
        },
        {
          title: 'Modelos',
          link: 'modelos',
          can: store.can('puede.ver.modelos'),
          icon: 'bi-circle',
        },
        {
          title: 'Productos',
          link: 'productos',
          icon: 'bi-circle',
          can: store.can('puede.ver.productos'),
        },
        {
          title: 'Detalles de productos',
          link: 'detalles',
          icon: 'bi-circle',
          can: store.can('puede.ver.detalles'),
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
          can: store.can('puede.ver.productos_perchas'),
        },
        {
          title: 'Préstamos',
          link: 'prestamos',
          can: store.can('puede.ver.prestamos'),
          icon: 'bi-circle',
        },
        {
          title: 'Ingreso de materiales',
          link: 'transacciones-ingresos',
          can: store.can('puede.ver.transacciones_ingresos'),
          icon: 'bi-circle',
        },
        {
          title: (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1)).length > 0 ? 'Egreso de materiales' : 'Pedidos a bodega',
          link: 'transacciones-egresos',
          can: store.can('puede.ver.transacciones_egresos'),
          icon: 'bi-circle',
        },
        {
          title: 'Reportes',
          icon: 'bi-circle',
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
      can: store.can('puede.ver.modulo_administracion'),
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
          title: 'Subtipos de Transacciones',
          link: 'subtipos-transacciones',
          can: store.can('puede.ver.subtipos_transacciones'),
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de Transacciones',
          link: 'tipos-transacciones',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_transacciones'),
        },
        {
          title: 'Inventario',
          link: 'inventario',
          icon: 'bi-circle',
          can: store.can('puede.ver.inventarios'),
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
      ]
    },
    {
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
    },
  ])

  return {
    links,
  }
})
