var router = new Reef.Router({
	routes: [
		{
			id: 'activity',
			title: 'Activity',
      url: '/',
      component: activity
		},
		{
			id: 'statistics',
			title: 'Statistics',
      url: '/statistics',
      component: statistics
		},
		{
			id: 'sessions',
			title: 'Sessions',
      url: '/sessions',
      component: sessions
    },
    {
			id: 'settings',
			title: 'Settings',
			url: '/settings'
		}
	]
})

var app = new Reef('#app', {
	template: function () {
      return `<main id="main"></main>
        <div id="bottom-nav"></div>`
	}
})

var main = new Reef('#main', {
  router: router,
  template: function(props, route) {
    return `<div id="activity"></div>`
  },
  attachTo: app
})

var bottom_nav = new Reef('#bottom-nav', {
  template: function() {
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
  data: {
    results: ''
  },
  template: function(props) {
    return `
      <div id="settings-icon"><a href="/settings">Settings</a></div>
      <button id="startBtn"></button>
      <div id="results">${props.results}</div>
    `
  },
  allowHTML: true,
  attachTo: main
})

var statistics = new Reef('#statistics', {
  template: function() {
    return `statistics!`
  },
})

var sessions = new Reef('#sessions', {
  template: function() {
    return `sessions!`
  },
})

var startBtnComp = new Reef('#startBtn', {
  data: {
    btnContent: 'Start<br>Session'
  },
  template: function(props) {
    return props.btnContent
  },
  allowHTML: true,
  attachTo: activity
})

Reef.debug(true)
app.render()

const startBtn = document.getElementById('startBtn')

function success(position) {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  const date = new Date()

  activity.data.results += `Latitude: ${latitude}, Longitude: ${longitude}; ${date}<br>-----<br>`;
}

function error() {
  activity.data.results = 'Unable to retrieve your location';
}

startBtn.addEventListener('click', () => {
  if(!navigator.geolocation) {
    activity.data.results = 'Geolocation is not supported by your browser';
  } else {
    activity.data.results = 'Locating…';
    navigator.geolocation.watchPosition(success, error);
  }
})
