import React from 'react'

/**
 *组件默认属性Hoc
 *
 * @export
 * @template P
 * @param {Partial<P>} [defaultProps]
 * @return {*}
 */
export function withDefaultProps<P = object>(defaultProps: Partial<P> = {}) {
  return function (Component: any) {
    const WrappedComponent: React.FC<P> = (props) => {
      return React.createElement(Component, {
        ...defaultProps,
        ...props,
      })
    }

    WrappedComponent.displayName = `withDefaultProps(${Component.displayName})`

    return WrappedComponent
  }
}
