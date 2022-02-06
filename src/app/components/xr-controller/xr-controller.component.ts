import { Component, Input } from "@angular/core";
import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Raycaster, RingGeometry, XRInputSource } from "three";
import { NgtLine } from "@angular-three/core/lines";

export interface ControllerSelected {
  controller: Group | undefined;
  selected: boolean;
}

@Component({
  selector: 'app-xr-controller',
  templateUrl: './xr-controller.component.html',
})
export class XRControllerComponent {
  @Input() index = 0;

  controller?: Group;

  position = new Float32Array([0, 0, 0, 0, 0, - 1]);
  color = new Float32Array([0.5, 0.5, 0.5, 0, 0, 0]);
  blending = AdditiveBlending;

  trackedpointerline?: Line;

  ready(state: NgtCreatedState): void {
    const renderer = state.renderer;
    const scene = state.scene;

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);

    this.controller.addEventListener('selectstart', (event) => {
      const controller = <Group>event.target;
      controller.userData.isSelecting = true;
    });
    this.controller.addEventListener('selectend', (event) => {
      const controller = <Group>event.target;
      controller.userData.isSelecting = false;
    });
    this.controller.addEventListener('connected', (event) => {
      const controller = <Group>event.target;
      const source = <XRInputSource>event.data;
      controller.name = source.handedness;
      if (source.targetRayMode == 'tracked-pointer') {
        if (this.trackedpointerline) {
          controller.add(this.trackedpointerline);
        }
      }
      else if (source.targetRayMode == 'gaze') {
        controller.add(this.buildGaze());
      }
    });
    this.controller.addEventListener('disconnected', (event) => {
      const controller = <Group>event.target;
      controller.remove(controller.children[0]);
    });

  }

  lineready(line: Line) {
    this.trackedpointerline = line;
  }

  private buildGaze() {
    const geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new Mesh(geometry, material);
  }

  private INTERSECTED: any;

  animateGroup(event: NgtRender) {
    const room = <Group>event.scene.getObjectByName('room');
    if (this.controller && room) {

      // find intersections
      const tempMatrix = new Matrix4();
      tempMatrix.extractRotation(this.controller.matrixWorld);

      const raycaster = new Raycaster();
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
