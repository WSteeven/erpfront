import { computed, Ref } from 'vue';
import { MenuOption } from 'shared/menu/MenuOption';
import { useAuthenticationStore } from 'stores/authentication';

const comprasProveedores: Ref<MenuOption[]> = computed((() => {
    const store = useAuthenticationStore()
    return [
        {
            title: 'Compras y proveedores',
            icon: 'fa-solid fa-cart-shopping',
            can: store.can('puede.acceder.modulo_compras') || store.esAdministrador,
            module: true,
            children: [
                {
                    title: 'Dashboard',
                    link: 'dashboard-ordenes-compras',
                    icon: 'bi-bar-chart',
                    can: store.can('puede.acceder.dashboard_ordenes_compras')
                },
                {
                    title: 'Generador de cash',
                    link: 'generador-cash',
                    icon: 'bi-cash-stack',
                    can: store.can('puede.acceder.generador_cash')
                },
                {
                    title: 'Empresas',
                    link: 'empresas',
                    icon: 'bi-building',
                    can: store.can('puede.acceder.empresas') || store.esAdministrador
                },
                {
                    title: 'Bancos',
                    link: 'bancos',
                    icon: 'bi-bank',
                    can: store.can('puede.acceder.bancos') || store.esAdministrador
                },
                {
                    title: 'Proveedores',
                    link: 'proveedores',
                    icon: 'bi-people',
                    can: store.can('puede.acceder.proveedores') || store.esAdministrador
                },
                {
                    title: 'Proveedores Internacionales',
                    link: 'proveedores-internacionales',
                    icon: 'bi-people',
                    can:
                        store.can('puede.acceder.proveedores_internacionales') ||
                        store.esAdministrador
                },
                {
                    title: 'Datos Bancarios de Proveedores',
                    link: 'datos-bancarios-proveedores',
                    icon: 'bi-bank2',
                    can:
                        store.can('puede.acceder.contactos_proveedores') ||
                        store.esAdministrador
                },
                {
                    title: 'Contactos de Proveedores',
                    link: 'contactos-proveedores',
                    icon: 'bi-person-lines',
                    can:
                        store.can('puede.acceder.contactos_proveedores') ||
                        store.esAdministrador
                },
                {
                    title: 'Criterios de Calificacion de Proveedores',
                    link: 'criterios-calificaciones',
                    icon: 'bi-check-circle',
                    can:
                        store.can('puede.acceder.criterios_calificaciones') ||
                        store.esAdministrador
                },
                {
                    title: 'Categorias Tipo Oferta',
                    link: 'categorias-ofertas',
                    icon: 'bi-tags',
                    can:
                        store.can('puede.acceder.categorias_ofertas') ||
                        store.esAdministrador
                },
                {
                    title: 'Preordenes de Compras',
                    link: 'preordenes-compras',
                    icon: 'bi-cart',
                    can:
                        store.can('puede.acceder.preordenes_compras') ||
                        store.esAdministrador
                },
                {
                    title: 'Ordenes de Compras',
                    link: 'ordenes-compras',
                    icon: 'bi-cart-plus',
                    can:
                        store.can('puede.acceder.ordenes_compras') || store.esAdministrador
                },
                {
                    title: 'Pago a Proveedores',
                    link: 'pagos-proveedores',
                    icon: 'bi-cash-stack',
                    can:
                        store.can('puede.acceder.pagos_proveedores') ||
                        store.esAdministrador
                },
                {
                    title: 'Reportes',
                    icon: 'bi-graph-up-arrow',
                    can:
                        store.esAdministrador ||
                        store.esCompras ||
                        store.can('puede.acceder.reportes_proveedores'),
                    children: [
                        {
                            title: 'Reporte de Proveedores',
                            link: 'reporte-proveedores',
                            icon: 'bi-bar-chart',
                            can: store.can('puede.acceder.reporte_proveedores')
                        },
                        {
                            title: 'Reporte de Calificaciones y Recalificaciones',
                            link: 'reporte-calificaciones-proveedores',
                            icon: 'bi-bar-chart',
                            can: store.can('puede.acceder.reporte_calificaciones_proveedores')
                        },
                        {
                            title: 'Reporte de Ordenes de Compras',
                            link: 'reporte-ordenes-compras',
                            icon: 'bi-file-earmark-bar-graph',
                            can: store.can('puede.acceder.reporte_ordenes_compras')
                        }
                    ]
                },
                {
                    title: 'Logs',
                    icon: 'bi-journal-text',
                    can: store.esAdministrador,
                    children: [
                        {
                            title: 'Contactos de Proveedores',
                            link: 'logs-contactos-proveedores',
                            icon: 'bi-person-lines',
                            can: true
                        }
                    ]
                }
            ]
        },
    ]
}))

export default comprasProveedores;