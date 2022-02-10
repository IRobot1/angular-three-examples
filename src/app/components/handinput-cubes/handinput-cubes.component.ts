import { NgtRender } from "@angular-three/core";
import { Component, ViewChild } from "@angular/core";

import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { AppCanvasService } from "../../app.service";
import { GrabEndEvent, GrabStartEvent, XRControllerComponent } from "../xr-controller/xr-controller.component";


@Component({
  selector: 'app-handinput-cubes',
  templateUrl: './handinput-cubes.component.html',
})
export class HandInputCubesComponent {
  @ViewChild('xr0') xr0?: XRControllerComponent;
  @ViewChild('xr1') xr1?: XRControllerComponent;

  private leftstate?: GrabStartEvent;
  private rightstate?: GrabStartEvent;

  private spheres: Array<Mesh> = [];
  private grabbing = false;

  // scaling
  private active = false;
  private initialDistance = 0;
  private object?: Mesh;
  private initialScale = 1;


  constructor(private canvasService: AppCanvasService) { }

  private collideObject(indexTip: any): Mesh | undefined {

    const tmpVector1 = new Vector3();
    const tmpVector2 = new Vector3();

    for (let i = 0; i < this.spheres.length; i++) {

      const sphere = this.spheres[i];
      const distance = indexTip.getWorldPosition(tmpVector1).distanceTo(sphere.getWorldPosition(tmpVector2));

      if (sphere.geometry.boundingSphere) {
        if (distance < sphere.geometry.boundingSphere.radius * sphere.scale.x) {
          return sphere;
        }
      }
    }
    return undefined;
  }

  leftgrabstart(xr: XRControllerComponent, event: GrabStartEvent) {
    this.leftstate = event;
    if (this.grabbing) {

      const leftobject = event.grabbedobject;
      if (leftobject && this.rightstate) {
        const rightobject = this.rightstate.controller.userData.selected;
        console.log('sphere1', leftobject, 'sphere2', rightobject);
        if (leftobject === rightobject) {
          this.active = true;
          this.object = leftobject;
          this.initialScale = leftobject.scale.x;
          const indexTip = event.intersect;
          this.initialDistance = indexTip.position.distanceTo(this.rightstate.intersect.position);
        }
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

      const indexTip = event.intersect;
      spawn.position.copy(indexTip.position);
      spawn.quaternion.copy(indexTip.quaternion);

      this.spheres.push(spawn);

      if (this.canvasService.state) {
        this.canvasService.state.scene.add(spawn);
      }
    }
  }

  leftgrabend(xr: XRControllerComponent, event: GrabEndEvent) {
    this.active = false;
    this.leftstate = undefined;
  }

  rightgrabstart(xr: XRControllerComponent, event: GrabStartEvent) {
    this.rightstate = event;
    const indexTip = event.intersect;
    const object = this.collideObject(indexTip);
    if (object) {
      this.grabbing = true;
      indexTip.attach(object);
      event.controller.userData.selected = object;
      console.log('Selected', object);
    }

  }

  rightgrabend(xr: XRControllerComponent, event: GrabEndEvent) {
    if (event.controller.userData.selected) {
      const object = event.controller.userData.selected;
      object.material.emissive.b = 0;
      if (this.canvasService.state) {
        this.canvasService.state.scene.attach(object);
      }

      event.controller.userData.selected = undefined;
      this.grabbing = false;
    }
    this.active = false;
    this.rightstate = undefined;
  }

  animateGroup({ delta }: NgtRender) {

    if (this.active) {
      const indexTip1Pos = this.leftstate?.intersect.position;
      const indexTip2Pos = this.rightstate?.intersect.position;
      const distance = indexTip1Pos.distanceTo(indexTip2Pos);
      const newScale = this.initialScale + distance / this.initialDistance - 1;
      this.object?.scale.setScalar(newScale);

    }
  }
}
