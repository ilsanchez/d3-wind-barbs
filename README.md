<a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
       width="88" height="31" alt="WTFPL" /></a>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/ilsanchez/d3-wind-barbs/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/ilsanchez/d3-wind-barbs.svg)](https://github.com/ilsanchez/d3-wind-barbs/blob/master/LICENSE)
[![GitHub version](https://badge.fury.io/gh/ilsanchez%2Fd3-wind-barbs.js.svg)](https://github.com/ilsanchez/d3-wind-barbs)
[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Minizipped Size](https://badgen.net/bundlephobia/minzip/d3-wind-barbs)](https://bundlephobia.com/result?p=d3-wind-barbs@1.0.3)

# d3-wind-barbs

![wind-barb](./static/wind-barb.png)

Generates wind barbs for your meteorological visualizations in a dead simple way.

This library is fully customizable, from colors to bars and triangle angle.

## How to use?

```bash
npm install --save d3-wind-barbs
```

```typescript
const windBarb = new D3WindBarb(
  40 /* wind speed in knots */,
  135 /* wind direction angle */
).draw();
```

Click [here](https://ilsanchez.github.io/d3-wind-barbs/) to see the full documentation.

Or [here](https://stackblitz.com/edit/d3-wind-barbs-playground?file=index.tsx) to play with it in Stackblitz
