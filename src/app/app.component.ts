import { Component } from '@angular/core';
import { NgtCreatedState } from '@angular-three/core';

import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
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
    //new Example('handinputcubes', 'vr / handinput cubes', 'https://threejs.org/examples/screenshots/webxr_vr_handinput_cubes.jpg'),
    new Example('ballshooter', 'vr / ballblaster', 'https://threejs.org/examples/screenshots/webxr_vr_ballshooter.jpg'),
    new Example('cubes', 'vr / cubes', 'https://threejs.org/examples/screenshots/webxr_vr_cubes.jpg'),
    new Example('dragging', 'vr / dragging', 'https://threejs.org/examples/screenshots/webxr_vr_dragging.jpg'),
    new Example('handinput', 'vr / handinput', 'https://threejs.org/examples/screenshots/webxr_vr_handinput.jpg'),
  ]

  selected: string = 'handinputcubes';

  constructor(private canvasService: AppCanvasService) { }

  created(event: NgtCreatedState, container: HTMLDivElement) {
    this.canvasService.state = event;
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

  }
}
