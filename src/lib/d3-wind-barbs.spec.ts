import test from 'ava';
import { JSDOM } from 'jsdom';

import { ConversionFactors, D3WindBarb } from './d3-wind-barbs';

global.document = new JSDOM().window.document;

test('Should create correct number of elements without conversion', (t) => {
  const svg = new D3WindBarb(85, 90).draw();
  const triangles = svg.getElementsByClassName('wind-barb-triangle');
  const longBars = svg.getElementsByClassName('wind-barb-bar-full');
  const shortBars = svg.getElementsByClassName('wind-barb-bar-half');

  t.is(triangles.length, 1);
  t.is(longBars.length, 3);
  t.is(shortBars.length, 1);
});

test('Should create correct number of elements from meters per second', (t) => {
  const svg = new D3WindBarb(40, 90, {
    conversionFactor: ConversionFactors.MpsToKnot,
  }).draw();
  const triangles = svg.getElementsByClassName('wind-barb-triangle');
  const longBars = svg.getElementsByClassName('wind-barb-bar-full');
  const shortBars = svg.getElementsByClassName('wind-barb-bar-half');

  t.is(triangles.length, 1);
  t.is(longBars.length, 2);
  t.is(shortBars.length, 1);
});

test('Should create only a circle', (t) => {
  const svg = new D3WindBarb(0, 90, {
    conversionFactor: ConversionFactors.None,
  }).draw();
  const circles = svg.getElementsByClassName('wind-barb-circle');

  t.is(circles.length, 1);
});

test('Should append svg into container element', (t) => {
  const container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  new D3WindBarb(40, 0, { svgId: 'wind-barb-root' }).draw('#container');

  const child = container.firstChild as SVGElement;
  console.log(container, child);
  t.is(child.id, 'wind-barb-root');
});
