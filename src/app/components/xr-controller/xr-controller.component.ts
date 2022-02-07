import { Component, Input } from "@angular/core";
import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { AdditiveBlending, Group, Line, Matrix4, Mesh, MeshBasicMaterial, Raycaster, RingGeometry, XRInputSource } from "three";
import { AppCanvasService } from "../../app.service";
import { OnInit } from "@angular/core";

export type TrackType = 'pointer' | 'grab';

@Component({
  selector: 'app-xr-controller',
  templateUrl: './xr-controller.component.html',
})
export class XRControllerComponent implements OnInit {
  @Input() index = 0;
  @Input() tracktype: TrackType = 'pointer';

  controller?: Group;

  position = new Float32Array([0, 0, 0, 0, 0, - 1]);
  color = new Float32Array([0.5, 0.5, 0.5, 0, 0, 0]);
  blending = AdditiveBlending;

  trackedpointerline?: Line;

  constructor(private canvasService: AppCanvasService) { }

  ngOnInit(): void {
    if (!this.canvasService.state) return;

    const renderer = this.canvasService.state.renderer;
    const scene = this.canvasService.state.scene;

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);


    this.controller.addEventListener('selectstart', (event) => {
      const controller = <Group>event.target;
      if (this.tracktype == 'pointer') {
        controller.userData.isSelecting = true;
      }
      else if (this.tracktype == 'grab') {
        const room = <Group>scene.getObjectByName('room');
        this.startgrab(controller, room);
      }
    });
    this.controller.addEventListener('selectend', (event) => {
      const controller = <Group>event.target;
      if (this.tracktype == 'pointer') {
        controller.userData.isSelecting = false;
      }
      else if (this.tracktype == 'grab') {
        const room = <Group>scene.getObjectByName('room');
        this.endgrab(controller, room);
      }
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
    line.name = 'line';
    line.scale.z = 1.5;
    this.trackedpointerline = line;
  }

  private buildGaze() {
    const geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new Mesh(geometry, material);
  }

  private getIntersections(controller: Group, room: Group): any {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(room.children, false);
  }

  private startgrab(controller: Group, room: Group) {
    if (this.IntersectObject) {
      controller.attach(this.IntersectObject);
      controller.userData.selected = this.IntersectObject;
      if (this.trackedpointerline) {
        this.trackedpointerline.scale.z = this.Intersect.distance;
      }
    }
  }

  private endgrab(controller: Group, room: Group) {
    if (controller.userData.selected) {
      const object = controller.userData.selected;
      object.material.emissive.b = 0;

      room.attach(object);
      controller.userData.selected = undefined;
      if (this.trackedpointerline) {
        this.trackedpointerline.scale.z = 1.5;
      }
    }
  }

  private Intersect: any;
  private IntersectObject: any;

  animateGroup(event: NgtRender) {
    const room = <Group>event.scene.getObjectByName('room');
    if (this.controller && room) {

      const intersects = this.getIntersections(this.controller, room);

      if (intersects.length > 0) {
        if (this.IntersectObject != intersects[0].object) {

          if (this.IntersectObject) this.IntersectObject.material.emissive.b = 0;

          this.Intersect = intersects[0];
          this.IntersectObject = this.Intersect.object;
          this.IntersectObject.material.emissive.b = 1;
        }
      } else {
        if (this.IntersectObject) {
          this.IntersectObject.material.emissive.b = 0;
          this.IntersectObject = undefined;
        }

      }
    }
  }
}
