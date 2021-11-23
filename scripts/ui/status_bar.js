export class status_bar 
{
    constructor(id)
    {
        this.element = document.getElementById(id);
        this.textElement = this.element.querySelector(".bar-text-value");
        this.valueElement = this.element.querySelector(".bar-value");
        
        this.id = id;
        this.min = 0;
        this.max = 0;
        this.boostValue = 0;
        this.boostMax = 0;
        this.value = this.max;
    }

    updateLimits(min, max, boostMin, boostMax)
    {
        if (min > max)
        {
            console.log("updateLimits was called on bar " + this.id + " with a min value > than max");
            return;
        }
        this.min = min;
        this.max = max;
        if (boostMin != null && typeof(boostMin) != "undefined")
        {
            this.boostValue = boostMin;
        }
        if (boostMax != null && typeof(boostMax) != "undefined")
        {
            this.boostMax = boostMax;
        }
    }

    updateValue(value, boostValue)
    {
        if (value < this.min)
        {
            value = this.min;
        }
        this.value = value;
        if (_u.isNumeric(boostValue))
        {
            this.boostValue = boostValue;
        }
    }


    percent()
    {

        return _u.isNumeric(this.boostValue) && this.boostValue > 0 ? Math.floor((this.value + this.boostValue) / ( this.max + this.boostMax) * 100) : Math.floor(this.value / this.max * 100);
    }

    update()
    {
        this.valueElement.style.width = this.percent() + "%";
        if (this.boostValue > 0)
        {
            this.textElement.innerText = this.value + "/" + this.max + "+(" + this.boostValue + "/" + this.boostMax + ")";
        } else {
            this.textElement.innerText = this.value + "/" + this.max;
        }
    }
    
}