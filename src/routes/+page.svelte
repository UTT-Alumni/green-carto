<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { Seo } from 'chyme-svelte';

	import type { PageData } from './$types';
	import type { D3Event, D3Link, D3Node } from '$lib/types';

	export let data: PageData;

	const width = 960;
	const height = 600;

	const radius = 30;

	onMount(() => {
		var svg = d3.select('#networkGraph').append('svg').attr('width', width).attr('height', height);

		var simulation = d3
			.forceSimulation()
			.force(
				'link',
				d3.forceLink().id((d: D3Node) => d.id)
			)
			.force('charge', d3.forceManyBody().strength(-1900).theta(0.5).distanceMax(1500))
			.force('collision', d3.forceCollide().radius(radius))
			.force(
				'center',
				d3.forceCenter(
					width / 2,
					height / 2
					// document.querySelector('#networkGraph').clientWidth / 2,
					// document.querySelector('#networkGraph').clientHeight / 2
				)
			);

		var link = svg
			.append('g')
			.selectAll('line')
			.data(data.relations)
			.enter()
			.append('line')
			.attr('stroke-width', '2')
			.style('stroke', '#aaa');

		var node = svg
			.append('g')
			.attr('class', 'nodes')
			.selectAll('circle')
			.data(data.actors)
			.enter()
			.append('circle')
			//I made the article/source nodes larger than the entity nodes
			.attr('r', (d: D3Node) => radius)
			.attr('fill', '#cccccc')
			.attr('stroke', '#424242')
			.attr('stroke-width', '1');

		var label = svg
			.append('g')
			.attr('class', 'labels')
			.selectAll('text')
			.data(data.actors)
			.enter()
			.append('text')
			.text((d: D3Node) => d.name)
			.attr('class', 'label');

		label.style('text-anchor', 'middle').style('font-size', function () {
			return Math.min(radius, ((2 * radius + 0) / this.getComputedTextLength()) * 15) + 'px';
		});

		simulation.nodes(data.actors).on('tick', ticked);

		simulation.force('link').links(data.relations);

		function ticked() {
			link
				.attr('x1', (d: D3Link) => d.source.x)
				.attr('y1', (d: D3Link) => d.source.y)
				.attr('x2', (d: D3Link) => d.target.x)
				.attr('y2', (d: D3Link) => d.target.y);

			node.attr('cx', (d: D3Node) => d.x + 5).attr('cy', (d: D3Node) => d.y - 3);

			label.attr('x', (d: D3Node) => d.x).attr('y', (d: D3Node) => d.y);
		}

		var tooltip = d3
			.select('body')
			.append('div')
			.style('position', 'absolute')
			.style('visibility', 'hidden')
			.style('color', 'white')
			.style('padding', '8px')
			.style('background-color', '#626D71')
			.style('border-radius', '6px')
			.style('text-align', 'center')
			.style('width', 'auto')
			.text('');

		node
			.on('mouseover', (_event: D3Event, d: D3Node) => {
				tooltip.html(`${d.name}`);
				return tooltip.style('visibility', 'visible');
			})
			.on('mousemove', (event: D3Event) => {
				return tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
			})
			.on('mouseout', () => {
				return tooltip.style('visibility', 'hidden');
			});
	});
</script>

<Seo
	title="UTT Alumni | Cartographie Green"
	description="Cartographie des acteurs dans le domaine du développement durable"
/>

<div id="networkGraph" />

<style>
	:global(.labels) {
		transform: translate(6px, 2px);
	}
	:global(.label) {
		cursor: default;
		pointer-events: none;
	}
</style>
