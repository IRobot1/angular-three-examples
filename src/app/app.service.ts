import { NgtCreatedState } from "@angular-three/core";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppCanvasService {
  state?: NgtCreatedState;
}
