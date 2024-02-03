import { init } from 'klinecharts'

// import { ethers } from 'ethers'
// import { sortBy, uniqBy } from 'lodash-es'
import type { Models } from '@/.generated/api/models'

export function createKLine(data: Models.UserPortfolioVo[]) {
  // TODO 时区
  const chart = init('KLineContainer')
  chart?.setStyles({
    grid: {
      // show: true,
      horizontal: {
        // show: true,
        size: 1,
        color: '#EDEDED',
        // style: 'dashed',
        dashedValue: [2, 2],
      },
      vertical: {
        // show: true,
        size: 1,
        color: '#EDEDED',
        // style: 'dashed',
        dashedValue: [2, 2],
      },
    },
    candle: {
      // type: 'candle_solid',
      // 蜡烛柱
      bar: {
        upColor: '#2DC08E',
        downColor: '#F92855',
        noChangeColor: '#888888',
        upBorderColor: '#2DC08E',
        downBorderColor: '#F92855',
        noChangeBorderColor: '#888888',
        upWickColor: '#2DC08E',
        downWickColor: '#F92855',
        noChangeWickColor: '#888888',
      },
      area: {
        lineSize: 2,
        lineColor: '#2196F3',
        value: 'close',
        backgroundColor: [{
          offset: 0,
          color: 'rgba(33, 150, 243, 0.01)',
        }, {
          offset: 1,
          color: 'rgba(33, 150, 243, 0.2)',
        }],
      },
    },
  })
  const list: { timestamp: number; open: number; high: number; low: number; close: number }[] = []
  data.map((e) => {
    const item = {
      timestamp: e.createDate! * 1000,
      open: 5 + Math.random() * 10,
      high: 10 + Math.random() * 10,
      low: 3 + Math.random() * 10,
      close: 8.5 + Math.random() * 10,
    }
    list.push(item)
    return true
  })

  // const uniqueAndSortedData = sortBy(uniqBy(list, 'timestamp'), 'timestamp')
  // console.log(1111, uniqueAndSortedData)
  // console.log('%c [ uniqueAndSortedData ]-19', 'font-size:13px; background:#19f670; color:#5dffb4;', uniqueAndSortedData)
  // console.log(2222, uniqueAndSortedData.splice(0, 10))
  chart?.applyNewData(list.splice(0, 10))

  function setTimezone(timezone: string) {
    chart?.setTimezone(timezone)
  }

  // 以下仅仅是为了协助代码演示，在实际项目中根据情况进行调整。
  // The following is only for the purpose of assisting in code demonstration, and adjustments will be made according to the actual situation in the project.
  const container = document.getElementById('container')
  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'button-container'
  const items = [
    { key: 'Asia/Shanghai', text: '上海-Shanghai' },
    { key: 'Europe/Berlin', text: '柏林-Berlin' },
    { key: 'America/Chicago', text: '芝加哥-Chicago' },
  ]
  items.forEach(({ key, text }) => {
    const button = document.createElement('button')
    button.innerText = text
    button.addEventListener('click', () => {
      setTimezone(key)
    })
    buttonContainer.appendChild(button)
  })
  container?.appendChild(buttonContainer)
}
