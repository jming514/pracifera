import dynamic from 'next/dynamic'
import React from 'react'

type Props = {
   children: React.ReactNode
}

const NoSSRWrapper: React.FC<Props> = (props)  => (
  <>{props.children}</>
)

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false
})