var firstLoad = true;
var gold = 0;
var update;
var currRock = 0;
var level = 0;
var exp = 0;
var isMining = false;
var muted = false;
var currPick = 0;
var shopWindowOpen = false;

function doClick() {
  if (firstLoad) {
    gold = parseInt(document.getElementById('hiddenGold').value);
    level = parseInt(document.getElementById('hiddenLevel').value);
    exp = parseInt(document.getElementById('hiddenExp').value);
    currRock = parseInt(document.getElementById('hiddenRock').value);
    currPick = parseInt(document.getElementById('hiddenPick').value);
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
    document.getElementById('levelup_sound_effect').pause();
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
    expRequired = expForLevel(parseInt(level)+1);
    if (exp >= expRequired) {
      if (!muted) {
        document.getElementById('levelup_sound_effect').play();
      }
      $.ajax({ //Send a get request to the server with which pickaxe to buy
         type: "GET",
         url: "./game/levelup",
         data: "id=" + level, //send the level of the user
         success: function(data) {
             if (data != "notunlocked") {
                 // data is ur summary
                newData = data.split(" ");
                $('#level').html(newData[0]); //update the visual gold
                $('#hiddenLevel').val(newData[0]); //update the hidden gold
                $('#hiddenRock').val(newData[1]); //update the hidden gold
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
    //  document.getElementById('mining_sound_effect').currentTime = 0;
      document.getElementById('mining_sound_effect').loop = true;
      document.getElementById('mining_sound_effect').play();
    }
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/mineRock",
     data: "id=" + id + "&pick=" + currPick + "&level=" + level, //send the id of the rock as a param //add pickaxe as another param
     success: function(data) {
         if (data == "notunlocked") {
             stopMining();
         } else {
         newData = data.split(" ");
         $('#hiddenExp').val(newData[1]);
         $('#exp').html('Experience:' + ' ' + newData[1]);
         currRock = id;
         stopMining();
         checkLevelUp();
         $.ajax({ //Send a get request to the server with which pickaxe to buy
            type: "GET",
            url: "./game/listInventory",
            success: function(data) {
                document.getElementById('inventory').innerHTML = data;
                $.ajax({ //Send a get request to the server with which pickaxe to buy
                   type: "GET",
                   url: "./game/shopView",
                   success: function(data) {
                       document.getElementById('shopWindow').innerHTML = data;
                   }
                 });
            }
          });
        }
      }
   });
}

function doBuyPickaxe(id) {
  if (isMining) {
    return;
  }
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/buyPickaxe",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
           // data is ur summary
          $('#gold').html(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); //update the visual gold
          $('#hiddenGold').val(data); //update the hidden gold
          gold = data;
          $.ajax({ //Send a get request to the server with which pickaxe to buy
             type: "GET",
             url: "./game/listpicks",
             success: function(data) {
                 document.getElementById('pickaxes').innerHTML = data;
             }
           });
           choosePick(id);
     }
   });
}

function choosePick(id) {
  if (isMining) {
    return;
  }
  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/choosePick",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
          if (data != "notunlocked") {
          $('#pickpicture').attr('src', './images/picks/'+id+'.png');
          currPick = id;
        }
     }
   });
}

function chooseRock(id) {
  if (isMining) {
    return;
  }
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
}

function sellOre(id) {

  $.ajax({ //Send a get request to the server with which pickaxe to buy
     type: "GET",
     url: "./game/sellOre",
     data: "id=" + id, //send the id of the pickaxe as a param
     success: function(data) {
          if (data) {
             $.ajax({ //Send a get request to the server with which pickaxe to buy
               type: "GET",
               url: "./game/listInventory",
               success: function(data) {
                   document.getElementById('inventory').innerHTML = data;
                   $.ajax({ //Send a get request to the server with which pickaxe to buy
                      type: "GET",
                      url: "./game/shopView",
                      success: function(data) {
                          document.getElementById('shopWindow').innerHTML = data;
                      }
                    });
               }
             });
             $('#hiddenGold').val(data); //update the hidden gold
             $('#gold').html(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); //update the visual gold
           }
     }
   });
}

function showExp() {
  document.getElementById('exp').style.display = "block";
}

function hideExp() {
  document.getElementById('exp').style.display = "none";
}

function toggleShop() {
  if (!shopWindowOpen) {
    document.getElementById('shopWindow').style.display = "block";
    shopWindowOpen = true;
  } else {
    document.getElementById('shopWindow').style.display = "none";
    shopWindowOpen = false;
  }
}

function toggleRockTooltip(which) {
  var div = document.getElementById('rockTooltip');
  if (which=="show") {
    div.style.display = "block";
  } else if (which=="hide") {
    div.style.display = "none";
  }
}

function showRockTooltip(e, description) {
  var x = e.pageX;
  var y = e.pageY;
  document.getElementById('rockTooltip').innerHTML = description;
  document.getElementById("rockTooltip").style.left = x + 5;
  document.getElementById("rockTooltip").style.top = y - 50;
}
