import * as React from 'react'

// import * as style from './Layout.css'
const style = require('./Layout.css')

// import { Menu } from 'antd';
import 'antd/dist/antd.css';

// const {SubMenu} = Menu
interface Props {
  userName: string,
  menu: object
}
class Layout extends React.Component<Props, object> {
  public render() {
    return(
      <div id={style.app}>
        <div className={style.top}>
          <span className={style.title}>广州水运</span>
          <span className={style.user}>{this.props.userName}</span>
        </div>
        <div className={style.bottom}>
          <div className={style['leftbox']}>
            {this.props.menu}
          </div>
          <div className={style['rightbox']}>
            {this.props.children}
          </div>
        </div>
      </div>

    )
  }
}
export default Layout