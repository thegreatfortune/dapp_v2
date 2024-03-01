import { useRoutes } from 'react-router-dom'
import routes from './routes'
import { RouterBeforeEach } from './routes/guard/RouterBeforeEach'

const App = () => {
  const ElementRouter = useRoutes(routes)
  return (
    <div>
      <RouterBeforeEach>
        {ElementRouter}
      </RouterBeforeEach>
    </div>
  )
}

export default App
