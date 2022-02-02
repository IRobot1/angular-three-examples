import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgtCoreModule } from '@angular-three/core';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';

import { AppComponent } from './app.component';
import { CubeComponent } from './components/cube/cube.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
  ],
  imports: [
    BrowserModule,
    NgtCoreModule,
    NgtMeshModule,
    NgtBoxGeometryModule,
    NgtMeshBasicMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
