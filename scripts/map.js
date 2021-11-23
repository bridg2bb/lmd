export class map
{
    constructor(game)
    {
        this.game = game;
		this.areas = [];
    }
	inArea(location)
	{
		let circle = this.findCircle(location);
		let returnValue = null;
		this.areas.forEach(area => {
			if (area.startCircle <= circle && area.endCircle > circle)
			{
				returnValue = area;
				return;
			}
		});
		return returnValue;
	}
    nearestTown()
    {
        var x = Math.round(this.game.character.location.x / 100) * 100; //Closest X
        var y = Math.round(this.game.character.location.y / 100) * 100; //Closest y

        if (x == 0 && this.game.character.location.x < 0)
        {
            x = -100;
        } else if (x == 0 && this.game.character.location.x > 0)
        {
            x = 100;
        } 
        if (y == 0 && this.game.character.location.y < 0)
        {
            y = -100;
        } else if (y == 0 && this.game.character.location.y > 0)
        {
            y = 100;
        } 
        Math.abs(this.game.character.location.x - x) <= Math.abs(this.game.character.location.y - y) ? y = x : x = y;
        return {
            x: x,
            y: y
        }
    }
    closeEnoughToMoveToTown()
    {
        let nearestTown = this.nearestTown();
        let xDifference = Math.abs(this.game.character.location.x - nearestTown.x);
        let yDifference = Math.abs(this.game.character.location.y - nearestTown.y);

        return xDifference + yDifference <= this.game.character.level + 1;
    }
    findCircle(location)
    {
        let x = location.x;
        let y = location.y;
        if (location.x < 0)
        {
            x = x * -1;
        }
        if (location.y < 0)
        {
            y = y * -1;
        }
        let circleX = Math.floor(x / 100);
        let circleY = Math.floor(y / 100);
        return circleX > circleY ? circleX : circleY;
    }
}