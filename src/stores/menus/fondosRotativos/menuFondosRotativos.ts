import { computed, Ref } from 'vue'
import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'

const menuFondosRotativos: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
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
              title: 'Reporte Valijas',
              link: 'reporte-valijas',
              icon: 'bi-suitcase-lg', // Cambiado de 'bi-calendar-check' a Font Awesome
              can: store.can('puede.acceder.reporte_valijas')
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
    }
  ]
})

export default menuFondosRotativos
