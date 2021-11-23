
var _u = 
{
    getRandomPositiveInt : function(max) {
        return Math.floor(Math.random() * max);
    },

    getRandomInt : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max) + 1;
        return Math.floor(Math.random() * (max - min) + min); 
    },
    pad : function(num, size) {
        return num.pad(size,'0');
    },
    findCircle : function(location)
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
    },
    formatAMPM : function(date) 
    {
        return date.formatAMPM();
    },
    isNumeric : function(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
      
}
Number.prototype.pad = function( size, char) {
    let num = this.toString();
    while (num.length < size) num = char + num;
    return num;
}
Date.prototype.formatAMPM = function() 
{
    var hours = this.getHours();
    var minutes = this.getMinutes().pad(2,'0');
    var seconds = this.getSeconds().pad(2,'0');
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours.pad(2,'0') : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes + ':' + seconds  + ampm;
    return strTime;
}
Date.prototype.getShortDateTime = function()
{
    let dateString = this.getMonth() + "-" + this.getDate() + "-" + this.getFullYear();
    let timeString = this.formatAMPM();
    let returnValue = `${dateString} ${timeString}`;

    return returnValue;
}

String.prototype.tokenReplace = function(tokens)
{
    for (var i = 0; i < tokens.length; i++) {
       return this.replace(new RegExp("%"+i+"%","g"),tokens[i]);
    }
}

