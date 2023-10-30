import { PageContainer, ProLayout } from '@ant-design/pro-components'
import { Button, Input, Result, Tag } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import logo from '@/assets/uniswap.svg'

const defaultProps = {
  routes: [
    {
      path: '/welcome',
      name: 'COinWave',
      icon: logo,
      component: './Welcome',
    },
  ],
}

export default () => {
  return (
    <>
      <ProLayout
        route={defaultProps}
        location={{ pathname: '/' }}
        layout="top"
        title = 'COinWave'
        logo ={logo}
        headerRender={false}
        onMenuHeaderClick={e => console.log(e)}
        actionsRender={() => [
          <ConnectButton />,
        ]}
        avatarProps={{
          icon: logo,
        }}
      >
        <PageContainer
          header={{
            style: {
              padding: '8px 16px',
              backgroundColor: '#fff',
              position: 'fixed',
              top: 0,
              width: '100%',
              left: 0,
              zIndex: 999,
              boxShadow: '0 2px 8px #f0f1f2',
            },
          }}
          style={{
            paddingBlockStart: 48,
          }}
          extra={[
            <ConnectButton />,
          ]}
        >
          <div
            style={{
              height: '120vh',
              minHeight: 600,
            }}
          >
            <Result
              status="404"
              style={{
                height: '100%',
                background: '#fff',
              }}
              title="Hello World"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<Button type="primary">Back Home</Button>}
            />
          </div>
        </PageContainer>
      </ProLayout>
    </>
  )
}
