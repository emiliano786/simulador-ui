<template>
  <content-tpl>
    <template #header-left>
      <div class="flex items-center justify-between w-full xl:w-[75vw]">
        <div class="flex flex-col">
          <h1
            class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            Simulador
          </h1>
          <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Gestión de transacciones ISO8583.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="relative flex items-center bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-full pl-4 pr-8 py-2 shadow-sm transition-all hover:border-cyan-300 dark:hover:border-cyan-700"
          >
            <svg
              class="w-4 h-4 text-cyan-500 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <select
              v-model="selectedXmlFile"
              @change="onXmlChange"
              class="bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 outline-none cursor-pointer appearance-none w-full"
            >
              <option value="" disabled v-if="availableXmlFiles.length === 0">
                Cargando...
              </option>
              <option
                v-for="file in availableXmlFiles"
                :key="file"
                :value="file"
                class="bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
              >
                {{ file }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          <button
            @click="toggleDarkMode"
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm"
          >
            <span class="material-symbols-outlined text-[18px]">
              {{ isDark ? "light_mode" : "dark_mode" }}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-widest">
              {{ isDark ? "Modo Claro" : "Modo Oscuro" }}
            </span>
          </button>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-6">
        <div
          class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300"
        >
          <div
            class="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center"
          >
            <h2
              class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider"
            >
              Configuración de Envío
            </h2>
            <div
              class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors"
              :class="
                rawPreview
                  ? 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
                  : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
              "
            >
              {{ rawPreview ? "Trama Detectada" : "Esperando Trama Raw" }}
            </div>
          </div>

          <div class="p-8">
            <div
              class="mb-8 flex flex-col gap-4 p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800"
            >
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <label
                    class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                  >
                    Paso 1: Cadena ISO8583 (Raw)
                  </label>
                  <button
                    type="button"
                    @click="fillSyntheticRaw"
                    class="text-[9px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 border border-cyan-500/30 px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    GENERAR EJEMPLO
                  </button>
                </div>

                <textarea
                  v-model="rawString"
                  rows="4"
                  placeholder="Pega aquí tu cadena ISO8583 para extraer los campos..."
                  class="w-full font-mono text-xs bg-white dark:bg-black border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none resize-none leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 shadow-sm transition-all"
                ></textarea>
              </div>
            </div>

            <div
              v-if="!rawPreview"
              class="flex flex-col items-center justify-center py-10 opacity-50"
            >
              <span
                class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 mb-2"
                >arrow_downward</span
              >
              <p
                class="text-xs font-bold text-gray-400 tracking-widest uppercase"
              >
                Ingresa una trama para abrir el Editor Dinámico
              </p>
            </div>

            <transition name="slide-down">
              <div
                v-if="rawPreview"
                class="mb-4 mt-4 border-t border-gray-100 dark:border-slate-800 pt-6"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"
                    ></div>
                    <span
                      class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
                    >
                      XML Builder — {{ filteredXmlFields.length }} Campos
                      Extraídos
                    </span>
                  </div>
                  <div class="flex items-center gap-3">
                    <label
                      class="text-[10px] font-bold uppercase text-gray-400 tracking-widest"
                      >MTI</label
                    >
                    <input
                      v-model="xmlMti"
                      maxlength="4"
                      class="w-24 px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-black border border-cyan-200 dark:border-cyan-900/50 rounded-lg text-cyan-600 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none text-center"
                      placeholder="1100"
                    />

                    <button
                      @click="syncToRaw"
                      :disabled="isSyncing || activeXmlFields.length === 0"
                      class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="!isSyncing"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <div
                        v-else
                        class="animate-spin w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full"
                      ></div>
                      Sincronizar Raw
                    </button>
                  </div>
                </div>

                <div
                  v-if="xmlLoading"
                  class="flex items-center justify-center py-16"
                >
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="animate-spin w-8 h-8 border-2 border-[#06b6d4] border-t-transparent rounded-full"
                    ></div>
                    <span class="text-xs text-gray-400 font-medium"
                      >Cargando definición del estándar...</span
                    >
                  </div>
                </div>

                <div
                  v-else-if="xmlError"
                  class="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center"
                >
                  <p class="text-sm text-red-500 font-medium">{{ xmlError }}</p>
                  <button
                    @click="loadXmlFields"
                    class="mt-3 text-xs text-red-400 underline"
                  >
                    Reintentar
                  </button>
                </div>

                <div v-else class="flex flex-col gap-6">
                  <div
                    class="bg-gray-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner flex flex-col gap-4"
                  >
                    <div class="flex justify-between items-center">
                      <span
                        class="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                      >
                        Mapa de Campos
                        <span v-if="gridTool === 'edit'"
                          >— Seleccionar campo
                        </span>
                        <span
                          v-if="gridTool === 'toggle_active'"
                          class="text-cyan-500"
                          >— Prender/Apagar</span
                        >
                        <span
                          v-if="gridTool === 'toggle_synthetic'"
                          class="text-purple-500"
                          >— Activar Sintético</span
                        >
                      </span>
                      <span
                        class="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded"
                      >
                        {{ activeXmlFields.length }} Activos
                      </span>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="field in filteredXmlFields"
                        :key="field.id"
                        @click="handleGridFieldClick(field.id)"
                        class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 border-2"
                        :class="[
                          selectedFieldEdit === field.id
                            ? xmlForm[field.id].synthetic
                              ? 'bg-purple-500 border-purple-500 text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)] scale-110 z-10 ring-2 ring-purple-200 dark:ring-purple-900'
                              : 'bg-cyan-500 border-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4)] scale-110 z-10 ring-2 ring-cyan-200 dark:ring-cyan-900'
                            : xmlForm[field.id]?.active
                              ? !isFieldValid(field, xmlForm[field.id].value) &&
                                !xmlForm[field.id].synthetic
                                ? 'bg-red-50 border-red-400 text-red-600 shadow-[0_0_8px_rgba(248,113,113,0.5)] dark:bg-red-900/30 dark:border-red-600 dark:text-red-400'
                                : xmlForm[field.id]?.synthetic
                                  ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-300 hover:bg-purple-100'
                                  : 'bg-cyan-50 border-cyan-300 text-cyan-700 dark:bg-cyan-900/40 dark:border-cyan-700 dark:text-cyan-300 hover:bg-cyan-100'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:bg-[#0d1421] dark:border-slate-700',
                        ]"
                        :title="field.name"
                      >
                        {{ field.id }}
                      </button>
                    </div>

                    <div class="mt-2 flex flex-col items-center gap-3">
                      <div
                        class="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-gray-200/50 dark:bg-slate-800/50 rounded-xl w-fit mx-auto border border-gray-300 dark:border-slate-700"
                      >
                        <button
                          @click="gridTool = 'edit'"
                          :class="
                            gridTool === 'edit'
                              ? 'bg-white dark:bg-slate-600 shadow text-gray-800 dark:text-white'
                              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          "
                          class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Seleccionar
                        </button>
                        <button
                          @click="gridTool = 'toggle_active'"
                          :class="
                            gridTool === 'toggle_active'
                              ? 'bg-cyan-500 shadow text-white'
                              : 'text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400'
                          "
                          class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Prender/Apagar
                        </button>
                        <button
                          @click="gridTool = 'toggle_synthetic'"
                          :class="
                            gridTool === 'toggle_synthetic'
                              ? 'bg-purple-500 shadow text-white'
                              : 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400'
                          "
                          class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Activar Sintético
                        </button>
                      </div>

                      <div class="h-6 flex items-center justify-center">
                        <transition name="fade" mode="out-in">
                          <div
                            v-if="gridTool === 'toggle_active'"
                            key="active-tools"
                            class="flex gap-3"
                          >
                            <button
                              @click="toggleAllFields('active', true)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-cyan-500/30 text-cyan-600 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                            >
                              Encender Todos
                            </button>
                            <button
                              @click="toggleAllFields('active', false)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                            >
                              Apagar Todos
                            </button>
                          </div>
                          <div
                            v-else-if="gridTool === 'toggle_synthetic'"
                            key="synthetic-tools"
                            class="flex gap-3"
                          >
                            <button
                              @click="toggleAllFields('synthetic', true)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-purple-500/30 text-purple-600 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                            >
                              Todos Sintéticos
                            </button>
                            <button
                              @click="toggleAllFields('synthetic', false)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-gray-500/30 text-gray-500 bg-gray-500/10 hover:bg-gray-500/20 transition-colors"
                            >
                              Ninguno Sintético
                            </button>
                          </div>
                          <div
                            v-else
                            key="edit-tools"
                            class="text-[9px] font-bold uppercase tracking-widest text-gray-400"
                          >
                            Haz clic en un campo para editar o mutar sus valores
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>

                  <transition name="slide-down">
                    <div
                      v-if="currentEditField"
                      class="rounded-2xl border-2 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-[#111827] shadow-xl overflow-hidden relative"
                    >
                      <button
                        @click="selectedFieldEdit = null"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>

                      <div
                        class="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50"
                      >
                        <div class="flex flex-wrap items-center gap-3 pr-8">
                          <span
                            class="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono w-10"
                            >F{{ currentEditField.id }}</span
                          >
                          <span
                            class="text-base font-bold text-gray-800 dark:text-gray-100"
                            >{{ currentEditField.name }}</span
                          >
                          <span
                            :class="typeColor(currentEditField.type)"
                            class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm font-mono"
                            >{{ currentEditField.typeShort }}</span
                          >
                          <span
                            class="text-[10px] font-bold text-gray-500 bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded font-mono shadow-sm"
                            >{{ currentEditField.lengthLabel }}</span
                          >
                        </div>
                      </div>

                      <div class="p-6 flex flex-col gap-5">
                        <input
                          v-model="xmlForm[currentEditField.id].value"
                          :maxlength="currentEditField.maxInput"
                          :placeholder="currentEditField.placeholder"
                          class="w-full font-mono text-sm px-4 py-4 rounded-xl border-2 outline-none transition-all"
                          :class="[
                            xmlForm[currentEditField.id].synthetic
                              ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 placeholder-purple-300 dark:placeholder-purple-800/50 border-purple-300 dark:border-purple-700/50 focus:border-purple-500 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.15)]'
                              : 'bg-white dark:bg-black text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.1)]',
                            xmlForm[currentEditField.id].value &&
                            !isFieldValid(
                              currentEditField,
                              xmlForm[currentEditField.id].value,
                            ) &&
                            !xmlForm[currentEditField.id].synthetic
                              ? 'border-red-400 focus:border-red-500 dark:border-red-800 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
                              : '',
                          ]"
                        />

                        <transition name="fade">
                          <div
                            v-if="currentEditField.isNum"
                            class="flex flex-wrap gap-4 p-4 mt-2 rounded-xl border transition-all"
                            :class="
                              xmlForm[currentEditField.id].synthetic
                                ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50'
                                : 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700'
                            "
                          >
                            <div class="flex-1 min-w-[80px]">
                              <label
                                class="text-[10px] font-bold uppercase tracking-widest block mb-1"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                "
                                >Mínimo</label
                              >
                              <input
                                type="number"
                                v-model="xmlForm[currentEditField.id].minRange"
                                @input="
                                  enforceRangeLimit(
                                    currentEditField.id,
                                    'minRange',
                                    currentEditField.maxInput,
                                  )
                                "
                                min="0"
                                :max="'9'.repeat(currentEditField.maxInput)"
                                placeholder="Ej. 1"
                                class="w-full text-xs font-mono px-3 py-2 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none transition-colors"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'border-purple-200 dark:border-purple-700 focus:border-purple-500'
                                    : 'border-gray-200 dark:border-slate-600 focus:border-cyan-500'
                                "
                              />
                            </div>

                            <div class="flex-1 min-w-[80px]">
                              <label
                                class="text-[10px] font-bold uppercase tracking-widest block mb-1"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                "
                                >Máximo</label
                              >
                              <input
                                type="number"
                                v-model="xmlForm[currentEditField.id].maxRange"
                                @input="
                                  enforceRangeLimit(
                                    currentEditField.id,
                                    'maxRange',
                                    currentEditField.maxInput,
                                  )
                                "
                                min="1"
                                :max="'9'.repeat(currentEditField.maxInput)"
                                :placeholder="
                                  'Ej. ' +
                                  '9'.repeat(
                                    Math.min(currentEditField.maxInput, 4),
                                  )
                                "
                                class="w-full text-xs font-mono px-3 py-2 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none transition-colors"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'border-purple-200 dark:border-purple-700 focus:border-purple-500'
                                    : 'border-gray-200 dark:border-slate-600 focus:border-cyan-500'
                                "
                              />
                            </div>

                            <div class="flex-1 min-w-[100px]">
                              <label
                                class="text-[10px] font-bold uppercase tracking-widest block mb-1"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                "
                                >Modo</label
                              >
                              <select
                                v-model="xmlForm[currentEditField.id].mode"
                                class="w-full text-xs font-mono px-3 py-2 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none cursor-pointer appearance-none transition-colors"
                                :class="
                                  xmlForm[currentEditField.id].synthetic
                                    ? 'border-purple-200 dark:border-purple-700 focus:border-purple-500'
                                    : 'border-gray-200 dark:border-slate-600 focus:border-cyan-500'
                                "
                              >
                                <option value="random">Aleatorio</option>
                                <option value="sequential">Secuencial</option>
                              </select>
                            </div>
                          </div>
                        </transition>

                        <div
                          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div class="flex flex-wrap items-center gap-3">
                            <button
                              @click="
                                xmlForm[currentEditField.id].synthetic =
                                  !xmlForm[currentEditField.id].synthetic
                              "
                              class="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border-2 font-bold uppercase tracking-widest text-[10px]"
                              :class="
                                xmlForm[currentEditField.id].synthetic
                                  ? 'bg-purple-100 border-purple-400 text-purple-700 dark:bg-purple-900/60 dark:border-purple-500 dark:text-purple-300 shadow-sm'
                                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="m21 16-4 4-4-4" />
                                <path d="M17 20V4" />
                                <path d="m3 8 4-4 4 4" />
                                <path d="M7 4v16" />
                              </svg>
                              {{
                                xmlForm[currentEditField.id].synthetic
                                  ? "Sintético Activado"
                                  : "Activar Sintético"
                              }}
                            </button>
                            <button
                              @click="deactivateField(currentEditField.id)"
                              class="px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[10px] font-bold uppercase tracking-widest border-2 border-transparent hover:border-red-200 dark:hover:border-red-800"
                            >
                              Apagar Campo
                            </button>
                          </div>
                          <div
                            class="flex flex-col sm:items-end gap-1 text-left sm:text-right"
                          >
                            <span
                              class="text-[10px] font-medium"
                              :class="
                                xmlForm[currentEditField.id].synthetic
                                  ? 'text-purple-500 dark:text-purple-400'
                                  : 'text-gray-500 dark:text-gray-400'
                              "
                            >
                              {{
                                xmlForm[currentEditField.id].synthetic
                                  ? "Este dato mutará con el CSV base al procesar la ráfaga."
                                  : currentEditField.hint
                              }}
                            </span>
                            <span
                              :class="[
                                'text-[11px] font-mono font-bold px-2 py-1 rounded border',
                                xmlForm[currentEditField.id].value &&
                                !isFieldValid(
                                  currentEditField,
                                  xmlForm[currentEditField.id].value,
                                ) &&
                                !xmlForm[currentEditField.id].synthetic
                                  ? 'text-red-500 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                  : xmlForm[currentEditField.id].synthetic
                                    ? 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-900/20'
                                    : 'text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-slate-800 dark:bg-black',
                              ]"
                            >
                              {{
                                xmlForm[currentEditField.id].value?.length || 0
                              }}
                              / {{ currentEditField.length }} chars
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>

                  <div
                    class="mt-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      @click="showQuickEdits = !showQuickEdits"
                      class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div class="text-left">
                          <h3
                            class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                          >
                            Editor rapido
                          </h3>
                          <p
                            class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5"
                          >
                            Edita PAN, Monto, Fechas, MCC y País
                          </p>
                        </div>
                      </div>
                      <svg
                        class="w-5 h-5 text-gray-400 transition-transform duration-300"
                        :class="showQuickEdits ? 'rotate-180' : ''"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    <transition name="slide-down">
                      <div
                        v-if="showQuickEdits"
                        class="p-6 border-t border-gray-100 dark:border-slate-800"
                      >
                        <div
                          v-if="quickEditFields.length === 0"
                          class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest py-8"
                        >
                          No se detectaron campos principales en esta trama.
                        </div>
                        <div
                          v-else
                          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                          <div
                            v-for="field in quickEditFields"
                            :key="'qe-' + field.id"
                            class="space-y-2"
                          >
                            <div class="flex justify-between items-center">
                              <label
                                class="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate pr-2"
                              >
                                F{{ field.id }} - {{ field.name }}
                              </label>
                              <span
                                :class="typeColor(field.type)"
                                class="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold"
                                >{{ field.typeShort }}</span
                              >
                            </div>
                            <input
                              v-model="xmlForm[field.id].value"
                              :maxlength="field.maxInput"
                              class="w-full font-mono text-xs px-3 py-2.5 rounded-xl border-2 outline-none transition-all"
                              :class="[
                                xmlForm[field.id].value &&
                                !isFieldValid(field, xmlForm[field.id].value) &&
                                !xmlForm[field.id].synthetic
                                  ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100'
                                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:border-blue-500',
                              ]"
                            />
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>

                  <div
                    class="mt-4 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/10 dark:bg-cyan-900/5 space-y-6"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        ></div>
                        <h3
                          class="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300"
                        >
                          Ajustes
                        </h3>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-4">
                        <div class="flex justify-between items-center">
                          <label
                            class="text-xs font-bold text-gray-500 uppercase tracking-wider"
                            >Cantidad de Mensajes</label
                          >
                          <input
                            type="number"
                            v-model="batchSize"
                            class="w-20 p-2 text-center text-sm font-mono font-bold bg-white dark:bg-black border border-cyan-200 dark:border-cyan-900/50 rounded-lg text-cyan-600 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                          />
                        </div>
                        <input
                          type="range"
                          v-model="batchSize"
                          min="1"
                          max="100"
                          class="w-full h-1.5 bg-cyan-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <p class="text-[9px] text-gray-400 italic">
                          La trama se enviará repetidamente
                          {{ batchSize }} veces.
                        </p>
                      </div>
                      <div class="space-y-4">
                        <div class="flex justify-between items-center">
                          <label
                            class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                            >Retraso entre envíos</label
                          >
                          <span
                            class="text-xs font-mono font-bold text-cyan-500"
                            >{{ delayMs }} ms</span
                          >
                        </div>
                        <input
                          type="range"
                          v-model="delayMs"
                          min="0"
                          max="5000"
                          step="100"
                          class="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div
                          class="flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-1"
                        >
                          <span>0ms (Instantáneo)</span><span>5s (Lento)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <div
              class="flex justify-end mt-8 border-t border-gray-100 dark:border-slate-800 pt-6"
            >
              <button
                type="button"
                @click="handleDispatch"
                :disabled="isLoading || !rawPreview || !isFormValid"
                class="px-12 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:-translate-y-0.5 shadow-lg shadow-purple-500/25 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600 disabled:shadow-none disabled:transform-none"
              >
                <span
                  v-if="isLoading"
                  class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"
                ></span>
                <span>Enviar ({{ activeXmlFields.length }} campos)</span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="responseFromServer || errorMessage"
          class="animate-fade-in pb-10"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col"
            >
              <span
                class="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest w-fit mb-4"
                >Trama Generada</span
              >
              <div
                class="bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-slate-800 font-mono text-[10px] text-gray-500 dark:text-gray-400 break-all leading-relaxed flex-1 overflow-y-auto max-h-[150px]"
              >
                {{ responseFromServer?.generated_iso || "---" }}
              </div>
            </div>

            <div
              class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center"
            >
              <span
                class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4"
                >Estatus del Envío</span
              >
              <div
                v-if="responseFromServer?.sent"
                class="flex flex-col items-center"
              >
                <div
                  class="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2 text-xl"
                >
                  ✓
                </div>
                <p
                  class="text-sm font-bold text-gray-900 dark:text-white uppercase"
                >
                  Enviado
                </p>
              </div>
              <div v-else class="flex flex-col items-center">
                <div
                  class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2 text-xl"
                >
                  ✕
                </div>
                <p class="text-sm font-bold text-red-600 uppercase">
                  Fallo en Conexión
                </p>
              </div>
              <p
                class="mt-2 text-[10px] text-gray-400 font-medium uppercase leading-tight"
              >
                {{
                  responseFromServer?.sent
                    ? "Mensaje Entregado"
                    : errorMessage || "Sin respuesta del bridge"
                }}
              </p>
            </div>

            <div
              class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center overflow-hidden"
            >
              <span
                class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4"
                >Respuesta del Host</span
              >
              <p
                class="font-bold tracking-tighter break-all w-full leading-tight text-2xl text-gray-900 dark:text-white"
              >
                {{
                  responseFromServer?.sent
                    ? responseFromServer?.host_response || "00"
                    : "N/A"
                }}
              </p>
              <p class="mt-4 text-[10px] text-gray-400 uppercase font-bold">
                Respuesta
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const enforceRangeLimit = (fieldId, type, maxLength) => {
  const currentVal = xmlForm.value[fieldId][type];
  if (currentVal !== null && currentVal !== "") {
    const strVal = String(currentVal);
    if (strVal.length > maxLength) {
      xmlForm.value[fieldId][type] = Number(strVal.slice(0, maxLength));
    }
  }
};

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }

  await fetchXmlFiles();
  await loadXmlFields();
});

const delayMs = ref(0);
const batchSize = ref(1);

const rawString = ref("");
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);

const TYPE_META = {
  IFA_NUMERIC: {
    short: "NUM",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    isVar: false,
    isNum: true,
    isBin: false,
  },
  IFA_AMOUNT: {
    short: "AMT",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    isVar: false,
    isNum: false,
    isBin: false,
  },
  IFA_LLNUM: {
    short: "LLNUM",
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    isVar: true,
    isNum: true,
    isBin: false,
  },
  IFA_LLLNUM: {
    short: "LLLNUM",
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    isVar: true,
    isNum: true,
    isBin: false,
  },
  IFA_LLCHAR: {
    short: "LLVAR",
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    isVar: true,
    isNum: false,
    isBin: false,
  },
  IFA_LLLCHAR: {
    short: "LLLVAR",
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    isVar: true,
    isNum: false,
    isBin: false,
  },
  IFA_LLLLCHAR: {
    short: "LLLLVAR",
    color:
      "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
    isVar: true,
    isNum: false,
    isBin: false,
  },
  IFA_BINARY: {
    short: "BIN",
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    isVar: false,
    isNum: false,
    isBin: true,
  },
  IFA_LLBINARY: {
    short: "LLBIN",
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    isVar: true,
    isNum: false,
    isBin: true,
  },
  IFA_LLLBINARY: {
    short: "LLLBIN",
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    isVar: true,
    isNum: false,
    isBin: true,
  },
};

function typeColor(type) {
  return (
    TYPE_META[type]?.color ??
    "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
  );
}

const xmlFields = ref([]);
const xmlForm = ref({});
const xmlMti = ref("1100");
const xmlLoading = ref(false);
const xmlError = ref(null);

const selectedFieldEdit = ref(null);
const gridTool = ref("edit");

const currentEditField = computed(() =>
  selectedFieldEdit.value
    ? xmlFields.value.find((f) => f.id === selectedFieldEdit.value)
    : null,
);

function parseTypeKey(cls) {
  return cls?.split(".").pop() ?? "UNKNOWN";
}
function buildHint({ type, length }) {
  const m = TYPE_META[type] ?? {};
  const parts = [];
  if (m.isNum) parts.push("Solo dígitos");
  if (m.isBin) parts.push("Formato hex");
  parts.push(m.isVar ? `Hasta ${length} caracteres` : `Fijo: ${length}`);
  return parts.join(" · ");
}
function buildPlaceholder({ type, length }) {
  const m = TYPE_META[type] ?? {};
  if (m.isBin) return "0".repeat(Math.min(length * 2, 16)) + "...";
  if (m.isNum) return "0".repeat(Math.min(length, 12));
  return `Hasta ${length} caracteres`;
}

const availableXmlFiles = ref([]);
const selectedXmlFile = ref("");

const fetchXmlFiles = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/xml-files");
    availableXmlFiles.value = data.files || [];
    selectedXmlFile.value =
      data.current ||
      (availableXmlFiles.value.length ? availableXmlFiles.value[0] : "");
  } catch (error) {
    console.error("Error obteniendo lista de XMLs:", error);
  }
};

const onXmlChange = async () => {
  if (!selectedXmlFile.value) return;
  xmlLoading.value = true;
  xmlError.value = null;
  try {
    await axios.post("http://localhost:8080/api/set-xml", {
      filename: selectedXmlFile.value,
    });
    rawString.value = "";
    await loadXmlFields();
  } catch (error) {
    console.error("Error cambiando XML:", error);
    xmlError.value = "Error al cambiar el archivo XML en el servidor.";
  } finally {
    xmlLoading.value = false;
  }
};

async function loadXmlFields() {
  xmlLoading.value = true;
  xmlError.value = null;
  try {
    const { data } = await axios.get("http://localhost:8080/xml-fields");

    xmlFields.value = data
      .filter((f) => f.id !== 0 && f.id !== 1)
      .sort((a, b) => a.id - b.id)
      .map((f) => {
        const type = parseTypeKey(f.class);
        const meta = TYPE_META[type] ?? {
          short: type,
          color: "bg-gray-100 text-gray-500",
          isVar: false,
          isNum: false,
          isBin: false,
        };
        return {
          id: f.id,
          name: f.name.trim(),
          length: f.length,
          type,
          typeShort: meta.short,
          maxInput: meta.isBin ? f.length * 2 : f.length,
          hint: buildHint({ type, length: f.length }),
          placeholder: buildPlaceholder({ type, length: f.length }),
          lengthLabel: meta.isVar ? `max ${f.length}` : `len ${f.length}`,
          isNum: meta.isNum,
          isVar: meta.isVar,
          isBin: meta.isBin,
        };
      });

    const initial = {};
    xmlFields.value.forEach((f) => {
      initial[f.id] = {
        active: false,
        value: "",
        synthetic: false,
        minRange: "",
        maxRange: "",
        mode: "random",
      };
    });
    xmlForm.value = initial;
  } catch {
    xmlError.value = "Error conectando al Servidor en el puerto 8080.";
  } finally {
    xmlLoading.value = false;
  }
}

function hexToBin(hex) {
  return hex
    .split("")
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
}

const rawPreview = ref(null);
let parseTimeout = null;
let skipNextParse = false;

watch(rawString, (newVal) => {
  clearTimeout(parseTimeout);

  if (skipNextParse) {
    skipNextParse = false;
    return;
  }

  const s = newVal.trim();
  if (!s || s.length < 16) {
    rawPreview.value = null;
    Object.keys(xmlForm.value).forEach((k) => {
      xmlForm.value[k].active = false;
      xmlForm.value[k].value = "";
    });
    return;
  }

  parseTimeout = setTimeout(async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/parse", {
        raw_string: s,
      });
      rawPreview.value = data;
      xmlMti.value = data.mti || "0000";

      Object.keys(xmlForm.value).forEach((k) => {
        xmlForm.value[k].active = false;
        xmlForm.value[k].value = "";
      });

      Object.entries(data.fields).forEach(([fid, val]) => {
        if (xmlForm.value[fid]) {
          xmlForm.value[fid].active = true;
          xmlForm.value[fid].value = val;
        }
      });
    } catch (err) {
      console.warn(
        "Fallo el parser del servidor, extrayendo solo Bitmap localmente.",
      );

      const mti = s.slice(0, 4);
      const bitmapHex1 = s.slice(4, 20);
      let active_fields = [];
      try {
        let bin1 = hexToBin(bitmapHex1);
        for (let i = 1; i < 64; i++)
          if (bin1[i] === "1") active_fields.push(i + 1);
        if (bin1[0] === "1" && s.length >= 36) {
          let bin2 = hexToBin(s.slice(20, 36));
          for (let i = 0; i < 64; i++)
            if (bin2[i] === "1") active_fields.push(i + 65);
        }
      } catch (e) {}

      rawPreview.value = { mti, active_fields };
      xmlMti.value = mti;

      Object.keys(xmlForm.value).forEach((k) => {
        xmlForm.value[k].active = active_fields.includes(parseInt(k));
      });
    }
  }, 400);
});

const filteredXmlFields = computed(() => {
  if (!rawPreview.value || !rawPreview.value.active_fields) return [];
  return xmlFields.value.filter((f) =>
    rawPreview.value.active_fields.includes(f.id),
  );
});

// ── Cambios Rápidos  ──────────────────────────
const showQuickEdits = ref(false);

const quickEditFields = computed(() => {
  if (!rawPreview.value || !rawPreview.value.active_fields) return [];
  const targetIds = [2, 4, 7, 12, 13, 18, 19];
  return xmlFields.value.filter(
    (f) =>
      targetIds.includes(f.id) && rawPreview.value.active_fields.includes(f.id),
  );
});

const handleGridFieldClick = (id) => {
  const fieldData = xmlForm.value[id];
  if (gridTool.value === "edit") {
    selectedFieldEdit.value = selectedFieldEdit.value === id ? null : id;

    if (selectedFieldEdit.value) {
      nextTick(() => {
        document
          .getElementById("edit-panel")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  } else if (gridTool.value === "toggle_active") {
    fieldData.active = !fieldData.active;
    if (!fieldData.active) {
      fieldData.synthetic = false;
      if (selectedFieldEdit.value === id) selectedFieldEdit.value = null;
    }
  } else if (gridTool.value === "toggle_synthetic") {
    if (fieldData.active) fieldData.synthetic = !fieldData.synthetic;
  }
};

const toggleAllFields = (type, state) => {
  filteredXmlFields.value.forEach((f) => {
    const id = f.id;
    const fieldData = xmlForm.value[id];

    if (type === "active") {
      fieldData.active = state;
      if (!state) {
        fieldData.synthetic = false;
        if (selectedFieldEdit.value === id) selectedFieldEdit.value = null;
      }
    } else if (type === "synthetic") {
      if (fieldData.active || !state) {
        fieldData.synthetic = state;
      }
    }
  });
};

const deactivateField = (id) => {
  xmlForm.value[id].active = false;
  xmlForm.value[id].synthetic = false;
  selectedFieldEdit.value = null;
};

function isFieldValid(field, value) {
  if (!value) return true;
  const strVal = String(value);
  if (field.isNum && !/^\d+$/.test(strVal)) return false;
  if (field.isBin && !/^[0-9A-Fa-f]+$/i.test(strVal)) return false;
  if (strVal.length > field.maxInput) return false;
  return true;
}

const activeXmlFields = computed(() =>
  xmlFields.value.filter((f) => xmlForm.value[f.id]?.active),
);

const isFormValid = computed(() => {
  if (!/^\d{4}$/.test(xmlMti.value)) return false;
  if (activeXmlFields.value.length === 0) return false;
  return activeXmlFields.value.every((f) => {
    const v = xmlForm.value[f.id]?.value ?? "";
    if (!xmlForm.value[f.id].synthetic) {
      return v.length > 0 && isFieldValid(f, v);
    }
    return true;
  });
});

const fillSyntheticRaw = async () => {
  try {
    isLoading.value = true;
    const { data } = await axios.get(
      "http://localhost:8080/api/generate-raw-sample",
    );

    if (data && data.raw_iso) {
      skipNextParse = true;
      rawString.value = data.raw_iso;

      if (data.parsed_fields) {
        const active_fields = Object.keys(data.parsed_fields).map(Number);
        rawPreview.value = { mti: data.mti, active_fields };
        xmlMti.value = data.mti;

        Object.keys(xmlForm.value).forEach((k) => {
          xmlForm.value[k].active = false;
          xmlForm.value[k].value = "";
        });

        Object.entries(data.parsed_fields).forEach(([fid, val]) => {
          if (xmlForm.value[fid]) {
            xmlForm.value[fid].active = true;
            xmlForm.value[fid].value = val;
          }
        });
      }
    }
  } catch (error) {
    console.error("Error al obtener muestra raw:", error);
  } finally {
    isLoading.value = false;
  }
};

// ── Sincronización (Editor -> Raw) ─────────────────────────
const isSyncing = ref(false);

const syncToRaw = async () => {
  isSyncing.value = true;
  try {
    const fields = {};
    activeXmlFields.value.forEach((f) => {
      fields[String(f.id)] = xmlForm.value[f.id].value;

      let isSynthetic = xmlForm.value[f.id].synthetic;

      if (f.isNum) {
        const minVal = parseInt(xmlForm.value[f.id].minRange);
        const maxVal = parseInt(xmlForm.value[f.id].maxRange);
        const modeVal = xmlForm.value[f.id].mode || "random";

        if (!isNaN(minVal) && !isNaN(maxVal)) {
          syntheticConfig[String(f.id)] = {
            min: minVal,
            max: maxVal,
            mode: modeVal,
          };
          isSynthetic = true;
        }
      }

      if (isSynthetic) {
        if (!syntheticFields.includes(String(f.id))) {
          syntheticFields.push(String(f.id));
        }
      }
    });

    const { data } = await axios.post("http://localhost:8080/api/build-raw", {
      mti: xmlMti.value,
      fields: fields,
    });

    if (data && data.raw_iso) {
      skipNextParse = true;
      rawString.value = data.raw_iso;

      const parsed = await axios.post("http://localhost:8080/api/parse", {
        raw_string: data.raw_iso,
      });
      rawPreview.value = parsed.data;
    }
  } catch (err) {
    alert(
      "Error al sincronizar: \n" +
        (err.response?.data?.detail ||
          "Revisa que los campos cumplan con la longitud y formato correctos del XML."),
    );
  } finally {
    isSyncing.value = false;
  }
};

const handleDispatch = async () => {
  isLoading.value = true;
  responseFromServer.value = null;
  errorMessage.value = null;

  const fields = {};
  const syntheticFields = [];
  const syntheticConfig = {};

  activeXmlFields.value.forEach((f) => {
    fields[String(f.id)] = xmlForm.value[f.id].value;

    let isSynthetic = xmlForm.value[f.id].synthetic;

    if (f.isNum) {
      const minVal = parseInt(xmlForm.value[f.id].minRange);
      const maxVal = parseInt(xmlForm.value[f.id].maxRange);
      const modeVal = xmlForm.value[f.id].mode || "random";

      if (!isNaN(minVal) && !isNaN(maxVal)) {
        syntheticConfig[String(f.id)] = {
          min: minVal,
          max: maxVal,
          mode: modeVal,
        };
        isSynthetic = true;
      }
    }

    if (isSynthetic) {
      if (!syntheticFields.includes(String(f.id))) {
        syntheticFields.push(String(f.id));
      }
    }
  });

  try {
    const { data } = await axios.post("http://localhost:8080/send-message", {
      is_raw: false,
      is_synthetic: syntheticFields.length > 0,
      burst_synthetic: syntheticFields.length > 0,
      mti: xmlMti.value,
      batch_size: batchSize.value,
      delay_ms: delayMs.value,
      fields,
      synthetic_fields: syntheticFields,
      synthetic_config: syntheticConfig,
    });

    responseFromServer.value =
      data.results?.length > 0
        ? data.results[data.results.length - 1]
        : {
            generated_iso: data.generated_iso,
            host_response: data.host_response,
            sent: data.sent,
          };

    if (data.sent === false) errorMessage.value = data.host_response;
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail || "Error interno del servidor.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: transactiveXmllateY(-10px);
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #06b6d4;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #06b6d4;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
}
</style>
