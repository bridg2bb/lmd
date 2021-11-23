export class battle {
    constructor(parentGame, creatures) 
    {
        this.game = parentGame;
        this.creature = undefined;
        this.creatures = creatures;
        
    }

    getRandomCreatureForCircle(circle)
    {
        let creaturesForThisCircle = [];
        this.creatures.forEach(creature => {
            let aboveMin = creature.minCircle == 0 || circle >= creature.minCircle;
            let belowMax = creature.maxCircle == 0 || circle <= creature.maxCircle;
            if (aboveMin && belowMax)
            {
                creaturesForThisCircle.push(creature);
            }
        });
        let randomCreatureIndex = _u.getRandomInt(0, creaturesForThisCircle.length - 1);
        let creature = creaturesForThisCircle[randomCreatureIndex];
        creature.roll(circle);
        
        return creature;
    }

    

    playerAttack(messages)
    {
        messages = messages || [];
        let playerAttackCriteria = 2;
        if (this.game.character.dex >= this.creature.dex) 
        {
            let percentHigher = Math.floor(this.creature.dex / this.game.character.dex * 100);
            if (percentHigher < 50)
            {
                playerAttackCriteria += 5;
            } 
            else if (percentHigher < 75)
            {
                playerAttackCriteria += 2;
            } else {
                playerAttackCriteria += 1;
            }
        
        } else {
            let percentHigher = Math.floor(this.game.character.dex / this.creature.dex * 100);
            if (percentHigher < 50)
            {
                playerAttackCriteria -= 1;
            } 
        }
        let playerAttackFactor = _u.getRandomInt(0, playerAttackCriteria);
        if (playerAttackFactor >= 1)
        {
            let playerDamage = _u.getRandomInt(this.game.character.level * 2, this.game.character.str * 2 + this.game.character.sword + this.game.character.level * 2);
            if (playerDamage != 0 && playerDamage <= (this.game.character.str  * 2 + this.game.character.sword) / 2)
            {
                playerDamage = Math.floor(playerDamage * 1.33);
            }
            this.creature.health -= playerDamage;
            messages.push("You hit the " + this.creature.displayName().toLowerCase() + " for " + playerDamage + " damage!");
        } else {
            messages.push("You missed the "  + this.creature.displayName().toLowerCase() + "." );
        }

     
        this.creatureAttack(messages);
    }


    

    creatureAttack(messages)
    {
        messages = messages || [];

        let creatureAttackCriteria = 2;
        if (this.creature.dex >= this.game.character.dex) 
        {
            let percentHigher = Math.floor(this.game.character.dex / this.creature.dex * 100);
            if (percentHigher < 50)
            {
                creatureAttackCriteria += 5;
            } 
            else if (percentHigher < 75)
            {
                creatureAttackCriteria += 2;
            } else {
                creatureAttackCriteria += 1;
            }
        
        } else {
            let percentHigher = Math.floor(this.creature.dex / this.game.character.dex * 100);
            if (percentHigher < 50)
            {
                creatureAttackCriteria -= 1;
            } 
        }
        let creatureAttackFactor = _u.getRandomInt(0, creatureAttackCriteria);

        if (creatureAttackFactor > 1)
        {
            let creatureDamage = _u.getRandomInt(0 + this.creature.level, this.creature.str);

            messages = this.game.character.takeDamage(creatureDamage,messages);
            messages.push("The " + this.creature.displayName().toLowerCase() + " did " + creatureDamage + " damage to you!");
            this.game.interface.updateCharacterInfo();
        } else {
            messages.push("The "  + this.creature.displayName().toLowerCase() + " missed you." );
        }
        this.combatStep(messages);
    }

    

    run ()
    {
        let runCriteria = 3;
        let messages = [];
        if (this.creature.dex >= this.game.character.dex) 
        {
            let percentHigher = Math.floor(this.game.character.dex / this.creature.dex * 100);
            if (percentHigher < 50)
            {
                runCriteria += 1;
            } 
            else if (percentHigher < 75)
            {
                runCriteria += 2;
            } else {
                runCriteria += 3;
            }
        
        } else {
            let percentHigher = Math.floor(this.creature.dex / this.game.character.dex * 100);
            if (percentHigher < 50)
            {
                runCriteria += 5;
            } 
            else if (percentHigher >= 50)
            {
                runCriteria += 3;
            } 
        }
        let runFactor = _u.getRandomInt(0, runCriteria);
        if (runFactor > 2)
        {
                
            
            messages.push("You successfully ran away!"); 
            let buttons = [];
            buttons.push( {
                text: "Continue",
                callback: this.game.mainMovement.bind(this.game)
            });
            this.game.interface.setupButtons(buttons,messages);
        } else {
          
            messages.push("You were unable to run away!");
            this.creatureAttack(messages);
        }

    }

    rest (messages)
    {
        messages = messages || [];
        let healthIncreased = this.game.character.rest();
        messages.push("You gained " + healthIncreased + " health from resting."); 
        this.creatureAttack(messages);
    }


    
    combatStep(messages)
    {
        messages = messages || [];
        this.game.updateCharacterData();
        if (this.creature.health <= 0)
        {
            this.creature.death(messages);
            return;
        } 

        if (this.game.character.health <= 0 && typeof(this.game.character.race) != "undefined")
        {
            this.game.gameOver();
            return;
        }
        messages.push(this.creature.displayName() + " " + this.creature.health + "/" + this.creature.fullHealth);
        
        let buttons = [];
        buttons.push( {
            text: "Attack",
            callback: this.playerAttack.bind(this)
        });
        buttons.push( {
            text: "Attempt to run",
            callback: this.run.bind(this)
        });
        buttons.push( {
            text: "Rest",
            callback: this.rest.bind(this)
        });
        this.game.interface.setupButtons(buttons, messages);
    }

    start()
    {
        let messages = [];

        this.game.interface.disableNavigation();

    
        messages.push("Combat started."); 
        
        this.creature = this.getRandomCreatureForCircle(this.game.character.getCircle());

        let snuckUp = false;
        let creatureSnuckUp = false;
        if (this.game.character.dex >= this.creature.dex)
        {
            let snuckUpRand = _u.getRandomInt(0,10);
            snuckUp = snuckUpRand == 9;
        } else {
            let snuckUpRand = _u.getRandomInt(0,10);
            creatureSnuckUp = snuckUpRand == 9;
        }
        
        if (creatureSnuckUp)
        {
            let creatureDamage = _u.getRandomInt(0, this.creature.str);
            messages = this.game.character.takeDamage(creatureDamage,messages);
            messages.push(this.creature.prefix + " " + this.creature.displayName().toLowerCase() + " snuck up behind you and did " + creatureDamage + " to you.");
        } else if (snuckUp)
        {
            let playerDamage = _u.getRandomInt(0, this.game.character.str + this.game.character.sword);
            messages.push("You snuck up on " + this.creature.prefix.toLowerCase() + " " + this.creature.displayName().toLowerCase() + " and did " + playerDamage + ".");
            this.creature.health -= playerDamage;
        }

        if (!snuckUp && !creatureSnuckUp)
        {
            this.game.interface.addMessage("You come upon " + this.creature.prefix.toLowerCase() + " " + this.creature.displayName().toLowerCase());
        }
        this.combatStep(messages);
      
    }
}