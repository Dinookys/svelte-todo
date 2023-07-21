<script lang="ts">
  export let showTopCloseButton = false;
  export let show = false;
</script>

<div class="box-confirmation shadow-lg" class:show>
  <div class="box-confirmation-content bg-slate-700 text-white rounded-md">
    {#if showTopCloseButton}
      <div class="box-confirmation-action">
        <button on:click|preventDefault={() => (show = false)}>&times;</button
        >
      </div>
    {/if}

    <div class="box-confirmation-body">
      <slot />
    </div>
  </div>
</div>

<style>
  .box-confirmation {
    transform: translateX(-50%);
    transition: top 0.5s linear;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    overflow: auto;
    display: flex;
    z-index: 9999;
    left: 50%;
    top: -100%;
  }

  .show {
    top: 0;
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
    color: white;
  }

  .box-confirmation-content .box-confirmation-action button:hover {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
