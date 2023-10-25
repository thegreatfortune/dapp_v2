import { useRoutes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import routes from './routes'
import { useLanguageSwitch } from './hooks/useLanguageSwitch'

function App() {
  const ElementRouter = useRoutes(routes)

  const { currentLanguageLib } = useLanguageSwitch()

  return (
    <ConfigProvider locale={currentLanguageLib}>
      <div>
        {ElementRouter}
      </div>
    </ConfigProvider>
  )
}

export default App
