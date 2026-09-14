<template>
  <AppToastHost />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import { AppToastHost } from '@/design-system'
</script>
