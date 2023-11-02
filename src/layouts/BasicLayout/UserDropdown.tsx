import { Dropdown, type MenuProps, Space } from 'antd'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        My Loan
      </a>

    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        My Follow
      </a>

    ),
  },
]

const UserDropdown = () => {
  return (<Dropdown menu={{ items }} placement="bottomRight" >
    <a onClick={e => e.preventDefault()}>
      <div>
        User
      </div>
    </a>
  </Dropdown>)
}

export default UserDropdown
