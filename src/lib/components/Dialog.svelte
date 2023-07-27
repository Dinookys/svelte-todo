<script lang="ts">
  import { fly } from "svelte/transition";
  import { clickOutside } from "$lib/actions/outside";
  import { createEventDispatcher } from "svelte";

  export let showTopCloseButton = true;
  export let show = false;

  const dispatch = createEventDispatcher();

  const closeModal = () => {
    show = false;
    dispatch("close");
  };

  $: !show && dispatch("close");
</script>

{#if show}
  <div
    class="box-confirmation shadow-lg"
    transition:fly={{ y: -50 }}
    use:clickOutside={closeModal}
  >
    <div
      class="box-confirmation-content bg-slate-600 text-white rounded-md border-slate-500 border"
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
    box-shadow: rgba(0, 0, 0, 0.4);
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
  }
</style>
