import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";

import * as THREE from 'three';
import { Color, Vector3 } from 'three';
import { XRControllerComponent } from "../xr-controller/xr-controller.component";


class RandomSettings {
  constructor(public color: string, public position: Vector3, public velocity: Vector3) { }
}


@Component({
  selector: 'app-ballshooter',
  templateUrl: './ballshooter.component.html',
})
export class BallshooterComponent implements OnInit, AfterViewInit {
  @ViewChild('xr0') xr0?: XRControllerComponent;
  @ViewChild('xr1') xr1?: XRControllerComponent;

  radius = 0.08;

  shapes: Array<RandomSettings> = [];

  private state?: NgtCreatedState;

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.shapes.push(new RandomSettings(
        '#' + new Color(Math.random() * 0xffffff).getHexString(),
        new Vector3(Math.random() * 4 - 2, Math.random() * 4, Math.random() * 4 - 2),
        new Vector3(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005),
      ));
    }
  }

  ngAfterViewInit(): void {
    if (this.state) {
      if (this.xr0) this.xr0.ready(this.state);
      if (this.xr1) this.xr1.ready(this.state);
    }
  }


  ready(state: NgtCreatedState): void {
    this.state = state;
  }

  private count = 0;

  private handleController(room: THREE.Group, controller?: THREE.Group) {
    if (controller && controller.userData.isSelecting) {
      const object = room.children[this.count++];

      if (object) {
        object.position.copy(controller.position);
        object.userData.velocity.x = (Math.random() - 0.5) * 3;
        object.userData.velocity.y = (Math.random() - 0.5) * 3;
        object.userData.velocity.z = (Math.random() - 9);
        object.userData.velocity.applyQuaternion(controller.quaternion);
      }
      if (this.count === room.children.length) this.count = 0;
    }
  }

  animateGroup({ delta }: NgtRender, room: THREE.Group) {
    if (this.xr0 ) { this.handleController(room, this.xr0.controller); }
    if (this.xr1 ) { this.handleController(room, this.xr1.controller); }

    const radius = this.radius;
    const range = 3 - radius;
    let normal = new THREE.Vector3();
    const relativeVelocity = new THREE.Vector3();

    for (let i = 0; i < room.children.length; i++) {

      const object = room.children[i];

      object.position.x += object.userData.velocity.x * delta;
      object.position.y += object.userData.velocity.y * delta;
      object.position.z += object.userData.velocity.z * delta;

      // keep objects inside room

      if (object.position.x < - range || object.position.x > range) {

        object.position.x = THREE.MathUtils.clamp(object.position.x, - range, range);
        object.userData.velocity.x = - object.userData.velocity.x;

      }

      if (object.position.y < radius || object.position.y > 6) {

        object.position.y = Math.max(object.position.y, radius);

        object.userData.velocity.x *= 0.98;
        object.userData.velocity.y = - object.userData.velocity.y * 0.8;
        object.userData.velocity.z *= 0.98;

      }

      if (object.position.z < - range || object.position.z > range) {

        object.position.z = THREE.MathUtils.clamp(object.position.z, - range, range);
        object.userData.velocity.z = - object.userData.velocity.z;

      }

      for (let j = i + 1; j < room.children.length; j++) {

        const object2 = room.children[j];

        normal.copy(object.position).sub(object2.position);

        const distance = normal.length();

        if (distance < 2 * radius) {

          normal.multiplyScalar(0.5 * distance - radius);

          object.position.sub(normal);
          object2.position.add(normal);

          normal.normalize();

          relativeVelocity.copy(object.userData.velocity).sub(object2.userData.velocity);

          normal = normal.multiplyScalar(relativeVelocity.dot(normal));

          object.userData.velocity.sub(normal);
          object2.userData.velocity.add(normal);

        }

      }

      object.userData.velocity.y -= 9.8 * delta;

    }
  }
}
