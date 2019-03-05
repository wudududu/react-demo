import * as React from 'react'
import * as ReactDOM from 'react-dom';
import Layout from '../components/Layout'
import EleMap from '../views/eleMap/eleMap'

import { HashRouter, Route, Redirect } from 'react-router-dom'

import eleMap from './eleMap'
import infoSet from './infoSet'
import reportCenter from './reportCenter'
import sailTrail from './sailTrail'

import { Menu } from 'antd';
const {SubMenu} = Menu

const menus = [eleMap, infoSet, reportCenter, sailTrail].map(m => {
  if (m.children) {
    let item = m.children.map(c => <Menu.Item key={m.path + c.path}>{c.name}</Menu.Item>)
    return <SubMenu title={m.name} key={m.path}>{item}</SubMenu>
  } else {
    return <Menu.Item key={m.path}>{m.name}</Menu.Item>
  }
})
ReactDOM.render((
  <HashRouter>
      <Layout userName="admin" menu={
          <Menu 
          theme="dark" 
          mode="inline"
          style={{backgroundColor: '#1c364b'}}
          onClick={function(obj) {
            window.location.href = '/#' + obj.key
          }}>{menus}</Menu>
      }>
        <Route exact path="/" render={() => (
          <Redirect to="/eleMap"/>
        )}/>
        <Route path="/eleMap" 
        children={({match}) => {
          return (
          <EleMap display={match ? 'block' : 'none'}></EleMap>
        )}}/>
        {/* <Route path="/world" component={world} /> */}
      </Layout>
  </HashRouter>
), document.getElementById('root'))

export default {}