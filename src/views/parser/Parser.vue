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
            Parser ISO8583
          </h1>
          <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Desglose y parseo de tramas.
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
          <div class="p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 flex justify-between items-center">
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
                  <h3 class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200">
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
            
            <button
              type="button"
              @click="fillSyntheticRaw"
              :disabled="isLoading"
              class="text-[9px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 border border-cyan-500/30 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span v-if="isLoading" class="animate-spin w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              GENERAR EJEMPLO
            </button>
          </div>

          <div class="p-6">
            <textarea
              v-model="rawString"
              rows="4"
              placeholder="Pega aquí tu cadena ISO8583 para extraer los campos..."
              class="w-full font-mono text-xs bg-gray-50 dark:bg-black border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none resize-none leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 shadow-sm transition-all"
            ></textarea>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all"
        >
          <div class="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/30 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-outlined text-[18px]">
                  view_list
                </span>
              </div>
              <div class="text-left">
                <h3
                  class="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
                >
                  Desglose de Campos
                </h3>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Visualización de datos extraídos en formato de lista.
                </p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div
              v-if="!rawPreview"
              class="flex flex-col items-center justify-center py-10 opacity-50"
            >
              <span
                class="material-symbols-outlined text-5xl text-gray-300 dark:text-slate-700 mb-3"
                >lock</span
              >
              <p
                class="text-xs font-bold text-gray-400 tracking-widest uppercase"
              >
                Ingresa una trama para ver el desglose
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
                    :value="xmlMti"
                    readonly
                    class="w-20 px-3 py-2 text-sm font-mono font-bold bg-gray-50 dark:bg-black border border-purple-200 dark:border-purple-900/50 rounded-lg text-purple-600 shadow-sm outline-none text-center cursor-not-allowed"
                  />

                  <label
                    class="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2 hidden sm:block"
                    >BITMAP</label
                  >
                  <input
                    :value="xmlBitmap"
                    readonly
                    class="w-36 sm:w-64 px-3 py-2 text-xs font-mono font-bold bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-400 dark:text-gray-500 shadow-inner outline-none truncate select-all cursor-not-allowed"
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
                  class="flex flex-col sm:flex-row gap-4 text-[10px] opacity-70 font-mono mt-1"
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

              <transition name="fade">
                <div
                  v-if="parsingErrorField"
                  class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl"
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

              <div class="flex flex-col gap-2 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                <div
                  v-for="field in filteredXmlFields"
                  :key="field.id"
                  class="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border transition-all"
                  :class="xmlForm[field.id].active ? 'bg-white dark:bg-slate-900 border-cyan-200 dark:border-cyan-900/50 shadow-sm' : 'bg-gray-50 dark:bg-[#0d1421] border-gray-100 dark:border-slate-800 opacity-50'"
                >
                  <div class="flex items-center gap-3 w-full sm:w-2/5 md:w-1/3">
                    <div class="w-3 h-3 rounded-full shrink-0 shadow-inner" :class="xmlForm[field.id].active ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-gray-300 dark:bg-slate-700'"></div>
                    
                    <div class="flex flex-col overflow-hidden">
                      <span class="text-xs font-bold truncate" :class="xmlForm[field.id].active ? 'text-cyan-700 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400'">
                        F{{ field.id }} - {{ field.name }}
                      </span>
                      <div class="flex gap-2 mt-1">
                        <span :class="typeColor(field.type)" class="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded font-mono">{{ field.typeShort }}</span>
                        <span class="text-[8px] font-bold text-gray-500 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">{{ field.lengthLabel }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="w-full sm:flex-1 flex items-center gap-2">
                    <div class="relative w-full flex-1">
                      <span v-if="field.id === 4" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                      <input
                        :value="field.id === 4 && xmlForm[field.id].value ? getFormattedAmount(xmlForm[field.id].value) : xmlForm[field.id].value"
                        readonly
                        :placeholder="xmlForm[field.id].active ? field.placeholder : 'Campo ausente en la trama'"
                        class="w-full font-mono text-xs px-3 py-2.5 rounded-lg border-2 outline-none transition-all cursor-text select-all"
                        :class="[
                          field.id === 4 ? 'pl-7' : '',
                          !xmlForm[field.id].active
                            ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 border-transparent cursor-not-allowed'
                            : isFieldMasked(xmlForm[field.id].value) && field.id !== 1
                              ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 border-amber-300'
                              : xmlForm[field.id].value && !isFieldValid(field, xmlForm[field.id].value) && field.id !== 1
                                ? 'border-red-300 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-100'
                                : 'bg-white dark:bg-black text-gray-800 dark:text-gray-100 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                        ]"
                      />
                    </div>
                    <span
                      :class="[
                        'text-[10px] font-mono font-bold px-2 py-2.5 rounded-lg border whitespace-nowrap shrink-0',
                        !xmlForm[field.id].active ? 'text-gray-400 border-transparent bg-transparent' :
                        isFieldMasked(xmlForm[field.id].value) && field.id !== 1 ? 'text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800' :
                        xmlForm[field.id].value && !isFieldValid(field, xmlForm[field.id].value) && field.id !== 1 ? 'text-red-500 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                        'text-cyan-600 border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400'
                      ]"
                    >
                      {{ xmlForm[field.id].value?.length || 0 }} / {{ field.length }}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </template>
  </content-tpl>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import ContentTpl from "@/layouts/ContentTpl.vue";

const isDark = ref(false);

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

const rawString = ref("");
const isLoading = ref(false);
const showRawString = ref(true);

const TYPE_META = {
  IFA_NUMERIC: { short: "NUM", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", isNum: true, isBin: false, isVar: false },
  IFA_AMOUNT: { short: "AMT", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", isNum: false, isBin: false, isVar: false },
  IFA_LLNUM: { short: "LLNUM", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", isNum: true, isBin: false, isVar: true },
  IFA_LLLNUM: { short: "LLLNUM", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", isNum: true, isBin: false, isVar: true },
  IFA_LLCHAR: { short: "LLVAR", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", isNum: false, isBin: false, isVar: true },
  IFA_LLLCHAR: { short: "LLLVAR", color: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", isNum: false, isBin: false, isVar: true },
  IFA_LLLLCHAR: { short: "LLLLVAR", color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400", isNum: false, isBin: false, isVar: true },
  IFA_BINARY: { short: "BIN", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", isNum: false, isBin: true, isVar: false },
  IFA_LLBINARY: { short: "LLBIN", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", isNum: false, isBin: true, isVar: true },
  IFA_LLLBINARY: { short: "LLLBIN", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", isNum: false, isBin: true, isVar: true },
};

function typeColor(type) {
  return TYPE_META[type]?.color ?? "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400";
}

const xmlFields = ref([]);
const xmlForm = ref({});
const xmlMti = ref("1100");
const xmlLoading = ref(false);
const xmlError = ref(null);

function parseTypeKey(cls) {
  return cls?.split(".").pop() ?? "UNKNOWN";
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
    selectedXmlFile.value = data.current || (availableXmlFiles.value.length ? availableXmlFiles.value[0] : "");
  } catch (error) {
    console.error("Error obteniendo lista de XMLs:", error);
  }
};

const onXmlChange = async () => {
  if (!selectedXmlFile.value) return;
  xmlLoading.value = true;
  try {
    await axios.post("http://localhost:8080/api/set-xml", { filename: selectedXmlFile.value });
    rawString.value = "";
    await loadXmlFields();
  } catch (error) {
    console.error("Error cambiando XML:", error);
  } finally {
    xmlLoading.value = false;
  }
};

async function loadXmlFields() {
  xmlLoading.value = true;
  try {
    const { data } = await axios.get("http://localhost:8080/xml-fields");
    xmlFields.value = data
      .filter((f) => f.id !== 0)
      .sort((a, b) => a.id - b.id)
      .map((f) => {
        let type = parseTypeKey(f.class);
        let meta = TYPE_META[type] ?? { short: type, isVar: false, isNum: false, isBin: false };
        if (f.id === 1) { meta.short = "BIN"; meta.isBin = true; meta.isNum = false; meta.isVar = false; }

        return {
          id: f.id,
          name: f.id === 1 ? "BITMAP" : f.name.trim(),
          length: f.length,
          type,
          typeShort: meta.short,
          maxInput: meta.isBin ? f.length * 2 : f.length,
          placeholder: buildPlaceholder({ type, length: f.length }),
          lengthLabel: meta.isVar ? `max ${f.length}` : `len ${f.length}`,
          isNum: meta.isNum,
          isVar: meta.isVar,
          isBin: meta.isBin,
        };
      });

    const initial = {};
    xmlFields.value.forEach((f) => {
      initial[f.id] = { active: false, value: "" };
    });
    xmlForm.value = initial;
  } catch (e) {
    console.error(e);
  } finally {
    xmlLoading.value = false;
  }
}

function hexToBin(hex) {
  return hex.split("").map((c) => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
}

const rawPreview = ref(null);
let parseTimeout = null;
let skipNextParse = false;
const parsingErrorField = ref(null);
const parsingErrorMessage = ref("");
const isParsingFromServer = ref(false);

const activeXmlFields = computed(() => xmlFields.value.filter((f) => xmlForm.value[f.id]?.active));
const filteredXmlFields = computed(() => xmlFields.value);

const detectedBitmaps = computed(() => {
  let s = rawString.value.trim();
  if (s.startsWith("ISO")) s = s.substring(12);
  if (s.length < 20) return { primary: "---", secondary: "---", isSecondaryActive: false, expectedFields: [] };

  const primary = s.slice(4, 20);
  const firstChar = primary.charAt(0).toUpperCase();
  const isSecondaryActive = ["8", "9", "A", "B", "C", "D", "E", "F"].includes(firstChar);
  let secondary = "Esperando más caracteres...";
  if (isSecondaryActive && s.length >= 36) secondary = s.slice(20, 36);

  let expectedFields = [];
  try {
    let bin1 = hexToBin(primary);
    for (let i = 1; i < 64; i++) if (bin1[i] === "1") expectedFields.push(i + 1);
    if (isSecondaryActive && s.length >= 36) {
      let bin2 = hexToBin(secondary);
      for (let i = 0; i < 64; i++) if (bin2[i] === "1") expectedFields.push(i + 65);
    }
  } catch (e) {}

  return { primary, secondary, isSecondaryActive, expectedFields };
});

const xmlBitmap = computed(() => {
  let bin = Array(128).fill("0");
  let hasSecondary = false;
  activeXmlFields.value.filter((f) => f.id > 1).forEach((f) => {
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

watch(xmlBitmap, (newHex) => {
  if (xmlForm.value[1]) {
    xmlForm.value[1].value = newHex;
    const shouldBeActive = newHex !== "0000000000000000";
    if (xmlForm.value[1].active !== shouldBeActive) xmlForm.value[1].active = shouldBeActive;
  }
}, { immediate: true });

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
    Object.keys(xmlForm.value).forEach((k) => {
      xmlForm.value[k].active = false;
      xmlForm.value[k].value = "";
    });
    return;
  }

  parseTimeout = setTimeout(async () => {
    isParsingFromServer.value = true;
    try {
      const { data } = await axios.post("http://localhost:8080/api/parse", { raw_string: s });
      rawPreview.value = data;
      xmlMti.value = data.mti || "0000";
      parsingErrorField.value = data.error_field || null;
      parsingErrorMessage.value = data.error_msg || "";

      Object.keys(xmlForm.value).forEach((k) => {
        if (k != 1) xmlForm.value[k].active = false;
      });

      Object.entries(data.fields).forEach(([fid, val]) => {
        if (xmlForm.value[fid]) {
          xmlForm.value[fid].active = true;
          xmlForm.value[fid].value = val;
        }
      });
    } catch (err) {
      console.warn("Fallo el parser, extrayendo localmente.");
    } finally {
      nextTick(() => { isParsingFromServer.value = false; });
    }
  }, 400);
});

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

function getFormattedAmount(rawVal) {
  if (!rawVal || !/^\d+$/.test(rawVal)) return rawVal;
  return (Number(rawVal) / 100).toFixed(2);
}

const fillSyntheticRaw = async () => {
  try {
    isLoading.value = true;
    const { data } = await axios.get("http://localhost:8080/api/generate-raw-sample");

    if (data && data.raw_iso) {
      if (rawString.value !== data.raw_iso) {
        skipNextParse = true;
        rawString.value = data.raw_iso;
      }

      parsingErrorField.value = null;
      parsingErrorMessage.value = "";

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
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>