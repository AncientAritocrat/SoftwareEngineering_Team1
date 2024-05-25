import type  { Map } from 'vjmap'
// 自定义按钮控件
export class ButtonControl {
    container!: any;
    panel!: HTMLDivElement;
    map: any;
    options: Record<string, any>;
    constructor(options: Record<string, any> = {}) {
        this.options = options;
    }
    _insertControl() {
        this.container = document.createElement("div");
        const button = document.createElement("input");
        button.type = this.options.type ?? "button";
        button.value = this.options.text ?? "";
       
        if (this.options.style) {
            const keys = Object.keys(this.options.style);
            keys.forEach((k: any) => button.style[k] = this.options.style[k])
        }
        // @ts-ignore
        this.onClick = () => {
            if (typeof (this.options.onClick) == 'function') {
                this.options.onClick(this);
            }
        }
        // @ts-ignore
        button.addEventListener("click", this.onClick);
        this.container.classList.add("vjmapgis-ctrl");
        this.container.appendChild(button);
        if (button.type == "checkbox" && button.value) {
            const txt = document.createElement("span");
            txt.innerHTML = button.value;
            this.container.appendChild(txt);
        }
        return this.container;
    }
    onAdd(map: Map) {
        this.map = map;
        this._insertControl();
        return this.container;
    }

    onRemove() {
        // @ts-ignore
        if (this.onClick) this.container.removeEventListener("click", this.onClick);
        this.container.parentNode.removeChild(this.container);
    }

    getDefaultPosition() {
        return "top-left";
    }
}