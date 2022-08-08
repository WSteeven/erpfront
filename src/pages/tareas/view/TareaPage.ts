// Dependencias
import { defineComponent, ref, reactive } from 'vue'
import { provincias, ciudades } from 'src/config/utils'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { Tarea } from '../domain/Tarea'
import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'

export default defineComponent({
  name: 'TareaPage',
  components: { TabLayout },
  setup() {
    const authentication = useAuthenticationStore()
    const credentiales = new UserLogin()
    credentiales.email = 'admin@admin.com'
    credentiales.password = 'password'
    // authentication.login(credentiales)
    const $q = useQuasar()

    const tarea = reactive(new Tarea())

    const toggle = ref(false)
    function enviar() {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted',
      })
    }

    // let datos

    // async function obtener() {
    // datos = await axios.get('http://jpconstrucred.test/api/categorias')
    // }
    authentication.getUser()

    return {
      tarea,
      toggle,
      enviar,
      authentication,
      provincias,
      ciudades,
    }
  },
})
