export class message {
    constructor(time,message)
    {
        this.element = document.createElement("div");
        this.element.classList.add("gameMessage");
        if (message.length == 0)
        {
            this.element.innerHTML = "&nbsp;";
            this.element.classList.add("blankMessage");
        } else {
            this.element.innerHTML = `<pre class="messageTime">${time}></pre><pre class="messageBody">${message}</pre>`;
        }
    }
}