import * as React from 'react'

const style = require('./index.css')

interface Props {
  left: object,
  right: object,
  display: string
}
class LeftRight extends React.Component<Props, object> {
  public render() {
    return (
      <div className={style['left-right']} style={{display: this.props.display}}>
        <div className={style['left-box']}>
          {this.props.left}
        </div>
        <div className={style['right-box']}>
          {this.props.right}
        </div>
      </div>
    )
  }
}

export default LeftRight