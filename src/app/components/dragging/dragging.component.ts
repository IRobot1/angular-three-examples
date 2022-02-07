import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgtCreatedState, NgtRender } from "@angular-three/core";
import { Color, Euler, Group,  Vector3 } from "three";
import { XRControllerComponent } from "../xr-controller/xr-controller.component";

class RandomSettings {
  constructor(public shapename: string, public color: string, public position: Vector3, public rotation: Euler, public scale: Vector3) { }
}


@Component({
  selector: 'app-dragging',
  templateUrl: './dragging.component.html',
})
export class DraggingComponent implements OnInit {
  @ViewChild('xr0') xr0?: XRControllerComponent;
  @ViewChild('xr1') xr1?: XRControllerComponent;

  x = -Math.PI / 2;

  private geometries = [
    'box',
    'cone',
    'cylinder',
    'icosahedron',
    'torus'
  ];

  shapes: Array<RandomSettings> = [];

  ngOnInit(): void {
    for (let i = 0; i < 75; i++) {
      const shapename = this.geometries[Math.floor(Math.random() * this.geometries.length)];
      this.shapes.push(new RandomSettings( shapename,
        '#' + new Color(Math.random() * 0xffffff).getHexString(),
        new Vector3(Math.random() * 3 - 1.5, Math.random() * 2, Math.random() * 3 - 1.5),
        new Euler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI),
        new Vector3(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4),
      ));
    }
  }

}
