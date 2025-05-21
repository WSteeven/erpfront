import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const ventasClaro: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()

  return [
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
          title: 'Estadistica',
          icon: 'bi-gear',
          children: [
            {
              title: 'Propuesta Comisional',
              link: 'bases-comisiones',
              icon: 'bi-card-list',
              can: store.can('puede.acceder.bases_comisiones') || true
            },
            {
              title: 'Seguimiento Ventas',
              link: 'seguimiento-ventas',
              icon: 'bi-card-list',
              can: store.can('puede.acceder.seguimiento_ventas') || true
            }
          ]
        },
        {
          title: 'Configuracion',
          icon: 'bi-gear',
          children: [
            {
              title: 'Estados',
              link: 'estados-claro',
              icon: 'bi-card-list',
              can: store.can('puede.acceder.estados_claro')
            },
            {
              title: 'Planes',
              link: 'planes',
              icon: 'bi-card-list',
              can: store.can('puede.acceder.planes')
            },
            {
              title: 'Modalidad de Vendedores',
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
    }
  ]
})

export default ventasClaro
