import { Component } from '@angular/core';
import { NgtCreatedState } from '@angular-three/core';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  state?: NgtCreatedState;

  created(event: NgtCreatedState) {
    this.state = event;
    const renderer = event.renderer;
    const scene = event.scene;

    document.body.appendChild(VRButton.createButton(event.renderer));

    const room = new THREE.LineSegments(
      new BoxLineGeometry(6, 6, 6, 10, 10, 10),
      new THREE.LineBasicMaterial({ color: 0x808080 })
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
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
