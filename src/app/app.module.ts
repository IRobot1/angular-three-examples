import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgtColorPipeModule, NgtCoreModule, NgtObject3dControllerModule, NgtRepeatModule } from '@angular-three/core';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtLineBasicMaterialModule, NgtMeshBasicMaterialModule, NgtMeshLambertMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtBoxGeometryModule, NgtBufferGeometryModule, NgtConeGeometryModule, NgtCylinderGeometryModule, NgtIcosahedronGeometryModule, NgtPlaneGeometryModule, NgtTorusGeometryModule } from '@angular-three/core/geometries';
import { NgtHemisphereLightModule } from '@angular-three/core/lights';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtBufferAttributeModule } from '@angular-three/core/attributes';
import { NgtLineModule } from '@angular-three/core/lines';

import { AppComponent } from './app.component';
import { CubeComponent } from './components/cube/cube.component';
import { BallshooterComponent } from './components/ballshooter/ballshooter.component';
import { XRControllerComponent } from './components/xr-controller/xr-controller.component';
import { CubesComponent } from './components/cubes/cubes.component';
import { DraggingComponent } from './components/dragging/dragging.component';
import { AppCanvasService } from './app.service';
import { HandInputComponent } from './components/handinput/handinput.component';

@NgModule({
  declarations: [
    AppComponent,
    XRControllerComponent,
    CubeComponent,
    BallshooterComponent,
    CubesComponent,
    DraggingComponent,
    HandInputComponent,
  ],
  imports: [
    BrowserModule,
    NgtCoreModule,
    NgtMeshModule,
    NgtBoxGeometryModule,
    NgtMeshBasicMaterialModule,
    NgtLineBasicMaterialModule,
    NgtColorPipeModule,
    NgtIcosahedronGeometryModule,
    NgtRepeatModule,
    NgtMeshLambertMaterialModule,
    NgtHemisphereLightModule,
    NgtObject3dControllerModule,
    NgtGroupModule,
    NgtStatsModule,
    NgtBufferGeometryModule,
    NgtBufferAttributeModule,
    NgtLineModule,
    NgtPlaneGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtConeGeometryModule,
    NgtCylinderGeometryModule,
    NgtIcosahedronGeometryModule,
    NgtTorusGeometryModule
  ],
  providers: [AppCanvasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
