rockTypes = [
    //id, name, cost, exp, description, required, baseTime
    new rockType(0, "Copper", 24, 35, "Requires level 1 to mine (24gp)", 1, 2),
    new rockType(1, "Tin", 24, 35, "Requires level 1 to mine (24gp)", 1, 2),
    new rockType(2, "Iron", 50, 70, "Requires level 15 to mine (70gp)", 15, 3),
    new rockType(3, "Silver", 90, 80, "Requires level 20 to mine (90gp)", 20, 5),
    new rockType(4, "Coal", 100, 100, "Requires level 30 to mine (100gp)", 30, 8),
    new rockType(5, "Gold", 180, 130, "Requires level 40 to mine (180gp)", 40, 10),
    new rockType(6, "Mithril", 190, 160, "Requires level 55 to mine (190gp)", 55, 10),
    new rockType(7, "Adamantite", 480, 190, "Requires level 70 to mine (480gp)", 70, 10),
    new rockType(8, "Runite", 3840, 250, "Requires level 85 to mine (3840gp)", 85, 10)
  ];

//allows nodeJS to access it
exports.rockTypes = rockTypes;

function rockType(id, name, cost, exp, description, required, mineTime) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.exp = exp;
  this.description = description;
  this.required = required;
  this.mineTime = mineTime;
}

pickTypes = [
    //id, name, cost, level, description
    new pickType(0, "Bronze", 1, 1, "Requires level 1 to wear"),
    new pickType(1, "Iron", 100, 1, "Requires level 1 to wear"),
    new pickType(2, "Steel", 500, 5, "Requires level 5 to wear"),
    new pickType(3, "Mithril", 2100, 21, "Requires level 21 to wear"),
    new pickType(4, "Adamantite", 3200, 31, "Requires level 31 to wear"),
    new pickType(5, "Runite", 32000, 31, "Requires level 41 to wear"),
    new pickType(6, "Dragon", 15871478, 31, "Requires level 61 to wear")
  ];

//allows nodeJS to access it
exports.pickTypes = pickTypes;

function pickType(id, name, cost, level, description) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.description = description;
  this.level = level;
}


/*var points = 0;
var clickValue = 1;
var autoRate = 0;

//AUTO UPGRADES BEGIN HERE//
var autoUpgrades = [
  new autoUpgrade(0, "Hire Grant", 10, "Convince Grant this is for the artist database and have him click for you but he's slow as fuck (1 click per second)", 0, 0),
  new autoUpgrade(1, "Onetouch API", 200, "Program your blood sugar tester to click for you (5 clicks per second)", 0, 0),
  new autoUpgrade(2, "Hack Cole's Tinder", 1000, "Every time Cole swipes right your autism increases (10 per second)", 0, 0)
];

function autoUpgrade(id, name, cost, description, unlocked, owned, classId) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.description = description;
  this.unlocked = unlocked;
  this.owned = owned;
  this.classId = document.createElement('li');
  var content = document.createTextNode(this.name + " - Cost: " + this.cost + "\n");
  this.classId.appendChild(content);
  this.classId.onclick = function() { doBuyAuto(id); };
  this.classId.onmouseover = function() { toggleAutoDescription("show", id); };
  this.classId.onmouseout = function() { toggleAutoDescription("hide", id); };
}

function toggleAutoDescription(which, id) {
  var div = document.getElementById("clickerUpgradesDescription");
  if (which == "show") {
    div.style.display = "block";
    div.innerHTML = autoUpgrades[id].description;
  } else if (which == "hide") {
    div.style.display = "none";
    div.innerHTML = "-";
  }
}

function doBuyAuto(id) {
  if (points >= autoUpgrades[id].cost && autoUpgrades[id].unlocked == 1 && autoUpgrades[id].owned == 0) {
    points -= autoUpgrades[id].cost;
    autoUpgrades[id].owned = 1;
    switch(id) {
      case 0: //Grant
        autoRate += 1;
        break;
      case 1: //API
        autoRate += 5;
        break;
      case 2: //TINDER
          autoRate += 10;
          break;
    }
  }
  update();
}

function updateAutoUpgrades() {
  document.getElementById("autoUpgrades").getElementsByClassName("unlocked")[0].innerHTML = "Available: <br/>";
  for (x in autoUpgrades) {
    if (autoUpgrades[x].unlocked == 1 && autoUpgrades[x].owned == 0)
      document.getElementById("autoUpgrades").getElementsByClassName("unlocked")[0].appendChild(autoUpgrades[x].classId);
  }

  document.getElementById("autoUpgrades").getElementsByClassName("owned")[0].innerHTML = "Owned: <br/>";
  for (x in autoUpgrades) {
    if (autoUpgrades[x].unlocked == 1 && autoUpgrades[x].owned == 1)
      document.getElementById("autoUpgrades").getElementsByClassName("owned")[0].appendChild(autoUpgrades[x].classId);
  }
}

//CLICKER UPGRADES BEGIN HERE//
var clickerUpgrades = [
  //name, cost, owned, description, unlocked
  new clickUpgrade(0, "Fedora", 25, "Your snazzy fedora makes your clicks twice as effective", 0, 0),
  new clickUpgrade(1, "Morning Soda", 100, "Sneak a soda in the morning and click twice as fast", 0, 0),
  new clickUpgrade(2, "Fedora x2", 200, "You put on another fedora making you the coolest camper (+2 autism per click)", 0, 0)
];

function clickUpgrade(id, name, cost, description, unlocked, owned, classId, content) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.description = description;
  this.unlocked = unlocked;
  this.owned = owned;
  this.classId = document.createElement('li');
  this.content = document.createTextNode(this.name + " - Cost: " + this.cost);
  this.classId.appendChild(this.content);
  this.classId.onclick = function() { doBuyClicker(id); };
  this.classId.onmouseover = function() { toggleClickerDescription("show", id); };
  this.classId.onmouseout = function() { toggleClickerDescription("hide", id); };
}

function toggleClickerDescription(which, id) {
  var div = document.getElementById("clickerUpgradesDescription");
  if (which == "show") {
    div.style.display = "block";
    div.innerHTML = clickerUpgrades[id].description;
  } else if (which == "hide") {
    div.style.display = "none";
    div.innerHTML = "-";
  }
}

function doBuyClicker(id) {
  if (points >= clickerUpgrades[id].cost && clickerUpgrades[id].unlocked == 1 && clickerUpgrades[id].owned == 0) {
    points -= clickerUpgrades[id].cost;
    clickerUpgrades[id].owned = 1;
    switch(id) {
      case 0: //fedora
        clickValue += 1;
        break;
      case 2: //fedora x2
          clickValue += 2;
          break;
      default:
        clickValue = clickValue * 2;
        break;
    }
  }
  update();
}

/*  console.log("clicked");
  alert("clicked");
  var clickers = ["1", "2", "3"];
  document.getElementById("clickers").innerHTML = clickers;
  var newElement = document.createElement('button');
  newElement.onclick = function() {alert('blah'); };
  document.getElementById("buttons").appendChild(newElement);


function updateClickerUpgrades() {
  document.getElementById("clickerUpgrades").getElementsByClassName("unlocked")[0].innerHTML = "Available: <br/>";
  for (x in clickerUpgrades) {
    if (clickerUpgrades[x].unlocked == 1 && clickerUpgrades[x].owned == 0)
      document.getElementById("clickerUpgrades").getElementsByClassName("unlocked")[0].appendChild(clickerUpgrades[x].classId);
  }

  document.getElementById("clickerUpgrades").getElementsByClassName("owned")[0].innerHTML = "Owned: <br/>";
  for (x in clickerUpgrades) {
    if (clickerUpgrades[x].unlocked == 1 && clickerUpgrades[x].owned == 1)
      document.getElementById("clickerUpgrades").getElementsByClassName("owned")[0].appendChild(clickerUpgrades[x].classId);
  }
}

function update() {
  points += autoRate;

  document.getElementById("points").innerHTML = "Autism Level: " + points;
  document.getElementById("persecond").innerHTML = "Per Second: " + autoRate;
  updateClickerUpgrades();
  updateAutoUpgrades();
  checkUpgrades();
}

function checkUpgrades() {
  for (x in clickerUpgrades) {
    if (points >= clickerUpgrades[x].cost && clickerUpgrades[x].unlocked == 0) {
      clickerUpgrades[x].unlocked = 1;
      updateClickerUpgrades();
    }
  }
  for (x in autoUpgrades) {
    if (points >= autoUpgrades[x].cost && autoUpgrades[x].unlocked == 0) {
      autoUpgrades[x].unlocked = 1;
      updateAutoUpgrades();
    }
  }
}

function doClick() {
  document.getElementById("clickArea").style.cursor = "url('fedora1.png'), wait;";
  points = points + clickValue;
  document.getElementById("points").innerHTML = "Autism Level: " + points;
  checkUpgrades();
}

function updateBoxPos(e) {
  var x = e.pageX;
  var y = e.pageY;
  document.getElementById("clickerUpgradesDescription").style.left = x + 5;
  document.getElementById("clickerUpgradesDescription").style.top = y - 50;
}

setInterval(update, 1000);*/
