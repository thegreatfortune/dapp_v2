import { Carousel } from 'antd'

interface CardProps {
  imageSrc: string
  title: string
  description: string
}

const TransparentCard: React.FC<CardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className="bg-transparent border-white p-4rem max-w-259 mx-auto">
      <div className="w-full h-260 bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc})` }}></div>
      <div className="mt-4">
        <h2 className="text-26 font-bold">{title}</h2>
        <p className=" text-26 mt-2">{description}</p>
      </div>
    </div>
  )
}

const CardsContainer = () => {
  return (<div>
    <div className='flex justify-between items-center h48'>
      <div>
        <h2 className='font-size-34'>
          Title
        </h2>
      </div>

      <div className='font-size-24 c-[#D2D2D2]'>
        view all {'>>'}
      </div>
    </div>

    <div className='h60 w-full'></div>

    <div className='flex flex-wrap'>
      {
        Array.from(Array.from({ length: 10 }).keys()).map(e => <div className="w-1/4" key={e} > <TransparentCard imageSrc='https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5' title='555' description='62516' /></div>)
      }
    </div>

  </div>)
}

const Index = () => {
  return (
    <div className="w-full mt76">
      <Carousel autoplay>
        <div>
          <img
            src="https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5"
            alt="Image 1"
            className="w-full h280 object-cover"
          />
        </div>
        <div>
          <img
            src="https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5"
            alt="Image 1"
            className="w-full h280 object-cover"
          />
        </div>
      </Carousel>

      <div className='h80 w-full'></div>

      <CardsContainer />

    </div>
  )
}

export default Index
