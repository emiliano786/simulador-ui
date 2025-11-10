<template>
  <div class="flex flex-col w-full gap-5">
    <!-- header -->
    <div class="flex w-full items-center" v-if="$slots['top-left'] || $slots['top-right']">
      <div class="w-[50%]">
        <slot name="top-left" />
      </div>
      <div class="w-[50%]">
        <slot name="top-right" />
      </div>
    </div>
    <!-- header -->
    <slot name="header" />
    <!-- main content -->
    <slot name="main-content" />

    <!-- footer -->
    <slot name="footer" />
  </div>
</template>
