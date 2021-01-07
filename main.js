const db = new Dexie('NikkiDB')
db.version(1).stores({
  tracks: '&timestamp',
  sessionsTable: '&startTime'
})

Reef.debug(true)

var store = new Reef.Store({
  data: {
    startTime: null,
    distanceInMeter: 0,
    distance: 0.0,
    duration: '00:00:00',
    pace: 0,
    hr: 0,
    pauseStopBtn: 'Stop'
  }
})

var router = new Reef.Router({
  routes: [
    {
      id: 'activity',
      title: 'Activity',
      url: '/',
    },
    {
      id: 'statistics',
      title: 'Statistics',
      url: '/statistics',
    },
    {
      id: 'sessions',
      title: 'Sessions',
      url: '/sessions',
    },
    {
      id: 'settings',
      title: 'Settings',
      url: '/settings'
    }
  ]
})

var app = new Reef('#app', {
  template: function (props) {
    return `<main id="main"></main>
        <div id="bottom-nav"></div>`
  }
})

var main = new Reef('#main', {
  router: router,
  template: function (props, route) {
    return `<div id="${route.id}"></div>`
  },
  attachTo: app
})

var bottom_nav = new Reef('#bottom-nav', {
  template: function () {
    return `
        <ul>
          <li><a href="/statistics">Statistics</a></li>
          <li><a href="/">Activity</a></li>
          <li><a href="/sessions">Sessions</a></li>
        </ul>
      `
  },
  attachTo: app
})

var activity = new Reef('#activity', {
  template: function () {
    return `
      <div id="settings-icon"><span>v0.2.0</span><a href="/settings"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></a></div>
      <div id="conn">
        <div id="gps"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg></div>
        <div id="hr" onclick="connectHR(this)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></div>
        <div id="scale"><img src="scale.svg"></div>
      </div>
      <div id="btnBox"></div>
    `
  },
  attachTo: main
})

var statistics = new Reef('#statistics', {
  template: function () {
    return `statistics!`
  }
})

var sessions = new Reef('#sessions', {
  data: {
    sessionArray: null
  },
  template: function (props) {
    const divs = props.sessionArray.map((single_session) => {
      return `
      <div class="sessionCard">
        <div>
          <div class="sessionDistance">${single_session.distance} km</div>
          <div class="sessionDuration">${single_session.duration}</div>
        </div>
        <div class="sessionDate">${new Date(single_session.startTime).toLocaleDateString()}</div>
      </div>
      `
    }).join('')

    return divs
  }
})

var settings = new Reef('#settings', {
  template: function () {
    return `settings!`
  }
})

var btnBox = new Reef('#btnBox', {
  data: {
    counterContent: 'Start',
    view: 'counter'
  },
  template: function (props) {
    if (props.view == 'counter') {
      return `<span id="counter" onclick="expandBtnBox(this)">${props.counterContent}</span>`
    } else {
      return `<div id="${props.view}"></div>`
    }

    // return `${props.showCounter ? '<span id="counter">' + props.counterContent + '</span>' : '<div id="sessionStats"></div>'}`
  },
  attachTo: activity
})

var sessionStats = new Reef('#sessionStats', {
  store: store,
  template: function (props) {
    return `
      <div id="duration">
        <div class="statVal">${props.duration}</div>
        <div class="statLabel">Duration</div>
      </div>
      <div id="distance">
        <div class="statVal">${props.distance}</div>
        <div class="statLabel">Distance (m)</div>
      </div>
      <div id="pace">
        <div class="statVal">${props.pace}</div>
        <div class="statLabel">⌀ Pace (min/km)</div>
      </div>
      <div id="hr">
        <div class="statVal">${props.hr}</div>
        <div class="statLabel">HR</div>
      </div>
      <div id="pauseStopBtn" onclick="stopSession()">${props.pauseStopBtn}</div>
        `
  }
})
var finalScreen = new Reef('#finalScreen', {
  template: function (props) {
    return `
      <p>Yeaaah</p>
      <button id="submitSession" onclick="submitSession(this)">Close</button>
    `
  }
})

// Render the component
app.render()

window.addEventListener('beforeRouteUpdated', function (e) {
  switch (e.detail.current.id) {
    case 'activity':
      main.detach(activity)
      break
    case 'statistics':
      main.detach(statistics)
      break
    case 'sessions':
      main.detach(sessions)
      break
    case 'settings':
      main.detach(settings)
      break

    default:
      console.log('No route found.')
      break
  }
})

window.addEventListener('routeUpdated', function (e) {
  switch (e.detail.current.id) {
    case 'activity':
      main.attach(activity)
      break
    case 'statistics':
      main.attach(statistics)
      break
    case 'sessions':
      db.sessionsTable.reverse().toArray().then((array) => {
        sessions.data.sessionArray = array
        main.attach(sessions)
      })
      break
    case 'settings':
      main.attach(settings)
      break

    default:
      console.log('No route found.')
      break
  }

  main.render()
})

// Variables
var counter = document.getElementById('counter')

let updateDuration, getPosition, count
let startTransition = true

// Functions
function connectHR(elem) {
  navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
    .then(device => {
      console.log(device)
      return device.gatt.connect()
    })
    .then(server => {
      console.log(server)
    })
}

function getDuration() {
  const curTime = new Date()
  const diff = (curTime - store.data.startTime) / 1000

  const seconds = Math.floor(diff % 60)
  const minutes = Math.floor(diff / 60) % 60
  const hours = Math.floor(diff / 3600)

  return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`
}

function getDuration2(start, end) {
  const diff = (end - start) / 1000
  const seconds = Math.floor(diff % 60)
  const minutes = Math.floor(diff / 60) % 60
  const hours = Math.floor(diff / 3600)

  return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`
}

function getDistance(firstWP, secondWP) {
  store.data.distanceInMeter += window.geolib.getDistance(firstWP, secondWP)

  return store.data.distanceInMeter
  // return window.geolib.convertDistance(store.data.distanceInMeter, 'km')
}

function posSuccess(position) {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  const timestamp = position.timestamp

  const waypoint = {
    "latitude": latitude,
    "longitude": longitude,
    "timestamp": timestamp
  }

  if (store.data.waypoints.length != 0) {
    const lastWaypoint = store.data.waypoints[store.data.waypoints.length - 1]
    store.data.distance = getDistance(lastWaypoint, waypoint)
  }

  store.data.waypoints.push(waypoint)
}

function posError() {
  console.log('Unable to retrieve your location')
}

function submitSession(elem) {
  const startTimestamp = Reef.clone(store.data.startTime.getTime())
  const endTimestamp = Reef.clone(store.data.endTime.getTime())

  const track = {
    timestamp: startTimestamp,
    waypoints: Reef.clone(store.data.waypoints)
  }

  const cur_session = {
    startTime: startTimestamp,
    endTime: endTimestamp,
    duration: getDuration2(startTimestamp, endTimestamp),
    distanceInMeter: Reef.clone(store.data.distanceInMeter),
    distance: window.geolib.convertDistance(store.data.distanceInMeter, 'km').toFixed(2)
  }

  db.tracks.add(track)
  db.sessionsTable.add(cur_session)

  btnBox.detach(finalScreen)
  elem.parentElement.parentElement.classList.remove('countdown')
  btnBox.data.view = 'counter'
  btnBox.data.counterContent = 'Start'
  elem.parentElement.parentElement.classList.remove('statsExpand')
}

function stopSession() {
  store.data.endTime = new Date()

  clearInterval(getPosition)
  clearInterval(updateDuration)

  btnBox.detach(sessionStats)
  btnBox.data.view = 'finalScreen'
  btnBox.attach(finalScreen)
}

function startSession() {
  store.data.startTime = new Date()
  store.data.duration = '00:00:00'
  store.data.waypoints = []
  store.data.distance = 0.0
  store.data.distanceInMeter = 0

  updateDuration = setInterval(() => {
    store.data.duration = getDuration()
  }, 1000)

  navigator.geolocation.getCurrentPosition(posSuccess, posError)
  getPosition = setInterval(() => {
    navigator.geolocation.getCurrentPosition(posSuccess, posError)
  }, 5000)
}

// Event listeners
function expandBtnBox(elem) {
  elem.parentElement.classList.add('statsExpand')

  if (btnBox.data.counterContent != 'Start') {
    count = 0
  }
}

window.addEventListener("transitionend", function (e) {
  if (e.propertyName == 'border-bottom-left-radius' && e.target.id == 'btnBox' && startTransition) {
    startTransition = false
    count = 10
    btnBox.data.counterContent = count
    e.target.classList.add('countdown')
    count--

    const countdown = setInterval(() => {
      if (count > 0) {
        btnBox.data.counterContent = count--
      } else if (count == 0) {
        btnBox.data.counterContent = 'GO!'
        count--
      } else {
        clearInterval(countdown)
        btnBox.data.view = 'sessionStats'
        btnBox.attach(sessionStats)
        startSession()
      }
    }, 1000)
  } else if (e.propertyName == 'border-bottom-left-radius' && !startTransition) {
    startTransition = true
  }
})
