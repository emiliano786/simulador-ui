<template>
  <content-tpl>
    <template #header-left>
      <div class="flex items-center justify-between w-full xl:w-[75vw]"> 
        
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {{ t("Simulador") || "Monitoreo de Procesos" }}
          </h1>
          <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Gestión de transacciones ISO8583.
          </p>
        </div>

        <button @click="toggleDarkMode" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm">
          <span class="material-symbols-outlined text-[18px]">
            {{ isDark ? "light_mode" : "dark_mode" }}
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest">
            {{ isDark ? "Modo Claro" : "Modo Oscuro" }}
          </span>
        </button>

      </div>
    </template>

    <template #main-content>
      <div class="max-w-7xl mx-auto space-y-6">
        <div class="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          
          <div class="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <h2 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
              Configuración de Envío
            </h2>
           
            <div :class="modeBadgeClass" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">
              {{ modeBadgeLabel }}
            </div>
          </div>

          <div class="p-8">
            <div class="mb-8 flex flex-col gap-4 p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-800">
              
              <div v-if="!isXmlMode">
                <div class="flex items-center gap-4 py-2">
                  <div class="relative inline-block w-10 h-5">
                    <input
                      type="checkbox"
                      v-model="isRawMode"
                      @change="onRawToggle"
                      id="rawToggle"
                      class="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#f97316] shadow-sm"
                    />
                    <label for="rawToggle" class="block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-slate-700 peer-checked:bg-[#f97316] cursor-pointer"></label>
                  </div>
                  <label for="rawToggle" class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    Modo Raw — Enviar cadena ISO8583 sin validación
                  </label>
                </div>

                <transition name="slide-down">
                  <div v-if="isRawMode" class="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800 mt-2">
                    <div class="flex justify-between items-center">
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cadena ISO8583 Raw</label>
                      <button type="button" @click="fillSyntheticRaw" class="text-[9px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 border border-cyan-500/30 px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        GENERAR EJEMPLO
                      </button>
                    </div>

                    <textarea v-model="rawString" rows="4" placeholder="Pega aquí tu cadena ISO8583..." class="w-full font-mono text-xs bg-white dark:bg-black border border-orange-200 dark:border-orange-900/50 rounded-xl p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-400 outline-none resize-none leading-relaxed placeholder-gray-300 dark:placeholder-gray-700"></textarea>

                    <div v-if="rawPreview" class="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-black overflow-hidden">
                      <div class="px-4 py-2 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preview</span>
                        <span class="text-[10px] font-mono text-gray-400">{{ rawString.trim().length }} chars</span>
                      </div>
                      <div class="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">MTI</p><p class="font-mono text-sm font-bold" :class="rawPreview.mti ? 'text-orange-500' : 'text-gray-300 dark:text-slate-700'">{{ rawPreview.mti || "—" }}</p></div>
                        <div><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bitmap primario</p><p class="font-mono text-[10px] break-all leading-relaxed" :class="rawPreview.bitmap1 ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-slate-700'">{{ rawPreview.bitmap1 || "—" }}</p></div>
                        <div><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bitmap secundario</p><p class="font-mono text-[10px] break-all leading-relaxed" :class="rawPreview.bitmap2 ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-slate-700'">{{ rawPreview.bitmap2 || "—" }}</p></div>
                        <div><p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Campos activos</p><p class="font-mono text-sm font-bold" :class="rawPreview.activeFields.length ? 'text-orange-500' : 'text-gray-300 dark:text-slate-700'">{{ rawPreview.activeFields.length ? rawPreview.activeFields.join(", ") : "—" }}</p></div>
                      </div>
                    </div>
                    <p class="text-[10px] text-orange-400 dark:text-orange-500 font-medium">⚠ La cadena se enviará tal cual, sin ninguna transformación.</p>
                  </div>
                </transition>
              </div>

              <div v-if="!isRawMode && !isXmlMode" class="w-full h-px bg-gray-200 dark:bg-slate-700 my-1"></div>

              <div v-if="!isRawMode">
                <div class="flex items-center gap-4 py-2">
                  <div class="relative inline-block w-10 h-5">
                    <input
                      type="checkbox"
                      v-model="isXmlMode"
                      @change="onXmlToggle"
                      id="xmlToggle"
                      class="peer absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#06b6d4] shadow-sm"
                    />
                    <label for="xmlToggle" class="block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-slate-700 peer-checked:bg-[#06b6d4] cursor-pointer"></label>
                  </div>
                  <label for="xmlToggle" class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    XML Builder — Construir mensaje desde definición del estándar
                  </label>
                </div>

                <transition name="slide-down">
                  <div v-if="isXmlMode" class="mb-4 mt-4 border-t border-gray-100 dark:border-slate-800 pt-6">
                    
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ xmlFields.length }} Data Elements · {{ activeXmlFields.length }} seleccionados</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <label class="text-[10px] font-bold uppercase text-gray-400 tracking-widest">MTI</label>
                        <input v-model="xmlMti" maxlength="4" class="w-24 px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-black border border-gray-200 dark:border-slate-700 rounded-lg text-[#06b6d4] focus:ring-2 focus:ring-cyan-400 outline-none text-center" placeholder="1100" />
                        <button @click="clearXmlFields" class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-red-200 dark:hover:border-red-900/50 transition-colors">Limpiar todo</button>
                      </div>
                    </div>

                    <div v-if="xmlLoading" class="flex items-center justify-center py-16">
                      <div class="flex flex-col items-center gap-3">
                        <div class="animate-spin w-8 h-8 border-2 border-[#06b6d4] border-t-transparent rounded-full"></div>
                        <span class="text-xs text-gray-400 font-medium">Cargando definición del estándar...</span>
                      </div>
                    </div>

                    <div v-else-if="xmlError" class="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center">
                      <p class="text-sm text-red-500 font-medium">{{ xmlError }}</p>
                      <button @click="loadXmlFields" class="mt-3 text-xs text-red-400 underline">Reintentar</button>
                    </div>

                    <div v-else class="flex flex-col gap-6">
                      <div class="bg-gray-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Mapa de Campos
                            <span v-if="gridTool === 'edit'">— Seleccionar campo </span>
                            <span v-if="gridTool === 'toggle_active'" class="text-cyan-500">— Prender/Apagar</span>
                            <span v-if="gridTool === 'toggle_synthetic'" class="text-purple-500">— Activar Sintético</span>
                          </span>
                          <span class="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded">{{ activeXmlFields.length }} Activos</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2">
                          <button
                            v-for="field in xmlFields"
                            :key="field.id"
                            @click="handleGridFieldClick(field.id)"
                            class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 border-2"
                            :class="[
                              selectedFieldEdit === field.id
                                ? (xmlForm[field.id].synthetic ? 'bg-purple-500 border-purple-500 text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)] scale-110 z-10 ring-2 ring-purple-200 dark:ring-purple-900' : 'bg-cyan-500 border-cyan-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4)] scale-110 z-10 ring-2 ring-cyan-200 dark:ring-cyan-900')
                                : xmlForm[field.id]?.active
                                  ? xmlForm[field.id]?.synthetic ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-300 hover:bg-purple-100' : 'bg-cyan-50 border-cyan-300 text-cyan-700 dark:bg-cyan-900/40 dark:border-cyan-700 dark:text-cyan-300 hover:bg-cyan-100'
                                  : (gridTool === 'toggle_synthetic' ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60 dark:bg-[#0a0f18] dark:border-slate-800 dark:text-slate-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:bg-[#0d1421] dark:border-slate-700')
                            ]"
                            :title="field.name"
                          >
                            {{ field.id }}
                          </button>
                        </div>

                        <div class="mt-2 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-gray-200/50 dark:bg-slate-800/50 rounded-xl w-fit mx-auto border border-gray-300 dark:border-slate-700">
                          <button @click="gridTool = 'edit'" :class="gridTool === 'edit' ? 'bg-white dark:bg-slate-600 shadow text-gray-800 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'" class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Seleccionar</button>
                          <button @click="gridTool = 'toggle_active'" :class="gridTool === 'toggle_active' ? 'bg-cyan-500 shadow text-white' : 'text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400'" class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Prender/Apagar</button>
                          <button @click="gridTool = 'toggle_synthetic'" :class="gridTool === 'toggle_synthetic' ? 'bg-purple-500 shadow text-white' : 'text-gray-500 hover:text-purple-600 dark:hover:text-purple-400'" class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Activar Sintético</button>
                        </div>
                      </div>

                      <transition name="slide-down">
                        <div v-if="currentEditField" class="rounded-2xl border-2 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-[#111827] shadow-xl overflow-hidden relative">
                          <button @click="selectedFieldEdit = null" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>

                          <div class="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                            <div class="flex flex-wrap items-center gap-3 pr-8">
                              <span class="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono w-10">F{{ currentEditField.id }}</span>
                              <span class="text-base font-bold text-gray-800 dark:text-gray-100">{{ currentEditField.name }}</span>
                              <span :class="typeColor(currentEditField.type)" class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm font-mono">{{ currentEditField.typeShort }}</span>
                              <span class="text-[10px] font-bold text-gray-500 bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded font-mono shadow-sm">{{ currentEditField.lengthLabel }}</span>
                            </div>
                          </div>

                          <div class="p-6 flex flex-col gap-5">
                            <input
                              v-model="xmlForm[currentEditField.id].value"
                              :maxlength="currentEditField.maxInput"
                              :placeholder="currentEditField.placeholder"
                              :class="[
                                'w-full font-mono text-sm px-4 py-4 rounded-xl border-2 outline-none transition-all',
                                xmlForm[currentEditField.id].synthetic ? 'bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100 placeholder-purple-300 dark:placeholder-purple-800/50' : 'bg-white dark:bg-black text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700',
                                xmlForm[currentEditField.id].value && !isFieldValid(currentEditField, xmlForm[currentEditField.id].value) ? 'border-red-400 focus:border-red-500 dark:border-red-800 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.1)]' : xmlForm[currentEditField.id].synthetic ? 'border-purple-300 dark:border-purple-700/50 focus:border-purple-500 focus:shadow-[0_0_0_4px_rgba(168,85,247,0.15)]' : 'border-gray-200 dark:border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.1)]'
                              ]"
                            />

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div class="flex flex-wrap items-center gap-3">
                                <button
                                  @click="xmlForm[currentEditField.id].synthetic = !xmlForm[currentEditField.id].synthetic"
                                  class="px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border-2 font-bold uppercase tracking-widest text-[10px]"
                                  :class="xmlForm[currentEditField.id].synthetic ? 'bg-purple-100 border-purple-400 text-purple-700 dark:bg-purple-900/60 dark:border-purple-500 dark:text-purple-300 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700'"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                                  {{ xmlForm[currentEditField.id].synthetic ? 'Sintético Activado' : 'Activar Sintético' }}
                                </button>
                                <button @click="deactivateField(currentEditField.id)" class="px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[10px] font-bold uppercase tracking-widest border-2 border-transparent hover:border-red-200 dark:hover:border-red-800">
                                  Apagar Campo
                                </button>
                              </div>
                              <div class="flex flex-col sm:items-end gap-1 text-left sm:text-right">
                                <span class="text-[10px] font-medium" :class="xmlForm[currentEditField.id].synthetic ? 'text-purple-500 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'">
                                  {{ xmlForm[currentEditField.id].synthetic ? "Este texto se enviará en el mensaje 1, luego mutará." : currentEditField.hint }}
                                </span>
                                <span :class="['text-[11px] font-mono font-bold px-2 py-1 rounded border', xmlForm[currentEditField.id].value && !isFieldValid(currentEditField, xmlForm[currentEditField.id].value) ? 'text-red-500 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : xmlForm[currentEditField.id].synthetic ? 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-300 dark:border-purple-800 dark:bg-purple-900/20' : 'text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-slate-800 dark:bg-black']">
                                  {{ xmlForm[currentEditField.id].value?.length || 0 }} / {{ currentEditField.length }} chars
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </transition>

                      <div class="mt-4 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/10 dark:bg-cyan-900/5 space-y-6">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                            <h3 class="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Ajustes de Envío</h3>
                          </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div class="space-y-4">
                            <div class="flex justify-between items-center">
                              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Cantidad de Mensajes</label>
                              <input type="number" v-model="batchSize" class="w-20 p-2 text-center text-sm font-mono font-bold bg-white dark:bg-black border border-cyan-200 dark:border-cyan-900/50 rounded-lg text-cyan-600 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                            </div>
                            <input type="range" v-model="batchSize" min="1" max="100" class="w-full h-1.5 bg-cyan-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                            <p class="text-[9px] text-gray-400 italic">Se enviará la trama repetidamente hasta completar {{ batchSize }} envíos.</p>
                          </div>
                          <div class="space-y-4">
                            <div class="flex justify-between items-center">
                              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Retraso entre envíos</label>
                              <span class="text-xs font-mono font-bold text-cyan-500">{{ delayMs }} ms</span>
                            </div>
                            <input type="range" v-model="delayMs" min="0" max="5000" step="100" class="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                            <div class="flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-1">
                              <span>0ms (Instantáneo)</span><span>5s (Lento)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </transition>
              </div>

            </div>

            <div class="flex justify-end mt-8 border-t border-gray-100 dark:border-slate-800 pt-6">
              <button
                type="button"
                @click="handleDispatch"
                :disabled="isLoading || (!isRawMode && !isXmlMode) || !isFormValid"
                class="px-12 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:-translate-y-0.5 shadow-lg shadow-purple-500/25 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800 dark:disabled:text-gray-600 disabled:shadow-none disabled:transform-none"
              >
                <span v-if="isLoading" class="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
                <span>{{ sendButtonLabel }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="responseFromServer || errorMessage" class="animate-fade-in pb-10">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
              <span class="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest w-fit mb-4">Trama Generada</span>
              <div class="bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-slate-800 font-mono text-[10px] text-gray-500 dark:text-gray-400 break-all leading-relaxed flex-1 overflow-y-auto max-h-[150px]">
                {{ responseFromServer?.generated_iso || "---" }}
              </div>
            </div>

            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
              <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4">Estatus del Envío</span>
              <div v-if="responseFromServer?.sent" class="flex flex-col items-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2 text-xl">✓</div>
                <p class="text-sm font-bold text-gray-900 dark:text-white uppercase">Enviado</p>
              </div>
              <div v-else class="flex flex-col items-center">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2 text-xl">✕</div>
                <p class="text-sm font-bold text-red-600 uppercase">Fallo en Conexión</p>
              </div>
              <p class="mt-2 text-[10px] text-gray-400 font-medium uppercase leading-tight">
                {{ responseFromServer?.sent ? "Mensaje Entregado" : errorMessage || "Sin respuesta del bridge" }}
              </p>
            </div>

            <div class="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center overflow-hidden">
              <span class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest mb-4">Respuesta del Host</span>
              <p class="font-bold tracking-tighter break-all w-full leading-tight text-2xl text-gray-900 dark:text-white">
                {{ responseFromServer?.sent ? responseFromServer?.host_response || "00" : "N/A" }}
              </p>
              <p class="mt-4 text-[10px] text-gray-400 uppercase font-bold">Respuesta</p>
            </div>
          </div>
        </div>

      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
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

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  }
  loadXmlFields();
});

const { t } = useI18n();

// Variables de Configuración Global
const delayMs = ref(0);
const batchSize = ref(1);

// Modos de operación
const isRawMode = ref(false);
const isXmlMode = ref(false);

const onRawToggle = () => {
  if (isRawMode.value) isXmlMode.value = false;
};

const onXmlToggle = () => {
  if (isXmlMode.value) isRawMode.value = false;
};

const rawString = ref("");
const isLoading = ref(false);
const responseFromServer = ref(null);
const errorMessage = ref(null);

// Mapeo de clases jPOS
const TYPE_META = {
  IFA_NUMERIC: { short: "NUM", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", isVar: false, isNum: true, isBin: false },
  IFA_LLCHAR: { short: "LLVAR", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", isVar: true, isNum: false, isBin: false },
  IFA_LLLCHAR: { short: "LLLVAR", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", isVar: true, isNum: false, isBin: false },
  IFA_LLLLCHAR: { short: "LLLLVAR", color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400", isVar: true, isNum: false, isBin: false },
  IFA_BINARY: { short: "BIN", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", isVar: false, isNum: false, isBin: true },
};

const xmlFields = ref([]);
const xmlForm = ref({});
const xmlMti = ref("1100");
const xmlLoading = ref(false);
const xmlError = ref(null);

const selectedFieldEdit = ref(null);
const gridTool = ref('edit');

const currentEditField = computed(() =>
  selectedFieldEdit.value ? xmlFields.value.find((f) => f.id === selectedFieldEdit.value) : null
);

function parseTypeKey(cls) { return cls?.split(".").pop() ?? "UNKNOWN"; }
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

async function loadXmlFields() {
  xmlLoading.value = true;
  xmlError.value = null;
  try {
    const { data } = await axios.get("http://localhost:8080/xml-fields");
    const { data: defaults } = await axios.get("http://localhost:8080/api/default-values");
    
    xmlFields.value = data.filter((f) => f.id !== 0 && f.id !== 1).sort((a, b) => a.id - b.id).map((f) => {
      const type = parseTypeKey(f.class);
      const meta = TYPE_META[type] ?? { short: type, color: "bg-gray-100 text-gray-500", isVar: false, isNum: false, isBin: false };
      return {
        id: f.id, name: f.name.trim(), length: f.length, type, typeShort: meta.short, maxInput: meta.isBin ? f.length * 2 : f.length,
        hint: buildHint({ type, length: f.length }), placeholder: buildPlaceholder({ type, length: f.length }),
        lengthLabel: meta.isVar ? `max ${f.length}` : `len ${f.length}`, isNum: meta.isNum, isVar: meta.isVar, isBin: meta.isBin,
      };
    });

    const initial = {};
    xmlFields.value.forEach((f) => {
      initial[f.id] = { active: true, value: defaults[f.id] || "", synthetic: false };
    });
    xmlForm.value = initial;
  } catch {
    xmlError.value = "Error conectando al Servidor en el puerto 8080.";
  } finally {
    xmlLoading.value = false;
  }
}

const handleGridFieldClick = (id) => {
  const fieldData = xmlForm.value[id];
  if (gridTool.value === 'edit') {
    if (!fieldData.active) fieldData.active = true;
    selectedFieldEdit.value = selectedFieldEdit.value === id ? null : id;
  } 
  else if (gridTool.value === 'toggle_active') {
    fieldData.active = !fieldData.active;
    if (!fieldData.active) {
      fieldData.synthetic = false;
      if (selectedFieldEdit.value === id) selectedFieldEdit.value = null;
    }
  } 
  else if (gridTool.value === 'toggle_synthetic') {
    if (fieldData.active) fieldData.synthetic = !fieldData.synthetic;
  }
};

const deactivateField = (id) => {
  xmlForm.value[id].active = false;
  xmlForm.value[id].synthetic = false;
  selectedFieldEdit.value = null;
};

function clearXmlFields() {
  Object.keys(xmlForm.value).forEach((k) => {
    xmlForm.value[k].active = false;
    xmlForm.value[k].value = "";
  });
  selectedFieldEdit.value = null;
}

function isFieldValid(field, value) {
  if (!value) return true;
  if (field.isNum && !/^\d+$/.test(value)) return false;
  if (!field.isVar && value.length !== field.length) return false;
  if (field.isVar && value.length > field.length) return false;
  return true;
}

const activeXmlFields = computed(() => xmlFields.value.filter((f) => xmlForm.value[f.id]?.active));

// ── Modo Raw ─────────────────────────────────────────────────────────
function hexToBin(hex) { return hex.split("").map((c) => parseInt(c, 16).toString(2).padStart(4, "0")).join(""); }

const rawPreview = computed(() => {
  const s = rawString.value.trim();
  if (!s || s.length < 4) return null;
  const mti = s.slice(0, 4);
  const bitmapHex1 = s.slice(4, 20);
  if (bitmapHex1.length < 16) return { mti, bitmap1: null, bitmap2: null, activeFields: [] };
  
  const activeFields = [];
  let bitmapBin1 = "";
  try { bitmapBin1 = hexToBin(bitmapHex1); } catch { return { mti, bitmap1: bitmapHex1, bitmap2: null, activeFields: [] }; }
  
  const hasSecondary = bitmapBin1[0] === "1";
  for (let i = 1; i < 64; i++) { if (bitmapBin1[i] === "1") activeFields.push(i + 1); }
  
  let bitmap2 = null;
  if (hasSecondary && s.length >= 36) {
    const bitmapHex2 = s.slice(20, 36);
    try {
      const bitmapBin2 = hexToBin(bitmapHex2);
      for (let i = 0; i < 64; i++) { if (bitmapBin2[i] === "1") activeFields.push(i + 65); }
      bitmap2 = bitmapHex2;
    } catch { bitmap2 = bitmapHex2; }
  }
  return { mti, bitmap1: bitmapHex1, bitmap2, activeFields };
});

const fillSyntheticRaw = async () => {
  try {
    isLoading.value = true;
    const { data } = await axios.get("http://localhost:8080/api/generate-raw-sample");
    if (data && data.raw_iso) rawString.value = data.raw_iso;
  } catch (error) {
    console.error("Error al obtener muestra raw:", error);
  } finally {
    isLoading.value = false;
  }
};

// ── Computed de UI y Validación ──────────────────────────────────────────────
const modeBadgeClass = computed(() => {
  if (isXmlMode.value) return "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400";
  if (isRawMode.value) return "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
  return "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400";
});

const modeBadgeLabel = computed(() => {
  if (isXmlMode.value) return "XML Builder";
  if (isRawMode.value) return "Modo Raw";
  return "Selecciona un Modo";
});

const sendButtonLabel = computed(() => {
  if (isXmlMode.value) return `Construir y Enviar (${activeXmlFields.value.length} campos)`;
  if (isRawMode.value) return "Enviar Raw ISO";
  return "Selecciona un Modo";
});

function typeColor(type) { return TYPE_META[type]?.color ?? "bg-gray-100 text-gray-500"; }

const isFormValid = computed(() => {
  if (isRawMode.value) return rawString.value.trim().length > 0;
  if (isXmlMode.value) {
    if (!/^\d{4}$/.test(xmlMti.value)) return false;
    if (activeXmlFields.value.length === 0) return false;
    return activeXmlFields.value.every((f) => {
      const v = xmlForm.value[f.id]?.value ?? "";
      return v.length > 0 && isFieldValid(f, v);
    });
  }
  return false;
});

// ── Funciones de Envío ──────────────────────────────────────────────────────
function handleDispatch() {
  if (isXmlMode.value) return handleSendXml();
  if (isRawMode.value) return handleSendRaw();
}

const handleSendXml = async () => {
  const fields = {};
  const syntheticFields = [];
  activeXmlFields.value.forEach((f) => {
    fields[String(f.id)] = xmlForm.value[f.id].value;
    if (xmlForm.value[f.id].synthetic) {
      syntheticFields.push(String(f.id));
    }
  });
  await executePost({
    is_synthetic: false, is_raw: false, mti: xmlMti.value, batch_size: batchSize.value,
    delay_ms: parseInt(delayMs.value), fields, synthetic_fields: syntheticFields,
  });
};

const handleSendRaw = async () => {
  await executePost({
    is_raw: true, is_synthetic: false, mti: "0000", raw_string: rawString.value.trim(),
    fields: {}, batch_size: 1,
  });
};

const executePost = async (payload) => {
  isLoading.value = true;
  responseFromServer.value = null;
  errorMessage.value = null;
  try {
    const { data } = await axios.post("http://localhost:8080/send-message", payload);
    responseFromServer.value = data.results?.length > 0 ? data.results[0] : { generated_iso: data.generated_iso, host_response: data.host_response, sent: data.sent };
    if (data.sent === false) errorMessage.value = data.host_response;
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || "Error interno del servidor.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

input[type="range"]::-webkit-slider-thumb {
  appearance: none; width: 16px; height: 16px; background: #06b6d4; border: 2px solid white; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
input[type="range"]::-moz-range-thumb {
  width: 16px; height: 16px; background: #06b6d4; border: 2px solid white; border-radius: 50%; cursor: pointer;
}
</style>