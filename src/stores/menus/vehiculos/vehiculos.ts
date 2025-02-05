import { MenuOption } from 'shared/menu/MenuOption'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, Ref } from 'vue'

const vehiculos: Ref<MenuOption[]> = computed(() => {
  const store = useAuthenticationStore()
  return [
    {
      title: 'Vehículos',
      icon: 'fa-solid fa-car',
      can: store.esAdministrador || store.can('puede.acceder.modulo_vehiculos'),
      module: true,
      children: [
        {
          title: 'Historial Vehicular',
          link: 'historial-vehiculos',
          icon: 'bi-file-earmark-text',
          can: store.can('puede.acceder.historial_vehiculos')
        },
        {
          title: 'Conductores',
          link: 'conductores',
          icon: 'bi-person-check-fill',
          can: store.can('puede.acceder.conductores')
        },
        {
          title: 'Multas de Conductores',
          link: 'multas-conductores',
          icon: 'bi-exclamation-octagon-fill',
          can: store.can('puede.acceder.multas_conductores')
        },
        {
          title: 'Vehículos',
          link: 'vehiculos',
          icon: 'bi-car-front-fill',
          can: store.can('puede.acceder.vehiculos')
        },
        {
          title: 'Vehículos Asignados',
          link: 'asignaciones-vehiculos',
          icon: 'bi-clipboard-check-fill',
          can: store.can('puede.acceder.asignaciones_vehiculos')
        },
        {
          title: 'Transferencias Vehículos entre Choferes',
          link: 'transferencias-vehiculos',
          icon: 'bi-arrow-left-right',
          can: store.can('puede.acceder.transferencias_vehiculos')
        },
        {
          title: 'Tipos de Vehículos',
          link: 'tipos-vehiculos',
          icon: 'bi-list-check',
          can: store.can('puede.acceder.tipos_vehiculos')
        },
        {
          title: 'Garajes',
          link: 'garajes',
          icon: 'bi-building',
          can: store.can('puede.acceder.garajes')
        },
        {
          title: 'Combustibles',
          link: 'combustibles',
          icon: 'bi-fuel-pump',
          can: store.can('puede.acceder.combustibles')
        },
        {
          title: 'Tanqueo de Combustible',
          link: 'tanqueos-vehiculos',
          icon: 'bi-fuel-pump',
          can: store.can('puede.acceder.tanqueos_vehiculos')
        },
        {
          title: 'Control Diario',
          link: 'control-vehiculos',
          icon: 'bi-clipboard-check-fill',
          can: store.can('puede.acceder.bitacoras_vehiculos')
        },
        {
          title: 'Registro de Incidentes',
          link: 'registros-incidentes',
          icon: 'bi-exclamation-triangle-fill',
          can: store.can('puede.acceder.registros_incidentes')
        },
        {
          title: 'Orden Interna de Reparación',
          link: 'ordenes-reparaciones',
          icon: 'bi-wrench',
          can: store.can('puede.acceder.ordenes_reparaciones')
        },
        {
          title: 'Pólizas Seguros Vehiculares',
          link: 'seguros',
          icon: 'bi-shield-fill',
          can: store.can('puede.acceder.seguros_vehiculares')
        },
        {
          title: 'Matrículas',
          link: 'matriculas',
          icon: 'bi-card-heading',
          can: store.can('puede.acceder.matriculas_vehiculos')
        },
        {
          title: 'Mantenimiento',
          link: 'servicios',
          icon: 'bi-tools',
          can: store.can('puede.acceder.mantenimientos_vehiculos'),
          children: [
            {
              title: 'Mantenimientos de Vehiculos',
              link: 'mantenimientos-vehiculos',
              icon: 'bi-tools',
              can: store.can('puede.acceder.mantenimientos_vehiculos')
            },
            {
              title: 'Servicios de Mantenimientos',
              link: 'servicios',
              icon: 'bi-gear-fill',
              can: store.can('puede.acceder.servicios_mantenimientos')
            },
            {
              title: 'Planes de Mantenimiento',
              link: 'planes-mantenimientos',
              icon: 'bi-gear-fill',
              can: store.can('puede.acceder.planes_mantenimientos')
            }
          ]
        },
        {
          title: 'Reportes',
          icon: 'bi-graph-up-arrow',
          can: store.can('puede.acceder.reportes_vehiculos'),
          children: [
            {
              title: 'Reporte de Conductores y Licencias',
              link: 'reporte-conductores',
              icon: 'bi-card-checklist',
              can: true
            },
            {
              title: 'Dashboard de Combustibles',
              // title: 'Reporte de Combustibles',
              link: 'reporte-combustibles',
              icon: 'bi-fuel-pump',
              can: true
            },
            {
              title: 'Reporte de Bitácoras',
              link: 'reporte-bitacoras',
              icon: 'bi-files',
              can: true
            },
            {
              title: 'Reporte de Pólizas',
              link: 'reporte-seguros',
              icon: 'bi-shield-fill',
              can: true
            },
            {
              title: 'Reporte de Tiempos de Vehículos',
              link: 'reporte-tiempos-vehiculos',
              icon: 'bi-clock-fill',
              can: true
            },
            {
              title: 'Reporte de matriculas',
              link: 'reporte-matriculas',
              icon: 'bi-file-earmark-text-fill',
              can: true
            }
          ]
        }
      ]
    }
  ]
})

export default vehiculos
