<!-- ErrorLogin.vue -->
<template>
  <div class="success-container">
    <h1>Inicio de Sesión Exitoso</h1>
    <p>¡Bienvenido, {{ user.nombres }} {{ user.apellidos }}!</p>
    <p>Serás redirigido a la pagina de inicio</p>
    <p>Serás redirigido en {{ countdown }} segundos...</p>
    <div class="loader"></div>
    <!-- <button @click="goToDashboard">Ir al Dashboard</button> -->
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { tipoAutenticacion } from 'config/utils'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'

export default {
  data() {
    return {
      token: null,
      user: {},
      countdown: 3 // Tiempo de cuenta regresiva (3 segundos)
    }
  },
  mounted() {
    // Obtener el token de la URL si existe
    const urlParams = new URLSearchParams(window.location.search)
    console.log(urlParams)
    this.token = urlParams.get('token')
    const userData = urlParams.get('user')
    console.log(this.token)
    console.log(userData, urlParams.get('user'))
    const store = useAuthenticationExternalStore()
    if (this.token) {
      this.storeToken(this.token)
      if (userData) {
        this.user = JSON.parse(userData)
        store.setUser(this.user)
      }
    } else {
      // Manejar el caso en que no se recibe el token
      console.error('Token no encontrado en la URL')
    }

    // Inicia la cuenta regresiva
    this.startCountdown()
  },
  methods: {
    storeToken(token) {
      // Almacenar el token en localStorage
      LocalStorage.set('token', token)
      LocalStorage.set('method_access', tipoAutenticacion.usuario_externo)
    },
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--
        } else {
          clearInterval(countdownInterval)
          this.goToDashboard()
        }
      }, 1000) // Actualiza cada segundo
    },
    goToDashboard() {
      // Redirigir a la página principal después de iniciar sesión
      this.$router.push('/puestos-disponibles') // Cambia esto a la ruta a la que quieres redirigir
    }
  }
}
</script>

<style scoped>
.success-container {
  text-align: center;
  padding: 2rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
