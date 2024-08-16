import { MenuOption } from 'src/shared/menu/MenuOption';
import { useAuthenticationStore } from 'src/stores/authentication';
import { computed, Ref } from 'vue';

const seleccionContratacionPersonal: Ref<MenuOption[]> = computed(() => {
    const store = useAuthenticationStore()
    return [
        {
            title: 'Seleccion y Contratacion',
            icon: 'bi-person-lines-fill',
            can: store.can('puede.ver.modulo_seleccion_contratacion'),
            children: [
                {
                    title: 'Solicitud de Personal',
                    link: 'solicitudes-puestos',
                    icon: 'bi-file-text',
                    can: store.can('puede.acceder.rrhh_solicitudes_nuevas_vacantes'),
                },
                {
                    title: 'Vacantes',
                    link: 'vacantes',
                    icon: 'bi-app',
                    can: store.can('puede.acceder.rrhh_vacantes'),
                },
                {
                    title: 'Postulaciones',
                    link: 'postulaciones',
                    icon: 'bi-app',
                    can: store.can('puede.acceder.rrhh_postulaciones'),
                },
                {
                    title: 'Configuracion',
                    icon: 'bi-gear-fill',
                    children: [
                        {
                            title: 'Areas de conocimiento',
                            link: 'areas-conocimientos',
                            icon: 'bi-circle',
                            can: store.can('puede.acceder.rrhh_areas_conocimientos'),
                        },
                        {
                            title: 'Modalidades de Trabajo',
                            link: 'modalidades-trabajo',
                            icon: 'bi-circle',
                            can: store.can('puede.acceder.rrhh_modalidades_trabajo'),
                        },
                        {
                            title: 'Tipos de Puestos de Trabajo',
                            link: 'tipos-puestos',
                            icon: 'bi-circle',
                            can: store.can('puede.acceder.rrhh_tipos_puestos'),
                        },
                    ]
                }

            ]
        },
    ]
})

export default seleccionContratacionPersonal
