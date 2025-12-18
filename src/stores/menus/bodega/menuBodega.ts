import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const menuBodega: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
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
          can: store.esActivosFijos ||store.esBodeguero ||store.can('puede.acceder.categorias'),
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
              can: true // store.can('puede.acceder.aceptar_transferencia_producto')
            }
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
              title: 'Reporte de vida útil EPPs',
              link: 'reporte-vida-util-epps',
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
    }
  ]
})

export default menuBodega
