// Dependencias
import { configuracionColumnas } from '../domain/configuracionColumnas'
import { defineComponent, ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import EssentialTable from 'src/components/EssentialTable.vue'

// Logica y controladores
import { Tarea } from '../domain/Tarea'
import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from 'pages/sistema/authentication/login/domain/UserLogin'

export default defineComponent({
  name: 'TareaPage',
  components: { EssentialTable },
  setup() {
    const authentication = useAuthenticationStore()
    const credentiales = new UserLogin()
    credentiales.email = 'admin@admin.com'
    credentiales.password = 'password'
    // authentication.login(credentiales)
    const $q = useQuasar()

    const tarea = reactive(new Tarea())

    const datos = [
      {
        tarea_jp: 'JP001',
        tarea_cliente: 'ADD878',
      },
    ]

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
      datos,
      configuracionColumnas,
      toggle,
      enviar,
      authentication,
    }
  },
})
