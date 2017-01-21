const newYorkMarathon2017 = "11/05/2017 09:20 AM";
const convMarDate = moment(new Date(newYorkMarathon2017));

// countdown clock
var tick;
var countdownClock = {

  time : function() {
    var today = moment(new Date());
      var difference = convMarDate.diff(today, 'seconds');

      return difference;
    },

  start: function() {
      tick = setInterval(countdownClock.countdown, 1000);
    },

  stop: function() {
    clearInterval(tick);
  },

  countdown: function() {
    if (countdownClock.time() === 0) {

          countdownClock.stop();

        } else {

      let currentTime = countdownClock.timeConverter(countdownClock.time());
          $("#timer").text(currentTime);
    }
  },

  timeConverter: function(t) {
      //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
      var days = Math.floor(t/86400);
      var hours = Math.floor((t - (days * 86400))/3600);
      var minutes = Math.floor((t - (days * 86400) - (hours * 3600))/60);
      var seconds = t - (days * 86400) - (hours * 3600)- (minutes * 60);
      // allows game time to be altered in the future to more than one minute

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if (minutes === 0) {
        minutes = "00";
      }

      else if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (hours === 0) {
        hours = "00"
      }

      else if (hours < 10) {
        hours = "0" + hours;
      }
      if (days === 0) {
        hours = "00"
      }

      else if (days < 10) {
        days = "0" + hours;
      }
            if (hours === 0) {
        hours = "00"
      }

      else if (hours < 10) {
        hours = "0" + hours;
      }

      return days + " Days " + hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
    }
}
