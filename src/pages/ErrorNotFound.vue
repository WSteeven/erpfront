<template>
  <div class="page_404 fullscreen flex flex-center">
    <div class="container">
      <!-- Animación del 404 -->
      <div class="error-animation">
        <div class="error-number">
          <span class="four">4</span>
          <span class="zero">0</span>
          <span class="four-2">4</span>
        </div>
        <div class="floating-elements">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="content-box">
        <h2 class="error-title">¡Oops! Página no encontrada</h2>
        <p class="error-description text-secondary">
          La página que buscas no existe o no tienes los permisos necesarios para acceder a ella.
          <br>Puede que la URL sea incorrecta o que la página haya sido movida.
        </p>

        <div class="action-buttons">
          <q-btn
            class="primary-btn bg-primary text-white"
            color="primary"
            unelevated
            rounded
            to="/"
            label="Ir al inicio"
            no-caps
            size="lg"
            icon="home"
          />
          <q-btn
            class="secondary-btn bg-secondary text-white"
            rounded
            @click="goBack"
            label="Volver atrás"
            no-caps
            size="lg"
            icon="arrow_back"
          />
        </div>
      </div>

      <!-- Decoración adicional -->
      <div class="decoration">
        <div class="planet"></div>
        <div class="astronaut">
          <div class="head"></div>
          <div class="body"></div>
          <div class="arm arm-left"></div>
          <div class="arm arm-right"></div>
          <div class="leg leg-left"></div>
          <div class="leg leg-right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.page_404 {
  background: white;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 800px;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

/* Animación del número 404 */
.error-animation {
  position: relative;
  margin-bottom: 2rem;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.error-number span {
  font-size: 8rem;
  font-weight: 900;
  color: #333;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite ease-in-out;
}

.zero {
  animation-delay: 0.2s;
  background: linear-gradient(45deg, #ff4800, #ffd93d);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.zero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border: 0.3rem solid #333;
  border-radius: 50%;
  animation: spin 3s linear infinite;
}

.four-2 {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Elementos flotantes */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 60px;
  height: 60px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 40px;
  height: 40px;
  top: 30%;
  right: 30%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Contenido principal */
.content-box {
  text-align: center;
  color: #333;
  margin-bottom: 3rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.error-description {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.secondary-btn {

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Decoración del astronauta */
.decoration {
  position: absolute;
  bottom: -50px;
  right: -100px;
  opacity: 0.1;
  pointer-events: none;
}

.astronaut {
  position: relative;
  width: 200px;
  height: 300px;
  animation: astronautFloat 4s ease-in-out infinite;
}

.head {
  width: 60px;
  height: 60px;
  background: #ddd;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.body {
  width: 80px;
  height: 100px;
  background: #ddd;
  border-radius: 20px;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.arm {
  width: 15px;
  height: 60px;
  background: #ddd;
  border-radius: 10px;
  position: absolute;
  top: 60px;
}

.arm-left {
  left: 20px;
  transform: rotate(-30deg);
}

.arm-right {
  right: 20px;
  transform: rotate(30deg);
}

.leg {
  width: 20px;
  height: 80px;
  background: #ddd;
  border-radius: 10px;
  position: absolute;
  top: 140px;
}

.leg-left {
  left: 35px;
}

.leg-right {
  right: 35px;
}

.planet {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle at 30% 30%, #ffcc00, #0051ff);
  border-radius: 50%;
  top: -200px;
  left: -200px;
  opacity: 0.3;
  animation: planetRotate 20s linear infinite;
}

@keyframes astronautFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

@keyframes planetRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .error-number span {
    font-size: 5rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .decoration {
    display: none;
  }
}

@media (max-width: 480px) {
  .error-number span {
    font-size: 4rem;
  }

  .container {
    padding: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }
}
</style>
