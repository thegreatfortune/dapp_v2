import { Carousel } from 'antd'

interface CardProps {
  imageSrc: string
  title: string
  description: string
}

const TransparentCard: React.FC<CardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className="bg-transparent border-gradient p-4 max-w-xs mx-auto">
      <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc})` }}></div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  )
}
function CardsContainer() {
  return (<div>
    <div className='flex justify-between items-center'>
      <div>
        <h2 className='font-size-8.5'>
          title
        </h2>
      </div>

      <div className='font-size-6'>
        view all {'>>'}
      </div>
    </div>

    <div className='flex flex-wrap'>
      {
        Array.from(Array.from({ length: 10 }).keys()).map(() => <div className="w-1/4" > <TransparentCard imageSrc='https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5' title='555' description='62516' /></div>)
      }
    </div>

  </div>)
}

function Index() {
  return (
    <div className="w-full mt19">
      <Carousel autoplay>
        <div>
          <img
            src="https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5"
            alt="Image 1"
            className="w-full h70 object-cover"
          />
        </div>
      </Carousel>

      <CardsContainer />
    </div>
  )
}

export default Index
