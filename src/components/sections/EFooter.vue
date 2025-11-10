<template>
  <footer class="text-white w-full bg-black border-t border-gray-600 pl-2 pr-4">
    <div class="w-full grid grid-cols-3 items-center h-[2.3rem]">
      <div class="flex flex-row gap-x-8 md:gap-x-1 justify-start items-center">
        <div class="bg-pink-500 m-1 p-1 px-1 text-center grid grid-cols-4 gap-1 rounded-full">
          <div
            @click="setLanguage('en-us')"
            :class="languageClass('en-us')"
            class="col-span-2 px-[0.3em] text-xs cursor-pointer"
          >
            EN
          </div>
          <div
            @click="setLanguage('es-mx')"
            :class="languageClass('es-mx')"
            class="col-span-2 px-[0.3em] text-xs cursor-pointer"
          >
            ES
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <img src="../../assets/logos/exos_logo.png" alt="Vision" class="h-[1.3rem]" />
      </div>
      <div class="flex justify-end items-center gap-2 text-caption-2">
        {{ $t('footer.copyright', { year: actualYear }) }}
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();
  const language = ref('');

  const getInitialLanguage = () => {
    const storedLang = localStorage.getItem('userLanguage');
    return storedLang || 'es-mx';
  };

  const setLanguage = (lang) => {
    if (lang !== language.value) {
      language.value = lang;
      locale.value = lang;
      localStorage.setItem('userLanguage', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };

  const currentYear = new Date().getFullYear();
  const actualYear = computed(() => currentYear);

  const languageClass = (lang) => {
    return language.value === lang ? 'selected-language' : '';
  };

  onMounted(() => {
    language.value = getInitialLanguage();
    setLanguage(language.value);
  });
</script>

<style>
  .selected-language {
    background-color: white;
    color: #ec4899;
    border-radius: 9999px;
    padding-left: 0.3em;
    padding-right: 0.3em;
    transition:
      background-color 0.9s ease,
      color 0.9s ease,
      padding-left 0.9s ease,
      padding-right 0.9s ease;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
