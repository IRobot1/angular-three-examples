import { Component, Input } from "@angular/core";
import { NgtVector3 } from "@angular-three/core";
import { Mesh, Object3D } from "three";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
})
export class CubeComponent {
  @Input() position?: NgtVector3; // imported from @angular-three/core

  hover = false;
  active = false;

  onAnimate(object: Object3D) {
    object.rotation.x = object.rotation.y += 0.01;
  }
}
