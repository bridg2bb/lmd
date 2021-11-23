import { character } from "./models/character.js";
import { ui } from "./ui.js";
import { race } from "./models/race.js";
import { creature } from "./models/creature.js";
import { settings } from "./models/settings.js";

import { treasure } from "./models/treasure.js";
import { battle } from "./models/battle.js"

import { map  } from "./map.js";
import { area  } from "./models/area.js";

import { town  } from "./town.js";

export class game {
    constructor()
    {
        this.config = {

            //Start Conditions
            maxStartX : 150,
            maxStartY : 150,
            minStartX : -150,
            minStartY : -150,
            debugMode : window.location.href.indexOf("local") != -1 //This will allow things like moving wherever you want
        };

        //Object initialization
        let storedCharacter  = localStorage.getItem("savedCharacter");
        if (storedCharacter)
        {
            this.savedCharacter = new character(this,JSON.parse(storedCharacter));
        } else {
            this.savedCharacter = null;            
        }
        let storedSettings  = localStorage.getItem("settings");
        if (storedSettings)
        {
            this.settings = JSON.parse(storedSettings);
        } else {
            this.settings = new settings();
        }
        this.interface = new ui(this);
        this.town = new town(this)
        let stepCount = 7;
        let currentStep = 1;

        this.interface.loadingBar.updateLimits(currentStep,stepCount);
        this.interface.loadingOverlay.style.display = "block";
        this.interface.loadingDialog.style.display = "block";
        this.interface.loadingText.innerText = "Loading game...";
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();
		

        this.map = new map(this);

        this.character = new character(this);
        this.battle = new battle(this);
        
        for (let i = 0; i < 50; i ++)
        {
            this.interface.addMessage("");
        }
        
        this.races = [];
        

        
        this.interface.loadingText.innerText = "Fetching race data...";
        fetch('data/races.json')
            .then(response => response.json())
            .then(data => 
                {
                    data.forEach(item =>
                        {
                            this.races.push(new race(item.name,item.minHealth,item.maxHealth,
                                                    item.minStr,item.maxStr, item.minDex, item.maxDex));
                        });
                });
        
        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();
		
		
		
        
 
        
        this.interface.loadingText.innerText = "Fetching map data...";
        fetch('data/map.json')
            .then(response => response.json())
            .then(data => 
                {
                    data.areas.forEach(item =>
                        {
                            this.map.areas.push(new area(item));
                        });
                });
        
        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();
		
		
        let creatures = [];     

        
        this.interface.loadingText.innerText = "Fetching creature data...";
        fetch('data/creatures.json')
            .then(response => response.json())
            .then(data => 
                {
                    data.forEach(item =>
                        {
                            creatures.push(new creature(item, this));
                        });
                });
        this.battle = new battle(this, creatures);

        
        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();


        this.names = [];     

        this.interface.loadingText.innerText = "Fetching name data...";
        fetch('data/names.json')
            .then(response => response.json())
            .then(data => 
                {
                    this.names = data;
                });



        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();

        this.interface.loadingText.innerText = "Fetching treasure data...";
        
        this.treasures = [];
        fetch('data/treasures.json')
        .then(response => response.json())
        .then(data => 
        {
            data.forEach(item =>
            {
                this.treasures.push(new treasure(item));
            });
        });

        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();


        this.interface.loadingText.innerText = "Fetching change log...";

        this.changeLogs = [];
        fetch('changelog.json')
        .then(response => response.json())
        .then(data => 
        {
            data.forEach(item =>
            {
                this.changeLogs.push(item);
            });
        });
        currentStep ++;
        this.interface.loadingBar.updateValue(currentStep);
        this.interface.loadingBar.update();


        this.interface.loadingText.innerText = "Complete!";

        this.interface.loadingDialog.style.display = "none";
        this.interface.loadingOverlay.style.display = "none";

        this.welcome();
        this.interface.update();
    }
    
 
   
    //Events
  
    saveSettings()
    {
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }

    gameOver(messages)
    {
        messages = messages || [];
        messages.push("You were killed!\nWould you like to try again?");
        this.character = new character(this);
        let buttons = [];
        buttons.push( {
            text: "Try again",
            callback: this.welcome.bind(this)
        });
        this.interface.setupButtons(buttons,messages);
    }



    
    treasure(messages)
    {
        
        messages = messages || [];
        this.interface.disableNavigation();
        let treasureToChooseFrom = [];

        this.treasures.forEach(treasure => 
            {
                for (let i = 0; i <= treasure.weight; i ++)
                {
                    treasureToChooseFrom.push(treasure);
                }
            });
        let randomTreasureIndex = _u.getRandomInt(0, treasureToChooseFrom.length - 1);
        let treasure = treasureToChooseFrom[randomTreasureIndex];
        
        messages.push(treasure.message);
        if (treasure.maxGold != 0)
        {
            let circle = this.character.getCircle() == 0 ? 1 : this.character.getCircle();
            let goldToGive = _u.getRandomInt(treasure.minGold * circle, treasure.maxGold * circle);
            this.character.gold += goldToGive;
            messages.push("Gold increased by " + goldToGive);
        }

        if (treasure.maxExp != 0)
        {
            let circle = this.character.getCircle() == 0 ? 1 : this.character.getCircle();
            let expToGive = _u.getRandomInt(treasure.minExp * circle, treasure.maxExp * circle);
            this.character.experience += expToGive;
            messages.push("Experience increased by " + expToGive);

            let expMessages = this.character.processExperience();
            expMessages.forEach(message => {
                messages.push(message);
            });
        }

        if (treasure.maxShield != 0)
        {
            let circle = this.character.getCircle() == 0 ? 1 : this.character.getCircle();
            let shieldToGive = _u.getRandomInt(treasure.minShield * circle, treasure.maxShield * circle);

            messages[messages.length - 1] = messages[messages.length - 1].tokenReplace(["" + shieldToGive]);
            if (this.character.maxShield < shieldToGive)
            {
                this.character.maxShield = shieldToGive;
                this.character.shield = shieldToGive;
                messages.push("This armor is better than your old armor so you equip it.");
            } else {
                messages.push("This armor is not as good as yours so you discard it.");
            }
        }
        
        if (treasure.maxSword != 0)
        {
            let circle = this.character.getCircle() == 0 ? 1 : this.character.getCircle();
            let swordToGive = _u.getRandomInt(treasure.minSword * circle, treasure.maxSword * circle);

            messages[messages.length - 1] = messages[messages.length - 1].tokenReplace(["" + swordToGive]);
            if (this.character.maxSword < swordToGive)
            {
                this.character.maxSword = swordToGive;
                this.character.sword = swordToGive;
                messages.push("This sword is better than your old sword so you equip it.");
            }else {
                messages.push("This sword is not as good as yours so you discard it.");
            }
        }
        
        
        let buttons = [];
        buttons.push( {
            text: "Continue",
            callback: this.mainMovement.bind(this)
        });
        this.interface.setupButtons(buttons, messages);
    }
    rest(messages)
    {
        messages = messages || [];
        let healthIncreased = this.character.rest();
        messages.push(`You gained ${healthIncreased} health from resting.`); 
        this.mainMovement(messages);
    }
    hunt(messages)
    {
       
        messages = messages || [];
        this.interface.disableNavigation();
        messages.push("Hunt started!"); 
        let random = _u.getRandomInt(0, 1);
        if (random == 1)
        {
            this.battle.start();
            return;
        } else {
            messages.push("Failed to find anything to hunt!");
        }

        let buttons = [];
        buttons.push( {
            text: "Continue",
            callback: this.mainMovement.bind(this)
        });
        this.interface.setupButtons(buttons, messages);
    }
    moveTo(messages)
    {
        messages = messages || [];
        this.interface.disableNavigation();
        let totalMovement = this.character.level + 1;
        let maxX = this.character.location.x + totalMovement;
        let minX = this.character.location.x - totalMovement;
        if (this.config.debugMode)
        {
            maxX = 100000000;
            minX = -100000000;
            totalMovement = 1000000000;
        }
        
        let x = maxX + 1; //Set bounds outside
        while (x > maxX || x < minX)
        {
            let tempX = prompt("What x value would you like to move to? (Max " + maxX + " Min " + minX);
            if (tempX == null)
            {
                this.mainMovement(messages);
                return;
            }
            if (_u.isNumeric(tempX))
            {
                x =  Number.parseInt(tempX);
            }
        }
        

        let xDifference = x > this.character.location.x ? Math.abs(this.character.location.x - x) : Math.abs(x - this.character.location.x);
        let leftOverMovement = totalMovement - xDifference;
        
        let maxY = this.character.location.y + leftOverMovement;
        let minY = this.character.location.y - leftOverMovement;
        
        if (this.config.debugMode)
        {
            maxY = 100000000;
            minY = -100000000;
            leftOverMovement = 1000000000;
        }


        let y = maxY + 1; //Set bounds outside
        while (y > maxY || y < minY)
        {
            let tempY = prompt("What y value would you like to move to? (Max " + maxY + " Min " + minY);
            if (tempY == null)
            {
                this.mainMovement(messages);
                return;
            }
            if (_u.isNumeric(tempY))
            {
                y = Number.parseInt(tempY);
            }
        }
        
        this.character.location.x = x;
        this.character.location.y = y;
        messages.push("Successfully moved to " + x + "," + y);
        this.mainMovement(messages);
    }

    moveToNearestTown(messages)
    {
        messages = messages || [];
        this.character.location = this.map.nearestTown();
        messages.push("Successfully moved to " + this.character.location.x + "," + this.character.location.y);
        this.mainMovement(messages);
        
    }
    updateCharacterData()
    {
        this.interface.healthBar.updateLimits(this.character.health, this.character.maxHealth, this.character.shield, this.character.maxShield);
        this.interface.healthBar.updateValue(this.character.health, this.character.shield);


        this.interface.strBar.updateLimits(this.character.str, this.character.maxStr, this.character.sword, this.character.sword);
        this.interface.strBar.updateValue(this.character.str, this.character.sword);

    
        this.interface.dexBar.value = this.character.dex;
        this.interface.dexBar.max = this.character.maxDex;
    
        this.interface.strBar.value = this.character.str;
        this.interface.strBar.max = this.character.maxStr;
    
        this.interface.expBar.value = this.character.experience;
        this.interface.expBar.max = this.character.nextLevel;
    }

    
    mainMovement(messages)
    {
        messages = messages || [];
        if (this.character.health <= 0)
        {
            this.gameOver(messages);
            return;
        }
        if (this.character.location.x == this.map.nearestTown().x && this.character.location.y == this.map.nearestTown().y)
        {
            messages.push("Would you like to enter the town?");
            let buttons = [];
            buttons.push({
                text : "Enter Town", 
                enabled: true,
                callback: this.town.enterTown.bind(this.town)
            });
            buttons.push({
                text : "Cancel", 
                enabled: true,
                callback: this.town.leaveTown.bind(this.town)
            });
        
            this.interface.setupButtons(buttons,messages);
            return;

        } 
        let eventi = _u.getRandomInt(0, 100);

        if (eventi >= 75 && eventi <= 90)
        {
            this.battle.start(messages);
            return; 
        }
        if (eventi > 90)
        {
            this.treasure(messages);
            return;       
        }

        this.updateCharacterData();
        this.interface.enableNavigation();
        messages.push("Moved to " + this.character.location.x + "," + this.character.location.y)


        let buttons = [];
        buttons.push({
            text : "Hunt", 
            enabled: true,
            callback: this.hunt.bind(this)
        });
        buttons.push({
            text : "Move To", 
            enabled: true,
            callback: this.moveTo.bind(this)
        });
        if (this.map.closeEnoughToMoveToTown())
        {
            buttons.push({
                text : "Move to town at (" + this.map.nearestTown().x + "," + this.map.nearestTown().y + ")", 
                enabled: true,
                callback: this.moveToNearestTown.bind(this)
            });
        }
        buttons.push({
            text : "Rest", 
            enabled: true,
            callback: this.rest.bind(this)
        });
        
        this.interface.setupButtons(buttons,messages);
    }

    raceSelected(data)
    {
        this.character.race = data.race;
        this.character.roll(); 
        this.character.shield = this.config.debugMode ? 10000 : 0; 
        this.character.maxShield = this.config.debugMode ? 10000 : 0;
        this.character.sword = this.config.debugMode ? 1000 : 0; 
        let messages = [];
        messages.push("Rolled");
        messages.push("Health: " + this.character.health + " (Min: " + data.race.minHealth + " Max: " + data.race.maxHealth +")");
        messages.push("Strength: " + this.character.str + " (Min: " + data.race.minStr + " Max: " + data.race.maxStr +")");
        messages.push("Dexerity: " + this.character.dex + " (Min: " + data.race.minDex + " Max: " + data.race.maxDex +")");
        messages.push("Would you like to accept or reroll?");
      
        while (this.character.location.x == 0 && this.character.location.y == 0)
        {
            this.character.location.x = _u.getRandomInt(this.config.minStartX, this.config.maxStartX);
            this.character.location.y = _u.getRandomInt(this.config.minStartY, this.config.maxStartY);
        }
        let buttons = [];
        buttons.push({ 
            text: "Accept",
            enabled: true,
            callback: this.mainMovement.bind(this)
        });
        buttons.push({ 
            text: "Reroll",
            enabled: true,
            callback: this.raceSelected.bind(this),
            data: {
                race: data.race
            }
        });
        this.interface.setupButtons(buttons, messages);
    }
    selectRace()
    {
        let messages = [];
        messages.push("What race would you like to be?");
        
        let buttons = [];
        this.races.forEach(race => {
            buttons.push( { 
                text: race.name,
                enabled: true,
                callback: this.raceSelected.bind(this),
                data: {
                    race: race
                }
            });
        });
        this.interface.setupButtons(buttons,messages);
    }


    start()
    {
        let randomName = _u.getRandomInt(0, this.names.length);
        let messages = [];
        let characterName = this.names[randomName];
        characterName = prompt("Please enter character name:", characterName);
        if (characterName == null)
        {
            this.welcome();
            return;
        }
        this.character.name = characterName;
        messages.push("Welcome to the realm " + this.character.name);
        let buttons = [];
        buttons.push({
            text: "Continue",
            enabled: true,
            callback: this.selectRace.bind(this)
        });
        this.interface.setupButtons(buttons);
    }

    

    help(option)
    {

        let messages = [];
        switch (option)
        {
            case "interface":
                messages.push("The game is controlled primarily by 5 action buttons. These buttons can also be controlled by the keyboard using the keys a s d f g in order.\n\nWhen out in the world not in an event, you can navigate with the navigation buttons. The buttons are laid out like the number pad on the keyboard. These buttons can be controlled by the number pad or the number keys. ");
                break;
            case "combat":
                messages.push("While moving around the world you will have random encounters with creatures. Alternatively, you can use the hunt button to greatly increase your odds of encountering an enemy.\n\nCreatures will get harder the further you are from the center origin of 0,0. They will increase every 100 x or y.\n\nResting during combat will heal you, but also leads you open to being attacked.\n\nRunning is not guaranteed, don’t wait until too late!");
                break;
            case "general":
                messages.push("Resting will restore your health.\n\nStrength determines the damage you are dealt.\n\nDexterity controls chance to hit for both you and your enemy.");
                break;

        }

        
        messages.push("Please choose from the following options:");

        let buttons = [];
        buttons.push( {
                text: "Back",
                enabled: true,
                callback: this.welcome.bind(this)
            },
            {
                text: "Interface",
                enabled: true,
                callback: this.help.bind(this),
                data: "interface"
            },
            {
            text: "Combat",
            enabled: true,
            callback: this.help.bind(this),
            data: "combat"
            },
            {
            text: "General",
            enabled: true,
            callback: this.help.bind(this),
            data: "general"
        });
        this.interface.setupButtons(buttons,messages);
   

    }

    changeLog()
    {
        let messages = [];
        messages.push("");
        this.changeLogs.forEach(log =>
            messages.push(log.version + " - " + log.date + "\n_______________\n" + log.body + "\n\n")
        );

        
        let buttons = [];
        buttons.push( {
             text: "Back",
             enabled: true,
             callback: this.welcome.bind(this)
        });
        this.interface.setupButtons(buttons, messages);

    }

    welcome()
    {
       let messages = [];
       messages.push("Welcome to the game!!\n\nYou can load a previous save in the settings menu on the right. Otherwise you can start a new game below.");
       let buttons = [];
       buttons.push( {
            text: "Start a new character",
            enabled: true,
            callback: this.start.bind(this)
       },  
       {
        text: "Change Log",
        enabled: true,
        callback: this.changeLog.bind(this)
        },  
        {
         text: "Help",
         enabled: true,
         callback: this.help.bind(this)
         });
       this.interface.setupButtons(buttons, messages);
    }
    
}