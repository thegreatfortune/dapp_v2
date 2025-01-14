import { useRoutes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import routes from './routes'
import { RouterBeforeEach } from './routes/guard/RouterBeforeEach'

const App = () => {
  const ElementRouter = useRoutes(routes)
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            borderRadiusLG: 15,
          },
          components: {
            Modal: {
              titleFontSize: 24,
            },
            List: {
              avatarMarginRight: 20,
            },
            Select: {
              borderRadiusLG: 8,
            },
          },
        }}
      >
        <RouterBeforeEach>
          {ElementRouter}
        </RouterBeforeEach>
      </ConfigProvider>
    </div>
  )
}

export default App
