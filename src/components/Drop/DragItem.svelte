<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let item: HTMLDivElement = undefined as any;
  let draggable = true;


  const dragStart = (event: DragEvent) => {
    item.classList.add("dragged");
    dispatch("dragstart", event);
  };

  const dragEnd = (event: DragEvent) => {
    item.classList.remove("dragged");
    dispatch("dragend", event);
  };

  const dragLeave = (event: DragEvent) => {
    item.classList.remove("dragenter");
    dispatch("dragleave", event);
  };

  const dragOver = (event: DragEvent) => {
    item.classList.add("dragenter");
    dispatch("dragover", event);
  };
</script>

<div
  bind:this={item}
  {...$$restProps}
  on:dragstart={dragStart}
  on:dragleave={dragLeave}
  on:dragend={dragEnd}
  on:dragover={dragOver}
  {draggable}
  class="dragitem"
>
  <slot />
</div>
