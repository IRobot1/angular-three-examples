import { NgtRender } from "@angular-three/core";
import { Component, ViewChild } from "@angular/core";

import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { AppCanvasService } from "../../app.service";
import { GrabEndEvent, GrabStartEvent, XRControllerComponent } from "../xr-controller/xr-controller.component";

//
// EXAMPLE NOT WORKING YET
//

@Component({
  selector: 'app-handinput-cubes',
  templateUrl: './handinput-cubes.component.html',
})
export class HandInputCubesComponent {
  @ViewChild('xr0') xr0?: XRControllerComponent;
  @ViewChild('xr1') xr1?: XRControllerComponent;

  private lefthand?: GrabStartEvent;
  private righthand?: GrabStartEvent;

  private bothgrabbing = false;

  // scaling
  private active = false;
  private initialDistance = 0;
  private initialScale = 1;


  constructor(private canvasService: AppCanvasService) { }

  private checkbothgrabbing(): boolean {
    if (!(this.lefthand && this.righthand)) return false;

    const leftobject = this.lefthand.grabbedobject;
    const rightobject = this.righthand.grabbedobject;

    return leftobject === rightobject;
      this.active = true;
      this.initialScale = leftobject.scale.x;
      //const indexTip = event.intersect;
      //this.initialDistance = indexTip.position.distanceTo(this.rightstate.intersect.position);
  }

  leftgrabstart(xr: XRControllerComponent, event: GrabStartEvent, room: Group) {
    this.lefthand = event;
    //if (this.bothgrabbing) {
    //  const leftobject = event.grabbedobject;
    //  if (leftobject && this.righthand) {
    //    const rightobject = this.righthand.controller.userData.selected;
    //    console.log('sphere1', leftobject, 'sphere2', rightobject);
    //    if (leftobject === rightobject) {
    //      this.active = true;
    //      this.initialScale = leftobject.scale.x;
    //      const indexTip = event.intersect;
    //      this.initialDistance = indexTip.position.distanceTo(this.righthand.intersect.position);
    //    }
    //  }
    //}
    if (event.grabbedobject) {
      if (event.controller) {
        event.controller.attach(event.grabbedobject);
        event.controller.userData.selected = event.grabbedobject;
      }
      if (xr.trackedpointerline) {
        xr.trackedpointerline.scale.z = event.intersect.distance;
      }
    }
    else {
      const geometry = new BoxGeometry(0.05, 0.05, 0.05);
      const material = new MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 1.0,
        metalness: 0.0
      });
      const spawn = new Mesh(geometry, material);
      spawn.geometry.computeBoundingSphere();
      spawn.name = 'box' + room.children.length.toString();

      let position: Vector3;
      let quaternion: Quaternion;

      //const indexTip = event.intersect;
      //if (indexTip) {
      //  position = indexTip.position;
      //  quaternion = indexTip.quaternion;
      //}
      //else  {
      position = event.controller.position;
      quaternion = event.controller.quaternion;
      //}
      spawn.position.copy(position);
      spawn.quaternion.copy(quaternion);

      room.add(spawn);
    }
  }

  leftgrabend(xr: XRControllerComponent, event: GrabEndEvent, room: Group) {
    if (event.controller.userData.selected) {
      const object = event.controller.userData.selected;
      object.material.emissive.b = 0;

      room.attach(object);

      event.controller.userData.selected = undefined;
      if (xr.trackedpointerline) {
        xr.trackedpointerline.scale.z = 1.5;
      }
    }
    else {
      this.active = false;
      this.lefthand = undefined;
    }
  }

  rightgrabstart(xr: XRControllerComponent, event: GrabStartEvent, room: Group) {
    this.righthand = event;
    if (event.grabbedobject) {
      this.bothgrabbing = true;

      //event.intersect.attach(event.grabbedobject);
      event.controller.userData.selected = event.grabbedobject;
      console.log('Selected', event.grabbedobject);
    }

  }

  rightgrabend(xr: XRControllerComponent, event: GrabEndEvent, room: Group) {
    if (event.controller.userData.selected) {
      const object = event.controller.userData.selected;
      object.material.emissive.b = 0;
      room.attach(object);

      event.controller.userData.selected = undefined;
      this.bothgrabbing = false;
    }
    this.active = false;

    this.righthand = undefined;
  }

  animateGroup({ delta }: NgtRender) {

    if (this.active) {
      console.warn('scaling')
      const indexTip1Pos = this.lefthand?.intersect.position;
      const indexTip2Pos = this.righthand?.intersect.position;
      const distance = indexTip1Pos.distanceTo(indexTip2Pos);
      const newScale = this.initialScale + distance / this.initialDistance - 1;
      this.lefthand?.grabbedobject.scale.setScalar(newScale);

    }
  }
}
