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
     isMining = true;
     mineRock(currRock);
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

function expForLevel(theLevel) {
    var a = 0;
    for (x=1;x<theLevel;x++) {
        a += Math.floor((x + 300 * Math.pow(2, (x/7.)))/4);
    }
    return a;
}

function checkLevelUp() {
    exp = document.getElementById('hiddenExp').value;
    level = document.getElementById('hiddenLevel').value;
    //levelup TODO: FIX EXP FORMULA

    expRequired = expForLevel(parseInt(level)+1);
    if (exp >= expRequired) {
      save(); //Save user data
      $.ajax({ //Send a get request to the server with which pickaxe to buy
         type: "GET",
         url: "./game/levelup",
         data: "id=" + level, //send the level of the user
         success: function(data) {
             if (data != "notunlocked") {
                 // data is ur summary
                newData = data.split(" ");
                $('#level').html(newData[0]); //update the visual points
                $('#hiddenLevel').val(newData[0]); //update the hidden points
                $('#hiddenRock').val(newData[1]); //update the hidden points
                level = parseInt(document.getElementById('hiddenLevel').value);
                $.ajax({ //Send a get request to the server with which pickaxe to buy
                   type: "GET",
                   url: "./game/listrocks",
                   success: function(data) {
                       document.getElementById('rockslist').innerHTML = data;
                   }
                 });
             }
         }
       });
    }
}

function stopMining() {
    if (!muted) {
      document.getElementById('mining_sound_effect').pause();
      document.getElementById('mining_finished').play();
    }
    document.getElementById("pickarea").style.visibility = 'hidden';
    isMining = false;
}

function mineRock(id) {
    document.getElementById('pickarea').style.visibility = 'visible';
    if (!muted) {
      document.getElementById('mining_sound_effect').currentTime = 0;
      document.getElementById('mining_sound_effect').loop = true;
      document.getElementById('mining_sound_effect').play();
    }
  save(); //Save user data
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/mineRock",
     data: "id=" + id, //send the id of the rock as a param //add pickaxe as another param
     success: function(data) {
         if (data == "notunlocked") {
             stopMining();
         } else {
         newData = data.split(" ");
         points += (newData[0] + 1) * 5;
         $('#hiddenPoints').val(points);
         $('#points').html(points);//INVENTORY WOULD GO HERE INSTEAD OF POINTS
         $('#hiddenExp').val(newData[1]);
         $('#exp').html(newData[1]);
         currRock = id;
         stopMining();
         checkLevelUp();
        }
      }
   });
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
          if (data != "notunlocked") {
          $('#hiddenRock').val(data);
          $('#rockpicture').attr('src', './images/rocks/'+id+'.png');
          currRock = id;
        }
     }
   });
  doUpdate();
}

function tick() {
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

//var doSave = setInterval(save, 10000);
