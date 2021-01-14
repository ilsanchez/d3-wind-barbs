/**
 * Make T fully partial
 * @ignore
 */
type DeepPartial<T> = { readonly [P in keyof T]?: DeepPartial<T[P]> };

interface WindBarbSize {
  /**
   * Svg dimensions.
   */
  readonly size: {
    /**
     * Refers to base line where other elements will be appended
     */
    readonly width: number;
    /**
     * Refers to elements that will be appended to root line as Full lines or triangles
     */
    readonly height: number;
  };
  /**
   * SVG root `line` element css class
   */
  readonly rootBarClassName: string;
  /**
   * SVG element id
   */
  readonly svgId: string;
}

interface WindBarbConversionFactor {
  /**
   * @see [[ConversionFactors]]
   */
  readonly conversionFactor: number;
}

interface WindBarbBar {
  /**
   * Bars properties, for both, full bars (10 knots) and half bars (5knots)
   */
  readonly bar: {
    /**
     * Color for barbs, including root line
     */
    readonly stroke: string;
    /**
     * Width of the line stroke
     */
    readonly width: number;
    /**
     * Angle used to draw bars and triangles
     */
    readonly angle: number;
    /**
     * Space between bars and adjacent triangles
     */
    readonly padding: number;
    /**
     * Css class name for 10 knots bars
     */
    readonly fullBarClassName: string;
    /**
     * Css class name for 5 knots bars
     */
    readonly shortBarClassName: string;
  };
}
interface WindBarbTriangle {
  /**
   * Triangles properties
   */
  readonly triangle: {
    /**
     * Stroke color for the triangles
     */
    readonly stroke: string;
    /**
     * Fill color for the triangles
     */
    readonly fill: string;
    /**
     * Space between triangles
     */
    readonly padding: number;
    /**
     * Css class name for triangles
     */
    readonly className: string;
  };
}

interface WindBarbZeroKnotsCircle {
  /**
   * Circle properties which will be drawn when speed < 5 knots
   */
  readonly circle: {
    /**
     * Stroke color for circle
     */
    readonly stroke: string;
    /**
     * Fill color for circle
     */
    readonly fill: string;
    /**
     * Radius of the circle
     */
    readonly radius: number;
    /**
     * Stroke width of the circle
     */
    readonly strokeWidth: number;
    /**
     * Css class for the circle
     */
    readonly className: string;
  };
}

interface WindBarbCircle {
  /**
   * Properties for base circle. If is undefined no circle will be drawn
   */
  readonly baseCircle: {
    /**
     * Stroke color for circle
     */
    readonly stroke: string;
    /**
     * Fill color for circle
     */
    readonly fill: string;
    /**
     * Radius of the circle
     */
    readonly radius: number;
    /**
     * Stroke width of the circle
     */
    readonly strokeWidth: number;
    /**
     * Css class for the circle
     */
    readonly className: string;
  };
}

/**
 * For internal use only
 * @ignore
 */
export interface WindBarbDims {
  readonly dims: {
    readonly barHeight: number;
    readonly triangleHeight: number;
    readonly triangleWidth: number;
  };
}

export type PublicWindBarbOptions = DeepPartial<WindBarbSize> &
  DeepPartial<WindBarbConversionFactor> &
  DeepPartial<WindBarbBar> &
  DeepPartial<WindBarbTriangle> &
  DeepPartial<WindBarbZeroKnotsCircle> &
  DeepPartial<WindBarbCircle | { baseCircle: boolean }>;

/**
 * For internal use only. Makes @see [[PublicWindBarbOptions]] fully required and
 * add @see [[WindBarbDims]]
 * @ignore
 */
export type PrivateWindBarbOptions = WindBarbBar &
  WindBarbSize &
  WindBarbConversionFactor &
  WindBarbTriangle &
  WindBarbDims &
  WindBarbZeroKnotsCircle &
  Partial<WindBarbCircle>;
