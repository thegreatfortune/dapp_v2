import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface Props {
  targetTimestamp: number // 目标时间戳（单位秒）
}

function Countdown(props: Props) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = dayjs().unix()
      const remainingSeconds = Math.max(props.targetTimestamp - now, 0)

      const days = Math.floor(remainingSeconds / 86400)
      const hours = Math.floor((remainingSeconds % 86400) / 3600)
      const minutes = Math.floor(((remainingSeconds % 86400) % 3600) / 60)
      const seconds = Math.floor((((remainingSeconds % 86400) % 3600) % 60))

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
      })

      if (remainingSeconds === 0)
        clearInterval(intervalId)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [props.targetTimestamp])

  return (
    <span className='flex'>
      {/* 距离结束还有 {timeRemaining.days} 天, {timeRemaining.hours} 小时,{' '}
      {timeRemaining.minutes} 分钟，{timeRemaining.seconds} 秒。 */}

      <span className='text-14 font-400'>
      Fundraising countdown
      </span>
      <div className="w8"></div>
      <span className='text-16 c-#FDB600'>
        {timeRemaining.days}day {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
      </span>

    </span>
  )
}

export default Countdown
