import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { ResizeService } from '../services/resize.service';
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

  constructor(private resizeService: ResizeService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._canvas = this.el.nativeElement;
    let g = new Game(this._canvas, this.resizeService);
    g.createScene();
    g.animate();
  }
}

class Game {
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

  createScene(): void {
    // create a basic BJS Scene object
    this._scene = new BABYLON.Scene(this._engine);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this._scene);

    // target the camera to scene origin
    this._camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    this._camera.attachControl(this._canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

    // create a built-in "sphere" shape; with 16 segments and diameter of 2
    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
      { segments: 16, diameter: 2 }, this._scene);

    // move the sphere upward 1/2 of its height
    sphere.position.y = 1;

    // create a built-in "ground" shape
    let ground = BABYLON.MeshBuilder.CreateGround('ground1',
      { width: 6, height: 6, subdivisions: 2 }, this._scene);
  }

  animate(): void {
    // run the render loop
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    this.resizeService.onResize$.subscribe(() => this._engine.resize());

  }
}