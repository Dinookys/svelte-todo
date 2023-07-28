<script lang="ts">
  import { Positions } from "./ToolTip";
  import {tick} from "svelte";

  export let el = "span";  
  export let toolTipText = "Text";
  export let toolTipWidth = "";
  export let toolTipHeight = "";
  export let toolTipClass = "";
  export let position: Positions = Positions.BottomLeft;
  export let showWhenClicked = false;

  let element: HTMLElement;
  let toolTipDialog: HTMLElement;
  let enterTooltip = false;
  let showTooltip = false;

  let toolTipTopPosition = 0;
  let toolTipLeftPosition = 0;

  const getParentPosition = () => {   

    if(!element) return {top: 0, left: 0}

    const viewportOffset = element.getBoundingClientRect();

    const toolTipDialogHeight = toolTipDialog.offsetHeight;
    const toolTipDialogWidth = toolTipDialog.offsetWidth;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const topToolTip = viewportOffset.top - toolTipDialogHeight -  4;
    const bottomToolTip = viewportOffset.top + ( toolTipDialogHeight/2 ) +  elementHeight;
    const centerXToolTip = viewportOffset.left + elementWidth / 2 - toolTipDialogWidth / 2;
    const centerYToolTip = viewportOffset.top - toolTipDialogHeight / 2 + elementHeight / 2;
    const rightToolTip = (viewportOffset.left + elementWidth) - toolTipDialogWidth;
    const leftToolTip = viewportOffset.left;

    switch (position) {
      case Positions.BottomCenter:
        return {
          top: bottomToolTip,
          left: centerXToolTip,
        };
      case Positions.CenterLeft:
        return {
          top: centerYToolTip,
          left: leftToolTip - toolTipDialogWidth - 5,
        };
      case Positions.CenterRight:
        return {
          top: centerYToolTip,
          left: rightToolTip + toolTipDialogWidth + 5,
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

  const onHovered = (show: boolean) => {
    if (showWhenClicked) return;
    enterTooltip = show;
  };

  const onClicked = () => {
    if (!showWhenClicked) return;
    enterTooltip = !enterTooltip;
  };

  $: {
    tick().then(() => {
      toolTipTopPosition = getParentPosition().top;
      toolTipLeftPosition = getParentPosition().left;
      showTooltip = enterTooltip;      
    })
  }
</script>

<div    
  class="tooltip bg-primary-500 text-xs text-white rounded-md p-2 {toolTipClass}"
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
  on:mouseenter={() => onHovered(true)}
  on:mouseleave={() => onHovered(false)}
  on:click={onClicked}
  { ...$$restProps}
>
  <slot></slot>
</svelte:element>

<style>
  .tooltip {
    position: fixed;    
    filter: opacity(0);
    transform: scale(0);
    transition: filter 0.3s;
    z-index: 9999;
  }

  .tooltip.enter {
    transform: scale(1);
  }

  .tooltip.show {
    filter: opacity(1);
  }
</style>
