

export class character
{
    constructor(game, character)
    {
        this.name = character ? character.name : "" ;
        this.health = character ? character.health : 0;
        this.maxHealth = character ? character.maxHealth : 0;
        this.str = character ? character.str : 0;
        this.maxStr = character ? character.maxStr : 0;
        this.dex = character ? character.dex : 0; 
        this.maxDex = character ? character.maxDex : 0;
        this.race = character ? character.race : null;
        this.level = character ? character.level : 1;
        this.experience = character ? character.experience : 0;
        this.nextLevel = character ? character.nextLevel : 2000;
        this.gold = character ? character.gold : 0;
        this.location = character ? character.location : {
            x : 0,
            y : 0
        };
        this.sword = character ? character.sword : 0;
        this.maxSword = character ? character.maxSword : 0;
        this.shield = character ? character.shield : 0;
        this.maxShield = character ? character.maxShield : 0;
        this.date = character ? new Date(Date.parse(character.date)) : new Date();
		this.game = game;
        
    }

    getSave()
    {
        return {
            name: this.name,
            health: this.health,
            maxHealth: this.maxHealth,
            str: this.str,
            maxStr: this.maxStr,
            dex: this.dex,
            maxDex: this.maxDex,
            race: this.race,
            level: this.level,
            experience: this.experience,
            nextLevel: this.nextLevel,
            gold: this.gold,
            location: this.location,
            sword: this.sword,
            maxSword: this.maxSword,
            shield: this.shield,
            maxShield: this.maxShield,
            date: new Date()
        };
    }
    processExperience()
    {
        let returnMessages = [];
        while(this.experience > this.nextLevel)
        {
            this.level ++;
            this.health += 100;
            this.maxHealth += 100;
            this.str += 3;
            this.maxStr += 3;
            this.dex += 2;
            this.maxDex += 2;
            this.experience -= this.nextLevel;
            this.nextLevel = Math.floor(this.nextLevel * 1.33);
            returnMessages.push("You gained a level. +100 health +3 strength +3 dexterity");
        }
        return returnMessages;
    }

    takeDamage(damage,messages)
    {
        if (this.shield > 0)
        {
            this.shield -= damage;
        }
        if (this.shield < 0)
        {
            this.health  += this.shield;
            this.maxShield = 0;
            this.shield = 0;
            messages.push("Your armor broke!");
        } else if (this.shield == 0) 
        {
            this.health -= damage;
        }
        return messages;
    }
	getLocationDisplay()
	{
		let area = this.game.map.inArea(this.location);
		let returnValue = `(${this.location.x},${this.location.y})`;
		if (area != null)
		{
			returnValue += ` ${area.name}`;
		}
		return returnValue;
	}

    getCircle()
    {
        return _u.findCircle(this.location);
    }
    roll() 
    {
       this.health = _u.getRandomInt(this.race.minHealth, this.race.maxHealth);
       this.maxHealth = this.health;
       this.str = _u.getRandomInt(this.race.minStr, this.race.maxStr);
       this.maxStr = this.str;
       this.dex = _u.getRandomInt(this.race.minDex, this.race.maxDex);
       this.maxDex = this.dex;
    }

   
    moveNorthwest()
    {
        this.move("nw");
    }
    moveNorth()
    {
        this.move("n");
    }
    moveNortheast()
    {
        this.move("ne");
    }
    moveWest()
    {
        this.move("w");
    }
    moveEast()
    {
        this.move("e");
    }
    moveSouthwest()
    {
        this.move("sw");
    }
    moveSouth()
    {
        this.move("s");
    }
    moveSoutheast()
    {
        this.move("se");
    }

    rest()
    {
        if (this.health != this.maxHealth)
        {
            let healthToIncrease = _u.getRandomInt(Math.floor(this.maxHealth * .05), Math.floor(this.maxHealth * .125));
            let missingHealth = this.maxHealth - this.health;

            if (missingHealth < healthToIncrease)
            {
                healthToIncrease = missingHealth;
            }

            this.health += healthToIncrease;

            return healthToIncrease;
        }
        return 0;
    }

    move(direction)
    {
        let distance = this.level + 1;
        switch (direction)
        {
            case "nw":
                this.location.x -= Math.floor(distance / 2);
                this.location.y += Math.floor(distance / 2);
                break;
            case "n":
                this.location.y += distance;
                break
            case "ne":
                this.location.x += Math.floor(distance / 2);
                this.location.y += Math.floor(distance / 2);
                break;
            case "w":
                this.location.x -= distance;
                break;
            case "e":
                this.location.x += distance;
                break;
            case "sw":
                this.location.x -= Math.floor(distance / 2);
                this.location.y -= Math.floor(distance / 2);
                break;
            case "s":
                this.location.y -= distance;
                break
            case "se":
                this.location.x += Math.floor(distance / 2);
                this.location.y -= Math.floor(distance / 2);
                break;
        }
    }
};


