import React from 'react'
import { PageContainer, ProLayout } from '@ant-design/pro-components'
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
    // Add more menu items as needed
  ]

  return (
    <ProLayout
      menuDataRender={() => menuData}
      location={{ pathname: '/' }}
      layout="top" // 设置为 'top' 以变为顶部导航栏
      title="CoinWave"
      logo={logo}
    >
      <PageContainer
        header={{
          title:'',
          breadcrumb: {}, // 添加面包屑导航配置
        }}
      >
        {props.children}
      </PageContainer>
    </ProLayout>
  )
}

export default BasicLayout
