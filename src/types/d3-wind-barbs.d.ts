declare module 'd3-wind-barbs' {
  import { Selection } from 'd3';

  type SVG = Selection<any, any, any, any>;

  type DeepPartial<T> = {
    readonly [P in keyof T]?: DeepPartial<T[P]>;
  };

  interface WindBarbSize {
    readonly size: {
      readonly width: number;
      readonly height: number;
    };
    readonly rootBarClassName: string;
    readonly svgId: string;
  }

  interface WindBarbConversionFactor {
    readonly conversionFactor: number;
  }

  interface WindBarbBar {
    readonly bar: {
      readonly stroke: string;
      readonly width: number;
      readonly angle: number;
      readonly padding: number;
      readonly fullBarClassName: string;
      readonly shortBarClassName: string;
    };
  }

  interface WindBarbTriangle {
    readonly triangle: {
      readonly stroke: string;
      readonly fill: string;
      readonly padding: number;
      readonly className: string;
    };
  }

  interface WindBarbCircle {
    readonly circle: {
      readonly stroke: string;
      readonly fill: string;
      readonly radius: number;
      readonly strokeWidth: number;
      readonly className: string;
    };
  }

  interface WindBarbDims {
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
    DeepPartial<WindBarbCircle>;

  type PrivateWindBarbOptions = WindBarbBar &
    WindBarbSize &
    WindBarbConversionFactor &
    WindBarbTriangle &
    WindBarbDims &
    WindBarbCircle;

  type Barbs = { 50: number; 10: number; 5: number };
}
