<template>
  <div class="page-switcher">
    <div
      class="page-switcher__button"
      :class="{ 'page-switcher__button_disabled': currentPage === 1 }"
      @click="switchPage(ESwitchType.PREVIOUS)"
    >
      {{ LEFT_ARROW }}
    </div>
    <div class="page-switcher__counter counter">
      <div class="counter__current-page">{{ currentPage }}</div>
      <div class="counter__slash">\</div>
      <div class="counter__total-pages">{{ totalPages }}</div>
    </div>
    <div
      class="page-switcher__button"
      :class="{ 'page-switcher__button_disabled': currentPage === totalPages }"
      @click="switchPage(ESwitchType.NEXT)"
    >
      {{ RIGHT_ARROW }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { LEFT_ARROW, RIGHT_ARROW } from '~/constants';
type TComponentProps = {
  totalPages: number;
};

enum ESwitchType {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

const currentPage = defineModel<number>('currentPage', { required: true });
const { totalPages } = defineProps<TComponentProps>();
const componentEmits = defineEmits<{ (e: 'click'): void }>();

const switchPage = (type: ESwitchType) => {
  if (type === ESwitchType.PREVIOUS && currentPage.value !== 1) currentPage.value--;
  if (type === ESwitchType.NEXT && currentPage.value !== totalPages) currentPage.value++;
  componentEmits('click');
};
</script>

<style scoped>
.page-switcher {
  display: flex;
  height: 50px;
  width: min-content;
  align-items: center;
  font-family: '18vag';
  font-size: 20px;
  user-select: none;
}
.page-switcher__button {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(183, 183, 224);

  cursor: pointer;
}
.page-switcher__counter {
  height: 50px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.counter div {
  display: flex;
}

.counter :not(.counter__slash) {
  width: 30%;
}
.counter__slash {
  width: 20%;
  justify-content: center;
}
.counter__current-page {
  justify-content: end;
}

.counter__total-pages {
  justify-content: start;
}
.page-switcher__button_disabled {
  background-color: rgb(182, 182, 194);
  pointer-events: none;
}
</style>
