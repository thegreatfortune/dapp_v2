import dayjs from 'dayjs'
import { ColorType, createChart } from 'lightweight-charts'
import type { Models } from '@/.generated/api/models'

export function createKLine(data: Models.UserPortfolioVo[]) {
  // Lightweight Charts™ Example: Tracking Tooltip
// https://tradingview.github.io/lightweight-charts/tutorials/how_to/tooltips

  const chartOptions = { layout: { textColor: 'white', background: { type: ColorType.Solid, color: '#151823' } } }

  /** @type {import('lightweight-charts').IChartApi} */
  const chart = createChart(document.getElementById('KLineContainer')!, chartOptions)

  chart.applyOptions({
    rightPriceScale: {
      scaleMargins: {
        top: 0.3, // leave some space for the legend
        bottom: 0.25,
      },
    },
    crosshair: {
      // hide the horizontal crosshair line
      horzLine: {
        visible: false,
        labelVisible: false,
      },
      // hide the vertical crosshair label
      vertLine: {
        labelVisible: false,
      },
    },
    // hide the grid lines
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        visible: false,
      },
    },
  })

  const series = chart.addAreaSeries({
    topColor: '#19204e',
    bottomColor: '#151927',
    lineColor: '#0675f2',
    lineWidth: 2,
    crossHairMarkerVisible: false,
  })

  const list = data.map(e => ({
    time: e.createDate * 1000,
    value: Number(e.uPrice),
  })).sort((a, b) => a.time - b.time)

  const uniqueArray = list.filter(
    (obj, index, self) =>
      index
      === self.findIndex(
        o => o.time === obj.time,
      ),
  )

  console.log('%c [ uniqueArray ]-63', 'font-size:13px; background:#23f5b5; color:#67fff9;', uniqueArray)

  series.setData(uniqueArray)

  const container = document.getElementById('KLineContainer')

  const toolTipWidth = 80
  const toolTipHeight = 80
  const toolTipMargin = 15

  // Create and style the tooltip html element
  const toolTip = document.createElement('div')
  toolTip.style = 'width: 130px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, \'Trebuchet MS\', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;'
  toolTip.style.background = 'white'
  toolTip.style.color = 'black'
  toolTip.style.borderColor = 'rgba( 38, 166, 154, 1)'
  container?.appendChild(toolTip)

  // update tooltip
  chart.subscribeCrosshairMove((param) => {
    if (
      param.point === undefined
		|| !param.time
		|| param.point.x < 0
		|| param.point.x > container.clientWidth
		|| param.point.y < 0
		|| param.point.y > container.clientHeight
    ) {
      toolTip.style.display = 'none'
    }
    else {
      // time will be in the same format that we supplied to setData.
      // thus it will be YYYY-MM-DD
      const dateStr = dayjs(param.time).format('YYYY-MM-DD HH:mm:ss')

      toolTip.style.display = 'block'
      const data = param.seriesData.get(series)
      const price = data.value !== undefined ? data.value : data.close
      toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 20px; color: ${'black'}">
			${price}
			</div><div style="color: ${'black'};">
			${dateStr}
			</div>`

      const y = param.point.y
      let left = param.point.x + toolTipMargin
      if (left > container.clientWidth - toolTipWidth)
        left = param.point.x - toolTipMargin - toolTipWidth

      let top = y + toolTipMargin
      if (top > container.clientHeight - toolTipHeight)
        top = y - toolTipHeight - toolTipMargin

      toolTip.style.left = `${left}px`
      toolTip.style.top = `${top}px`
    }
  })

  chart.timeScale().fitContent()
}
