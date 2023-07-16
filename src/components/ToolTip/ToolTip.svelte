<script lang="ts">
  import { Positions } from "./ToolTip";

  export let el = "span";  
  export let toolTipText = "Tooltip text";
  export let toolTipWidth = "";
  export let toolTipHeight = "";
  export let toolTipClass = "";

  export let position = "";
  export let showWhenClicked = false;

  let element: HTMLElement;
  let toolTipDialog: HTMLElement;
  let enterTooltip = false;
  let showTooltip = false;

  let toolTipTopPosition = 0;
  let toolTipLeftPosition = 0;

  const getParentPosition = () => {   

    const rect = element.getBoundingClientRect();
    const toolTipDialogHeight = toolTipDialog.offsetHeight;
    const toolTipDialogWidth = toolTipDialog.offsetWidth;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const topToolTip = rect.top + window.scrollY - (toolTipDialogHeight + 2);
    const bottomToolTip = rect.top + window.scrollY + toolTipDialogHeight +  (elementHeight / 2);
    const centerXToolTip =
      rect.left + elementWidth / 2 - toolTipDialogWidth / 2;
    const centerYToolTip =
      rect.top + window.scrollY - toolTipDialogHeight / 2 + elementHeight / 2;
    const leftToolTip =
      rect.right + window.scrollY - (toolTipDialogWidth + elementWidth);
    const rightToolTip = rect.left + window.scrollY + elementWidth;

    switch (position) {
      case Positions.BottomCenter:
        return {
          top: bottomToolTip,
          left: centerXToolTip,
        };
      case Positions.CenterLeft:
        return {
          top: centerYToolTip,
          left: leftToolTip,
        };
      case Positions.CenterRight:
        return {
          top: centerYToolTip,
          left: rightToolTip,
        };
      case Positions.TopLeft:
        return {
          top: topToolTip,
          left: leftToolTip,
        };
      case Positions.TopRight:
        return {
          top: topToolTip,
          left: rightToolTip,
        };
      case Positions.BottomLeft:
        return {
          top: bottomToolTip,
          left: leftToolTip,
        };
      case Positions.BottomRight:
        return {
          top: bottomToolTip,
          left: rightToolTip,
        };
      default:
      case Positions.TopCenter:
        return {
          top: topToolTip,
          left: centerXToolTip,
        };
    }
  };

  const onHovered = () => {
    if (showWhenClicked) return;
    enterTooltip = !enterTooltip;
  };

  const onClicked = () => {
    if (!showWhenClicked) return;
    enterTooltip = !enterTooltip;
  };

  $: {
    setTimeout(() => {
      toolTipTopPosition = getParentPosition().top;
      toolTipLeftPosition = getParentPosition().left;
      showTooltip = enterTooltip;
    }, 1);
  }
</script>

<div    
  class="tooltip {toolTipClass}"
  class:enter={enterTooltip}
  class:show={showTooltip}
  style="left: {toolTipLeftPosition}px; top: {toolTipTopPosition}px; {toolTipWidth &&
    ` width: ${toolTipWidth};`} {toolTipHeight &&
    ` height: ${toolTipHeight};`}"
  bind:this={toolTipDialog}
>
  <slot name="toolTipText" >{toolTipText}</slot>
</div>
<svelte:element
  this={el}
  bind:this={element}  
  on:mouseenter={onHovered}
  on:mouseleave={onHovered}
  on:click={onClicked}
  { ...$$restProps}
>
  <slot></slot>
</svelte:element>

<style>
  .tooltip {
    position: absolute;
    background-color: var(--color-bg-gray-5);
    padding: 5px;
    border-radius: var(--radius-sm);
    filter: opacity(0);
    transform: scale(0);
    transition: filter 0.3s;
  }

  .tooltip.enter {
    transform: scale(1);
  }

  .tooltip.show {
    filter: opacity(1);
  }
</style>
