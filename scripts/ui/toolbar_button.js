export class toolbar_button 
{
    constructor(id, clickEvent)
    {
        this.element = document.getElementById(id);
        this.element.addEventListener("click", clickEvent);
        this.callback = function() { };
        this.id = id;
        this.enabled = false;
        this.data;
    }


    setState(text, enabled, callback, data)
    {
        this.element.innerText = text;
        this.element.title = text;
        this.enabled = enabled || typeof(enabled) == "undefined";
        this.callback = callback;
        this.data = data;

        if (this.enabled)
        {
            this.element.classList.remove("disabled");
            this.element.removeAttribute("aria-disabled");
        } else {
            this.element.classList.add("disabled");
            this.element.setAttribute("aria-disabled",true);
        }
    }


}