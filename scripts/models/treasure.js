export class treasure {
    constructor(data)
    {
        this.message = data.message;
        this.weight = data.weight;
        this.minGold = typeof(data.minGold) == "undefined" ? 0 : data.minGold;
        this.maxGold = typeof(data.maxGold) == "undefined" ? 0 : data.maxGold;
        this.minExp = typeof(data.minExp) == "undefined" ? 0 : data.minExp;
        this.maxExp = typeof(data.maxExp) == "undefined" ? 0 : data.maxExp;
        this.minSword = typeof(data.minSword) == "undefined" ? 0 : data.minSword;
        this.maxSword = typeof(data.maxSword) == "undefined" ? 0 : data.maxSword;
        this.minShield = typeof(data.minShield) == "undefined" ? 0 : data.minShield;
        this.maxShield = typeof(data.maxShield) == "undefined" ? 0 : data.maxShield;
    }

  
    treasureEvent(messages)
    {
        this.interface.disableNavigation();
        let treasureToChooseFrom = [];
        messages = messages || [];

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
        
        this.interface.addMessage(messages.join('\n'));
        let buttons = [];
        buttons.push( {
            text: "Continue",
            callback: this.mainMovement.bind(this)
        });
        this.interface.setupButtons(buttons);
    }
}