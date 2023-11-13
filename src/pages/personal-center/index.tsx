import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'

const PersonalCenter = () => {
  const navigate = useNavigate()

  const navigateToHomePage = () => {
    navigate('/apply-loan')
  }

  return (
    <div>
      <Button type="primary" onClick={navigateToHomePage}>
        Apply for a loan
      </Button>

      <Button type="primary" onClick={() => navigate('/lend')}>
        Lend
      </Button>
    </div>
  )
}

export default PersonalCenter
