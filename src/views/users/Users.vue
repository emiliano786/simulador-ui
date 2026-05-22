<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6 relative">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Gestión de Usuarios</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Administra accesos y permisos del simulador</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">search</span>
          <input 
            v-model="search"
            type="text" 
            placeholder="Buscar por usuario o email..." 
            class="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none border-gray-200 dark:border-slate-700 focus:border-cyan-500 transition-colors"
          />
        </div>
        <button 
          v-if="isAdmin"
          @click="openCreateModal"
          class="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap flex items-center gap-2 justify-center"
        >
          <span class="material-symbols-outlined text-sm">person_add</span> Nuevo Usuario
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#0d1421] text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800">
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Nombre Completo</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4 text-center">Estatus</th>
              <th v-if="isAdmin" class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-xs font-mono text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-slate-800/50">
            
            <tr v-if="isLoading" class="animate-pulse">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">Cargando usuarios...</td>
            </tr>

            <tr v-else-if="filteredUsers.length === 0">
               <td colspan="6" class="px-6 py-12 text-center">
                 <span class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 block mb-2">group_off</span>
                 <span class="text-gray-400 font-sans text-sm">No se encontraron usuarios</span>
               </td>
            </tr>

            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
              <td class="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">{{ user.user }}</td>
              <td class="px-6 py-4 font-sans font-medium">{{ user.firstname }} {{ user.lastname }}</td>
              <td class="px-6 py-4 text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="user.active" class="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mx-auto">
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Activo
                </span>
                <span v-else class="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mx-auto">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Inactivo
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-3">
                <button v-if="isAdmin" @click="openEditModal(user)" class="text-gray-400 hover:text-cyan-500 transition-colors" title="Editar">
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
                <button v-if="isAdmin" @click="confirmDelete(user)" class="text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/30">
            <h2 class="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200">
              {{ isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario' }}
            </h2>
            <button @click="closeUserModal" class="text-gray-400 hover:text-red-500 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form id="userForm" @submit.prevent="submitUser" class="flex flex-col overflow-hidden">
            
            <div class="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Nombre</label>
                  <input v-model="userForm.firstname" type="text" required class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700"/>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Apellido</label>
                  <input v-model="userForm.lastname" type="text" required class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700"/>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Nombre de Usuario (Login)</label>
                <input v-model="userForm.user" type="text" :disabled="isEditing" required class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700 disabled:opacity-50"/>
              </div>

              <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Correo Electrónico</label>
                <input v-model="userForm.email" type="email" :disabled="isEditing" required class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700 disabled:opacity-50"/>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Rol</label>
                  <select v-model="userForm.role" required class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700 appearance-none">
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario Básico</option>
                    <option value="viewer">Solo Lectura</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Contraseña</label>
                  <input v-model="userForm.password" type="password" :required="!isEditing" :placeholder="isEditing ? 'Vacía para no cambiar' : 'Min. 8 caracteres'" class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-gray-50 dark:bg-black text-gray-800 dark:text-white outline-none focus:border-cyan-500 border-gray-200 dark:border-slate-700"/>
                </div>
              </div>

              <div class="pt-2">
                <label class="flex items-center gap-3 cursor-pointer w-fit select-none">
                  <input type="checkbox" v-model="userForm.active" class="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 accent-cyan-500" />
                  <span class="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Usuario Activo</span>
                </label>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-900/30">
              <button type="button" @click="closeUserModal" class="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                Cancelar
              </button>
              <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50">
                <span v-if="isSubmitting" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-3 h-3"></span>
                {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario') }}
              </button>
            </div>

          </form>

        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-[#111827] w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all">
          <div class="flex flex-col items-center justify-center py-8 px-6">
            <div class="mb-6 w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-red-500">warning</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">¿Eliminar Usuario?</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed">
              Estás a punto de eliminar a <span class="font-bold text-gray-700 dark:text-gray-200">{{ userToDelete?.user }}</span>. Esta acción no se puede deshacer.
            </p>
            <div class="flex gap-3 w-full">
              <button @click="showDeleteModal = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
              <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/30 flex justify-center items-center gap-2">
                <span v-if="isDeleting" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toast-drop">
      <div v-if="toast.show" class="fixed top-8 left-1/2 z-[9999] flex items-center gap-4 w-[90vw] max-w-xl px-6 py-4 rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] border transition-all"
        :class="toast.type === 'error' ? 'bg-red-50 border-red-200 border-l-[8px] border-l-red-500 text-red-700 dark:bg-[#2c1015] dark:border-red-900/50 dark:border-l-red-600 dark:text-red-400' : 'bg-emerald-50 border-emerald-200 border-l-[8px] border-l-emerald-500 text-emerald-700 dark:bg-[#122e20] dark:border-emerald-900/50 dark:border-l-emerald-600 dark:text-emerald-400'">
        <span class="material-symbols-outlined text-4xl shrink-0">{{ toast.type === "error" ? "error" : "check_circle" }}</span>
        <div class="flex-1 space-y-1 pr-4">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-60">Notificación del Sistema</p>
          <p class="text-xs font-bold uppercase tracking-widest whitespace-pre-wrap leading-relaxed">{{ toast.message }}</p>
        </div>
        <button @click="toast.show = false" class="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const search = ref('');
const isLoading = ref(true);

const isAdmin = computed(() => {
  const storedUser = localStorage.getItem('iso_user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      return parsed.role === 'admin';
    } catch (e) { return false; }
  }
  return false;
});

// --- ESTADO DEL MODAL DE USUARIO (Crear/Editar) ---
const showUserModal = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false); // Para saber si creamos o actualizamos
const editingUserId = ref(null);

const userForm = ref({
  user: '',
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  role: 'user',
  active: true
});

// --- ESTADO DEL MODAL DE ELIMINAR ---
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(false);

// --- ESTADO DEL TOAST ---
const toast = ref({ show: false, message: "", type: "error" });
let toastTimeout = null;

function showToast(message, type = "error") {
  toast.value = { show: true, message, type };
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.value.show = false, 5000);
}

// --- OBTENER USUARIOS ---
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('iso_token');
    const { data } = await axios.get('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    users.value = data.data || [];
  } catch (error) {
    showToast(error.response?.data?.detail || "No se pudieron cargar los usuarios.", "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchUsers());

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  const s = search.value.toLowerCase();
  return users.value.filter(u => 
    (u.user && u.user.toLowerCase().includes(s)) || 
    (u.email && u.email.toLowerCase().includes(s)) ||
    (u.firstname && u.firstname.toLowerCase().includes(s)) ||
    (u.lastname && u.lastname.toLowerCase().includes(s))
  );
});

const openCreateModal = () => {
  isEditing.value = false;
  editingUserId.value = null;
  userForm.value = { user: '', firstname: '', lastname: '', email: '', password: '', role: 'user', active: true };
  showUserModal.value = true;
};

const openEditModal = (user) => {
  isEditing.value = true;
  editingUserId.value = user.id;
  userForm.value = {
    user: user.user,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: '', // Se deja vacío para no cambiarla a menos que escriban algo
    role: user.role,
    active: user.active
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
};

const submitUser = async () => {
  isSubmitting.value = true;
  try {
    const token = localStorage.getItem('iso_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    if (isEditing.value) {
      await axios.put(`http://localhost:8080/api/users/${editingUserId.value}`, userForm.value, config);
      showToast("Usuario actualizado correctamente.", "success");
    } else {
      await axios.post('http://localhost:8080/api/users', userForm.value, config);
      showToast("Usuario creado exitosamente.", "success");
    }
    
    closeUserModal();
    fetchUsers();
  } catch (err) {
    showToast(err.response?.data?.detail || "Hubo un error al guardar el usuario.", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// --- LÓGICA: ELIMINAR ---
const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  isDeleting.value = true;
  try {
    const token = localStorage.getItem('iso_token');
    await axios.delete(`http://localhost:8080/api/users/${userToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    showToast("Usuario eliminado correctamente.", "success");
    showDeleteModal.value = false;
    fetchUsers();
  } catch (err) {
    showToast(err.response?.data?.detail || "No se pudo eliminar el usuario.", "error");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-drop-enter-active, .toast-drop-leave-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-drop-enter-from, .toast-drop-leave-to { opacity: 0; transform: translate(-50%, -50px); }
.toast-drop-enter-to, .toast-drop-leave-from { opacity: 1; transform: translate(-50%, 0); }
</style>