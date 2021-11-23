export class navigation_button 
{
    constructor(id, clickEvent)
    {
        this.element = document.getElementById(id);
        this.element.addEventListener("click", clickEvent);
        this.id = id;
        this.enabled = false;
        this.data;
    }

    enable()
    {
        this.enabled = true;
        this.element.classList.remove("disabled");
        this.element.removeAttribute("aria-disabled");
    }

    disable()
    {
        this.enabled = false;
        this.element.classList.add("disabled");
        this.element.setAttribute("aria-disabled",true);
    }


}