import { MenuOption } from "shared/menu/MenuOption";
import { useAuthenticationStore } from "stores/authentication";
import { computed, Ref } from "vue";

const seleccionContratacionPersonal: Ref<MenuOption[]> = computed(() => {
    const store = useAuthenticationStore()
    return [
        {
            title: 'Selección de Personal',
            icon: 'bi-person-bounding-box',
            can: true,
            children: [
                {
                    title: 'Solicitud de Personal',
                    link: 'solicitudes-puestos',
                    icon: 'bi-file-text',
                    can: store.can('puede.acceder.solicitudes_puestos'),
                },
                
            ],
        },

    ]
}) 

export default seleccionContratacionPersonal