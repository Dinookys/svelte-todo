<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const drop = (event: DragEvent) => {
    document.querySelectorAll(".dragenter").forEach((el) => {
      el.classList.remove("dragenter");
    });
    dispatch("drop", event);
  };
</script>

<div {...$$restProps} on:drop={drop} on:dragover={(ev) => { ev.preventDefault() }}>
  <slot />
</div>
