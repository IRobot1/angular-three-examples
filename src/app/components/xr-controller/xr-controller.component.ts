import { NgtCreatedState } from "@angular-three/core";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import * as THREE from "three";

export interface ControllerSelected {
  controller: THREE.Group | undefined;
  selected: boolean;
}

@Component({
  selector: 'app-xr-controller',
  templateUrl: './xr-controller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XRControllerComponent {
  @Input() index = 0;

  controller?: THREE.Group;
  isSelecting = false;

  ready(state: NgtCreatedState): void {
    const renderer = state.renderer;
    const scene = state.scene;

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);

    this.controller.addEventListener('selectstart', () => {
      this.isSelecting = true;
      console.warn(this.isSelecting)
    });
    this.controller.addEventListener('selectend', () => {
      this.isSelecting = false;
      console.warn(this.isSelecting)
    });
    this.controller.addEventListener('connected', (event) => {
      const group = <THREE.Group>event.target;
      group.add(this.buildController(event.data));
    });
    this.controller.addEventListener('disconnected', (event) => {
      const group = <THREE.Group>event.target;
      group.remove(group.children[0]);
    });

  }

  private buildController(data: any) {
    let geometry, material;

    // TODO: convert to declarative using *ngIf
    if (data.targetRayMode == 'tracked-pointer') {
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

      material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

      return new THREE.Line(geometry, material);
    }
    else { // 'gaze'
      geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
      material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
      return new THREE.Mesh(geometry, material);
    }
  }

}
