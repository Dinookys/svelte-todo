<script lang="ts">
  import { fly } from "svelte/transition";
  import { clickOutside } from "$lib/actions/outside";
  import { createEventDispatcher } from "svelte";

  export let showTopCloseButton = true;
  export let show = false;
  export let duration = 300;

  const dispatch = createEventDispatcher();
  let afterCloseTimeOut: ReturnType<typeof setTimeout> | null = null;

  const closeModal = () => {
    show = false;
    dispatch("close");
  };

  const afterClose = () => {
    if (afterCloseTimeOut) {
      clearTimeout(afterCloseTimeOut);
    }

    afterCloseTimeOut = setTimeout(() => {
      dispatch("afterClose");
    }, duration);
  };

  $: if (!show) {
    dispatch("close");
    afterClose();
  }
</script>

{#if show}
  <div
    class="box-confirmation shadow-lg"
    transition:fly={{ y: -50, duration }}
    use:clickOutside={closeModal}
  >
    <div
      {...{
        ...$$restProps,
        class: `box-confirmation-content bg-slate-600 text-white rounded-md border-slate-500 border ${$$restProps.class}`,
      }}
    >
      {#if showTopCloseButton}
        <div class="box-confirmation-action mx-2">
          <button
            on:click|preventDefault={closeModal}
            class="text-white hover:text-red-500 transition-colors"
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
    transform: translateX(-50%);
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    overflow: auto;
    display: flex;
    z-index: 9999;
    left: 50%;
    top: 30px;
  }

  .box-confirmation-content {
    min-width: 12rem;    
    margin-top: 15px;
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
  }
</style>
