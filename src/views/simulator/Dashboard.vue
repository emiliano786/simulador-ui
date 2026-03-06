<template>
  <content-tpl>
    <template #header-left>
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {{ t("Dashboard") || "Transaction Tracer" }}
        </h1>
        <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Monitoreo y trazabilidad de procesos en tiempo real
        </p>
      </div>
    </template>

    <template #header-right>
      <div class="flex items-center gap-4">
        <!-- Auto-refresh toggle -->
        <div class="flex items-center gap-3">
          <div class="relative inline-block w-10 h-5">
            <input type="checkbox" v-model="autoRefresh" id="autoRefreshToggle"
                   class="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#10b981] shadow-sm" />
            <label for="autoRefreshToggle" class="block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-slate-700 peer-checked:bg-[#10b981] cursor-pointer"></label>
          </div>
          <label for="autoRefreshToggle" class="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
            Auto-refresh
          </label>
        </div>

        <!-- Connection status -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full" :class="connectionStatusClass">
          <div class="w-2 h-2 rounded-full" :class="connectionDotClass"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest">{{ connectionStatus }}</span>
        </div>

        <!-- Manual refresh -->
        <button @click="fetchDashboard" :disabled="isLoading"
                class="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
          <svg :class="['w-4 h-4 text-gray-500', isLoading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-6">

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div v-for="stat in summaryStats" :key="stat.key"
               class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-4 transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-2">
              <span :class="stat.badgeClass" class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                {{ stat.label }}
              </span>
              <span v-if="stat.showTrend && stat.trend !== 0" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-[10px] font-bold">
                {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
              </span>
            </div>
            <p class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ stat.value }}
            </p>
            <p v-if="stat.subtitle" class="text-[10px] text-gray-400 mt-1">{{ stat.subtitle }}</p>
          </div>
        </div>

        <!-- Process Stats Grid -->
        <div class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></div>
              <h2 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Estado de Procesos
              </h2>
            </div>
            <span class="text-[10px] font-mono text-gray-400">{{ dashboard?.date || today }}</span>
          </div>

          <div class="p-6">
            <div v-if="processStats.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-400 dark:text-gray-500">Sin datos de procesos para hoy</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="proc in processStats" :key="proc.process"
                   class="rounded-xl border border-gray-100 dark:border-slate-800 p-4 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors cursor-pointer"
                   @click="selectedProcess = proc.process">
                
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {{ formatProcessName(proc.process) }}
                  </span>
                  <span :class="getSuccessRateClass(proc.success_rate)" class="text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ proc.success_rate }}%
                  </span>
                </div>

                <!-- Mini progress bar -->
                <div class="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div class="h-full rounded-full transition-all duration-500"
                       :class="getSuccessRateBarClass(proc.success_rate)"
                       :style="{ width: proc.success_rate + '%' }"></div>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p class="text-lg font-black text-gray-900 dark:text-white">{{ proc.total }}</p>
                    <p class="text-[9px] text-gray-400 uppercase tracking-wider">Total</p>
                  </div>
                  <div>
                    <p class="text-lg font-black text-green-500">{{ proc.success }}</p>
                    <p class="text-[9px] text-gray-400 uppercase tracking-wider">OK</p>
                  </div>
                  <div>
                    <p class="text-lg font-black text-red-500">{{ proc.failed }}</p>
                    <p class="text-[9px] text-gray-400 uppercase tracking-wider">Fail</p>
                  </div>
                </div>

                <div class="mt-3 pt-3 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-[10px] text-gray-400">Latencia promedio</span>
                  <span class="text-xs font-mono font-bold" :class="getLatencyClass(proc.avg_latency_ms)">
                    {{ proc.avg_latency_ms }} ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
              <h2 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Transacciones Recientes
              </h2>
            </div>
            <button @click="showAllTransactions = true"
                    class="text-[10px] font-bold text-[#8b5cf6] hover:text-[#7c3aed] uppercase tracking-widest transition-colors">
              Ver todas →
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 dark:bg-slate-900/50">
                  <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">UUID</th>
                  <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Response</th>
                  <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Latencia</th>
                  <th class="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ruta</th>
                  <th class="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-slate-800">
                <tr v-for="tx in recentTransactions" :key="tx.uuid"
                    class="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {{ tx.uuid.slice(0, 8) }}...
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="getStatusBadgeClass(tx.status)" class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs font-bold" :class="tx.response_code === '00' ? 'text-green-500' : 'text-red-500'">
                      {{ tx.response_code || '—' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs" :class="getLatencyClass(tx.total_latency_ms)">
                      {{ tx.total_latency_ms }} ms
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1">
                      <span v-for="(proc, idx) in parseRoute(tx.route_executed)" :key="idx"
                            class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                        {{ proc.slice(0, 3) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button @click="openTransactionDetail(tx.uuid)"
                            class="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-400 hover:text-[#8b5cf6] transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="recentTransactions.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">
                    No hay transacciones recientes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Transaction Detail Modal -->
        <Teleport to="body">
          <transition name="fade">
            <div v-if="selectedTransaction" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                 @click.self="selectedTransaction = null">
              <div class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Detalle de Transacción</h3>
                    <p class="font-mono text-xs text-gray-400 mt-1">{{ selectedTransaction.summary.uuid }}</p>
                  </div>
                  <button @click="selectedTransaction = null"
                          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Content -->
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  
                  <!-- Summary -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <span :class="getStatusBadgeClass(selectedTransaction.summary.status)" class="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        {{ selectedTransaction.summary.status }}
                      </span>
                    </div>
                    <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Response Code</p>
                      <p class="text-xl font-black" :class="selectedTransaction.summary.response_code === '00' ? 'text-green-500' : 'text-red-500'">
                        {{ selectedTransaction.summary.response_code || '—' }}
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Latencia Total</p>
                      <p class="text-xl font-black text-gray-900 dark:text-white">{{ selectedTransaction.summary.total_latency_ms }} <span class="text-xs font-normal text-gray-400">ms</span></p>
                    </div>
                    <div class="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Procesos</p>
                      <p class="text-xl font-black text-gray-900 dark:text-white">{{ selectedTransaction.summary.process_count }}</p>
                    </div>
                  </div>

                  <!-- Process Timeline -->
                  <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
                    Timeline de Procesos
                  </h4>
                  
                  <div class="space-y-3">
                    <div v-for="(proc, idx) in selectedTransaction.processes" :key="proc.process"
                         class="relative pl-8">
                      
                      <!-- Timeline connector -->
                      <div v-if="idx < selectedTransaction.processes.length - 1"
                           class="absolute left-3 top-8 w-0.5 h-full bg-gray-200 dark:bg-slate-700"></div>
                      
                      <!-- Timeline dot -->
                      <div :class="getProcessDotClass(proc.status)"
                           class="absolute left-1 top-2 w-5 h-5 rounded-full flex items-center justify-center">
                        <svg v-if="proc.status === 'SUCCESS'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else-if="proc.status === 'FAILED'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div v-else class="w-2 h-2 rounded-full bg-white"></div>
                      </div>

                      <!-- Process card -->
                      <div class="rounded-xl border border-gray-100 dark:border-slate-800 p-4 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {{ formatProcessName(proc.process) }}
                          </span>
                          <div class="flex items-center gap-3">
                            <span :class="getStatusBadgeClass(proc.status)" class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              {{ proc.status }}
                            </span>
                            <span class="font-mono text-xs font-bold" :class="getLatencyClass(proc.latency_ms)">
                              {{ proc.latency_ms }} ms
                            </span>
                          </div>
                        </div>

                        <div v-if="proc.code || proc.message" class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span v-if="proc.code" class="font-mono font-bold">Code: {{ proc.code }}</span>
                          <span v-if="proc.message">{{ proc.message }}</span>
                        </div>

                        <div v-if="proc.rule" class="mt-2 px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium">
                          Rule: {{ proc.rule }}
                        </div>

                        <!-- Dynamic data fields -->
                        <div v-if="Object.keys(proc.data || {}).length > 0" class="mt-3 pt-3 border-t border-gray-50 dark:border-slate-800">
                          <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Datos adicionales</p>
                          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div v-for="(value, key) in proc.data" :key="key" class="text-xs">
                              <span class="text-gray-400">{{ key }}:</span>
                              <span class="font-mono text-gray-600 dark:text-gray-300 ml-1">{{ value }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </Teleport>

      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const { t } = useI18n();

// API Configuration
const API_BASE = "http://localhost:8080/api";

// State
const isLoading = ref(false);
const autoRefresh = ref(true);
const connectionStatus = ref("connecting");
const dashboard = ref(null);
const selectedProcess = ref(null);
const selectedTransaction = ref(null);
const showAllTransactions = ref(false);

let refreshInterval = null;

// Computed
const today = computed(() => {
  const d = new Date();
  return d.toISOString().slice(0, 10).replace(/-/g, '');
});

const summaryStats = computed(() => {
  const s = dashboard.value?.summary || {};
  return [
    {
      key: 'total',
      label: 'Total',
      value: s.total || 0,
      badgeClass: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400',
      showTrend: false
    },
    {
      key: 'success',
      label: 'Success',
      value: s.success || 0,
      badgeClass: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      showTrend: false
    },
    {
      key: 'rejected',
      label: 'Rejected',
      value: s.rejected || 0,
      badgeClass: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      showTrend: false
    },
    {
      key: 'declined',
      label: 'Declined',
      value: s.declined || 0,
      badgeClass: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      showTrend: false
    },
    {
      key: 'error',
      label: 'Error',
      value: s.error || 0,
      badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      showTrend: false
    },
    {
      key: 'processing',
      label: 'In Flight',
      value: s.processing || 0,
      badgeClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      showTrend: false
    },
    {
      key: 'latency',
      label: 'Avg Latency',
      value: (s.avg_latency_ms || 0) + ' ms',
      badgeClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      showTrend: false
    }
  ];
});

const processStats = computed(() => dashboard.value?.processes || []);
const recentTransactions = computed(() => dashboard.value?.recent_transactions || []);

const connectionStatusClass = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'error': return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
});

const connectionDotClass = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return 'bg-green-500 animate-pulse';
    case 'error': return 'bg-red-500';
    default: return 'bg-yellow-500 animate-pulse';
  }
});

// Methods
async function fetchDashboard() {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${API_BASE}/dashboard`);
    dashboard.value = data;
    connectionStatus.value = 'connected';
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    connectionStatus.value = 'error';
  } finally {
    isLoading.value = false;
  }
}

async function openTransactionDetail(uuid) {
  try {
    const { data } = await axios.get(`${API_BASE}/transactions/${uuid}`);
    selectedTransaction.value = data;
  } catch (err) {
    console.error('Error fetching transaction detail:', err);
  }
}

function formatProcessName(name) {
  const mapping = {
    'pe-mx-evaluator-core-main': 'Control transaccional',
    'pe-mx-authorizer-core-main': 'Autorizador',
    'pe-mx-accumulates-main': 'Acumulados',
    'pe-mx-alerts-core-main': 'Alertas',
    'PUBLISH_CHANNEL': 'Listener',
  };
  return mapping[name] || name;
}

function parseRoute(route) {
  if (!route) return [];
  return route.split(',').filter(Boolean);
}

function getSuccessRateClass(rate) {
  if (rate >= 95) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
  if (rate >= 80) return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
}

function getSuccessRateBarClass(rate) {
  if (rate >= 95) return 'bg-green-500';
  if (rate >= 80) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getLatencyClass(ms) {
  if (ms < 50) return 'text-green-500';
  if (ms < 200) return 'text-yellow-500';
  return 'text-red-500';
}

function getStatusBadgeClass(status) {
  const mapping = {
    'SUCCESS': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    'PROCESSING': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'REJECTED': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    'DECLINED': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    'ERROR': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    'TIMEOUT': 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400',
    'FAILED': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    'DISPATCHED': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'RUNNING': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  };
  return mapping[status] || 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400';
}

function getProcessDotClass(status) {
  const mapping = {
    'SUCCESS': 'bg-green-500',
    'FAILED': 'bg-red-500',
    'DISPATCHED': 'bg-purple-500',
    'RUNNING': 'bg-blue-500',
    'TIMEOUT': 'bg-gray-500'
  };
  return mapping[status] || 'bg-gray-400';
}

function startAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    if (autoRefresh.value) {
      fetchDashboard();
    }
  }, 5000);
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Watchers
watch(autoRefresh, (val) => {
  if (val) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
});

// Lifecycle
onMounted(() => {
  fetchDashboard();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>