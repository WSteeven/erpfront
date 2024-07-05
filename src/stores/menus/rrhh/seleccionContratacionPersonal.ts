import { MenuOption } from "shared/menu/MenuOption";
import { useAuthenticationStore } from "stores/authentication";
import { computed, Ref } from "vue";

const seleccionContratacionPersonal: Ref<MenuOption[]> = computed(() => {
    const store = useAuthenticationStore()
    return [
        {
            title: 'Seleccion y Contratacion',
            icon: 'bi-person-lines-fill',
            can: store.can('puede.ver.modulo.seleccion_contratacion'),
            children: [
                {
                    title: 'Solicitud de Personal',
                    link: 'solicitudes-puestos',
                    icon: 'bi-file-text',
                    can: store.can('puede.acceder.solicitudes_puestos'),
                },
                {
                    title: 'Solicitud de Puesto de Empleo',
                    link: 'solicitud-puesto-empleo',
                    icon: 'bi-app',
                    can: store.can('puede.acceder.solicitud_puesto_empleo'),
                },
                {
                    title: 'Publicacion de Puesto de Empleo',
                    link: 'publicacion-puesto-empleo',
                    icon: 'bi-app',
                    can: store.can('puede.acceder.publicacion_puesto_empleo'),
                },
            ]
        },
    ]
})

export default seleccionContratacionPersonal