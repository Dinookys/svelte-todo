<script lang="ts">
  import { writable } from "svelte/store";

  export let showTopCloseButton = false;
  export let show = false;

  let startTransition = writable(false);
  let showBox = writable(show);
  let setTimeoutShowTime = undefined as number | undefined;

  const delayTime = 200;

  showBox.subscribe((value) => {
    if (!value) {
      show = value;
      return;
    }

    setTimeoutShowTime = setTimeout(() => {
      startTransition.set(true);
    }, 1);
  });

  startTransition.subscribe((value) => {
    if (!value) {
      setTimeout(() => {
        showBox.set(false);
      }, delayTime);
    }
  });

  $: if (!show) {
    startTransition.set(false);
  }

  $: if (show) {
    showBox.set(true);
  }
</script>

{#if $showBox}
  <div class="box-confirmation {$startTransition && 'show'}">
    <div class="box-confirmation-content">
      {#if showTopCloseButton}
        <div class="box-confirmation-action">
          <button on:click|preventDefault={() => startTransition.set(false)}
            >&times;</button
          >
        </div>
      {/if}

      <div class="box-confirmation-body">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .box-confirmation {
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

  .box-confirmation-content {
    box-shadow: rgba(0, 0, 0, 0.4);
    background-color: var(--color-gray-4);
    border-radius: 8px;
    min-width: 12rem;
    max-width: 30rem;
    margin-top: 10px;
  }

  .box-confirmation-content .box-confirmation-body {
    padding: 14px;
  }

  .box-confirmation-content .box-confirmation-action {
    text-align: right;
  }

  .box-confirmation-content .box-confirmation-action button {
    background-color: transparent;
    cursor: pointer;
    border: none;
    font-size: 25px;
    color: white;
  }

  .box-confirmation-content .box-confirmation-action button:hover {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
