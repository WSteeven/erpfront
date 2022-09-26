import { defineStore } from 'pinia'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from './authentication'

export const useMenuStore = defineStore('menu', () => {
  const store = useAuthenticationStore()
  // State
  const links: MenuOption[] = [
    {
      header: 'Modulos',
    },
    {
      title: 'Tablero',
      icon: 'bi-layers-fill',
      link: '/',
    },
    {
      title: 'Tareas',
      icon: 'bi-paperclip',
      can: store.can('puede.ver.modulo_tareas'),
      children: [
        {
          title: 'Control de tareas',
          link: 'tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tareas'),
        },
        {
          title: 'Tipos de tareas',
          link: 'tipos-tareas',
          icon: 'bi-circle',
          can: store.can('puede.ver.tipos_tareas'),
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
          title: 'Progresivas',
          icon: 'bi-circle',
          children: [
            {
              title: 'Control de progresivas',
              link: 'control-progresivas',
              icon: 'bi-dash',
              can: store.can('puede.ver.control_progresivas'),
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
          icon: 'bi-circle',
        },
        {
          title: 'Marcas',
          link: 'marcas',
          icon: 'bi-circle',
        },
        {
          title: 'Modelos',
          link: 'modelos',
          icon: 'bi-circle',
        },
        {
          title: 'Productos',
          link: 'productos',
          icon: 'bi-circle',
        },
        {
          title: 'Detalles de productos',
          link: 'detalles',
          icon: 'bi-circle',
        },
        {
          title: 'Inventario',
          link: 'inventarios',
          icon: 'bi-circle',
        },
        {
          title: 'Ingreso de materiales',
          icon: 'bi-circle',
          children:[
            {
              title: 'Nuevo',
              link: 'nuevo-ingreso',
              icon: 'bi-dash',
            },
            {
              title: 'Pendientes',
              link: 'ingresos-pendientes',
              icon: 'bi-dash',
            },
            {
              title: 'Completados',
              link: 'ingresos-completados',
              icon: 'bi-dash',
            },
          ]
        },
        {
          title: 'Salida de materiales',
          icon: 'bi-circle',
          children:[
            {
              title: 'Nuevo',
              link: 'nuevo-egreso',
              icon: 'bi-dash',
            },
            {
              title: 'Pendientes',
              link: 'egresos-pendientes',
              icon: 'bi-dash',
            },
            {
              title: 'Completados',
              link: 'egresos-completados',
              icon: 'bi-dash',
            },
          ]
        },
        {
          title: 'Transferencias entre bodegas',
          link: 'transferencias',
          icon: 'bi-circle',
        },
        {
          title: 'Liquidaciones',
          link: 'liquidaciones',
          icon: 'bi-circle',
        },
        {
          title: 'Reportes',
          icon: 'bi-circle',
          children:[
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
    {
      header:'Administración',
    },
    {
      title: 'Bodega',
      icon: 'bi-ui-checks-grid',
      children: [
        {
          title: 'Autorizaciones',
          link: 'autorizaciones',
          icon: 'bi-circle',
        },
        {
          title: 'Condiciones de productos',
          link: 'condiciones',    
          icon: 'bi-circle',
        },
        {
          title: 'Codigos de productos',
          link: 'codigos-clientes',    
          icon: 'bi-circle',
        },
        {
          title: 'Estados de transacciones',
          link: 'estados-transacciones',
          icon: 'bi-circle',
        },
        {
          title: 'Hilos',
          link: 'hilos',    
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de Fibras',
          link: 'tipos-fibras',    
          icon: 'bi-circle',
        },
        {
          title: 'Subtipos de Transacciones',
          link: 'subtipos-transacciones',    
          icon: 'bi-circle',
        },
        {
          title: 'Tipos de Transacciones',
          link: 'tipos-transacciones',    
          icon: 'bi-circle',
        },
        {
          title: 'Inventario',
          link: 'inventario',
          icon: 'bi-circle',
        },
        {
          title: 'Ingreso de materiales',
          icon: 'bi-circle',
          children:[
            {
              title: 'Nuevo',
              link: 'nuevo-ingreso',
              icon: 'bi-dash',
            },
            {
              title: 'Pendientes',
              link: 'ingresos-pendientes',
              icon: 'bi-dash',
            },
            {
              title: 'Completados',
              link: 'ingresos-completados',
              icon: 'bi-dash',
            },
          ]
        },
        {
          title: 'Perchas',
          link: 'perchas',
          icon: 'bi-circle',
        },
        {
          title: 'Pisos',
          link: 'pisos',
          icon: 'bi-circle',
        },
        {
          title: 'Sucursales',
          link: 'sucursales',
          icon: 'bi-circle',
        },
        {
          title: 'Ubicaciones',
          link: 'ubicaciones',
          icon: 'bi-circle',
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
  ]

  return {
    links,
  }
})
