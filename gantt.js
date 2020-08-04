var demoData = [
  { id: 59, pName: '项目1', name: '任务1', startTime: '2020-06-18 15:38:00', endTime: '2020-06-20 16:11:00' }
  , { id: 37, pName: '项目1', name: '任务2', startTime: '2020-05-31 17:08:00', endTime: '2020-06-22 16:27:00' }
  , { id: 44, pName: '项目1', name: '任务3', startTime: '2020-06-04 17:37:00', endTime: '2020-06-14 08:41:00' }
  , { id: 54, pName: '项目2', name: '任务4', startTime: '2020-06-13 07:03:00', endTime: '2020-06-18 07:25:00' }
  , { id: 58, pName: '项目2', name: '任务5', startTime: '2020-06-17 15:05:00', endTime: '2020-06-22 08:06:00' }
  , { id: 50, pName: '项目3', name: '任务6', startTime: '2020-06-08 17:14:00', endTime: '2020-06-18 07:25:00' }
  , { id: 55, pName: '项目3', name: '任务7', startTime: '2020-06-13 11:23:00', endTime: '2020-06-15 10:33:00' }
  , { id: 57, pName: '项目3', name: '任务8', startTime: '2020-06-17 06:17:00', endTime: '2020-06-18 05:59:00' }
  , { id: 53, pName: '项目3', name: '任务9', startTime: '2020-06-12 01:23:00', endTime: '2020-06-18 06:05:00' }
  , { id: 56, pName: '项目3', name: '任务10', startTime: '2020-06-17 04:24:00', endTime: '2020-06-18 06:05:00' }
  , { id: 52, pName: '项目4', name: '任务11', startTime: '2020-06-11 11:59:00', endTime: '2020-06-11 17:59:00' }
  , { id: 1, pName: '项目4', name: '任务12', startTime: '2020-06-10 18:24:00', endTime: '2020-06-11 11:59:00' }
  , { id: 43, pName: '项目5', name: '任务13', startTime: '2020-06-03 13:28:00', endTime: '2020-06-09 11:58:00' }
]

renderGantt(demoData)

// 渲染甘特图
function renderGantt(CharData) {
  if (!CharData || !CharData.length) {
    return
  }
  $('.gantt').html('<div class="chartGT"><div class="GT-left-box"><div class="seize"></div></div><div class="GT-body-box"><div class="top-scale"></div></div></div>')
  // 最早和最晚时间
  var mustStartTime = 10000000000000
  var mustEndTime = 0
  // 最早和最晚时间标准格式
  var mustStartDate = ''
  var mustEndDate = ''
  // 总天数
  var middleDayNum = 0


  for (var i = 0; i < CharData.length; i++) {
    // 获取最大、最小时间
    mustStartTime = new Date(CharData[i].startTime).getTime() < mustStartTime ? new Date(CharData[i].startTime).getTime() : mustStartTime
    mustEndTime = new Date(CharData[i].endTime).getTime() > mustEndTime ? new Date(CharData[i].endTime).getTime() : mustEndTime
  }
  mustStartTime = new Date(mustStartTime).setHours(0, 0, 0, 0)
  mustEndTime = new Date(mustEndTime).setHours(23, 59, 59, 999)
  mustStartDate = new Date(mustStartTime)
  mustEndDate = new Date(mustEndTime)
  middleDayNum = (mustEndTime - mustStartTime + 1) / (24 * 60 * 60 * 1000)

  // var

  var middleDay = getAll(mustStartDate.getFullYear() + '-' + (mustStartDate.getMonth() + 1) + '-' + mustStartDate.getDate(), mustEndDate.getFullYear() + '-' + (mustEndDate.getMonth() + 1) + '-' + mustEndDate.getDate())
  middleDay.unshift(mustStartDate.getFullYear() + '-' + (mustStartDate.getMonth() + 1) + '-' + mustStartDate.getDate())
  middleDay.push(mustEndDate.getFullYear() + '-' + (mustEndDate.getMonth() + 1) + '-' + mustEndDate.getDate())

  var obj = {}
  for (var i = 0; i < middleDay.length; i++) {
    var st = middleDay[i].split('-')[0] + '-' + middleDay[i].split('-')[1]
    if (!obj[st]) {
      obj[st] = []
    }
    obj[st].push(middleDay[i].split('-')[2])
  }
  for (var key in obj) {
    var str = '<div class="lg-scale" style="width:' + (obj[key].length / middleDayNum * 100) + '%"><div class="scale-top"><p>' + key + '</p></div><div class="scale-bottom">'
    for (var i = 0; i < obj[key].length; i++) {
      str += '<p>' + obj[key][i] + '</p>'
    }
    str += '</div></div>'
    $('.top-scale').append(str)
  }
  var data = {}
  for (var i = 0; i < CharData.length; i++) {
    if (!data[CharData[i].pName]) {
      data[CharData[i].pName] = []
    }
    if (i == 0) {
      data[CharData[i].pName][0] = []
      data[CharData[i].pName][0].push({
        "name": CharData[i].name,
        "start": new Date(CharData[i].startTime),
        "end": new Date(CharData[i].endTime),
        "pName": CharData[i].pName,
        "startPos": (new Date(CharData[i].startTime).getTime() - mustStartTime) / (mustEndTime - mustStartTime),
        "endPos": (mustEndTime - new Date(CharData[i].endTime).getTime()) / (mustEndTime - mustStartTime)
      })
    } else {
      var eleFlag = false
      for (var j = 0; j < data[CharData[i].pName].length; j++) {
        var itemFlag = false
        for (var k = 0; k < data[CharData[i].pName][j].length; k++) {
          var oS = new Date(data[CharData[i].pName][j][k].start).getTime()
          var oE = new Date(data[CharData[i].pName][j][k].end).getTime()
          var nS = new Date(CharData[i].startTime).getTime()
          var nE = new Date(CharData[i].endTime).getTime()
          if ((nS <= oS && nE >= oS) || (nS <= oE && nS >= oS)) {
            itemFlag = true

          }
        }
        if (!itemFlag) {

          data[CharData[i].pName][j].push({
            "name": CharData[i].name,
            "start": new Date(CharData[i].startTime),
            "end": new Date(CharData[i].endTime),
            "pName": CharData[i].pName,
            "startPos": (new Date(CharData[i].startTime).getTime() - mustStartTime) / (mustEndTime - mustStartTime),
            "endPos": (mustEndTime - new Date(CharData[i].endTime).getTime()) / (mustEndTime - mustStartTime)
          })
          eleFlag = true
        }

      }
      if (!eleFlag) {
        data[CharData[i].pName].push([{
          "name": CharData[i].name,
          "start": new Date(CharData[i].startTime),
          "end": new Date(CharData[i].endTime),
          "pName": CharData[i].pName,
          "startPos": (new Date(CharData[i].startTime).getTime() - mustStartTime) / (mustEndTime - mustStartTime),
          "endPos": (mustEndTime - new Date(CharData[i].endTime).getTime()) / (mustEndTime - mustStartTime)
        }])
        eleFlag = true
      }
    }

  }
  console.log(data)
  for (var key in data) {
    $('.GT-left-box').append('<p class="device-name" style="height:' + (data[key].length * 34 + 7) + 'px"><span>' + key + '</span></p>')
    var str = '<div class="item-bar" style="height:' + (data[key].length * 34 + 7) + 'px">'
    for (var i = 0; i < data[key].length; i++) {
      for (var j = 0; j < data[key][i].length; j++) {
        str += '<p data-info="' + data[key][i][j].name + '" style="left:' + data[key][i][j].startPos * 100 + '%;right:' + data[key][i][j].endPos * 100 + '%;top:' + (i * 32 + 7) + 'px">' + data[key][i][j].name + '</p>'
      }

    }
    str += '</div>'
    $('.GT-body-box').append(str)
  }
}

function getAll(begin, end) {
  var ab = begin.split("-");
  var ae = end.split("-");
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  var arr = []
  for (var k = unixDb + 24 * 60 * 60 * 1000; k < unixDe;) {

    var s = '';
    s += new Date(parseInt(k)).getFullYear() + '-';// 获取年份。
    s += (new Date(parseInt(k)).getMonth() + 1) + "-";         // 获取月份。
    s += new Date(parseInt(k)).getDate();
    arr.push(s)
    k = k + 24 * 60 * 60 * 1000;
  }
  return arr
}
