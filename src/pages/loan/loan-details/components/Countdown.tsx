import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface Props {
  targetTimestamp: number // 目标时间戳（单位秒）
}

function Countdown(props: Props) {
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = dayjs().unix()
      const remainingSeconds = Math.max(props.targetTimestamp - now, 0)

      setSecondsRemaining(remainingSeconds)

      if (remainingSeconds === 0)
        clearInterval(intervalId)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [props.targetTimestamp])

  return (
    <div>
      距离结束还有 {Math.floor(secondsRemaining / 86400)} 天,
      {Math.floor((secondsRemaining % 86400) / 3600)} 小时,
      {Math.floor(((secondsRemaining % 86400) % 3600) / 60)} 分钟，
      {Math.floor((((secondsRemaining % 86400) % 3600) % 60))} 秒。
    </div>
  )
}

export default Countdown
