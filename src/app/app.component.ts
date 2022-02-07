import { Component } from '@angular/core';
import { NgtCreatedState } from '@angular-three/core';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DirectionalLight, LineBasicMaterial, LineSegments } from 'three';
import { AppCanvasService } from './app.service';

class Example {
  constructor(public tag: string,public title: string, public url: string) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  examples = [
    new Example('ballshooter', 'vr / ballblaster', 'https://threejs.org/examples/screenshots/webxr_vr_ballshooter.jpg'),
    new Example('cubes', 'vr / cubes', 'https://threejs.org/examples/screenshots/webxr_vr_cubes.jpg'),
    new Example('dragging', 'vr / dragging', 'https://threejs.org/examples/screenshots/webxr_vr_dragging.jpg'),
  ]

  selected: string = 'cube';

  constructor(private canvasService: AppCanvasService) { }

  select(tag: string) {
    this.selected = tag;
    console.warn(tag)
  }

  created(event: NgtCreatedState, container: HTMLDivElement) {
    this.canvasService.state = event;
    const renderer = event.renderer;
    const scene = event.scene;

    const controls = new OrbitControls(event.camera, container);
    controls.target.set(0, 1.6, 0);
    controls.update();

    document.body.appendChild(VRButton.createButton(event.renderer));

    const room = new LineSegments(
      new BoxLineGeometry(6, 6, 6, 10, 10, 10),
      new LineBasicMaterial({ color: 0x808080 })
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    const light = new DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = - 2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.

    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));

    scene.add(controllerGrip1);

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
  }
}
