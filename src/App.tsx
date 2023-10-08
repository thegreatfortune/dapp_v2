import { useRoutes } from 'react-router-dom'
import './App.css'

import routes from './routes'

function App() {
  const ElementRouter = useRoutes(routes)
  return (
    <>
     <div>
     555
     {ElementRouter}
     </div>
    </>
  )
}

export default App
