

export class creature
{
    constructor(data, game)
    {
        this.name = data.name;
        this.minHealth = data.minHealth;
        this.maxHealth = data.maxHealth;
        this.health = this.maxHealth;
		this.fullHealth = this.maxHealth;
        this.minStr = data.minStr;
        this.maxStr = data.maxStr;
        this.str = data.maxStr
        this.minDex = data.minDex;
        this.maxDex = data.maxDex;
        this.dex = data.maxDex;
        this.minCircle = data.minCircle;
        this.maxCircle = data.maxCircle;
        this.prefix = data.prefix;
        this.level = 0;
        this.circle = 0;
        this.game = game;
    }

    displayName() {
        return this.name + " (Lvl " + this.level + ")";
    }
    
    roll(circle) 
    {
        circle++;
        this.circle = circle;
        this.level = _u.getRandomInt(circle < 2 ? 1 : circle - 1, circle + 1);
        this.health = _u.getRandomInt(this.minHealth * this.level, this.maxHealth * this.level);
        this.fullHealth = this.health;
        this.str = _u.getRandomInt(this.minStr * this.level, this.maxStr * this.level);

        this.dex = _u.getRandomInt(this.minDex * this.level, this.maxDex * this.level);
        
    }

    death(messages)
    {
        
        messages = messages || [];
       
        messages.push("You killed the " + this.displayName().toLowerCase()  + "!");

        
        let gold = _u.getRandomInt(0, this.maxHealth);
        if (gold >= 50)
        {
            this.game.character.gold += gold;
            messages.push("You found " + gold + " gold on the " + this.displayName().toLowerCase() + ".");
        }


        let experience = this.maxHealth;
        this.game.character.experience += experience;
        messages.push("You gained " + experience + " xp from the " + this.displayName().toLowerCase() + ".");

        let experienceMessages = this.game.character.processExperience();

        experienceMessages.forEach(message => { messages.push(message); });
        this.game.updateCharacterData();

        
        let buttons = [];

        buttons.push( {
            text: "Continue",
            callback: this.game.mainMovement.bind(this.game)
        });
        this.game.interface.setupButtons(buttons,messages);
    }
}