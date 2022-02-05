import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from "@angular/core";
import * as THREE from "three";
import { Group } from "three";

@Component({
  selector: 'app-xr-controller',
  templateUrl: './xr-controller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XRControllerComponent implements OnInit {
  @Input() state?: NgtCreatedState;
  @Input() index = 0;

  private controller?: Group;

  ngOnInit(): void {
    if (this.state) {
      const renderer = this.state.renderer;
      const scene = this.state.scene;

      this.controller = renderer.xr.getController(this.index);
      this.controller.addEventListener('selectstart', (event) => {
        console.warn(event)
        event.userData.isSelecting = true;
      });
      this.controller.addEventListener('selectend', (event) => {
        console.warn(event)
        event.userData.isSelecting = false;
      });
      this.controller.addEventListener('connected', (event) => {
        console.warn(event)
        event.add(this.buildController(event.data));
      });
      this.controller.addEventListener('disconnected', (event) => {
        console.warn(event)
        event.remove(event.children[0]);
      });

      scene.add(this.controller);
    }
  }

  private buildController(data: any) {
    let geometry, material;

    switch (data.targetRayMode) {

      case 'tracked-pointer':

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

        material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

        return new THREE.Line(geometry, material);

      case 'gaze':

        geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
        material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
        return new THREE.Mesh(geometry, material);

      default:
        return undefined;
    }

  }


  onAnimate(event: NgtRender, room: THREE.Group) {
  }
}
