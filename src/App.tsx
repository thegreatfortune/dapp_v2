import { useRoutes } from 'react-router-dom'
import routes from './routes'

function App() {
  const ElementRouter = useRoutes(routes)

  return (
    <div>
      {ElementRouter}
    </div>
  )
}

export default App
