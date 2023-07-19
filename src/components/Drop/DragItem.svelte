<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const dragStart = (event: DragEvent) => {
    const target = event.currentTarget as HTMLDivElement;
    if (target) {
      target.classList.add("dragitem");
    }
    dispatch("dragstart", event);
  };

  const dragEnd = (event: DragEvent) => {
    const target = event.currentTarget as HTMLDivElement;
    if (target) {
      target.classList.remove("dragitem");
    }
    dispatch("dragend", event);
  };

  const dragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLDivElement;
    if (target) {
      target.classList.remove("dragenter");
    }
    dispatch("dragleave", event);
  };

  const dragOver = (event: DragEvent) => {
    const target = event.currentTarget as HTMLDivElement;
    if (target) {
      target.classList.add("dragenter");
    }
    dispatch("dragover", event);
  };
</script>

<div
  {...$$restProps}
  on:dragstart={dragStart}
  on:dragleave={dragLeave}
  on:dragend={dragEnd}
  on:dragover={dragOver}
  draggable="true"
>
  <slot />
</div>
