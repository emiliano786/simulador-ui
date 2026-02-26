<template>
  <div class="flex flex-col w-full gap-6">
    <header class="flex flex-col gap-1">
      <slot name="header-left" />
    </header>

    <div class="w-full">
      <slot name="main-content" />
    </div>

    <slot name="footer" />
  </div>
</template>
