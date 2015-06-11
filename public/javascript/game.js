var firstLoad = true;
var points = 0;
var update;
var currRock = 0;
var level = 0;
var exp = 0;
var isMining = false;
var muted = false;

function doClick() {
  if (firstLoad) {
    points = parseInt(document.getElementById('hiddenPoints').value);
    level = parseInt(document.getElementById('hiddenLevel').value);
    exp = parseInt(document.getElementById('hiddenExp').value);
    currRock = parseInt(document.getElementById('hiddenRock').value);
    doUpdate();
    //doTick = setInterval(tick, 600);
    firstLoad = false;
   }
   if (!isMining) {
     document.getElementById('pickarea').style.visibility = 'visible';
     if (!muted) {
       document.getElementById('mining_sound_effect').currentTime = 0;
       document.getElementById('mining_sound_effect').loop = true;
       document.getElementById('mining_sound_effect').play();
     }
     isMining = true;
     miningTime = Math.floor((Math.random() * 5) + 1) * (currRock + 1);
     document.getElementById('info').innerHTML = miningTime;
     setTimeout(function() {mineRock(currRock);} , miningTime * 1000);
   }
}

function mute() {
  if (!muted) {
    document.getElementById('mining_sound_effect').pause();
    muted = true;
  } else {
    muted = false;
  }
}

function mineRock(id) {
  save(); //Save user data
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/mineRock",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
         if (data == "notunlocked") {
         } else {
         newData = data.split(" ");
         points += (newData[0] + 1) * 5;
         $('#hiddenPoints').val(points);
         $('#points').html(points);
         $('#hiddenExp').val(newData[1]);
         $('#exp').html(newData[1]);
         currRock = id;
        }
      }
   });
  isMining = false;
  if (!muted) {
    document.getElementById('mining_sound_effect').pause();
    document.getElementById('mining_finished').play();
  }
  document.getElementById("pickarea").style.visibility = 'hidden';


  //levelup
  if (exp >= Math.floor(level-1 + 300 * Math.pow(2, level-1/7.)) + Math.floor(level + 300 * Math.pow(2, level/7. ))) {
    save(); //Save user data
    $.ajax({ //Send a get request to the server with which pickaxe to buy
       type: "GET",
       url: "./game/levelup",
       data: "id=" + level, //send the level of the user
       success: function(data) {
             // data is ur summary
            $('#level').html(data); //update the visual points
            $('#hiddenLevel').val(data); //update the hidden points
            level = parseInt(document.getElementById('hiddenLevel').value);
       }
     });
  }

  doUpdate();
}

function doBuyPickaxe(id) {
  save(); //Save user data
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/buyPickaxe",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
           // data is ur summary
          $('#points').html(data); //update the visual points
          $('#hiddenPoints').val(data); //update the hidden points
          points = parseInt(document.getElementById('hiddenPoints').value);
     }
   });
  doUpdate();
}

function chooseRock(id) {
  if (isMining) {
    return;
  }
  save(); //Save user data
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/chooseRock",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
          if (data == "notunlocked") {
            alert ('ye');
          } else {
          $('#hiddenRock').val(data);
          $('#rockpicture').attr('src', './images/rocks/'+id+'.png');
          currRock = id;
        }
     }
   });
  doUpdate();
}

function tick() {
  doUpdate();
}

function doUpdate() {
  document.getElementById('hiddenPoints').value = points;
  document.getElementById("points").innerHTML = points;

  /*points += autoRate;

  document.getElementById("points").innerHTML = "Autism Level: " + points;
  document.getElementById("persecond").innerHTML = "Per Second: " + autoRate;
  updateClickerUpgrades();
  updateAutoUpgrades();
  checkUpgrades();*/
}

function save() {
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "POST",
     url: "./game/save",
     data: "points=" + parseInt(document.getElementById('hiddenPoints').value) +
     "&rocks=" + parseInt(document.getElementById('hiddenRock').value), //send the id of the pickaxe as a param
     success: function(data) {
          if (data) {
            window.location.assign("./login")
            return;
          }
      }
   });
  //var i = document.createElement("img");
  //i.src = "./game/save?points=" + parseInt(document.getElementById('hiddenPoints').value);
}

var doSave = setInterval(save, 10000);
