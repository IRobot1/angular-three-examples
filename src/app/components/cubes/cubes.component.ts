import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";

import { Color, Euler, Group, MathUtils, Vector3 } from 'three';
import { XRControllerComponent } from "../xr-controller/xr-controller.component";


class RandomSettings {
  constructor(public color: string, public position: Vector3, public velocity: Vector3, public rotation: Euler, public scale: Vector3) { }
}


@Component({
  selector: 'app-vr-cubes',
  templateUrl: './cubes.component.html',
})
export class CubesComponent implements OnInit {
  @ViewChild('xr0') xr0?: XRControllerComponent;
  @ViewChild('xr1') xr1?: XRControllerComponent;

  shapes: Array<RandomSettings> = [];

  ngOnInit(): void {
    for (let i = 0; i < 200; i++) {
      this.shapes.push(new RandomSettings(
        '#' + new Color(Math.random() * 0xffffff).getHexString(),
        new Vector3(Math.random() * 4 - 2, Math.random() * 4, Math.random() * 4 - 2),
        new Vector3(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005),
        new Euler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI),
        new Vector3(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5),
      ));
    }
  }

  private handleController(delta: number, room: Group, controller?: Group) {
    if (controller) {
      if (controller.userData.isSelecting === true) {
        const cube = room.children[0];
        room.remove(cube);

        cube.position.copy(controller.position);
        cube.userData.velocity.x = (Math.random() - 0.5) * 0.02 * delta;
        cube.userData.velocity.y = (Math.random() - 0.5) * 0.02 * delta;
        cube.userData.velocity.z = (Math.random() * 0.01 - 0.05) * delta;
        cube.userData.velocity.applyQuaternion(controller.quaternion);

        room.add(cube);
      }
    }
  }

  animateGroup({ delta }: NgtRender, room: Group) {
    if (this.xr0) { this.handleController(delta * 60, room, this.xr0.controller); }
    if (this.xr1) { this.handleController(delta * 60, room, this.xr1.controller); }

    for (let i = 0; i < room.children.length; i++) {

      const cube = room.children[i];

      cube.userData.velocity.multiplyScalar(1 - (0.001 * delta));

      cube.position.add(cube.userData.velocity);

      if (cube.position.x < - 3 || cube.position.x > 3) {

        cube.position.x = MathUtils.clamp(cube.position.x, - 3, 3);
        cube.userData.velocity.x = - cube.userData.velocity.x;

      }

      if (cube.position.y < 0 || cube.position.y > 6) {

        cube.position.y = MathUtils.clamp(cube.position.y, 0, 6);
        cube.userData.velocity.y = - cube.userData.velocity.y;

      }

      if (cube.position.z < - 3 || cube.position.z > 3) {

        cube.position.z = MathUtils.clamp(cube.position.z, - 3, 3);
        cube.userData.velocity.z = - cube.userData.velocity.z;

      }

      cube.rotation.x += cube.userData.velocity.x * 2 * delta;
      cube.rotation.y += cube.userData.velocity.y * 2 * delta;
      cube.rotation.z += cube.userData.velocity.z * 2 * delta;

    }
  }
}
