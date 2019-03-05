import Router from './router'

const reportCenter: Router = {
  'path': '/reportCenter',
  'icon': 'reportCenter',
  'name': '报表中心',
  'children': [
    {
      'path': '/histroyAlarm',
      'name': '历史报警'
    }
  ]
}
export default reportCenter