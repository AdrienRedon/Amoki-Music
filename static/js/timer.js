var myCounter = new Countdown({
  onCounterEnd: function(){update_player();}
});

function timeline(current_time_left, current_time_past_percent){
  $(".progress-bar").stop();
  var actual_time = current_time_left;
  actual_time *= 1000;
  $(".progress-bar").css('width', current_time_past_percent+'%');
  $(".progress-bar").animate({ 'width' : '100%'} , {
      duration: actual_time,
      easing: 'linear',
      complete:function() {}
  });
}


function Countdown(options) {
  var timer,
  instance = this
  counterEnd = options.onCounterEnd || function () {};
  
  function decrementCounter() {
    var elementDisplay = $('.time-left-progress-bar');
    var heures = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (heures * 3600)) / 60);
    var secondes = seconds - (heures * 3600) - (minutes * 60) ;
    var printedTime = "";
    if(secondes === 0) {
        secondes = 59;
        if(minutes === 0) {
            minutes = 59;
            if(heures === 0){
                counterEnd();
                instance.stop();
            } else {
                heures--;
            }
        } else {
            minutes--;
        }
    } else {
        secondes--;
    }
    var stantardize = function(num){
        if (num < 10) {
            printedTime += "0";
        }
    };
    if(heures !== 0){
        printedTime = heures+":";
        stantardize(minutes);
    }
    printedTime += minutes+":";
    stantardize(secondes);
    printedTime += secondes;
    elementDisplay.html(printedTime);

    seconds--;
  }

  this.start = function (param_sec) {
      clearInterval(timer);
      timer = 0;
      seconds = param_sec;
      if (seconds === 0) {
        return;
      }
      decrementCounter();
      timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
      var elementDisplay = $('.time-left-progress-bar');
      elementDisplay.html("");
      clearInterval(timer);
  };
}

function updateDisplayTimeLeft(sec){
  

  return false;
}

function updateTimePlaylistTemporaryFunction(sec){
  var heures = Math.floor(sec / 3600);
  var minutes = Math.floor((sec - (heures * 3600)) / 60);
  var secondes = sec - (heures * 3600) - (minutes * 60) ;
  var printedTime = "";
  if(secondes === 0) {
      secondes = 59;
      if(minutes === 0) {
          minutes = 59;
          if(heures === 0){
              return '00:00';
          } else {
              heures--;
          }
      } else {
          minutes--;
      }
  } else {
      secondes--;
  }
  var stantardize = function(num){
      if (num < 10) {
          printedTime += "0";
      }
  };
  if(heures !== 0){
      printedTime = heures+":";
      stantardize(minutes);
  }
  printedTime += minutes+":";
  stantardize(secondes);
  printedTime += secondes;

  return printedTime;
}