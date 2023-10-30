import React from 'react'
import { PageContainer, ProLayout } from '@ant-design/pro-components'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import logo from '../assets/uniswap.svg'

interface BasicLayoutProps {
  children: React.ReactNode
}

const BasicLayout: React.FC<BasicLayoutProps> = (props: any) => {
  const menuData = [
    {
      path: '/nfts',
      name: 'NFTs',
      icon: '',
    },
  ]

  return (
    <ProLayout
      menuDataRender={() => menuData}
      location={{ pathname: '/' }}
      layout="top"
      title="CoinWave"
      logo={logo}
      actionsRender={() => [
        <ConnectButton />,
      ]}
    >
      <PageContainer
        header={{
          title: '',
          breadcrumb: {},
        }}
      >
        {props.children}
      </PageContainer>
    </ProLayout>
  )
}

export default BasicLayout
