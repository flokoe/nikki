let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    trackingSucc: function(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      this.message = `${latitude}, ${longitude}`;
    },
    trackingError: function() {
      this.message = 'Unable to retrieve your location';
    },
    startTracking: function() {
      if(!navigator.geolocation) {
        this.message = 'Geolocation is not supported by your browser';
      } else {
        this.message = 'Locating…';
        navigator.geolocation.getCurrentPosition(this.trackingSucc, this.trackingError);
      }
    }
  }
})
