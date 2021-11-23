export class town
{
    constructor(game)
    {
        this.game = game;
        
    }

    blackSmith(messages)
    {
        let buttons = [];
        messages = messages || [];

        this.game.updateCharacterData();
        messages.push("What would you like to do?");
      
        buttons.push({
            text : "Buy Shield", 
            enabled: true,
            callback: this.buyShield.bind(this)
        });
        
        buttons.push({
            text : "Repair Shield", 
            enabled: true,
            callback: this.repairShield.bind(this)
        });
        buttons.push({
            text : "Buy Sword", 
            enabled: true,
            callback: this.buySword.bind(this)
        });
        buttons.push({
            text : "Cancel", 
            enabled: true,
            callback: this.enterTown.bind(this)
        });
        this.game.interface.setupButtons(buttons,messages);
        return;     
    }
    repairShield(messages)
    {
        let max = Math.floor(this.game.character.gold / 5);
        let neededForRepair = this.game.character.maxShield - this.game.character.shield;

        max = neededForRepair < max ? neededForRepair : max;
        let armorSize = -1;

        while (armorSize < 0 || armorSize > max)
        {
            let inputValue = prompt("How much would you like to repair? (5 gold = 1 repair Max: " + max + ")", max);
            if (inputValue == null) //User hit cancel
            {
                this.game.mainMovement(messages);
                return;
            }

            if (_u.isNumeric(inputValue))
            {
                armorSize = parseInt(inputValue);
            } 
        }
        this.game.character.shield += armorSize;
        this.game.character.gold -= (armorSize * 5); 

        messages = messages || [];
        messages.push("You repaired your armor " + armorSize + " for " + (armorSize * 5) + " gold.");
        this.enterTown(messages);       
    }
    buyHeal(messages)
    {
        
        let missingLife = this.game.character.maxHealth - this.game.character.health;
        let max = this.game.character.gold > missingLife ? missingLife : this.game.character.gold;
        let healAmount = -1;

        while (healAmount < 0 || healAmount > max)
        {
            let inputValue = prompt("How much would you like to heal? (1 gold = 1 health Max: " + max + ")", max);
            if (inputValue == null) //User hit cancel
            {
                this.game.mainMovement(messages);
                return;
            }

            if (_u.isNumeric(inputValue))
            {
                healAmount = parseInt(inputValue);
            } 
       }
        this.game.character.health += healAmount;
        this.game.character.gold -= healAmount;

       messages = messages || [];
       messages.push("You purchased " + healAmount + " for " + healAmount + " gold.");
       this.enterTown(messages);
    }
    buyShield(messages)
    {
        let max = Math.floor(this.game.character.gold / 10);
        let armorSize = -1;

        while (armorSize < 0 || armorSize > max)
        {
            let inputValue = prompt("How big of armor would you like to purchase? (10 gold = 1 armor Max: " + max + ")", max);
            if (inputValue == null) //User hit cancel
            {
                this.game.mainMovement(messages);
                return;
            }

            if (_u.isNumeric(inputValue))
            {
                armorSize = parseInt(inputValue);
            } 
        }
        this.game.character.shield = armorSize;
        this.game.character.maxShield = armorSize;
        this.game.character.gold -= (armorSize * 10); 

        messages = messages || [];
        messages.push("You purchased a " + armorSize + " sized piece of armor for " + (armorSize * 10) + " gold.");
        this.enterTown(messages);
    }
    buySword(messages)
    {
        let max = Math.floor(this.game.character.gold / 100);
        let swordSize = -1;

        while (swordSize < 0 || swordSize > max)
        {
            let inputValue = prompt("How big of a sword would you like to purchase? (100 gold = 1 sword Max: " + max + ")", max);
            if (inputValue == null) //User hit cancel
            {
                this.game.mainMovement(messages);
                return;
            }

            if (_u.isNumeric(inputValue))
            {
                swordSize = parseInt(inputValue);
            } 
        }
        this.game.character.sword = swordSize;
        this.game.character.gold -= (swordSize * 100); 

        messages = messages || [];
        messages.push("You purchased a " + swordSize + " sized sword for " + (swordSize * 100) + " gold.");
        this.enterTown(messages);
    }
    leaveTown(messages)
    {
        messages = messages || [];
        let randomDirection = _u.getRandomInt(0, 7);
        switch (randomDirection)
        {
            case 0:
                this.game.character.moveNorthwest();
                break;
            case 1:
                this.game.character.moveNorth();
                break;
            case 2:
                this.game.character.moveNortheast();
                break;
            case 3:
                this.game.character.moveWest();
                break;
            case 4:
                this.game.character.moveEast();
                break;
            case 5:
                this.game.character.moveSouthwest();
                break;
            case 6:
                this.game.character.moveSouth();
                break;
            case 7:
                this.game.character.moveSoutheast();
                break;
        }   
        this.game.mainMovement(messages);
    }
    enterTown(messages)
    {
        let buttons = [];
        messages = messages || [];
        
        this.game.updateCharacterData();

        messages.push("Welcome to the town what would you like to do?");
        buttons.push({
            text : "Buy Healing", 
            enabled: true,
            callback: this.buyHeal.bind(this)
        });
        buttons.push({
            text : "Blacksmith", 
            enabled: true,
            callback: this.blackSmith.bind(this)
        });
        buttons.push({
            text : "Leave", 
            enabled: true,
            callback: this.leaveTown.bind(this)
        });
        this.game.interface.setupButtons(buttons,messages);
        return;
    }
}