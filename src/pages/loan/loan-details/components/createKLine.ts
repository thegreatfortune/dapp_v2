import { init } from 'klinecharts'
import { ethers } from 'ethers'
import { sortBy, uniqBy } from 'lodash-es'
import type { Models } from '@/.generated/api/models'

export function createKLine(data: Models.UserPortfolioVo[]) {
  // TODO 时区
  const chart = init('KLineContainer')

  const list = data.map(e => ({
    timestamp: e.createDate! * 1000,
    open: Number(ethers.formatUnits(e.uPrice ?? 0)),
    high: Number(ethers.formatUnits(e.uPrice ?? 0)),
    low: Number(ethers.formatUnits(e.uPrice ?? 0)),
    close: Number(ethers.formatUnits(e.uPrice ?? 0)),
  }))

  const uniqueAndSortedData = sortBy(uniqBy(list, 'timestamp'), 'timestamp')
  // console.log('%c [ uniqueAndSortedData ]-19', 'font-size:13px; background:#19f670; color:#5dffb4;', uniqueAndSortedData)

  chart?.applyNewData(uniqueAndSortedData.splice(0, 10))

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
