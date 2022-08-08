import {computed, defineComponent, reactive} from "vue"
import {Perfil} from "../domain/Perfil.domain"
import {useField} from "vee-validate"
import {SesionUsuario} from "@/router/sesionUsuario"
import {PerfilController} from "../infraestructure/Perfil.controller"
import {ActualizarPerfil} from "../application/ActualizarPerfil.application"
import {EliminarCuenta} from "../application/EliminarCuenta.application"

export default defineComponent({
  name: "Perfil",
  setup() {
    const perfilUsuario = reactive(new Perfil())
    const controller = new PerfilController()

    const actualizarPerfil = () =>
      new ActualizarPerfil(perfilUsuario, controller).execute()

    const eliminarCuenta = async () =>
      new EliminarCuenta(perfilUsuario, controller).execute()

    const sesionUsuario = SesionUsuario.getInstance()
    const info = computed(() => sesionUsuario.obtenerInformacionUsuario())
    perfilUsuario.hydrate(info.value)

    // Validator function
    const isRequired = (value: any) => {
      return value && value !== "" ? true : "Este campo es requerido"
    }
    // Reglas de validacion
    const {handleChange: handleName} = useField("name", isRequired)
    const {handleChange: handleLastname} = useField("lastname", isRequired)
    const {handleChange: handleEmail} = useField("email", isRequired)

    return {
      perfilUsuario,
      handleName,
      handleLastname,
      handleEmail,
      actualizarPerfil,
      eliminarCuenta,
      errors: {},
    }
  },
})
