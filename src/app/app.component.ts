import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgtCreatedState } from '@angular-three/core';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import * as THREE from 'three';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  //  styleUrls: ['./app.component.css']
  //  providers: [
  //    { provide: NGT_CANVAS_OPTIONS, useValue: provideCanvasOptions({ projectContent: false }) }
  //  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  state?: NgtCreatedState;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

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
