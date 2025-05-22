import { useAuthenticationStore } from 'stores/authentication'
import {defineComponent} from 'vue';

export default defineComponent({
    setup() {
        const store = useAuthenticationStore()

        return {
            store
        }
    }
})
