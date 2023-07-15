<script lang="ts">
  import { writable } from "svelte/store";

  export let show = false;
  export let time = 0;
  time = time || 3000;

  let width = writable(100);
  let startTransition = writable(false);
  let showNotification = writable(show);
  let setIntervalBarTime = undefined as number | undefined;
  let setTimeoutShowTime = undefined as number | undefined;

  const delayTime = 500;
  let autoCloseTime = time + delayTime;

  showNotification.subscribe((value) => {
    if (!value) {
      width.set(100);
      show = value;
      clearInterval(setIntervalBarTime);
      clearInterval(setTimeoutShowTime);
      return;
    }

    setTimeout(() => {
      startTransition.set(true);
    }, 1);

    setIntervalBarTime = setInterval(() => {
      width.set($width - 1);
    }, (autoCloseTime - delayTime) / 100);

    setTimeoutShowTime = setTimeout(() => {
      startTransition.set(false);
      setTimeout(() => {
        showNotification.set(false);
      }, delayTime);
    }, autoCloseTime - delayTime);
  });

  startTransition.subscribe((value) => {
    if (!value) {
      setTimeout(() => {
        showNotification.set(false);
      }, delayTime);
    }
  });

  $: if (!show) {
    startTransition.set(false);
  }

  $: if (show) {
    showNotification.set(true);
  }
</script>

{#if $showNotification}
  <div class="notify {$startTransition && 'show'}">
    <div class="notify-content">
      {#if time}
        <div class="notify-timebar">
          <div class="notify-time" style="width: {$width}%;" />
        </div>
      {/if}

      <div class="notify-body">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .notify {
    transform: translate(-50%, -100%);
    transition: all 0.5s linear;
    justify-content: center;
    align-items: start;
    position: fixed;
    overflow: auto;
    display: flex;
    z-index: 9999;
    left: 50%;
    top: -100%;
  }

  .show {
    top: 0;
    transform: translate(-50%, 0);
  }

  .notify-content {
    box-shadow: rgba(0, 0, 0, 0.4);
    background-color: var(--color-bg-gray-4);
    border-radius: 8px;
    min-width: 12rem;
    max-width: 30rem;
    margin-top: 10px;
  }

  .notify-content .notify-body {
    padding: 14px;
  }

  .notify-timebar {
    width: 100%;
    height: 3px;
    background-color: var(--color-bg-gray-7);
    position: relative;
    box-sizing: border-box;
  }

  .notify-time {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--color-main);
  }
</style>
