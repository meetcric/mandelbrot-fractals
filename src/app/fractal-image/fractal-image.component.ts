import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material';
import * as interact from 'interactjs';
import { HostListener } from '@angular/core';

// declare var $: any;
declare var $: any;
declare var jQuery: any;


var a

@Component({
  selector: 'fractal-image',
  templateUrl: './fractal-image.component.html',
  styleUrls: ['./fractal-image.component.css']
})
export class FractalImageComponent implements OnInit {

  // {int} Controls the sensitivity of wheel zoom.
  WHEEL_ZOOM_SLUGGISHNESS_PIXELS = 600;

  // {int} A bit mask of the zoom button bit for interactjs event.button.
  ZOOM_BUTTON_MASK = 4;

  // {int} Controls the sensitivity of mouse-drag zoom.
  ZOOM_SLUGGISHNESS = 30;
  motion = "position";
  desired_image_properties: any
  image: any;
  colors: any;
  _zoom_level = 0;
  imageLoaded = true;
  present_image_properties = null;
  flag = true;

  // `true` iff the content is being dragged.
  dragging = false;
  motion_x = 0;
  motion_y = 0;



constructor() {
}

ngOnInit() {
  this.set(0, 0, 0.015625, 0.015625, 256, 256, 1225, "cpp", true);
  this.setParmeter();
  // Make images interactive.
  this.imageInteractive();
}


//set the parameter to the desired_image_properties object
set(x, y, pix_x, pix_y, width, height, max_depth, renderer, darken) {
  this.desired_image_properties = {
    x: x,
    y: y,
    pix_x: pix_x,
    pix_y: pix_y,
    width: width,
    height: height,
    max_depth: max_depth,
    renderer: renderer,
    darken: darken
  }
  this.present_image_properties = (JSON.parse(JSON.stringify(this.desired_image_properties)));

}
/**
 * setter and getter method
 */

set zoom_level(v) { this._zoom_level = v; }
get zoom_level() { return this._zoom_level; }

set scale(v) { this.zoom_level = Math.log(v); }
get scale() { return Math.exp(this.zoom_level); }

// Scale of 1.0 has size_y of 4.0.
get image_size_x() { return this.desired_image_properties.pix_x * this.desired_image_properties.width; }
get image_size_y() { return 4 / this.scale; }

// Pixel x/y are same, based on height.
get pix_size_x() { return this.pix_size_y; }
get pix_size_y() { return this.image_size_y / this.desired_image_properties.height; }

/**
 * sets the parameter to the image src
 */
setParmeter() {
  var json = JSON.stringify(this.desired_image_properties);
  var img_url = "http://127.0.1.1:8888/img?json=" + json;
  // console.log(json)
  console.log(img_url)
  $(".image").attr("src", img_url);
}
/**
 * Function that responsible for image-interaction
 */
imageInteractive() {
  interact(".image")
    .draggable({
      inertia: true
    })
    .on('up', (e) => {
      this.endDrag();
    })
    .on('dragstart', (e) => {
     this.dragging = true;
    })
    .on('dragend', (e) => {
      // Clear flag `dragging` to re-enable mouseclicks.
      // Uses setTimeout to ensure that actions currently firing (on mouseup at the end of a drag)
      // are still blocked from changing the content.
      this.endDrag();
    })
    .on('dragmove', (e) => {
      // this.debugMessage(`DragMove: e = ${e}`);
      // e.preventDefault();
      if ((e.buttons & this.ZOOM_BUTTON_MASK) != 0) {
        // Mouse button & drag used for zoom (not currently enabled).
        let amt = e.dy / this.ZOOM_SLUGGISHNESS;
        if (this.motion === "position") {
          this.desired_image_properties.zoomBy(amt);
        }
      } else {
        // Default for position.
        let dx = e.dx;
        let dy = e.dy;
        this.motion_x += dx;
        this.motion_y += dy;
        if (this.motion === "position") {
          this.panBy(dx, dy);
          
        }
      }
    })
    //@ts-ignore
    .on("wheel", (e) => {
      e.preventDefault();
      // console.log(e)
      let sluggishness;
      if (e.originalEvent.deltaMode == 0) {
        sluggishness = this.WHEEL_ZOOM_SLUGGISHNESS_PIXELS;
      }
      let amt = - e.originalEvent.deltaY / sluggishness;
      if (this.motion === "position") {
        this.zoomByAt(amt, (e.offsetX - e.target.clientWidth / 2.0) * this.desired_image_properties.pix_x,
          (e.offsetY - e.target.clientHeight / 2.0) * this.desired_image_properties.pix_y);
      }
    })

}
zoomByAt(v, offset_x, offset_y) {
  console.log(1)
  this.present_image_properties = (JSON.parse(JSON.stringify(this.desired_image_properties)));
  let scale_up = Math.exp(v);
  // console.log(`v: ${v}, offset_x: ${offset_x}, offset_y: ${offset_y}, scale_up: ${scale_up}`)

  this.zoom_level += v;
  // console.log(this.zoom_level);
  this.desired_image_properties.x += offset_x * (scale_up - 1) / scale_up;
  this.desired_image_properties.y += offset_y * (scale_up - 1) / scale_up;
  // console.log(v)
  this.desired_image_properties.pix_x = this.pix_size_x;
  this.desired_image_properties.pix_y = this.pix_size_y;
  console.log(this.desired_image_properties)
  if (this.flag) {
    this.updateImage();
  }
}
/**
 * Function responsible for the drag feature 
 */
panBy(horiz_pix, vert_pix) {
  this.desired_image_properties.x -= horiz_pix * this.pix_size_x;
  this.desired_image_properties.y -= vert_pix  * this.pix_size_y;
  if (this.flag) {
    this.updateImage();
  }
}

/**
 * It will call After the present image finish loading
 */
updateImage() {
  if (!(JSON.stringify(this.present_image_properties).toLowerCase() === JSON.stringify(this.desired_image_properties).toLowerCase())) {
    this.setParmeter();
    this.flag = false
    this.present_image_properties = (JSON.parse(JSON.stringify(this.desired_image_properties)));
  }
  else {
    this.flag = true;
  }
}
endDrag() {
  setTimeout(() => { this.dragging = false; }, 0);
}


}


