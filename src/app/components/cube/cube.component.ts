import { Component, Input } from "@angular/core";
import { NgtVector3 } from "@angular-three/core";
import { Mesh } from "three";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
})
export class CubeComponent {
  @Input() position?: NgtVector3; // imported from @angular-three/core

  hover = false;
  active = false;

  onAnimate(mesh: Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}
