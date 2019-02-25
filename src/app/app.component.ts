import { Component,OnInit } from '@angular/core';
import '@polymer/iron-image/iron-image.js';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Mandelbrot';
  value: string;
  checked: boolean;

  constructor(){}
  image:any;
   json={
      "x":0,
      "y":0,
      "pix_x":0.00825,
      "pix_y":0.00825,
      "width":720,
      "height":720,
      "max_depth":1225,
      "renderer":"cpp"
   }
   ngOnInit(){
     this.setParmeter();
   }
   setParmeter(){
    var json=JSON.stringify(this.json);
    var img_url="http://fractalvalley.net/img?json="+json;
    console.log(img_url)
    $(".image").attr("imgsrc",img_url);
   }
}
