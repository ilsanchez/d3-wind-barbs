// d3-wind-barbs.ts
import { create, range, select } from 'd3';
import {
  Barbs,
  PrivateWindBarbOptions,
  PublicWindBarbOptions,
  SVG,
  WindBarbDims,
} from 'd3-wind-barbs';

/**
 * This library works internally with nautical Knots. So, if your data is in other
 * units you <b>should</b>:
 * 1) Pass the correct conversion factor as option
 * 2) Transform your data to knots and ignore the `conversionFactor` option
 *
 * This library provides 2 conversion factors:
 * 1) <b>KmhToKnot</b> - Kilometers per hour to nautical knots
 * 2) <b>MpsToKnot</b> - Meters per second to nautical knots
 *
 * <b>None</b> is the default option and will be used if your data is in knots
 *
 * Be aware that your speed data will be multiplied by `conversionFactor`
 */
export const ConversionFactors = {
  KmhToKnot: 0.539,
  MpsToKnot: 1.944,
  None: 1,
} as const;

/**
 * Default configuration.
 * All that properties that you don't provide will be overwritten by
 * the corresponding option of this configuration
 */
const DEFAULT_CONFIG: Omit<PrivateWindBarbOptions, 'dims'> = {
  /**
   * Svg dimensions.
   */
  size: {
    /**
     * Refers to elements that will be appended to root line as Full lines or triangles
     */
    height: 33,
    /**
     * Refers to base line where other elements will be appended
     */
    width: 80,
  },
  /**
   * SVG root `line` element css class
   */
  rootBarClassName: 'wind-barb-root',
  /**
   * SVG element id
   */
  svgId: '',
  /**
   * Bars properties, for both, full bars (10 knots) and half bars (5knots)
   */
  bar: {
    /**
     * Angle used to draw bars and triangles
     */
    angle: 30,
    /**
     * Space between bars and adjacent triangles
     */
    padding: 6,
    /**
     * Color for barbs, including root line
     */
    stroke: '#000',
    /**
     * Width of the line stroke
     */
    width: 2,
    /**
     * Css class name for 10 knots bars
     */
    fullBarClassName: 'wind-barb-bar-full',
    /**
     * Css class name for 5 knots bars
     */
    shortBarClassName: 'wind-barb-bar-half',
  },
  /**
   * @see [[ConversionFactors]]
   */
  conversionFactor: ConversionFactors.None,
  /**
   * Triangles properties
   */
  triangle: {
    /**
     * Fill color for the triangles
     */
    fill: '#000',
    /**
     * Stroke color for the triangles
     */
    stroke: '#000',
    /**
     * Space between triangles
     */
    padding: 6,
    /**
     * Css class name for triangles
     */
    className: 'wind-barb-triangle',
  },
  /**
   * Circle properties when speed < 5 knots
   */
  circle: {
    /**
     * Fill color for circle
     */
    fill: '#FFFFFF00',
    /**
     * Stroke color for circle
     */
    stroke: '#000',
    /**
     * Radius of the circle
     */
    radius: 10,
    /**
     * Stroke width of the circle
     */
    strokeWidth: 2,
    /**
     * Css class for the circle
     */
    className: 'wind-barb-circle',
  },
};

export class D3WindBarb {
  private svg: SVG;
  private fullOptions: PrivateWindBarbOptions;

  /**
   *
   * @param speed Wind speed in any units. @see [[ConversionFactors]]
   * @param angle Wind direction angle.
   *
   * As reference:
   *
   * - 0deg for north
   * - 90deg for east
   * - 180deg for south
   * - 270deg for west
   *
   * But you can pass any angle between 0 and 360
   * @param options @see [[DEFAULT_CONFIG]]
   */
  constructor(
    private speed: number,
    private angle: number,
    private options?: PublicWindBarbOptions
  ) {
    this.fullOptions = this.mergeOptions();
    this.svg = this.createSvg();
  }

  private createSvg(): SVG {
    const { width, height } = this.fullOptions.size;
    const svg = create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', width)
      .attr('height', height)
      .attr('overflow', 'visible');
    if (this.fullOptions.svgId) {
      svg.attr('id', this.fullOptions.svgId);
    }
    return svg;
  }

  private mergeOptions(): PrivateWindBarbOptions {
    const {
      bar: pBar,
      conversionFactor: pConversionFactor,
      size: pSize,
      triangle: pTriangle,
      circle: pCircle,
      svgId: pSvgId,
    } = this.options || {};
    const {
      bar,
      conversionFactor,
      size,
      triangle,
      circle,
      svgId,
    } = DEFAULT_CONFIG;
    const privateOptions: any = {
      bar: { ...bar, ...pBar },
      conversionFactor: pConversionFactor ?? conversionFactor,
      svgId: pSvgId ?? svgId,
      size: { ...size, ...pSize },
      triangle: { ...triangle, ...pTriangle },
      circle: { ...circle, ...pCircle },
    };
    const dims = this.getSizes(privateOptions);

    return {
      ...privateOptions,
      ...dims,
    };
  }

  private getSizes(
    options: Omit<PrivateWindBarbOptions, 'dims'>
  ): WindBarbDims {
    const height = options.size.height;
    const C = ((90 - options.bar.angle) * Math.PI) / 180;
    const b = height * Math.sin(C);
    const ct = height * Math.cos(C);

    const triangleHeight = b;
    const triangleWidth = ct;
    return {
      dims: {
        barHeight: height,
        triangleHeight,
        triangleWidth,
      },
    };
  }

  private getBarbs(): Barbs | undefined {
    const knots = Number(
      (this.speed * this.fullOptions.conversionFactor).toFixed()
    );

    const res = {
      50: 0,
      10: 0,
      5: 0,
    };

    if (knots < 5) {
      return undefined;
    }

    for (let k = knots; k > 0; ) {
      if (k - 50 >= 0) {
        res[50] += 1;
        k -= 50;
      } else if (k - 10 >= 0) {
        res[10] += 1;
        k -= 10;
      } else if (k - 5 >= 0) {
        res[5] += 1;
        k -= 5;
      } else {
        break;
      }
    }

    return res;
  }

  private drawCircle() {
    const {
      size: { width, height },
      circle,
    } = this.fullOptions;
    this.svg
      .append('circle')
      .attr('r', circle.radius)
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('stroke', circle.stroke)
      .attr('fill', circle.fill)
      .attr('stroke-width', circle.strokeWidth)
      .attr('class', circle.className);
    return this;
  }

  private drawBarbs(barbs: Barbs) {
    const {
      size: { height, width },
      rootBarClassName,
      bar: { width: barWidth, stroke, padding: barPadding },
      dims: { triangleWidth },
      triangle: { padding: trianglePadding },
    } = this.fullOptions;
    const container = this.svg.append('g');

    container
      .append('line')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', width)
      .attr('y2', height)
      .attr('stroke-width', barWidth)
      .attr('stroke', stroke)
      .attr('class', rootBarClassName);

    if (barbs[50] !== 0) {
      this.drawTriangles(barbs[50], container);
    }

    if (barbs[10] !== 0) {
      const paddingR = barbs[50] * (triangleWidth + trianglePadding);
      this.drawFullBars(barbs[10], container, paddingR);
    }

    if (barbs[5] !== 0) {
      const paddingR =
        barbs[50] * (triangleWidth + trianglePadding) +
        barbs[10] * (barPadding + barWidth);
      this.drawHalfBars(barbs[5], container, paddingR);
    }

    container
      .attr('transform-origin', `${width / 2}% ${height}%`)
      .attr('transform', `translate(0, ${-height / 2})`)
      .attr(
        'transform',
        `translate(0, ${-height / 2})rotate(${-90 + this.angle})`
      );

    return container;
  }

  private drawTriangles(q: number, container: SVG) {
    const {
      size: { height, width },
      triangle: { padding, stroke, fill, className },
      dims: { triangleWidth, triangleHeight },
    } = this.fullOptions;
    const drawPath = (index: number) => {
      const initialX = width - (triangleWidth + padding) * index;

      return `M${initialX}, ${height}, ${
        initialX - triangleWidth
      }, ${height}, ${initialX}, ${height - triangleHeight}z`;
    };

    const data = range(q);
    container
      .append('g')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', (_: any, i: number) => drawPath(i))
      .attr('stroke', stroke)
      .attr('fill', fill)
      .attr('class', className);
  }

  private drawFullBars(q: number, container: SVG, right: number) {
    const {
      size: { width, height },
      bar: { width: barWidth, padding, angle, stroke, fullBarClassName },
      dims: { barHeight },
    } = this.fullOptions;

    const data = range(q);
    container
      .append('g')
      .selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr(
        'x1',
        (_: any, i: number) => width - (right + i * (barWidth + padding))
      )
      .attr('y1', height)
      .attr(
        'x2',
        (_: any, i: number) => width - (right + i * (barWidth + padding))
      )
      .attr('y2', height - barHeight)
      .attr('stroke', stroke)
      .attr('stroke-width', barWidth)
      .attr('class', fullBarClassName)
      .attr(
        'transform-origin',
        (_: any, i: number) =>
          `${width - (right + i * (barWidth + padding))} ${height}`
      )
      .attr('transform', `rotate(${angle})`);
  }

  private drawHalfBars(q: number, container: SVG, right: number) {
    const {
      size: { height, width },
      bar: { width: barWidth, padding, angle, stroke, shortBarClassName },
      dims: { barHeight },
    } = this.fullOptions;

    const data = range(q);
    container
      .append('g')
      .selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (_: any, i: number) => {
        return width - (right + i * (barWidth + padding));
      })
      .attr('y1', height)
      .attr(
        'x2',
        (_: any, i: number) => width - (right + i * (barWidth + padding))
      )
      .attr('y2', height - barHeight / 2)
      .attr('stroke', stroke)
      .attr('stroke-width', barWidth)
      .attr('class', shortBarClassName)
      .attr(
        'transform-origin',
        (_: any, i: number) =>
          `${width - (right + i * (barWidth + padding))} ${height}`
      )
      .attr('transform', `rotate(${angle})`);
  }

  /**
   * Creates wind barb and returns the svg element. If `container` is provided, the svg
   * will be appended to element if found
   * @param container Id of the element where the svg will be appended if provided
   * @returns SVGElement
   * @example
   * ```typescript
   * // Use d3-wind-barbs with leaflet to draw wind barbs as markers
   *
   const windBarb = new WindBarb(21, 45, {
   size:
     height: 20,
     width: 50
}).draw();
   *
   * const leafletIcon = new L.DivIcon({
   *    html: windBarb.outerHTML
   * })
   *
   * // Now you can use this icon in your L.Marker
   *```
   *
   * @example
   * ```typescript
   * // Use d3-wind-barb with OpenLayers to draw svg icons
   * 
   * const windBarb = new WindBarb(21, 45, {
   *    size:
   *      height: 20,
   *      width: 50
   * }).draw();
   * 
   * const style = new ol.style.Style({
   *   image: new ol.style.Icon({
   *     opacity: 1,
   *     src: 'data:image/svg+xml;utf8,' + windBarb.outerHTML
   *   })
   * });
   *  
   * ```
   */
  public draw(container?: string): SVGElement {
    const barbs = this.getBarbs();

    if (barbs === undefined) {
      this.drawCircle();
    } else {
      this.drawBarbs(barbs);
    }
    if (container) {
      (select(container).node() as HTMLElement)?.appendChild(this.svg.node());
    }
    return this.svg.node();
  }
}
