<template>
  <div class="min-h-screen flex flex-col bg-neutral-white">
    <!-- Isotipo en la esquina superior izquierda -->
    <img
      src="/src/assets/logos/exos_isotipo.png"
      alt="Prosa Isotipo"
      class="absolute top-6 left-6 z-20 w-12 h-12 opacity-90"
    />
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="flex w-full max-w-7xl overflow-hidden min-h-[600px] h-[80vh]">
        <!-- Lado izquierdo: Olas animadas y frase -->
        <div
          class="relative flex-1 min-w-[400px] items-center justify-center overflow-visible hidden md:flex"
        >
          <!-- Blob 1 -->
          <svg
            class="blob blob1"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#9000FF" />
                <stop offset="100%" stop-color="#B85CFF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad1)"
              d="M700,400Q700,600,500,700Q300,800,200,600Q100,400,200,200Q300,0,500,100Q700,200,700,400Z"
            />
          </svg>
          <!-- Blob 2 -->
          <svg
            class="blob blob2"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef2f2" />
                <stop offset="100%" stop-color="#B85CFF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad2)"
              d="M600,400Q600,600,400,700Q200,800,100,600Q0,400,100,200Q200,0,400,100Q600,200,600,400Z"
            />
          </svg>
          <!-- Blob 3 -->
          <svg
            class="blob blob3"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#B85CFF" />
                <stop offset="100%" stop-color="#9000FF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad3)"
              d="M700,400Q700,500,600,600Q500,700,400,600Q300,500,200,400Q100,300,200,200Q300,100,400,200Q500,300,600,400Q700,500,700,400Z"
            />
          </svg>
          <!-- Blob 4 -->
          <svg
            class="blob blob4"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#B85CFF" />
                <stop offset="100%" stop-color="#fef2f2" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad4)"
              d="M400,700Q600,600,700,400Q800,200,600,100Q400,0,200,100Q0,200,100,400Q200,600,400,700Z"
            />
          </svg>
          <!-- Blob 5 -->
          <svg
            class="blob blob5"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#9000FF" />
                <stop offset="100%" stop-color="#fef2f2" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad5)"
              d="M400,100Q600,200,700,400Q800,600,600,700Q400,800,200,700Q0,600,100,400Q200,200,400,100Z"
            />
          </svg>
          <!-- Frase e ícono -->
          <div class="absolute z-10 w-full h-full flex flex-col items-center justify-center px-12">
            <div class="flex text-center">
              <h2 class="text-white text-center text-4xl font-bold drop-shadow-lg leading-tight">
                {{ $t('login.socratesPhrase') }}
              </h2>
            </div>
          </div>
        </div>
        <!-- Lado derecho: Formulario -->
        <div
          class="relative flex-1 flex flex-col justify-center xs:items-center md:items-start xs:w-full md:min-w-[450px] md:max-w-[500px] px-12 py-16 bg-white"
        >
          <div class="space-y-8">
            <div class="text-center md:text-left">
              <h1 class="text-3xl font-bold text-primary mb-3">{{ $t('login.welcome') }}</h1>
              <p class="text-body-2 text-neutralGrey hidden md:block">
                {{ $t('login.welcomeDescription') }}
              </p>
            </div>
            <form @submit.prevent="handleLogin" class="flex flex-col gap-2 w-full">
              <e-input
                v-model="email"
                :label="$t('login.email')"
                required
                class="w-full"
                @clean="email = null"
              >
                <template #icon>
                  <e-icon name="person" size="xs" color="text-primary" />
                </template>
              </e-input>
              <e-input
                v-model="password"
                :label="$t('login.password')"
                type="password"
                required
                class="w-full"
                @clean="password = null"
              >
                <template #icon>
                  <e-icon name="lock" size="xs" color="text-primary" />
                </template>
              </e-input>
              <e-btn
                type="submit"
                color="bg-primary hover:bg-primary/80"
                text-color="text-white"
                :text="$t('login.login')"
                :loading="isLoading"
                class="w-full h-10 mt-4 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
              </e-btn>
            </form>
          </div>
        </div>
      </div>
    </div>
    <EFooter />

    <!-- Diálogo de Error de Autenticación -->
    <e-dialog
      :show="showErrorDialog"
      bgColor="bg-white dark:bg-socrates-card-dark"
      :title="$t('login.error.title')"
      @close="closeErrorDialog"
    >
      <template #content>
        <div class="w-[60vw] max-w-md max-h-[80vh] overflow-y-auto">
          <div class="flex flex-col items-center justify-center py-6 px-4">
            <!-- Icono de error animado -->
            <div class="mb-4">
              <div
                class="w-16 h-16 bg-red-500/20 dark:bg-red-600/20 rounded-full flex items-center justify-center animate-pulse"
              >
                <e-icon
                  name="error"
                  size="2rem"
                  color="text-red-500 dark:text-red-400"
                  class="animate-bounce"
                />
              </div>
            </div>

            <!-- Título -->
            <h3 class="subtitle-1 text-neutral-black mb-3 text-center">
              {{ $t('login.error.title') }}
            </h3>

            <!-- Mensaje descriptivo -->
            <p class="text-body-3 text-neutral-black text-center mb-6 leading-relaxed">
              {{ $t('login.error.message') }}
            </p>

            <!-- Información adicional -->
            <div
              class="w-full bg-red-500/5 dark:bg-red-600/10 rounded-lg p-4 mb-6 border border-red-500/20 dark:border-red-600/30"
            >
              <div class="flex items-center gap-2 mb-2">
                <e-icon name="info" size="sm" color="text-red-500 dark:text-red-400" />
                <span class="text-body-3 text-red-500 dark:text-red-400 font-medium">
                  {{ $t('login.error.details') }}
                </span>
              </div>
              <ul class="text-caption-2 text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-red-500 dark:text-red-400" />
                  <span>{{ $t('login.error.verifyUsername') }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-red-500 dark:text-red-400" />
                  <span>{{ $t('login.error.verifyPassword') }}</span>
                </li>
                <li class="flex items-center gap-1">
                  <e-icon name="check_circle" size="xs" color="text-red-500 dark:text-red-400" />
                  <span>{{ $t('login.error.checkCapsLock') }}</span>
                </li>
              </ul>
            </div>

            <!-- Botón de acción -->
            <div class="w-full">
              <e-btn
                level="1"
                :text="$t('login.error.close')"
                iconName="close"
                @click="closeErrorDialog"
                class="w-full h-12 text-body-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                color="bg-red-500 hover:bg-red-500/80 dark:bg-red-600 dark:hover:bg-red-700"
                text-color="text-white"
              />
            </div>
          </div>
        </div>
      </template>
    </e-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProfilesStore } from '@/stores/profiles';
  import { useAuthStore } from '@/stores/auth';
  import EFooter from '@/components/sections/EFooter.vue';

  const router = useRouter();
  const profilesStore = useProfilesStore();
  const authStore = useAuthStore();

  const email = ref('');
  const password = ref('');
  const isLoading = ref(false);
  const showErrorDialog = ref(false);

  async function handleLogin() {
    if (!email.value || !password.value) {
      return;
    }

    isLoading.value = true;

    try {
      const result = await profilesStore.validateCredentials(email.value, password.value);

      if (result.success) {
        // Credenciales correctas, guardar usuario en el store de autenticación
        authStore.setCurrentUser(result.user);
        const userModules = result.user.permissions.map((p) => p.module);

        const targetModule = modulePriority.find((item) => userModules.includes(item.module));

        if (targetModule) {
          router.push({ name: targetModule.route });
        } else {
          console.error('User has no access to any module');
        }
      } else {
        // Credenciales incorrectas, mostrar diálogo de error
        showErrorDialog.value = true;
        // Limpiar contraseña
        password.value = '';
      }
    } catch (error) {
      console.error('Error durante la validación:', error);
      showErrorDialog.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  function closeErrorDialog() {
    showErrorDialog.value = false;
  }

  const modulePriority = [
    { module: 'deploy-monitoring', route: 'deploys-query' },
    { module: 'users', route: 'profiles-query' },
    { module: 'profiles', route: 'user-profiles' }
  ];
</script>

<style scoped>
  .blob {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: float 12s ease-in-out infinite;
  }

  .blob1 {
    animation-delay: 0s;
    opacity: 0.8;
  }

  .blob2 {
    animation-delay: 2s;
    opacity: 0.6;
  }

  .blob3 {
    animation-delay: 4s;
    opacity: 0.7;
  }

  .blob4 {
    animation-delay: 6s;
    opacity: 0.5;
  }

  .blob5 {
    animation-delay: 8s;
    opacity: 0.6;
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    25% {
      transform: translate(-50%, -50%) scale(1.05) rotate(45deg);
    }
    50% {
      transform: translate(-50%, -50%) scale(0.95) rotate(90deg);
    }
    75% {
      transform: translate(-50%, -50%) scale(1.02) rotate(135deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .blob {
      display: none;
    }
  }
</style>
