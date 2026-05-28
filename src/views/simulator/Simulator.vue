<template>
  <content-tpl>
    <template #header-left>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-7xl mx-auto gap-4"
      >
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

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div
            class="relative flex items-center bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-full pl-4 pr-8 py-2 shadow-sm transition-all hover:border-cyan-300 dark:hover:border-cyan-700 w-full sm:w-auto"
          >
            <span
              class="material-symbols-outlined text-cyan-500 text-sm mr-2 shrink-0"
            >
              description
            </span>
            <select
              v-model="selectedXmlFile"
              @change="onXmlChange"
              class="bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 outline-none cursor-pointer appearance-none w-full sm:w-48 truncate"
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
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-4">
        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <button
            @click="showTemplates = !showTemplates"
            class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"
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
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </div>
              <div class="text-left">
                <h3
                  class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                >
                  Plantillas de ajustes
                </h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Guarda y carga tus configuraciones
                </p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform duration-300"
              :class="showTemplates ? 'rotate-180' : ''"
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
              v-if="showTemplates"
              class="p-6 border-t border-gray-100 dark:border-slate-800 bg-indigo-50/5 dark:bg-indigo-900/5"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-3">
                  <label
                    class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                    >Guardar Plantilla</label
                  >
                  <div class="flex gap-2">
                    <label
                      class="flex items-center gap-2 cursor-pointer select-none w-fit mt-1"
                    >
                      <input
                        type="checkbox"
                        v-model="saveWithRaw"
                        :disabled="!rawString"
                        class="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer disabled:opacity-40"
                      />
                      <span
                        class="text-[9px] font-bold uppercase tracking-widest transition-colors"
                        :class="
                          saveWithRaw && rawString
                            ? 'text-indigo-500'
                            : 'text-gray-400'
                        "
                      >
                        Incluir trama actual
                      </span>
                      <span
                        v-if="rawString && saveWithRaw"
                        class="text-[8px] font-mono text-gray-400 truncate max-w-[120px]"
                        :title="rawString"
                      >
                        {{ rawString.slice(0, 12) }}…
                      </span>
                    </label>
                    <input
                      v-model="newConfigName"
                      type="text"
                      placeholder="Nombre de la plantilla..."
                      class="flex-1 text-xs font-mono px-3 py-2 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none border-indigo-200 focus:border-indigo-500"
                    />
                    <button
                      @click="saveConfiguration"
                      :disabled="!newConfigName || activeXmlFields.length === 0"
                      class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      Guardar
                    </button>
                  </div>
                  <transition name="fade">
                    <p
                      v-if="saveStatusMessage"
                      class="text-[10px] font-bold uppercase tracking-tight"
                      :class="
                        saveStatusIsError ? 'text-red-500' : 'text-emerald-500'
                      "
                    >
                      {{ saveStatusMessage }}
                    </p>
                  </transition>
                </div>
                <div class="flex flex-col gap-3">
                  <label
                    class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                    >Cargar Plantilla</label
                  >
                  <select
                    @change="loadConfiguration"
                    class="w-full text-xs font-mono px-3 py-2.5 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none cursor-pointer border-indigo-200 focus:border-indigo-500"
                  >
                    <option value="">-- Selecciona una plantilla --</option>
                    <option
                      v-for="cfg in savedConfigsList"
                      :key="cfg.name"
                      :value="cfg.name"
                    >
                      {{ cfg.name }}
                    </option>
                  </select>
                  <transition name="fade">
                    <p
                      v-if="loadStatusMessage"
                      class="text-[10px] font-bold uppercase tracking-tight"
                      :class="
                        loadStatusIsError ? 'text-red-500' : 'text-emerald-500'
                      "
                    >
                      {{ loadStatusMessage }}
                    </p>
                  </transition>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <button
            @click="showRawString = !showRawString"
            class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0"
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div class="text-left">
                <div class="flex items-center gap-3">
                  <h3
                    class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                  >
                    Cadena ISO8583
                  </h3>
                  <div
                    v-if="rawPreview"
                    class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                  >
                    Trama Detectada
                  </div>
                </div>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Pega aquí tu cadena cruda.
                </p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform duration-300"
              :class="showRawString ? 'rotate-180' : ''"
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
              v-if="showRawString"
              class="p-6 border-t border-gray-100 dark:border-slate-800"
            >
              <div class="flex justify-between items-center mb-3">
                <label
                  class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                  Trama Raw (Hex/Texto)
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
                class="w-full font-mono text-xs bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none resize-none leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 shadow-sm transition-all"
              ></textarea>
            </div>
          </transition>
        </div>

        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <button
            @click="showQuickEdits = !showQuickEdits"
            class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-[20px]">
                  bolt
                </span>
              </div>
              <div class="text-left">
                <h3
                  class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                >
                  Editor rápido
                </h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Edita campos fijados rapidamente
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
                v-if="!rawPreview"
                class="flex flex-col items-center justify-center py-6 opacity-50"
              >
                <span
                  class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 mb-2"
                  >lock</span
                >
                <p
                  class="text-xs font-bold text-gray-400 tracking-widest uppercase"
                >
                  Ingresa una trama primero
                </p>
              </div>
              <div
                v-else-if="quickEditFields.length === 0"
                class="flex flex-col items-center justify-center gap-2 py-8"
              >
                <span
                  class="material-symbols-outlined text-3xl text-amber-300 dark:text-amber-900/50"
                  >push_pin</span
                >
                <p
                  class="text-xs font-bold text-gray-400 uppercase tracking-widest text-center"
                >
                  No has fijado ningún campo.<br />Ve al "XML Builder" y usa la
                  opción "Fijar Rápido".
                </p>
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

                  <div v-if="field.id === 4" class="relative w-full">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
                      >$</span
                    >
                    <input
                      :value="getFormattedAmount(xmlForm[field.id].value)"
                      @change="
                        setFormattedAmount(field.id, $event.target.value)
                      "
                      :readonly="field.id == 1"
                      :maxlength="field.maxInput"
                      placeholder="0.00"
                      class="w-full font-mono text-xs pl-7 pr-3 py-2.5 rounded-xl border-2 outline-none transition-all"
                      :class="[
                        field.id == 1
                          ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                          : xmlForm[field.id].synthetic
                            ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700/50 focus:border-purple-500'
                            : isFieldMasked(xmlForm[field.id].value) &&
                                field.id !== 1
                              ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 border-amber-400 focus:border-amber-500'
                              : xmlForm[field.id].value &&
                                  !isFieldValid(
                                    field,
                                    xmlForm[field.id].value,
                                  ) &&
                                  !xmlForm[field.id].synthetic
                                ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100'
                                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:border-amber-500',
                      ]"
                    />
                  </div>

                  <input
                    v-else
                    v-model="xmlForm[field.id].value"
                    :readonly="field.id == 1"
                    :maxlength="field.maxInput"
                    class="w-full font-mono text-xs px-3 py-2.5 rounded-xl border-2 outline-none transition-all"
                    :class="[
                      field.id == 1
                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                        : xmlForm[field.id].synthetic
                          ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700/50 focus:border-purple-500'
                          : isFieldMasked(xmlForm[field.id].value) &&
                              field.id !== 1
                            ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 border-amber-400 focus:border-amber-500'
                            : xmlForm[field.id].value &&
                                !isFieldValid(field, xmlForm[field.id].value) &&
                                !xmlForm[field.id].synthetic
                              ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100'
                              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-black text-gray-800 dark:text-gray-100 focus:border-amber-500',
                    ]"
                  />
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <button
            @click="showXmlBuilder = !showXmlBuilder"
            class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <div class="text-left">
                <h3
                  class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                >
                  XML Builder
                </h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Mapa de campos, edición avanzada y sincronización Raw
                </p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform duration-300"
              :class="showXmlBuilder ? 'rotate-180' : ''"
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
              v-if="showXmlBuilder"
              class="p-6 border-t border-gray-100 dark:border-slate-800"
            >
              <div
                v-if="!rawPreview"
                class="flex flex-col items-center justify-center py-6 opacity-50"
              >
                <span
                  class="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-700 mb-2"
                  >lock</span
                >
                <p
                  class="text-xs font-bold text-gray-400 tracking-widest uppercase"
                >
                  Ingresa una trama primero
                </p>
              </div>

              <div v-else>
                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                    ></div>
                    <span
                      class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
                    >
                      {{ activeXmlFields.length }} Campos Extraídos
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
                      class="w-20 px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-black border border-purple-200 dark:border-purple-900/50 rounded-lg text-purple-600 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-center"
                      placeholder="1100"
                    />

                    <label
                      class="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2 hidden sm:block"
                      >BITMAP</label
                    >
                    <input
                      :value="xmlBitmap"
                      readonly
                      class="w-36 sm:w-64 px-3 py-2 text-xs font-mono font-bold bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 dark:text-gray-500 shadow-inner outline-none truncate select-all cursor-not-allowed"
                      title="Bitmap Hexadecimal (Auto-calculado)"
                    />
                  </div>
                </div>

                <div
                  class="mb-6 flex flex-col gap-4 p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/30 dark:bg-black/20 animate-fade-in"
                >
                  <div
                    v-if="detectedBitmaps.expectedFields.length > 0"
                    class="space-y-2"
                  >
                    <div class="flex justify-between items-center">
                      <label
                        class="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5"
                      >
                        <span class="material-symbols-outlined text-xs"
                          >analytics</span
                        >
                        Data Elements (DE) exigidos por este Bitmap
                      </label>
                      <span
                        class="text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded"
                      >
                        {{ detectedBitmaps.expectedFields.length }} Campos
                        requeridos
                      </span>
                    </div>

                    <div
                      class="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800/60 shadow-inner"
                    >
                      <span
                        v-for="de in detectedBitmaps.expectedFields"
                        :key="'de-' + de"
                        class="text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 px-2 py-0.5 rounded-md shadow-sm"
                      >
                        DE{{ de }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="flex flex-col sm:flex-row gap-4 text-[10px] opacity-70 font-mono"
                  >
                    <div>
                      <span class="text-cyan-500 font-bold">BMP1:</span>
                      {{ detectedBitmaps.primary }}
                    </div>
                    <div v-if="detectedBitmaps.isSecondaryActive">
                      <span class="text-purple-500 font-bold">BMP2:</span>
                      {{ detectedBitmaps.secondary }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="xmlLoading"
                  class="flex items-center justify-center py-16"
                >
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
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
                          >— Seleccionar campo</span
                        >
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
                        <span
                          v-if="gridTool === 'toggle_quickedit'"
                          class="text-amber-500"
                          >— Fijar campos en editor rápido</span
                        >
                      </span>
                      <span
                        class="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded"
                      >
                        {{ activeXmlFields.length }} Activos
                      </span>
                    </div>

                    <transition name="fade">
                      <div
                        v-if="parsingErrorField"
                        class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl"
                      >
                        <h4
                          class="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-2"
                        >
                          <span class="material-symbols-outlined text-sm"
                            >warning</span
                          >
                          Error fatal de parseo en el DE{{ parsingErrorField }}
                        </h4>
                        <p
                          class="text-[10px] text-red-600/80 dark:text-red-400/80 mt-1"
                        >
                          {{ parsingErrorMessage }}. El resto de la trama fue
                          ignorada.
                        </p>
                      </div>
                    </transition>

                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="field in filteredXmlFields"
                        :key="field.id"
                        @click="handleGridFieldClick(field.id)"
                        class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 border-2"
                        :class="[
                          parsingErrorField === field.id
                            ? 'bg-red-500 border-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse scale-110 z-20 ring-4 ring-red-500/30'
                            : selectedFieldEdit === field.id
                              ? xmlForm[field.id].synthetic
                                ? 'bg-purple-500 border-purple-500 text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)] scale-110 z-10 ring-2 ring-purple-200 dark:ring-purple-900'
                                : 'bg-cyan-500 border-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4)] scale-110 z-10 ring-2 ring-cyan-200 dark:ring-cyan-900'
                              : xmlForm[field.id]?.active
                                ? isFieldMasked(xmlForm[field.id].value) &&
                                  !xmlForm[field.id].synthetic
                                  ? 'bg-amber-50 border-amber-400 text-amber-600 shadow-[0_0_8px_rgba(251,191,36,0.5)] dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-400'
                                  : !isFieldValid(
                                        field,
                                        xmlForm[field.id].value,
                                      ) && !xmlForm[field.id].synthetic
                                    ? 'bg-red-50 border-red-400 text-red-600 shadow-[0_0_8px_rgba(248,113,113,0.5)] dark:bg-red-900/30 dark:border-red-600 dark:text-red-400'
                                    : gridTool === 'toggle_quickedit'
                                      ? xmlForm[field.id]?.quickEdit
                                        ? 'bg-amber-400 border-amber-500 text-white shadow-md'
                                        : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-slate-800 dark:border-slate-700 opacity-60'
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
                          Sintético
                        </button>
                        <button
                          @click="gridTool = 'toggle_quickedit'"
                          :class="
                            gridTool === 'toggle_quickedit'
                              ? 'bg-amber-500 shadow text-white'
                              : 'text-gray-500 hover:text-amber-600 dark:hover:text-amber-400'
                          "
                          class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1"
                        >
                          <span class="material-symbols-outlined text-[14px]"
                            >push_pin</span
                          >
                          Fijar Editor Rápido
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
                            v-else-if="gridTool === 'toggle_quickedit'"
                            key="quickedit-tools"
                            class="flex gap-3"
                          >
                            <button
                              @click="toggleAllFields('quickedit', true)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-amber-500/30 text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                            >
                              Fijar Todos
                            </button>
                            <button
                              @click="toggleAllFields('quickedit', false)"
                              class="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-gray-500/30 text-gray-500 bg-gray-500/10 hover:bg-gray-500/20 transition-colors"
                            >
                              Desfijar Todos
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
                      id="edit-panel"
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
                        <div
                          v-if="currentEditField.id === 4"
                          class="relative w-full"
                        >
                          <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg"
                            >$</span
                          >
                          <input
                            :value="
                              getFormattedAmount(
                                xmlForm[currentEditField.id].value,
                              )
                            "
                            @change="
                              setFormattedAmount(
                                currentEditField.id,
                                $event.target.value,
                              )
                            "
                            :readonly="currentEditField.id == 1"
                            :maxlength="currentEditField.maxInput"
                            placeholder="0.00"
                            class="w-full font-mono text-sm pl-9 pr-4 py-4 rounded-xl border-2 outline-none transition-all"
                            :class="[
                              currentEditField.id == 1
                                ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                                : xmlForm[currentEditField.id].synthetic
                                  ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 placeholder-purple-300 dark:placeholder-purple-800/50 border-purple-300 dark:border-purple-700/50 focus:border-purple-500 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.15)]'
                                  : isFieldMasked(
                                        xmlForm[currentEditField.id].value,
                                      ) && currentEditField.id !== 1
                                    ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 border-amber-400 focus:border-amber-500 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.15)]'
                                    : xmlForm[currentEditField.id].value &&
                                        !isFieldValid(
                                          currentEditField,
                                          xmlForm[currentEditField.id].value,
                                        ) &&
                                        currentEditField.id !== 1
                                      ? 'border-red-400 focus:border-red-500 dark:border-red-800 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
                                      : 'bg-white dark:bg-black text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.1)]',
                            ]"
                          />
                        </div>

                        <input
                          v-else
                          v-model="xmlForm[currentEditField.id].value"
                          :readonly="currentEditField.id == 1"
                          :maxlength="currentEditField.maxInput"
                          :placeholder="currentEditField.placeholder"
                          class="w-full font-mono text-sm px-4 py-4 rounded-xl border-2 outline-none transition-all"
                          :class="[
                            currentEditField.id == 1
                              ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                              : xmlForm[currentEditField.id].synthetic
                                ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 placeholder-purple-300 dark:placeholder-purple-800/50 border-purple-300 dark:border-purple-700/50 focus:border-purple-500 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.15)]'
                                : isFieldMasked(
                                      xmlForm[currentEditField.id].value,
                                    ) && currentEditField.id !== 1
                                  ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 border-amber-400 focus:border-amber-500 focus:shadow-[0_0_0_4px_rgba(251,191,36,0.15)]'
                                  : xmlForm[currentEditField.id].value &&
                                      !isFieldValid(
                                        currentEditField,
                                        xmlForm[currentEditField.id].value,
                                      ) &&
                                      currentEditField.id !== 1
                                    ? 'border-red-400 focus:border-red-500 dark:border-red-800 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]'
                                    : 'bg-white dark:bg-black text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700 border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.1)]',
                          ]"
                        />

                        <transition name="fade">
                          <div
                            v-if="
                              currentEditField.id !== 1 &&
                              (currentEditField.isNum ||
                                [2, 4, 12, 18, 38, 41, 45, 49].includes(
                                  currentEditField.id,
                                ))
                            "
                            class="flex flex-col gap-3 p-4 mt-2 rounded-xl border transition-all bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
                          >
                            <label
                              class="flex items-center gap-3 cursor-pointer w-fit select-none"
                            >
                              <input
                                type="checkbox"
                                v-model="
                                  xmlForm[currentEditField.id].useValueList
                                "
                                @change="
                                  initValueList(currentEditField.id);
                                  if (
                                    xmlForm[currentEditField.id].useValueList
                                  ) {
                                    xmlForm[currentEditField.id].useRange =
                                      false;
                                    xmlForm[currentEditField.id].minRange = '';
                                    xmlForm[currentEditField.id].maxRange = '';
                                  }
                                "
                                class="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer accent-emerald-500"
                              />
                              <span
                                class="text-[10px] font-bold uppercase tracking-widest transition-colors text-gray-500 dark:text-gray-400"
                                :class="{
                                  'text-emerald-600 dark:text-emerald-400':
                                    xmlForm[currentEditField.id].useValueList,
                                }"
                                >Usar Pool de valores específicos</span
                              >
                            </label>
                            <div
                              v-if="xmlForm[currentEditField.id].useValueList"
                              class="flex flex-col gap-3 mt-2 animate-fade-in"
                            >
                              <div class="flex gap-2">
                                <input
                                  type="text"
                                  v-model="newValueInput"
                                  :maxlength="currentEditField.maxInput"
                                  @keyup.enter="
                                    addValueToList(currentEditField.id)
                                  "
                                  :placeholder="
                                    'Añadir valor para F' +
                                    currentEditField.id +
                                    '...'
                                  "
                                  class="flex-1 text-xs font-mono px-3 py-2 rounded-lg border bg-white dark:bg-black text-gray-800 dark:text-white outline-none border-emerald-200 dark:border-emerald-800/50 focus:border-emerald-500"
                                />
                                <button
                                  @click="addValueToList(currentEditField.id)"
                                  class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                                >
                                  Añadir
                                </button>
                              </div>
                              <div class="flex flex-wrap gap-2">
                                <span
                                  v-if="
                                    !xmlForm[currentEditField.id].valueList
                                      ?.length
                                  "
                                  class="text-[10px] text-emerald-600/50 dark:text-emerald-400/50 italic"
                                  >No hay valores en la lista.</span
                                >
                                <span
                                  v-for="(val, index) in xmlForm[
                                    currentEditField.id
                                  ].valueList"
                                  :key="index"
                                  class="text-[10px] font-mono font-bold bg-white dark:bg-black border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md flex items-center gap-2 shadow-sm"
                                >
                                  {{ val }}
                                  <button
                                    @click="
                                      removeValueFromList(
                                        currentEditField.id,
                                        index,
                                      )
                                    "
                                    class="text-red-400 hover:text-red-600 text-sm leading-none"
                                  >
                                    &times;
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </transition>

                        <div
                          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          v-if="currentEditField.id !== 1"
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
                                xmlForm[currentEditField.id].synthetic
                                  ? 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-900/20'
                                  : isFieldMasked(
                                        xmlForm[currentEditField.id].value,
                                      )
                                    ? 'text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400'
                                    : xmlForm[currentEditField.id].value &&
                                        !isFieldValid(
                                          currentEditField,
                                          xmlForm[currentEditField.id].value,
                                        )
                                      ? 'text-red-500 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
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
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <button
            @click="showSettings = !showSettings"
            class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div class="text-left">
                <h3
                  class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                >
                  Ajustes de Envío
                </h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Cantidad de ráfagas y retrasos
                </p>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform duration-300"
              :class="showSettings ? 'rotate-180' : ''"
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
              v-if="showSettings"
              class="p-6 border-t border-gray-100 dark:border-slate-800"
            >
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto"
              >
                <div class="flex flex-col justify-between h-full space-y-4">
                  <div class="flex justify-between items-center h-10">
                    <label
                      class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                      >Cantidad de Mensajes</label
                    >
                    <input
                      type="number"
                      v-model="batchSize"
                      class="w-24 px-3 py-2 text-center text-sm font-mono font-bold bg-white dark:bg-black border border-cyan-200 dark:border-cyan-900/50 rounded-lg text-cyan-600 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div class="py-1">
                    <input
                      type="range"
                      v-model="batchSize"
                      min="1"
                      max="100"
                      class="w-full h-1.5 bg-cyan-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  <div class="h-4 flex items-start">
                    <p class="text-[9px] text-gray-400 italic">
                      La trama se enviará repetidamente {{ batchSize }} veces.
                    </p>
                  </div>
                </div>

                <div class="flex flex-col justify-between h-full space-y-4">
                  <div class="flex justify-between items-center h-10">
                    <label
                      class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                      >Retraso entre envíos</label
                    >
                    <div
                      class="w-24 px-3 py-2 text-center text-sm font-mono font-bold bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-cyan-500 shadow-inner select-none pointer-events-none"
                    >
                      {{ delayMs }} ms
                    </div>
                  </div>
                  <div class="py-1">
                    <input
                      type="range"
                      v-model="delayMs"
                      min="0"
                      max="5000"
                      step="100"
                      class="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                  <div
                    class="h-4 flex items-start justify-between text-[8px] text-gray-400 font-bold uppercase"
                  >
                    <span>0ms (Instantáneo)</span>
                    <span>5s (Lento)</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="flex justify-end pt-6">
          <button
            type="button"
            @click="handleDispatch"
            :disabled="isLoading || !rawPreview || !isFormValid"
            class="px-12 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:-translate-y-0.5 shadow-lg shadow-purple-500/25 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600 disabled:shadow-none disabled:transform-none"
          >
            <span
              v-if="isLoading"
              class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"
            ></span>
            <span
              >ENVIAR TRAMA ({{
                activeXmlFields.length > 0
                  ? activeXmlFields.length - (xmlForm[1]?.active ? 1 : 0)
                  : 0
              }}
              campos)</span
            >
          </button>
        </div>

        <div
          v-if="responseFromServer || errorMessage"
          class="animate-fade-in pb-10 mt-4"
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
        <transition name="toast-drop">
          <div
            v-if="toast.show"
            class="fixed top-8 left-1/2 z-[9999] flex items-center gap-5 w-[90vw] max-w-2xl px-8 py-5 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] border transition-all"
            :class="
              toast.type === 'error'
                ? 'bg-red-50 border-red-200 border-l-[12px] border-l-red-500 text-red-700 dark:bg-[#2c1015] dark:border-red-900/50 dark:border-l-red-600 dark:text-red-400'
                : 'bg-emerald-50 border-emerald-200 border-l-[12px] border-l-emerald-500 text-emerald-700 dark:bg-[#122e20] dark:border-emerald-900/50 dark:border-l-emerald-600 dark:text-emerald-400'
            "
          >
            <span
              class="material-symbols-outlined text-5xl shrink-0"
              :class="
                toast.type === 'error'
                  ? 'text-red-500 dark:text-red-500'
                  : 'text-emerald-500 dark:text-emerald-500'
              "
            >
              {{ toast.type === "error" ? "error" : "check_circle" }}
            </span>

            <div class="flex-1 space-y-1.5 pr-4">
              <p
                class="text-[10px] font-black uppercase tracking-widest opacity-60"
              >
                Notificación del Sistema
              </p>

              <p
                class="text-sm font-bold uppercase tracking-widest whitespace-pre-wrap leading-relaxed"
              >
                {{ toast.message }}
              </p>
            </div>

            <button
              @click="toast.show = false"
              class="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </transition>
      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const isDark = ref(false);

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
  await fetchSavedConfigs();
});

const delayMs = ref(0);
const batchSize = ref(1);

const rawString = ref("");
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);

const toast = ref({ show: false, message: "", type: "error" });

function showToast(message, type = "error") {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 10000);
}

const detectedBitmaps = computed(() => {
  let s = rawString.value.trim();
  if (s.startsWith("ISO")) s = s.substring(12);

  if (s.length < 20)
    return {
      primary: "---",
      secondary: "---",
      isSecondaryActive: false,
      expectedFields: [],
    };

  const primary = s.slice(4, 20);

  const firstChar = primary.charAt(0).toUpperCase();
  const isSecondaryActive = ["8", "9", "A", "B", "C", "D", "E", "F"].includes(
    firstChar,
  );

  let secondary = "Esperando más caracteres...";
  if (isSecondaryActive && s.length >= 36) {
    secondary = s.slice(20, 36);
  }

  let expectedFields = [];
  try {
    let bin1 = hexToBin(primary);
    for (let i = 1; i < 64; i++) {
      if (bin1[i] === "1") expectedFields.push(i + 1);
    }

    if (isSecondaryActive && s.length >= 36) {
      let bin2 = hexToBin(secondary);
      for (let i = 0; i < 64; i++) {
        if (bin2[i] === "1") expectedFields.push(i + 65);
      }
    }
  } catch (e) {
    console.warn("Error calculando los DEs del Bitmap", e);
  }

  return { primary, secondary, isSecondaryActive, expectedFields };
});

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

const DEFAULT_QUICK_EDITS = [1, 2, 4, 12, 18, 38, 41, 45, 49];

async function loadXmlFields() {
  xmlLoading.value = true;
  xmlError.value = null;
  try {
    const { data } = await axios.get("http://localhost:8080/xml-fields");

    xmlFields.value = data
      .filter((f) => f.id !== 0)
      .sort((a, b) => a.id - b.id)
      .map((f) => {
        let type = parseTypeKey(f.class);
        let meta = TYPE_META[type] ?? {
          short: type,
          color: "bg-gray-100 text-gray-500",
          isVar: false,
          isNum: false,
          isBin: false,
        };

        if (f.id === 1) {
          meta.short = "BIN";
          meta.isBin = true;
          meta.isNum = false;
          meta.isVar = false;
        }

        return {
          id: f.id,
          name: f.id === 1 ? "BITMAP" : f.name.trim(),
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
        quickEdit: DEFAULT_QUICK_EDITS.includes(f.id),
        minRange: "",
        maxRange: "",
        mode: "random",
        useRange: false,
        useValueList: false,
        valueList: [],
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
const parsingErrorField = ref(null);
const parsingErrorMessage = ref("");

const activeXmlFields = computed(() =>
  xmlFields.value.filter((f) => xmlForm.value[f.id]?.active),
);

const xmlBitmap = computed(() => {
  let bin = Array(128).fill("0");
  let hasSecondary = false;

  activeXmlFields.value
    .filter((f) => f.id > 1)
    .forEach((f) => {
      if (f.id > 64) hasSecondary = true;
      bin[f.id - 1] = "1";
    });

  if (hasSecondary) bin[0] = "1";

  let hex = "";
  const limit = hasSecondary ? 128 : 64;
  for (let i = 0; i < limit; i += 4) {
    let nibble = bin.slice(i, i + 4).join("");
    hex += parseInt(nibble, 2).toString(16).toUpperCase();
  }
  return hex || "0000000000000000";
});

watch(
  xmlBitmap,
  (newHex) => {
    if (xmlForm.value[1]) {
      xmlForm.value[1].value = newHex;
      const shouldBeActive = newHex !== "0000000000000000";
      if (xmlForm.value[1].active !== shouldBeActive) {
        xmlForm.value[1].active = shouldBeActive;
      }
    }
  },
  { immediate: true },
);

watch(rawPreview, (newVal) => {
  if (newVal && !showXmlBuilder.value) {
    showRawString.value = false;
  }
});

watch(rawString, (newVal) => {
  clearTimeout(parseTimeout);

  if (skipNextParse) {
    skipNextParse = false;
    return;
  }

  const s = newVal.trim();

  if (!s || s.length < 16) {
    rawPreview.value = null;
    parsingErrorField.value = null;
    parsingErrorMessage.value = "";
    errorMessage.value = null;
    responseFromServer.value = null;
    showXmlBuilder.value = false;

    Object.keys(xmlForm.value).forEach((k) => {
      xmlForm.value[k].active = false;
      xmlForm.value[k].value = "";
      xmlForm.value[k].synthetic = false;
    });
    return;
  }

  parseTimeout = setTimeout(async () => {
    isParsingFromServer.value = true;
    try {
      const { data } = await axios.post("http://localhost:8080/api/parse", {
        raw_string: s,
      });

      rawPreview.value = data;
      xmlMti.value = data.mti || "0000";
      parsingErrorField.value = data.error_field || null;
      parsingErrorMessage.value = data.error_msg || "";

      // Apagar campos anteriores
      Object.keys(xmlForm.value).forEach((k) => {
        if (k != 1) xmlForm.value[k].active = false;
      });

      let hasValidationError = false;

      Object.entries(data.fields).forEach(([fid, val]) => {
        if (xmlForm.value[fid]) {
          xmlForm.value[fid].active = true;
          xmlForm.value[fid].value = val;

          const fieldDef = xmlFields.value.find((f) => f.id == parseInt(fid));
          // Validar omitiendo la máscara (asteriscos) para no forzar el acordeón abierto
          if (fieldDef && !isFieldValid(fieldDef, val) && !isFieldMasked(val)) {
            hasValidationError = true;
          }
        }
      });

      if (parsingErrorField.value || hasValidationError) {
        showXmlBuilder.value = true;
      }
    } catch (err) {
      console.warn(
        "Fallo el parser del servidor, extrayendo solo Bitmap localmente.",
      );

      let cleanS = s;
      if (cleanS.startsWith("ISO")) cleanS = cleanS.substring(12);

      const mti = cleanS.slice(0, 4);
      const bitmapHex1 = cleanS.slice(4, 20);
      let active_fields = [];
      try {
        let bin1 = hexToBin(bitmapHex1);
        for (let i = 1; i < 64; i++)
          if (bin1[i] === "1") active_fields.push(i + 1);
        if (bin1[0] === "1" && cleanS.length >= 36) {
          let bin2 = hexToBin(cleanS.slice(20, 36));
          for (let i = 0; i < 64; i++)
            if (bin2[i] === "1") active_fields.push(i + 65);
        }
      } catch (e) {}

      rawPreview.value = { mti, active_fields };
      xmlMti.value = mti;
      parsingErrorField.value = null;

      Object.keys(xmlForm.value).forEach((k) => {
        if (k != 1) {
          xmlForm.value[k].active = active_fields.includes(parseInt(k));
        }
      });
    } finally {
      nextTick(() => {
        isParsingFromServer.value = false;
      });
    }
  }, 400);
});

const filteredXmlFields = computed(() => {
  return xmlFields.value;
});

const showTemplates = ref(true);
const showRawString = ref(false);
const showQuickEdits = ref(false);
const showXmlBuilder = ref(false);
const showSettings = ref(false);

const newValueInput = ref("");

const initValueList = (id) => {
  if (!xmlForm.value[id].valueList) xmlForm.value[id].valueList = [];
};

const addValueToList = (id) => {
  const val = newValueInput.value.trim();
  if (val) {
    if (!xmlForm.value[id].valueList) xmlForm.value[id].valueList = [];
    if (!xmlForm.value[id].valueList.includes(val)) {
      xmlForm.value[id].valueList.push(val);
    }
    newValueInput.value = "";
  }
};

const removeValueFromList = (id, index) => {
  if (xmlForm.value[id].valueList) {
    xmlForm.value[id].valueList.splice(index, 1);
  }
};

const quickEditFields = computed(() => {
  if (!rawPreview.value || !rawPreview.value.active_fields) return [];
  return xmlFields.value.filter(
    (f) =>
      xmlForm.value[f.id]?.quickEdit &&
      (f.id === 1 || rawPreview.value.active_fields.includes(f.id)),
  );
});

const newConfigName = ref("");
const savedConfigsList = ref([]);
const saveStatusMessage = ref("");
const saveStatusIsError = ref(false);
const loadStatusMessage = ref("");
const loadStatusIsError = ref(false);
const saveWithRaw = ref(true);

const fetchSavedConfigs = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/configs");
    savedConfigsList.value = data.configs || [];
  } catch (err) {
    console.error("Error obteniendo configuraciones de Mongo", err);
  }
};

const saveConfiguration = async () => {
  const fieldsToSave = {};
  const syntheticFields = [];
  const syntheticConfig = {};
  const quickEditFieldsList = [];

  activeXmlFields.value.forEach((f) => {
    if (xmlForm.value[f.id].quickEdit) {
      quickEditFieldsList.push(f.id);
    }

    if (f.id === 1) return;

    if (saveWithRaw.value) {
      fieldsToSave[String(f.id)] = xmlForm.value[f.id].value;
    } else {
      fieldsToSave[String(f.id)] = "";
    }

    let isSynthetic = xmlForm.value[f.id].synthetic;

    if (
      xmlForm.value[f.id].useValueList &&
      xmlForm.value[f.id].valueList?.length > 0
    ) {
      if (!syntheticConfig[String(f.id)]) syntheticConfig[String(f.id)] = {};
      syntheticConfig[String(f.id)].valueList = xmlForm.value[f.id].valueList;
      isSynthetic = true;
    } else if (
      (f.isNum || [2, 4, 12, 18, 38, 41, 45, 49].includes(f.id)) &&
      xmlForm.value[f.id].useRange
    ) {
      if (!syntheticConfig[String(f.id)]) syntheticConfig[String(f.id)] = {};
      syntheticConfig[String(f.id)].min = parseInt(
        xmlForm.value[f.id].minRange,
      );
      syntheticConfig[String(f.id)].max = parseInt(
        xmlForm.value[f.id].maxRange,
      );
      syntheticConfig[String(f.id)].mode = xmlForm.value[f.id].mode || "random";
      isSynthetic = true;
    }

    if (isSynthetic) syntheticFields.push(String(f.id));
  });

  try {
    await axios.post("http://localhost:8080/api/configs", {
      name: newConfigName.value,
      mti: xmlMti.value,
      batch_size: batchSize.value,
      delay_ms: delayMs.value,
      raw_string: saveWithRaw.value ? rawString.value : "",
      fields: fieldsToSave,
      synthetic_fields: syntheticFields,
      synthetic_config: syntheticConfig,
      quick_edit_fields: quickEditFieldsList,
    });

    saveStatusIsError.value = false;
    saveStatusMessage.value = "✓ Plantilla guardada correctamente";
    newConfigName.value = "";
    await fetchSavedConfigs();

    setTimeout(() => {
      saveStatusMessage.value = "";
    }, 3000);
  } catch (err) {
    saveStatusIsError.value = true;
    saveStatusMessage.value = "✕ Error al conectar con MongoDB";
    setTimeout(() => {
      saveStatusMessage.value = "";
    }, 3000);
  }
};

const loadConfiguration = (event) => {
  const cfgName = event.target.value;
  if (!cfgName) return;

  const cfg = savedConfigsList.value.find((c) => c.name === cfgName);
  if (!cfg) {
    loadStatusIsError.value = true;
    loadStatusMessage.value = "✕ Plantilla no encontrada";
    setTimeout(() => {
      loadStatusMessage.value = "";
    }, 3000);
    return;
  }

  try {
    xmlMti.value = cfg.mti;
    batchSize.value = cfg.batch_size;
    delayMs.value = cfg.delay_ms;

    const qeList = cfg.quick_edit_fields || DEFAULT_QUICK_EDITS;

    Object.keys(xmlForm.value).forEach((k) => {
      if (k != 1) {
        xmlForm.value[k].active = false;
        xmlForm.value[k].synthetic = false;
        xmlForm.value[k].useRange = false;
        xmlForm.value[k].useValueList = false;
        xmlForm.value[k].quickEdit = false;
      }
    });

    qeList.forEach((fid) => {
      if (xmlForm.value[fid]) xmlForm.value[fid].quickEdit = true;
    });

    if (cfg.raw_string) {
      skipNextParse = false;
      rawString.value = cfg.raw_string;
      showRawString.value = true;
    }

    if (cfg.fields) {
      Object.keys(cfg.fields).forEach((fid) => {
        if (xmlForm.value[fid]) xmlForm.value[fid].active = true;
      });
    }

    if (cfg.synthetic_fields) {
      cfg.synthetic_fields.forEach((fid) => {
        if (xmlForm.value[fid]) {
          xmlForm.value[fid].active = true;
          let isPureSynthetic = true;

          if (cfg.synthetic_config && cfg.synthetic_config[fid]) {
            const configDetails = cfg.synthetic_config[fid];

            if (configDetails.valueList) {
              xmlForm.value[fid].useValueList = true;
              xmlForm.value[fid].valueList = [...configDetails.valueList];
              isPureSynthetic = false;
            } else if (configDetails.min !== undefined) {
              xmlForm.value[fid].useRange = true;
              xmlForm.value[fid].minRange = configDetails.min;
              xmlForm.value[fid].maxRange = configDetails.max;
              xmlForm.value[fid].mode = configDetails.mode;
              isPureSynthetic = false;
            }
          }

          xmlForm.value[fid].synthetic = isPureSynthetic;
        }
      });
    }

    loadStatusIsError.value = false;
    loadStatusMessage.value = "✓ Plantilla cargada exitosamente";

    setTimeout(() => {
      loadStatusMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error(error);
    loadStatusIsError.value = true;
    loadStatusMessage.value = "✕ Error al procesar la plantilla";
    setTimeout(() => {
      loadStatusMessage.value = "";
    }, 3000);
  }
};

const handleGridFieldClick = (id) => {
  if (id === 1 && gridTool.value !== "edit") return;

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
      fieldData.quickEdit = false;
      if (selectedFieldEdit.value === id) selectedFieldEdit.value = null;
    }
  } else if (gridTool.value === "toggle_synthetic") {
    if (fieldData.active) fieldData.synthetic = !fieldData.synthetic;
  } else if (gridTool.value === "toggle_quickedit") {
    if (fieldData.active) {
      fieldData.quickEdit = !fieldData.quickEdit;
    }
  }
};

const toggleAllFields = (type, state) => {
  filteredXmlFields.value.forEach((f) => {
    if (f.id === 1) return;
    const id = f.id;
    const fieldData = xmlForm.value[id];

    if (type === "active") {
      fieldData.active = state;
      if (!state) {
        fieldData.synthetic = false;
        fieldData.quickEdit = false;
        if (selectedFieldEdit.value === id) selectedFieldEdit.value = null;
      }
    } else if (type === "synthetic") {
      if (fieldData.active || !state) {
        fieldData.synthetic = state;
      }
    } else if (type === "quickedit") {
      if (fieldData.active || !state) {
        fieldData.quickEdit = state;
      }
    }
  });
};

const deactivateField = (id) => {
  if (id === 1) return;
  xmlForm.value[id].active = false;
  xmlForm.value[id].synthetic = false;
  xmlForm.value[id].quickEdit = false;
  selectedFieldEdit.value = null;
};

function isFieldMasked(value) {
  if (!value) return false;
  return String(value).includes("*");
}

function isFieldValid(field, value) {
  if (!value) return true;
  const strVal = String(value);
  if (field.isNum && !/^\d+$/.test(strVal)) return false;
  if (field.isBin && !/^[0-9A-Fa-f]+$/i.test(strVal)) return false;
  if (strVal.length > field.maxInput) return false;
  return true;
}

function formatErrorMessage(err) {
  if (err.response && err.response.data && err.response.data.detail) {
    const detail = err.response.data.detail;

    if (typeof detail === "string") {
      const lowerDetail = detail.toLowerCase();

      if (lowerDetail.includes("exceeds maximum length")) {
        const fieldMatch = lowerDetail.match(/field (\d+)/);
        return fieldMatch
          ? `El Campo ${fieldMatch[1]} supera la longitud máxima permitida.`
          : `Un campo es demasiado largo.`;
      }
      if (lowerDetail.includes("must be numeric")) {
        const fieldMatch = lowerDetail.match(/field (\d+)/);
        return fieldMatch
          ? `El Campo ${fieldMatch[1]} debe contener solo números.`
          : `Un campo debe ser numérico.`;
      }
      if (lowerDetail.includes("does not exist in xml")) {
        const fieldMatch = lowerDetail.match(/field (\d+)/);
        return fieldMatch
          ? `El Campo ${fieldMatch[1]} no existe en la definición del XML.`
          : `Campo inválido.`;
      }

      return detail.replace(/^4\d{2}: \{.*?\[['"](.*?)['"]\].*?\}$/, "$1");
    }
  }

  return "Revisa que los campos cumplan con la longitud y formato correctos.";
}

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

function getFormattedAmount(rawVal) {
  if (!rawVal || !/^\d+$/.test(rawVal)) return rawVal;
  return (Number(rawVal) / 100).toFixed(2);
}

function setFormattedAmount(fieldId, displayVal) {
  if (!displayVal) {
    xmlForm.value[fieldId].value = "";
    return;
  }
  const clean = displayVal.replace(/[^\d.]/g, "");
  const floatVal = parseFloat(clean);
  if (!isNaN(floatVal)) {
    const intVal = Math.round(floatVal * 100);
    const fieldDef = xmlFields.value.find((f) => f.id === fieldId);
    const maxLen = fieldDef ? fieldDef.length : 12;
    xmlForm.value[fieldId].value = String(intVal).padStart(maxLen, "0");
  } else {
    xmlForm.value[fieldId].value = displayVal;
  }
}

const fillSyntheticRaw = async () => {
  try {
    isLoading.value = true;
    const { data } = await axios.get(
      "http://localhost:8080/api/generate-raw-sample",
    );

    if (data && data.raw_iso) {
      if (rawString.value !== data.raw_iso) {
        skipNextParse = true;
        rawString.value = data.raw_iso;
      }

      parsingErrorField.value = null;
      parsingErrorMessage.value = "";
      errorMessage.value = null;
      responseFromServer.value = null;

      if (data.parsed_fields) {
        const active_fields = Object.keys(data.parsed_fields).map(Number);
        rawPreview.value = { mti: data.mti, active_fields };
        xmlMti.value = data.mti;

        Object.keys(xmlForm.value).forEach((k) => {
          if (k != 1) {
            xmlForm.value[k].active = false;
            xmlForm.value[k].value = "";
          }
        });

        Object.entries(data.parsed_fields).forEach(([fid, val]) => {
          if (xmlForm.value[fid]) {
            xmlForm.value[fid].active = true;
            xmlForm.value[fid].value = val;
            xmlForm.value[fid].quickEdit = DEFAULT_QUICK_EDITS.includes(
              Number(fid),
            );
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

const isSyncing = ref(false);
const autoSync = ref(true);
const isParsingFromServer = ref(false);
let autoSyncTimeout = null;

watch(
  [xmlForm, xmlMti],
  () => {
    if (
      !autoSync.value ||
      !rawPreview.value ||
      isParsingFromServer.value ||
      isSyncing.value
    )
      return;

    clearTimeout(autoSyncTimeout);
    autoSyncTimeout = setTimeout(() => {
      syncToRaw();
    }, 800);
  },
  { deep: true },
);

const syncToRaw = async () => {
  isSyncing.value = true;
  try {
    const fields = {};

    activeXmlFields.value.forEach((f) => {
      if (f.id === 1) return;
      fields[String(f.id)] = xmlForm.value[f.id].value;
    });

    const { data } = await axios.post("http://localhost:8080/api/build-raw", {
      mti: xmlMti.value,
      fields: fields,
    });

    if (data && data.raw_iso) {
      if (rawString.value !== data.raw_iso) {
        skipNextParse = true;
        rawString.value = data.raw_iso;
      }

      const parsed = await axios.post("http://localhost:8080/api/parse", {
        raw_string: data.raw_iso,
      });
      rawPreview.value = parsed.data;
    }
  } catch (err) {
    showToast("ERROR DE VALIDACIÓN:\n" + formatErrorMessage(err), "error");
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
    if (f.id === 1) return;

    fields[String(f.id)] = xmlForm.value[f.id].value;
    let isSynthetic = xmlForm.value[f.id].synthetic;

    if (
      xmlForm.value[f.id].useValueList &&
      xmlForm.value[f.id].valueList?.length > 0
    ) {
      if (!syntheticConfig[String(f.id)]) syntheticConfig[String(f.id)] = {};
      syntheticConfig[String(f.id)].valueList = xmlForm.value[f.id].valueList;
      isSynthetic = true;
    } else if (
      (f.isNum || [1, 2, 4, 12, 18, 38, 41, 45, 49].includes(f.id)) &&
      xmlForm.value[f.id].useRange
    ) {
      const minVal = parseInt(xmlForm.value[f.id].minRange);
      const maxVal = parseInt(xmlForm.value[f.id].maxRange);
      const modeVal = xmlForm.value[f.id].mode || "random";

      if (!isNaN(minVal) && !isNaN(maxVal)) {
        if (!syntheticConfig[String(f.id)]) syntheticConfig[String(f.id)] = {};
        syntheticConfig[String(f.id)].min = minVal;
        syntheticConfig[String(f.id)].max = maxVal;
        syntheticConfig[String(f.id)].mode = modeVal;
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
  transform: translateY(-10px);
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 2500px;
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

.toast-drop-enter-active,
.toast-drop-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-drop-enter-from,
.toast-drop-leave-to {
  opacity: 0;
  transform: translate(-50%, -50px);
}
.toast-drop-enter-to,
.toast-drop-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
