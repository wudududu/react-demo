import * as React from 'react'

const style = require('./eleMap.css')

import Map from '../../static/mapdemo.js'

import LefrRight from '../../components/left-right/index'

import { getLine } from '../../apis/sailTrail.js'

const left = <div className={style.tree}><p>机构树</p></div>
const right = <div id={style['map-box']}></div>

interface Props {
  display: string
}
class EleMap extends React.Component<Props, object> {
  constructor(props: Props) {
    super(props)
    this.state = {
      map: null
    }
  }
  componentDidMount() {
    console.log('挂载')
    // 挂载地图
    this.setState({
      map: new Map(style['map-box'], [113.6139106750,22.7701668869])
    })
    // axios测试
    getLine({Id: '5c78a13bba51ce47484ef3b000000015'}).then((res: object) => {
      debugger
    })
  }
  componentWillUnmount() {
    // 保存状态信息
  }
  public render() {
    return (
      <LefrRight left={left} right={right} display={this.props.display}></LefrRight>
    )
  }
}

export default EleMap