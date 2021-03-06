// BSD 3-Clause License

// Copyright (c) 2018, meetcric
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.

// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.

// * Neither the name of the copyright holder nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


/** Angular Imports */
import { Component, OnInit, NgZone } from '@angular/core';

/** Interact.js Library Imports */
import * as interact from 'interactjs';

/** ResizeObserver Library Imports */
import ResizeObserver from 'resize-observer-polyfill';

/** Defining JQuery */
declare var $: any;
declare var jQuery: any;


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
  //Variable needed for Velocity mode
  timeouts_per_frame = 2;
  // Frames per second (roughly)
  frame_rate = 25;
  // Factor by which video will be sped up vs. realtime capture. (Just factors into frame_rate.)
  video_speedup = 1.4;
  //Varible for Motion_Timeout 
  MOTION_TIMEOUT = Math.round(1000 / this.frame_rate * this.video_speedup / this.timeouts_per_frame);
  // {float} Multiplier for velocity.
  VELOCITY_FACTOR = 1 / this.MOTION_TIMEOUT;  // Move by mouse position every second.
  // {float} Multiplier for zoom velocity.
  ZOOM_VELOCITY_FACTOR = this.VELOCITY_FACTOR * 0.6;
  // {float} Multiplier for acceleration.
  ACCELERATION_FACTOR = this.VELOCITY_FACTOR / this.MOTION_TIMEOUT; // Every second, increase velocity by mouse position/sec.
  // {float} Multiplier for zoom acceleration.
  ZOOM_ACCELERATION_FACTOR = this.ACCELERATION_FACTOR * 0.6;

  // `true` iff the content is being dragged.
  dragging = false;
  motion_x = 0;
  motion_y = 0;
  motion_z = 0;
  velocity_x = 0;
  velocity_y = 0;
  velocity_z = 0;

  //Varibale used for setter and getter method for zoom_level
  _zoom_level = 0;
  // Setting the motion attribute to "position"
  motion = "position";
  //object for fractal-image's properties
  desired_image_properties: any;
  present_image_properties :any;
  //This is a boolean variable used in updatingImage after any interaction
  flag = true;

  constructor(private ngzone: NgZone) {
  }

  ngOnInit() {
    //Set Default required parameter of the Fractal-Image
    this.set(0, 0, 0.015625, 0.015625, 256, 256, 1225, "cpp", true);
    //set Image parameter to img-src
    this.setParmeter();

    // Make images interactive.
    this.imageInteractive();

    //Modification to make ResizeObserver Work in Angular.
    this.ngzone.runOutsideAngular(() => {
      this.ro.observe($("#imagesContainer")[0]);
    });
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

  //set the parameter to the desired_image_properties and present_image_properties object 
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
   * sets the parameter to the image src
   */
  setParmeter() {
    var json = JSON.stringify(this.desired_image_properties);
    var img_url = "http://127.0.1.1:8888/img?json=" + json;
    $(".image").attr("src", img_url);
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

  /**
   * Function that responsible for image-interaction
   */
  imageInteractive() {
    interact(".image")
      .draggable({
        inertia: true
      })
      .on('down', (e) => {
        // Set flag `dragging`.
        this.dragging = true;
        if (this.motion !== "position") {
          //@ts-ignore
          this.motion_x = e.offsetX - e.target.clientWidth / 2.0;
          //@ts-ignore
          this.motion_y = e.offsetY - e.target.clientHeight / 2.0;
          this.motion_z = 0;
          this.velocity_x = 0;
          this.velocity_y = 0;
          this.velocity_z = 0;
          this.setMotionTimeout();
        }
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
        let sluggishness;
        if (e.originalEvent.deltaMode == 0) {
          sluggishness = this.WHEEL_ZOOM_SLUGGISHNESS_PIXELS;
        }
        let amt = - e.originalEvent.deltaY / sluggishness;
        if (this.motion === "position") {
          this.zoomByAt(amt, (e.offsetX - e.target.clientWidth / 2.0) * this.desired_image_properties.pix_x,
            (e.offsetY - e.target.clientHeight / 2.0) * this.desired_image_properties.pix_y);
        }
        else {
          this.motion_z += amt;
        }
      })

  }

  /**
   * Function responsible for zooming feature
   */
  zoomByAt(v, offset_x, offset_y) {
    this.present_image_properties = (JSON.parse(JSON.stringify(this.desired_image_properties)));
    let scale_up = Math.exp(v);
    this.zoom_level += v;
    this.desired_image_properties.x += offset_x * (scale_up - 1) / scale_up;
    this.desired_image_properties.y += offset_y * (scale_up - 1) / scale_up;
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
    this.desired_image_properties.y -= vert_pix * this.pix_size_y;
    if (this.flag) {
      this.updateImage();
    }
  }

  endDrag() {
    setTimeout(() => { this.dragging = false; }, 0);
  }

  setMotionTimeout() {
    setTimeout(() => { this.applyMotion(); }, this.MOTION_TIMEOUT);
  }

  /**
   * Function responsible for velocity mode
   */
  applyMotion() {
    if (this.dragging) {
      this.velocity_x = this.motion_x * - this.VELOCITY_FACTOR;
      this.velocity_y = this.motion_y * - this.VELOCITY_FACTOR;
      this.velocity_z = this.motion_z * this.ZOOM_VELOCITY_FACTOR;
      this.panBy(this.velocity_x, this.velocity_y);
      this.zoomBy(this.velocity_z)
      this.setMotionTimeout();
    }
  }
  /**
   * Function responsible for zooming in velocity mode
   */
  zoomBy(v) {
    this.zoom_level += v;
    this.desired_image_properties.pix_x = this.pix_size_x;
    this.desired_image_properties.pix_y = this.pix_size_y;
  }

  /**
   * when a user resizes the resizable container, this method is invoked
   */
  public ro = new ResizeObserver(entries => {
    this.sizeFullViewer();
  });

  /**
   *  Adjust full viewer to its container size.
   */
  sizeFullViewer() {
    let c = $("#imagesContainer");
    let w = c.width();
    let h = c.height();
    this.sizeViewer(c);
  }

  // Set viewer or playback view based on the size of the container component.
  sizeViewer(container_el) {

    let c = container_el;
    let c_w = c.width();
    let w = c_w; // Assuming not stereo.
    let h = c.height();


    w = Math.floor(w / 2) * 2; // use multiples of two so center is a whole number.
    h = Math.floor(h / 2) * 2;

    //set width and height of image
    this.desired_image_properties.width = w;
    this.desired_image_properties.height = h;

    //set pix_x and pix_y of image
    this.desired_image_properties.pix_x = this.pix_size_x;
    this.desired_image_properties.pix_y = this.pix_size_y;
    if (this.flag) {
      this.updateImage();
    }
  }
}


