import Router from './router'

const infoSet: Router = {
  'path': '/infoSet',
  'icon': 'infoSet',
  'name': '信息设置',
  'children': [
    {
      'path': '/shipInfo',
      'name': '船舶信息'
    },
    {
      'path': '/bridegeInfo',
      'name': '桥梁信息'
    }
  ]
}
export default infoSet