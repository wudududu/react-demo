// 初始化地图控件
async function initMap () {
  // let self = this
  // this.map.plugin(["AMap.ToolBar"], function () {
  //   self.map.addControl(new AMap.ToolBar({
  //     visible: true
  //   }));
  // });
  // if (location.href.indexOf('&guide=1') !== -1) {
  //   this.map.setStatus({
  //       scrollWheel: false
  //   })
  // }
  var scale, toolBar, overView
  const self = this
  const init = function () {
    scale = new AMap.Scale({
      visible: true
    })
    toolBar = new AMap.ToolBar({
      visible: true
    })
    overView = new AMap.OverView({
      visible: true
    })
    self.map.addControl(scale)
    self.map.addControl(toolBar)
    self.map.addControl(overView)
    console.log('over')
  }
  if (!AMap.Scale && !AMap.ToolBar && !AMap.OverView) {
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.OverView'], function () {
      init()
    })
  } else {
    init()
  }
}
// createMap('container', [112.744248, 28.157664])

// 信息窗体

// 点标记
async function pointMark (pointArr, infoArr = [], markCallback = function () {}, cb = function () {}) {
  const angle = 75
  this.singleMark = {} // 为单点change做准备
  this.pointArr = pointArr // 为区域查询做数据存储
  if (this.markers) {
    this.map.remove(this.markers)
  }
  if (this.cluster) {
    this.cluster.clearMarkers() // 清空
  }

  const tempArr = []
  const self = this
  const infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(20, -22),
    map: this.map
  })
  const markMachine = function (arr) {
    const temptemp = []
    for (let i = 0; i < arr.length; i++) {
      const content = document.createElement('div')
      // const imgBox = document.createElement('div')
      const img = document.createElement('img')
      // const p = document.createElement('p')
      if (arr[i].type === 'camera') {
        if (arr[i].status === 'on') {
          img.src = '../static/image/icons/icon_Cam.png'
        } else {
          img.src = '../static/image/icons/icon_Cam_off.png'
        }
      } else {
        img.src = '../static/image/icons/icon_c2.png'
      }
      // img.src = 'static/icons/new_direction.png'
      // img.style.cssText += ';width: 24px; vertical-align: text-top'
      // p.innerText = arr[i].PlateNumber // 车牌号
      // p.style.cssText += ';margin:0px;padding:2px;font-size:10px;background-color:#fff;white-space:nowrap;box-shadow:3px 0px 7px rgba(0, 0, 0, 0.35)'
      content.appendChild(img)
      // content.appendChild(p)
      // img.style.transform = `rotate(${angle}deg)` // 设定角度
      // content.style.textAlign = 'center'

      const marker = new AMap.Marker({
        position: arr[i].Coordinate, // --
        content: content,
        // content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>'
        map: self.map
      })
      if (infoArr.length > 0) {
        marker.content = infoArr[i]
      }
      // marker.carId = carId, 传递车的id用于数据查询
      marker.id = arr[i].id
      marker.cameraType = arr[i].cameraType
      marker.cameraName = arr[i].cameraName
      marker.on('click', function (e) {
        // self.map.setZoomAndCenter(20, e.target.getPosition())
        markCallback(e)
      })
      marker.on('mouseover', function (e) {
        if (infoArr.length > 0) {
          infoWindow.setContent(e.target.content.join('<br/>'))
          infoWindow.open(self.map, e.target.getPosition())
        }
      })
      temptemp.push(marker)
      tempArr.push(marker)
      self.singleMark[arr[i].id] = marker
    }
    if (AMap.MarkerClusterer) {
      if (self.cluster) {
        self.cluster.addMarkers(temptemp)
      }
    } else {
      AMap.plugin('AMap.MarkerClusterer', function () {
        self.cluster = new AMap.MarkerClusterer(self.map, tempArr, { gridSize: 80, maxZoom: 8 })
      })
    }
    self.markers = tempArr
    cb(tempArr.length, pointArr.length)
  }
  if (pointArr.length > 1000) {
    const len = Math.ceil(pointArr.length / 1000)
    for (let j = 0; j < len; j++) {
      setTimeout(function () {
        markMachine(pointArr.slice(j * 1000, j * 1000 + 1000))
      }, j * 1000)
    }
  } else {
    markMachine(pointArr)
  }
}
// 单点更新
function updateOneP (p) {
  if (this.singleMark[p.Vehicle]) {
    this.singleMark[p.Vehicle].setPosition([p.Longitude, p.Latitude])
    // console.warn(this.singleMark[p.Vehicle])
    this.singleMark[p.Vehicle].ue.content.childNodes[0].style.transform = `rotate(${p.Direction}deg)`
  }
}
// pointMark(testArr, infoTest);

// 区域选择功能
// 画形状
function drawShape (type, shape, callback = function () {}, clean = false) { // 形状，以及坐标
  console.log(callback)
  if (this.mouseTool) {
    this.mouseTool.close(true) // 清除上一次画的
  }
  this.mouseTool = new AMap.MouseTool(this.map)
  const self = this
  if (type === 'query') {
    const draw = AMap.event.addListener(this.mouseTool, 'draw', function (e) {
      console.log(e)
      const path = e.obj.getPath()
      const result = searchShape.apply(self, [path])
      callback(result)
      // 移除事件
      self.mouseTool.close() // 关闭
    })
  } else {
    AMap.event.addListener(this.mouseTool, 'draw', function (e) {
      if (e.obj.CLASS_NAME === 'AMap.Marker') {
        callback(e.obj.ue.position)
      } else {
        callback(e.obj.getPath())
      }
      self.mouseTool.close()
      if (clean) self.mouseTool.close(true)
    })
  }
  if (shape === 'circle') {
    this.mouseTool.circle()
  } else if (shape === 'polygon') {
    this.mouseTool.polygon()
  } else if (shape === 'point') {
    this.mouseTool.marker({ offset: new AMap.Pixel(-14, -11) })
  } else if (shape === 'rect') {
    this.mouseTool.rectangle()
  } else {
    this.mouseTool.polyline()
  }
}

// 区域查询
function searchShape (path) {
  // const result = this.pointArr.filter(item => { // 遍历在环内的数据
  //   return AMap.GeometryUtil.isPointInRing(item, path)
  // })
  const result = this.markers.filter(item => {
    const position = item.ue.position
    return AMap.GeometryUtil.isPointInRing(position, path)
  })
  console.log(result)
  return result
}

// 生成轨迹
function trail (lineArr) {
  if (this.regularTrail) {
    this.map.remove(this.regularTrail)
  }
  // 生成轨迹
  this.regularTrail = new AMap.Polyline({
    map: this.map,
    path: lineArr,
    strokeColor: '#000000', // 线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 5 // 线宽
    // strokeStyle: "solid"  //线样式
  })
  this.map.setFitView()
}
// 轨迹回放
function createTrail (lineArr, callback = function () {}) {
  if (this.polyline) {
    this.map.remove(this.polyline)
    this.markerStart.setMap(null)
    this.markerStart = null
    this.markerEnd.setMap(null)
    this.markerEnd = null
    this.markerCar.setMap(null)
    this.markerCar = null
  }
  this.markerStart = new AMap.Marker({ // 开始图标
    map: this.map,
    position: lineArr[0],
    // icon: 'https://webapi.amap.com/images/car.png',
    icon: new AMap.Icon({
      size: new AMap.Size(37, 44),
      image: 'static/icons/icon_start.png'
      // imageOffset: new AMap.Pixel(0, 5)
    }),
    offset: new AMap.Pixel(-18.5, -44),
    autoRotation: true
  })
  this.markerEnd = new AMap.Marker({ // 结束图标
    map: this.map,
    position: lineArr[lineArr.length - 1],
    // icon: 'https://webapi.amap.com/images/car.png',
    icon: new AMap.Icon({
      size: new AMap.Size(37, 44),
      image: 'static/icons/icon_end.png'
      // imageOffset: new AMap.Pixel(0, 5)
    }),
    offset: new AMap.Pixel(-18.5, -44),
    autoRotation: true
  })
  // 计算初始角度
  const angle = this.calcAngle(lineArr[0], lineArr[1])
  console.log(angle)
  this.markerCar = new AMap.Marker({ // 车图标
    map: this.map,
    position: lineArr[0],
    // icon: 'https://webapi.amap.com/images/car.png',
    icon: new AMap.Icon({
      size: new AMap.Size(48, 48),
      image: 'static/icons/new_direction.png'
      // imageOffset: new AMap.Pixel(-5, 5)
    }),
    offset: new AMap.Pixel(-15, -20),
    angle,
    autoRotation: true
  })
  // 生成轨迹
  this.polyline = new AMap.Polyline({
    map: this.map,
    path: lineArr,
    strokeColor: '#409EFF', // 线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 5 // 线宽
    // strokeStyle: "solid"  //线样式
  })
  var passedLine = new AMap.Polyline({
    map: this.map,
    strokeColor: '#fff',
    strokeWeight: 2
  })
  this.markerCar.on('moving', (e) => {
    // console.log(lineArr)
    if (e.passedPath.length === lineArr.length) {
      const length = lineArr.length
      if (e.passedPath[length - 1].lat === lineArr[length - 1].lat && e.passedPath[length - 1].lng === lineArr[length - 1].lng) {
        callback(length + 1)
      } else {
        callback(e.passedPath.length)
      }
    } else {
      callback(e.passedPath.length)
    }
    passedLine.setPath(e.passedPath)
  })
  this.map.setFitView()
  return { // 返回一个操作对象
    playTrail: (v) => {
      this.markerCar.moveAlong(lineArr, v)
    },
    pauseTrail: () => {
      this.markerCar.pauseMove()
    },
    resumeTrail: () => {
      this.markerCar.resumeMove()
    },
    stopTrail: () => {
      this.markerCar.stopMove()
    }
  }
}
// 地理位置解析
async function regeocoder (lnglat) {
  // 先进行坐标转换
  // await this.convertXY(lnglat).then(data => {
  //   lnglat = data
  // })
  let geocoder
  const self = this
  if (AMap.Geocoder) {
    geocoder = new AMap.Geocoder({ batch: true, extensions: 'all' }) // 可设置批量
  } else {
    AMap.plugin('AMap.Geocoder', function () {
      geocoder = new AMap.Geocoder({ batch: true, extensions: 'all' }) // 可设置批量
    })
  }
  // const geocoder = new AMap.Geocoder({ batch: true, extensions: 'all' }) // 可设置批量
  // 批量一次最多支持20对
  if (lnglat.length > 20) {
    const len = Math.ceil(lnglat.length / 20)
    const promiseArr = []
    for (let i = 0; i < len; i++) {
      const temp = new Promise((resolve, reject) => {
        geocoder.getAddress(lnglat.slice(i * 20, i * 20 + 20), function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            const tempArr = []
            result.regeocodes.forEach(item => {
              const tempObj = {
                Address: item.formattedAddress,
                ProvinceAndCity: item.addressComponent.province + item.addressComponent.city,
                Road: item.addressComponent.street,
                Nearby: item.pois[0] ? item.pois[0].name : '无'
              }
              tempArr.push(tempObj)
            })
            resolve(tempArr)
          } else {
            reject(result.info)
          }
        })
      })
      promiseArr.push(temp)
    }
    return Promise.all(promiseArr).then((data) => {
      data = data.reduce((a, b) => {
        return a.concat(b)
      })
      return data
    })
  } else {
    return new Promise((resolve, reject) => {
      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result)
          const tempArr = []
          result.regeocodes.forEach(item => {
            const tempObj = {
              Address: item.formattedAddress,
              ProvinceAndCity: item.addressComponent.province + item.addressComponent.city,
              Road: item.addressComponent.street,
              Nearby: item.pois[0] ? item.pois[0].name : '无'
            }
            tempArr.push(tempObj)
          })
          resolve(tempArr)
          // resolve([
          //   result.regeocode.addressComponent.province + result.regeocode.addressComponent.city,
          //   result.regeocode.addressComponent.city,
          //   result.regeocode.addressComponent.street,
          //   result.regeocode.pois[0]]) // 地址描述
        } else {
          reject(result.info)
        }
      })
    })
  }
}
// regeocoder([116.396574, 39.992706])

// 坐标转换
function convertXY (data) {
  if (data.length > 30) { // 单次处理上限为40，这里用30
    const len = Math.ceil(data.length / 30)
    const promiseArr = []
    for (let i = 0; i < len; i++) {
      const temp = new Promise((resolve, reject) => {
        AMap.convertFrom(data.slice(i * 30, i * 30 + 30), 'gps', function (status, result) {
          if (result.info == 'ok') {
            resolve(result.locations)
          }
        })
      })
      promiseArr.push(temp)
    }
    return Promise.all(promiseArr).then((data) => {
      data = data.reduce((a, b) => {
        return a.concat(b)
      })
      return data
    })
  } else {
    return new Promise((resolve, reject) => {
      AMap.convertFrom(data, 'gps', function (status, result) {
        if (result.info == 'ok') {
          resolve(result.locations)
        }
      })
    })
  }
}
// 计算两点之间的角度, 用于旋转车辆图标指向
function calcAngle (start, end) {
  const p_start = this.map.lngLatToContainer(start)
  const p_end = this.map.lngLatToContainer(end)
  const diff_x = p_end.x - p_start.x
  const diff_y = p_end.y - p_start.y
  return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI)
}
// 测距
function distance (path) {
  return AMap.GeometryUtil.distanceOfLine(path)
}
// window.map = null
// 构造函数
function Map (ctner, center) {
  const self = this
  let time = 0
  const init = function () {
    self.map = new AMap.Map(ctner, { // map需为全局变量
      resizeEnable: true,
      zoom: 11,
      center: center
    })
    self.mouseTool = new AMap.MouseTool(self.map)
    const features = ['bg', 'road', 'building']
    self.map.setFeatures(features)
  }
  if (AMap) {
    init()
  } else {
    const timer = setInterval(function () {
      if (AMap) {
        init()
        clearInterval(timer)
      } else if (time === 10) {
        alert('地图加载失败，请检查网络情况，或刷新')
      }
      time++
    }, 500)
  }
}
Map.prototype.pointMark = pointMark
Map.prototype.drawShape = drawShape
Map.prototype.createTrail = createTrail
Map.prototype.initMap = initMap
Map.prototype.convertXY = convertXY
Map.prototype.regeocoder = regeocoder
Map.prototype.calcAngle = calcAngle
Map.prototype.updateOneP = updateOneP
Map.prototype.distance = distance
Map.prototype.trail = trail

export default Map
