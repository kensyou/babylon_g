import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { ResizeService } from '../services/resize.service';
import { DataService } from '../services/data.service';
import { IBuilding } from '../services/stackingPlanModels';
import * as filter from "lodash/fp/filter";


@Component({
  selector: 'cb-building3d',
  templateUrl: './building3d.component.html',
  styleUrls: ['./building3d.component.scss']
})
export class Building3dComponent implements OnInit, AfterViewInit {
  @ViewChild('renderCanvas') el: ElementRef;

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(private resizeService: ResizeService, private dataService: DataService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataService.getBuildingData$().subscribe((building: IBuilding) => {
      this._canvas = this.el.nativeElement;
      let g = new Building3DGenerator(this._canvas, this.resizeService);
      g.createScene(building);
      g.animate();
    });
  }
}

class Building3DGenerator {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(canvas: HTMLCanvasElement, private resizeService: ResizeService) {
    this._canvas = canvas;
    // Create canvas and engine
    this._engine = new BABYLON.Engine(<any>this._canvas, true);
  }

  createScene(building: IBuilding): void {
    // create a basic BJS Scene object
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-8, 7.5, -18), this._scene);

    // target the camera to scene origin
    //this._camera.setTarget(BABYLON.Vector3.Zero());
    this._camera.setTarget(new BABYLON.Vector3(10, 5, 0));

    // attach the camera to the canvas
    this._camera.attachControl(this._canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

    /*
        // create a built-in "sphere" shape; with 16 segments and diameter of 2
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
          { segments: 16, diameter: 2 }, this._scene);
    
        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;
    */

    // create a built-in "ground" shape
    let ground = BABYLON.MeshBuilder.CreateGround('ground1',
      { width: 6, height: 6, subdivisions: 2 }, this._scene);
    let groundMaterial = new BABYLON.StandardMaterial("groundTexture", this._scene);
    groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#d3d3d3");//("#67b52f");
    ground.material = groundMaterial;


    var materialFloorTexture1 = new BABYLON.StandardMaterial("floorTexture1", this._scene);
    materialFloorTexture1.diffuseColor = BABYLON.Color3.FromHexString("#b0ff77");
    materialFloorTexture1.backFaceCulling = false;
    materialFloorTexture1.alpha = 0.08

    building.floors.forEach((f, index) => {
      let fbox = BABYLON.MeshBuilder.CreateBox(`box_${index}`, { width: 5, depth: 5, height: 1 / 3 }, this._scene);
      fbox.material = materialFloorTexture1;
      fbox.position.y = index / 3;
    });

    var a = 1;
    if (a == 2) {
      this._scene.registerBeforeRender(() => {
        // limit camera pen angle
        // look up
        if (this._camera.rotation.x < -0.3) {
          this._camera.rotation.x = -0.3;
        }
        // look down
        if (this._camera.rotation.x > 0.7) {
          this._camera.rotation.x = 0.7;
        }
        // look left 
        if (this._camera.rotation.y < -0.5) {
          this._camera.rotation.y = -0.5;
        }
        // look right
        if (this._camera.rotation.y > 0.5) {
          this._camera.rotation.y = 0.5;
        }
        // limit camera position
        if (this._camera.position.x > 0.5) {
          this._camera.position.x = 0.5;
        }
        if (this._camera.position.x < -0.5) {
          this._camera.position.x = -0.5;
        }
        if (this._camera.position.y > 11) {
          this._camera.position.y = 11;
        }
        if (this._camera.position.y < 4) {
          this._camera.position.y = 4;
        }
        if (this._camera.position.z > -11) {
          this._camera.position.z = -11;
        }
        if (this._camera.position.z < -9) {
          this._camera.position.z = -9;
        }
      })
    }
  }

  animate(): void {
    // run the render loop
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    this.resizeService.onResize$.subscribe(() => this._engine.resize());

  }
}