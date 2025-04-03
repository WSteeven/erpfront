<!-- ErrorLogin.vue -->
<template>
  <div class="error-container">
    <h1>Autenticación Fallida</h1>
    <p>{{ errorMessage }}</p>
    <button @click="retryLogin">Reintentar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: 'Ocurrió un error al intentar iniciar sesión.'
    };
  },
  mounted() {
    // Obtener el mensaje de error desde la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      this.errorMessage = this.getFriendlyMessage(message);
    }
  },
  methods: {
    getFriendlyMessage(message) {
      // Traducción de mensajes de error más amigables para el usuario
      const messages = {
        authentication_failed: 'La autenticación ha fallado. Por favor, intenta nuevamente.',
        authentication_canceled: 'El inicio de sesión fue cancelado. Si quieres iniciar sesión, por favor vuelve a intentarlo.'
      };
      return messages[message] || this.errorMessage;
    },
    retryLogin() {
      // Lógica para volver a intentar el login, redirige a la página principal de login
      this.$router.push('/login-postulante');
    }
  }
};
</script>

<style scoped>
.error-container {
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
</style>
