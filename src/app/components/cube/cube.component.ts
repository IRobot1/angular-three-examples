import { NgtVector3 } from "@angular-three/core";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
  @Input() position?: NgtVector3; // imported from @angular-three/core

  hover = false;
  active = false;

  onAnimate(mesh: THREE.Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}
