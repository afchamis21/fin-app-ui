<script setup lang="ts">
import LargeTile from '@/components/dashboard/LargeTile.vue';
import SmallTile from '@/components/dashboard/SmallTile.vue';
import { useDashBoardStore } from '@/stores/dashboard';

const dashBoardStore = useDashBoardStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="flex justify-between flex-wrap flex-col md:flex-row gap-4">
      <h2 class="text-2xl font-medium">Dashboard</h2>
      <form class="flex gap-4 md:gap-8 flex-wrap">
        <div class="flex gap-2 items-center w-64 md:justify-between">
          <label for="startDt">Ínicio:</label>
          <input type="month" name="startDt" id="startDt" class="flex-1 p-2 text-gray-800 bg-gray-200 shadow border-2 border-transparent rounded
            focus:outline-0 focus:border-2 focus:border-indigo-300 focus:bg-indigo-100 focus:text-indigo-400
            hover:bg-indigo-100 hover:text-indigo-400 transition-all" :value="dashBoardStore.periodStart"
            :max="dashBoardStore.periodEnd" @change="dashBoardStore.setPeriodStart(($event.target as any).value)">
        </div>
        <div class="flex gap-2 items-center w-64 md:justify-between">
          <label for="endDt">Fim:</label>
          <input type="month" name="endDt" id="endDt" class="flex-1 p-2 text-gray-800 bg-gray-200 shadow border-2 border-transparent rounded
            focus:outline-0 focus:border-2 focus:border-indigo-300 focus:bg-indigo-100 focus:text-indigo-400
            hover:bg-indigo-100 hover:text-indigo-400 transition-all" :value="dashBoardStore.periodEnd"
            :min="dashBoardStore.periodStart" @change="dashBoardStore.setPeriodEnd(($event.target as any).value)">
        </div>
      </form>
    </header>

    <section class="h-full overflow-auto mt-1 pb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full gap-4">
        <div class="md:col-span-2 p-4 h-[375px] shadow bg-gray-100">
          <LargeTile id="first" />
        </div>
        <div class="p-4 h-[375px] shadow bg-gray-100">
          <SmallTile id="second" />
        </div>

        <div class="p-4 h-[375px] shadow bg-gray-100">
          <SmallTile id="third" />
        </div>

        <div class="p-4 h-[375px] shadow bg-gray-100 md:col-span-2">
          <LargeTile id="fourth" />
        </div>
      </div>
    </section>
  </div>
</template>
