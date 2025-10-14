<template>
  <div class="blackout"><slot /></div>
</template>

<style scoped>
.blackout {
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: rgba(53, 58, 90, 0.24);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
