import { Component, Input } from "@angular/core";
import { NgtCreatedState, NgtRender } from "@angular-three/core";
import * as THREE from "three";
import { Group, XRInputSource } from "three";

export interface ControllerSelected {
  controller: THREE.Group | undefined;
  selected: boolean;
}

@Component({
  selector: 'app-xr-controller',
  templateUrl: './xr-controller.component.html',
})
export class XRControllerComponent {
  @Input() index = 0;

  controller?: THREE.Group;

  ready(state: NgtCreatedState): void {
    const renderer = state.renderer;
    const scene = state.scene;

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);

    this.controller.addEventListener('selectstart', (event) => {
      const controller = <THREE.Group>event.target;
      controller.userData.isSelecting = true;
    });
    this.controller.addEventListener('selectend', (event) => {
      const controller = <THREE.Group>event.target;
      controller.userData.isSelecting = false;
    });
    this.controller.addEventListener('connected', (event) => {
      const controller = <THREE.Group>event.target;
      const source = <XRInputSource>event.data;
      controller.name = source.handedness;
      if (source.targetRayMode == 'tracked-pointer') {
        controller.add(this.buildTrackPointer());
      }
      else if (source.targetRayMode == 'gaze') {
        state.camera.add(this.buildGaze());
      }
    });
    this.controller.addEventListener('disconnected', (event) => {
      const controller = <THREE.Group>event.target;
      controller.remove(controller.children[0]);
    });

  }

  private buildTrackPointer() {
    // TODO: convert to declarative.  Use ng-content to allow complete customization
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

    const material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });
    return new THREE.Line(geometry, material);
  }

  private buildGaze() {
    const geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new THREE.Mesh(geometry, material);
  }

  private INTERSECTED: any;

  animateGroup(event: NgtRender) {
    const room = <Group>event.scene.getObjectByName('room');
    if (this.controller && room) {

      // find intersections
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.extractRotation(this.controller.matrixWorld);

      const raycaster = new THREE.Raycaster();
      raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

      const intersects = raycaster.intersectObjects(room.children, false);

      if (intersects.length > 0) {
        if (this.INTERSECTED != intersects[0].object) {

          if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);

          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
          this.INTERSECTED.material.emissive.setHex(0xff0000);

        }
      } else {

        if (this.INTERSECTED) {
          this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
          this.INTERSECTED = undefined;
        }

      }
    }
  }
}
