import { navigation_button } from "./ui/navigation_button.js";
import { toolbar_button } from "./ui/toolbar_button.js";
import { status_bar } from "./ui/status_bar.js";
import { message } from "./models/messaage.js";

export class ui 
{
    constructor(parentGame) 
    {
        
        this.game = parentGame;
        
        this.textbox = document.getElementById("gameText");
        this.textFrame = document.getElementById("textFrame");
        this.playerHeader = document.getElementById("playerHeader");
        this.maxLineCount = 100;
        this.previousLineCount = 0;

        this.btn1 = new toolbar_button("toolbar-btn-1", this.btn1_click.bind(this));
        this.btn2 = new toolbar_button("toolbar-btn-2", this.btn2_click.bind(this));
        this.btn3 = new toolbar_button("toolbar-btn-3", this.btn3_click.bind(this));
        this.btn4 = new toolbar_button("toolbar-btn-4", this.btn4_click.bind(this));
        this.btn5 = new toolbar_button("toolbar-btn-5", this.btn5_click.bind(this));

        this.btnNorthwest = new navigation_button("navigation-btn-northwest",this.btnNorthwest_click.bind(this));
        this.btnNorth = new navigation_button("navigation-btn-north",this.btnNorth_click.bind(this));
        this.btnNortheast = new navigation_button("navigation-btn-northeast",this.btnNortheast_click.bind(this));
        this.btnWest = new navigation_button("navigation-btn-west",this.btnWest_click.bind(this));
        this.btnEast = new navigation_button("navigation-btn-east",this.btnEast_click.bind(this));
        this.btnSouthwest = new navigation_button("navigation-btn-southwest",this.btnSouthwest_click.bind(this));
        this.btnSouth = new navigation_button("navigation-btn-south",this.btnSouth_click.bind(this));
        this.btnSoutheast = new navigation_button("navigation-btn-southeast",this.btnSoutheast_click.bind(this));
        this.btnRest = new navigation_button("navigation-btn-rest",this.btnRest_click.bind(this));

        this.healthBar = new status_bar("health-bar");
        this.dexBar = new status_bar("dex-bar");
        this.strBar = new status_bar("str-bar");
        this.expBar = new status_bar("exp-bar");
        this.loadingBar = new status_bar("loading-bar");

        this.loadingOverlay = document.getElementById("loadingOverlay");
        this.loadingText = document.getElementById("loadingText");
        this.loadingDialog = document.getElementById("loadingDialog");
        this.nameLabel = document.getElementById("characterName");
        this.raceLabel = document.getElementById("characterRace");
        this.locationLabel = document.getElementById("characterLocation");
        this.goldLabel = document.getElementById("characterGold");
        this.lastCommand = document.getElementById("lastCommand");
        this.srCharacterInfo = document.getElementById("srCharacterInfo");
        this.levelLabel = document.getElementById("characterLevel");
        this.nearestTownLabel = document.getElementById("nearestTown");
        this.armorLabel = document.getElementById("characterArmor");
        this.swordLabel = document.getElementById("characterSword");
        this.divCurrentSave = document.getElementById("divCurrentSave");
        

        this.playerHeaderButtonContainer = document.getElementById("playerHeaderButtonContainer");

        this.btnCharacterInfo = document.getElementById("btnCharacterInfo");
        this.btnCharacterInfo.addEventListener("click", this.changeCharacterInfoTab.bind(this));
        this.btnInventory = document.getElementById("btnInventory");
        this.btnInventory.addEventListener("click",  this.changeCharacterInfoTab.bind(this));
        this.btnSettings = document.getElementById("btnSettings");
        this.btnSettings.addEventListener("click",  this.changeCharacterInfoTab.bind(this));

        
        this.playerHeaderInventory = document.getElementById("playerHeader-inventory");
        this.playerHeaderCharacterInfo = document.getElementById("playerHeader-characterInfo");
        this.playerHeaderSettings = document.getElementById("playerHeader-settings");

        this.btnCollapsePlayerHeader = document.getElementById("btnCollapsePlayerHeader");
        this.btnCollapsePlayerHeader.addEventListener("click", this.togglePlayerHeader.bind(this));
        this.textFrame = document.getElementById("textFrame");
    
        this.characterInfoFrame = document.getElementById("characterInfoFrame");
        this.directionFrame = document.getElementById("directionFrame");


        this.btnSave = document.getElementById("btnSave");
        this.btnSave.addEventListener("click", this.saveCharacter.bind(this));
        this.btnLoad = document.getElementById("btnLoad");
        this.btnLoad.addEventListener("click", this.loadCharacter.bind(this));
        this.btnDarkMode = document.getElementById("btnDarkMode");
        this.btnDarkMode.addEventListener("click", this.changeColorMode.bind(this));
        this.btnLightMode = document.getElementById("btnLightMode");
        this.btnLightMode.addEventListener("click", this.changeColorMode.bind(this));
        
        this.loadUISettings();

        this.messages = [];
        document.addEventListener("keypress",this.keypressHandler.bind(this));
        window.onresize = this.playerHeaderButtonContainerStickToPlayerHeader;
        this.playerHeaderButtonContainerStickToPlayerHeader();



    }

    saveCharacter(e)
    {
        let disabled = e.currentTarget.classList.contains("disabled");
        if (!disabled)
        {
            let character = this.game.character.getSave();
            localStorage.setItem("savedCharacter", JSON.stringify(character));
            this.game.savedCharacter = this.game.character;
            this.game.savedCharacter.date = character.date;
        }
    }

    loadCharacter(e)
    {
        let disabled = e.currentTarget.classList.contains("disabled");
        if (!disabled)
        {
            this.game.character = this.game.savedCharacter;
            this.game.mainMovement();
        }
    }
    changeColorMode(e)
    {
        let mode = e.currentTarget.getAttribute("data-action");
        this.game.settings.lightMode = mode == "light";
        this.loadUISettings();
        this.game.saveSettings();
    }

    loadUISettings()
    {
        if (this.game.settings.lightMode)
        {
            this.btnLightMode.classList.add("selected");
            this.btnDarkMode.classList.remove("selected");

            document.body.classList.remove("dark");
        } else {

            this.btnLightMode.classList.remove("selected");
            this.btnDarkMode.classList.add("selected");

            document.body.classList.add("dark");
        }
    }


    changeCharacterInfoTab(e)
    {
        let tab =  e.currentTarget.getAttribute("data-tab");
        this.playerHeaderCharacterInfo.style.display = "none";
        this.playerHeaderInventory.style.display = "none";
        this.playerHeaderSettings.style.display = "none";

        this.btnInventory.classList.remove("selected");
        this.btnSettings.classList.remove("selected");
        this.btnCharacterInfo.classList.remove("selected");
        switch (tab)
        {
            case "inventory":
                this.btnInventory.classList.add("selected");
                this.playerHeaderInventory.style.display = "grid";
                break;
            case "characterInfo":
                this.btnCharacterInfo.classList.add("selected");
                this.playerHeaderCharacterInfo.style.display = "grid";
                break;
            case "settings":
                this.btnSettings.classList.add("selected");
                this.playerHeaderSettings.style.display = "grid";
                break;
        }
    }

    playerHeaderButtonContainerStickToPlayerHeader()
    {

        if (this.playerHeader.classList.contains("playerHeader-expanded"))
        {
            this.playerHeaderButtonContainer.style.left = this.textFrame.getBoundingClientRect().right +27 + 'px';
            this.playerHeaderButtonContainer.style.top = this.textFrame.getBoundingClientRect().top + 1 + 'px';
        } else {

            this.playerHeaderButtonContainer.style.left = this.textFrame.getBoundingClientRect().right +26 + 'px';
            this.playerHeaderButtonContainer.style.top = this.textFrame.getBoundingClientRect().top + 1 + 'px';
        }
        this.textFrame.scrollTop = this.textFrame.scrollHeight;
    }

    togglePlayerHeader()
    {
        if (this.playerHeader.classList.contains("playerHeader-expanded"))
        {
            this.btnCollapsePlayerHeader.innerHTML = '<i class="fas fa-angle-double-left" title="Show info"></i>';
            this.playerHeader.classList.remove("playerHeader-expanded");
            this.btnInventory.style.display = "none";
            this.btnSettings.style.display = "none";
            this.btnCharacterInfo.style.display = "none";
            this.playerHeader.classList.add("playerHeader-hidden");
            this.textFrame.classList.add("expanded");
            this.playerHeaderButtonContainerStickToPlayerHeader();
        } else {
            this.btnCollapsePlayerHeader.innerHTML = '<i class="fas fa-angle-double-right" title="Collapse info"></i>';
            this.playerHeader.classList.remove("playerHeader-hidden");
            this.playerHeader.classList.add("playerHeader-expanded");
            this.btnInventory.style.display = "block";
            this.btnSettings.style.display = "block";
            this.btnCharacterInfo.style.display = "block";
            this.textFrame.classList.remove("expanded");
            this.playerHeaderButtonContainerStickToPlayerHeader();
        }
    }

    keypressHandler(e) {
        e = e || window.event;
        switch (e.keyCode)
        {
            case 97:
                this.btn1.element.click();
                break;
            case 115:
                this.btn2.element.click();
                break;
            case 100:
                this.btn3.element.click();
                break;
            case 102:
                this.btn4.element.click();
                break;
            case 103:
                this.btn5.element.click();
                break;
            case 55:
                this.btnNorthwest.element.click();
                break;
            case 56:
                this.btnNorth.element.click();
                break;
            case 57:
                this.btnNortheast.element.click();
                break;
            case 52:
                this.btnWest.element.click();
                break;
            case 53:
                this.btnRest.element.click();
                break;
            case 54:
                this.btnEast.element.click();
                break;
            case 49:
                this.btnSouthwest.element.click();
                break;
            case 50:
                this.btnSouth.element.click();
                break;
            case 51:
                this.btnSoutheast.element.click();
                break;
        }
    };

    btnNorthwest_click(e)
    {
        e.preventDefault();
        if (this.btnNorthwest.enabled)
        {
            
            this.game.character.moveNorthwest();
            this.game.mainMovement();
        }
    }

    btnNorth_click(e)
    {
        e.preventDefault();
        if (this.btnNorth.enabled)
        {
            
            this.game.character.moveNorth();
            this.game.mainMovement();
        }
    }

    

    btnNortheast_click(e)
    {
        e.preventDefault();
        if (this.btnNortheast.enabled)
        { 
            this.game.character.moveNortheast();
            this.game.mainMovement();
        }
    }


    
    btnWest_click(e)
    {
        e.preventDefault();
        if (this.btnWest.enabled)
        {
            this.game.character.moveWest();
            this.game.mainMovement();
        }
    }

    btnEast_click(e)
    {
        e.preventDefault();
        if (this.btnEast.enabled)
        {
            
            this.game.character.moveEast();
            this.game.mainMovement();
        }
    }

    
    btnSouthwest_click(e)
    {
        e.preventDefault();
        if (this.btnSouthwest.enabled)
        {
            
            this.game.character.moveSouthwest();
            this.game.mainMovement();
        }
    }

    btnSouth_click(e)
    {
        e.preventDefault();
        if (this.btnSouth.enabled)
        {
            
            this.game.character.moveSouth();
            this.game.mainMovement();
        }
    }

    

    btnSoutheast_click(e)
    {
        e.preventDefault();
        if (this.btnSoutheast.enabled)
        {
            
            this.game.character.moveSoutheast();
            this.game.mainMovement();
        }
    }

    

    btnRest_click(e)
    {
        e.preventDefault();
        if (this.btnRest.enabled)
        {
            
            this.game.rest();
        }
    }



    btn1_click(e)
    {
        e.preventDefault();
        if (this.btn1.enabled)
        {
            this.btn1.callback(this.btn1.data);
        }
    }

    
    btn2_click(e)
    {
        e.preventDefault();
        if (this.btn2.enabled)
        {
            this.btn2.callback(this.btn2.data);
        }
    }

    
    btn3_click(e)
    {
        e.preventDefault();
        if (this.btn3.enabled)
        {
            this.btn3.callback(this.btn3.data);
        }
    }

    btn4_click(e)
    {
        e.preventDefault();
        if (this.btn4.enabled)
        {
            this.btn4.callback(this.btn4.data);
        }
    }

    btn5_click(e)
    {
        e.preventDefault();
        if (this.btn5.enabled)
        {
            this.btn5.callback(this.btn5.data);
        }
    }

    setupButtons(buttons,messages)
    {
       if (messages)
       {
           this.addMessage(messages.join("\n"));
       }
       this.resetButtons();
       if (buttons.length >= 1)
       {
           this.btn1.setState(buttons[0].text,buttons[0].enabled, buttons[0].callback, buttons[0].data);
       }
    
       if (buttons.length >= 2)
       {
           this.btn2.setState(buttons[1].text,buttons[1].enabled, buttons[1].callback, buttons[1].data);
       }
    
       if (buttons.length >= 3)
       {
           this.btn3.setState(buttons[2].text,buttons[2].enabled, buttons[2].callback, buttons[2].data);
       }
    
       if (buttons.length >= 4)
       {
           this.btn4.setState(buttons[3].text,buttons[3].enabled, buttons[3].callback, buttons[3].data);
       }
    
       if (buttons.length == 5)
       {
           this.btn5.setState(buttons[4].text,buttons[4].enabled, buttons[4].callback, buttons[4].data);
       }
       
    }



    addMessage(msg)
    {
        let lineCount = this.messages.length;
        
        let today = new Date();
        this.messages.push(new message(msg.length == 0 ? "" : _u.formatAMPM(today),msg));
        this.lastCommand.innerText = msg;
        
        while (lineCount > this.maxLineCount)
        {
            this.messages.splice(0,1);
            lineCount = this.messages.length;

        }
        this.updateTextBox();
    }

    enableNavigation()
    {
        this.btnNorthwest.enable();
        this.btnNorth.enable();
        this.btnNortheast.enable();
        this.btnWest.enable();
        this.btnEast.enable();
        this.btnSouthwest.enable();
        this.btnSouth.enable();
        this.btnSoutheast.enable();
        this.btnRest.enable();
    }

    disableNavigation()
    {
        this.btnNorthwest.disable();
        this.btnNorth.disable();
        this.btnNortheast.disable();
        this.btnWest.disable();
        this.btnEast.disable();
        this.btnSouthwest.disable();
        this.btnSouth.disable();
        this.btnSoutheast.disable();
        this.btnRest.disable();
    }
    resetButtons()
    {
        this.btn1.setState("",false, function() {});
        this.btn2.setState("",false, function() {});
        this.btn3.setState("",false, function() {});
        this.btn4.setState("",false, function() {});
        this.btn5.setState("",false, function() {});
    }


    updateTextBox()
    {
        if (this.previousLineCount != this.messages.length)
        {
            this.textFrame.innerHTML = "";
            let lastIndex = this.messages.length - 1;
            let index = 0;
            this.messages.forEach(message => 
                {
                    this.textFrame.appendChild(message.element);
                    if (index == lastIndex)
                    {
                        this.messages[index].element.classList.add("currentMessage");
                    } else {
                        this.messages[index].element.classList.add("previousMessage");
                        this.messages[index].element.classList.remove("currentMessage");
                    }
                    index++;
                });
            this.previousLineCount = this.messages.length;
            this.textFrame.scrollTop = this.textFrame.scrollHeight;
        }
    }

    updateCharacterInfo()
    {
        if (this.game && this.game.character)
        {
            this.nameLabel.innerText = this.game.character.name;
            if (this.game.character.race)
            {
                this.raceLabel.innerText = this.game.character.race.name;
            } else { 
                this.raceLabel.innerText = "";
            }
            this.locationLabel.innerText = this.game.character.getLocationDisplay();
            this.goldLabel.innerText = String(this.game.character.gold);
            this.levelLabel.innerText = String(this.game.character.level);
            let nearestTown = this.game.map.nearestTown();
            this.nearestTownLabel.innerText = "(" + String(nearestTown.x) + "," + String(nearestTown.y) + ")";
            
            let characterInfoCondensed = "health " + this.game.character.health + " of " + this.game.character.maxHealth + " " +
                                            "experience " + this.game.character.experience + " of " + this.game.character.nextLevel + " " +
                                            "current location x " + this.game.character.location.x + " y " + this.game.character.location.y;
            if (this.srCharacterInfo.innerText != characterInfoCondensed)
            {
                this.srCharacterInfo.innerText = characterInfoCondensed;
            }

            this.armorLabel.innerText = this.game.character.shield + "/" + this.game.character.maxShield;
            this.swordLabel.innerText = this.game.character.sword;

        }
    }

    update()
    {
        if (this.game.savedCharacter != null)
        {
            let lastSaveDateTime = this.game.savedCharacter.date ? this.game.savedCharacter.date.getShortDateTime() : "N/A";
            let saveMessage = `You have a current save from: <br /> ${lastSaveDateTime}. <br /> Character Name: ${this.game.savedCharacter.name} Level: ${this.game.savedCharacter.level}`;
            
            if (this.divCurrentSave.innerHTML.indexOf(lastSaveDateTime) == -1)
            {
                this.divCurrentSave.innerHTML = saveMessage;
            }
            if (this.btnLoad.classList.contains("disabled"))
            {
                this.btnLoad.classList.remove("disabled");
            }
        } else if (this.game.savedCharacter == null && !this.btnLoad.classList.contains("disabled"))
        {
            this.divCurrentSave.innerText("This is no current save found!");
            this.btnLoad.classList.add("disabled");
        } 
        if (this.game.character.race != null && this.btnSave.classList.contains("disabled"))
        {
            this.btnSave.classList.remove("disabled");
        } else if (this.game.character.race == null && !this.btnSave.classList.contains("disabled")) {
            this.btnSave.classList.add("disabled");
        }
        this.updateCharacterInfo();
        this.healthBar.update();
        this.dexBar.update();
        this.strBar.update();
        this.expBar.update();
        this.loadingBar.update();
        this.updateTextBox();
        window.setTimeout(this.update.bind(this), 10);
    }

    
 
}
