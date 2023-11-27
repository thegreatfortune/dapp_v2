import { Radio } from 'antd'

const Trade = () => {
  return (<div>
    <div className='h48 flex items-center justify-between'>
      <div>
        <h2 className='font-size-34'>
          title
        </h2>
      </div>

      <Radio.Group value='All' >
        <Radio.Button value="All">All</Radio.Button>
        <Radio.Button value="LowRisk">LowRisk</Radio.Button>
        <Radio.Button value="HighRisk">HighRisk</Radio.Button>
      </Radio.Group>

    </div>

    <div className='h23 w-full'></div>

    <div className='flex flex-wrap gap-x-46 gap-y-50'>
      <div className='h125 w315 s-container'>
        777
      </div>
    </div>

  </div>)
}

export default Trade
