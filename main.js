Reef.debug(true)

var store = new Reef.Store({
  data: {
    startTime: null,
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
    // return `<div id="btnBox"></div>`
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
    return `<div id="btnBox"></div>`
  },
  attachTo: main
})

var statistics = new Reef('#statistics', {
  template: function () {
    return `statistics!`
  }
})

var sessions = new Reef('#sessions', {
  template: function () {
    return `sessions!`
  }
})

var btnBox = new Reef('#btnBox', {
  data: {
    counterContent: 'Start',
    showCounter: true
  },
  template: function (props) {
    return `${props.showCounter ? '<span id="counter">' + props.counterContent + '</span>' : '<div id="sessionStats"></div>'}`
  },
  attachTo: activity
})

var sessionStats = new Reef('#sessionStats', {
  store: store,
  template: function (props) {
    return `
      <div id="duration">Duration: ${props.duration}</div>
      <div id="distance">Distance: ${props.distance} KM</div>
      <div id="pace">Pace: ${props.pace} Min/KM</div>
      <div id="hr">Heart Rate: ${props.hr} S/Min</div>
      <div id="pauseStopBtn" onclick="stopSession()">${props.pauseStopBtn}</div>
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
      main.attach(sessions)
      break

    default:
      console.log('No route found.')
      break
  }

  main.render()
})

// Variables
var btnBoxEl = document.getElementById('btnBox')
var counter = document.getElementById('counter')

let updateDuration, getPosition, count

// Functions
function getDuration() {
  const curTime = new Date()
  const diff = (curTime - store.data.startTime) / 1000

  const seconds = Math.floor(diff % 60)
  const minutes = Math.floor(diff / 60) % 60
  const hours = Math.floor(diff / 3600)

  return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`
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

  store.data.waypoints.push(waypoint)
}

function posError() {
  console.log('Unable to retrieve your location')
}

function stopSession() {
  store.data.endTime = new Date()

  clearInterval(updateDuration)
  clearInterval(getPosition)
  console.log('end session')
}

function startSession() {
  store.data.startTime = new Date()
  store.data.waypoints = []

  updateDuration = setInterval(() => {
    store.data.duration = getDuration()
  }, 1000)

  getPosition = setInterval(() => {
    navigator.geolocation.getCurrentPosition(posSuccess, posError)
  }, 5000)
}

// Event listeners
counter.addEventListener('click', function () {
  btnBoxEl.classList.add('statsExpand')

  if (btnBox.data.counterContent != 'Start') {
    count = 0
  }
})

btnBoxEl.addEventListener("transitionend", function (e) {
  if (e.propertyName == 'border-bottom-left-radius') {
    count = 10
    btnBox.data.counterContent = count
    btnBoxEl.classList.add('countdown')
    count--

    const countdown = setInterval(() => {
      if (count > 0) {
        btnBox.data.counterContent = count--
      } else if (count == 0) {
        btnBox.data.counterContent = 'GO!'
        count--
      } else {
        clearInterval(countdown)
        btnBox.data.showCounter = false
        btnBox.attach(sessionStats)
        startSession()
      }
    }, 1000)
  }
})
