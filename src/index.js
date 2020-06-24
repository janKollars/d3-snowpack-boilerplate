import dataset from './my_weather_data.json';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { timeParse } from 'd3-time-format';

function drawLineChart() {
  // BASICS
  //========================================================

  console.log('Dataset: ', dataset);
  // Table view of one JSON Object
  console.table(dataset[0]);

  // PREPARATION
  //========================================================
  // Accessor function for y-values
  const yAccessor = (d) => d.temperatureMax;
  // Accessor founction for x-values with date parser
  const dateParser = timeParse('%Y-%m-%d');
  const xAccessor = (d) => dateParser(d.date);

  // Set dimensions and properties
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 16,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // DRAWING
  //========================================================
  const wrapper = select('#wrapper');
  const svg = wrapper
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = svg
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
    );

  // Y - scale
  const yScale = scaleLinear()
    .domain(extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  // Rectangle for indicating freezing temperatures
  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append('rect')
    .attr('x', 0)
    .attr('width', dimensions.boundedWidth)
    .attr('y', freezingTemperaturePlacement)
    .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr('fill', '#e0f3f3');

  // X - scale
  const xScale = scaleTime()
    .domain(extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  console.log(extent(dataset, xAccessor));

  // Line generator
  const lineGenerator = line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const graphLine = bounds
    .append('path')
    .attr('d', lineGenerator(dataset))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 2);

  // Adding the y and x axis
  const yAxisGenerator = axisLeft().scale(yScale);
  const yAxis = bounds.append('g').call(yAxisGenerator);

  const xAxisGenerator = axisBottom().scale(xScale);
  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);
}

window.addEventListener('load', drawLineChart);
