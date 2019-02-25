import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class FractalView extends PolymerElement {
  static get template() {   
    
    return html`
        <style>
            :host{
            }
        </style>
        <div>
        <img  src={{imgsrc}} />
        </div>
    `;
  }

  static get properties() {
    return {
        imgsrc:{
            type: String,
            value:''
        }
        
    };
  }


}

window.customElements.define('fractal-view', FractalView);