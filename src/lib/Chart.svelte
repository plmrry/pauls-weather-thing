<script>
  import { onMount } from "svelte";
  import * as d3 from 'd3';
  import * as Plot from '@observablehq/plot';

  export let title = "Farm";

  export let options;

  let width;
  let height;

  $: options_final = ({
    width,
    height,
    x: { ticks: 7, type: `time`, domain: [new Date(), d3.utcDay.offset(new Date(), 2)] },
    style: {
      overflow: "visible",
      "font-size": "14px"
    },
    ...($options ?? {})
  })

  function plot_action(element) {
    console.log({ options_final })
    element.appendChild(
      Plot.plot(options_final)
    )
  }

  function size_action(elem) {
    const update = () => {
      ({ width, height } = elem.getBoundingClientRect());
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(elem);
    const destroy = () => {
      observer.disconnect();
    }
    return {
      destroy
    }
  }
</script>

{#key options_final}
  <chart-container use:size_action use:plot_action />
{/key}

<style>
  chart-container {
    display: block;
    width: 100%;
    height: 100%;
    background: pink;
  }
</style>