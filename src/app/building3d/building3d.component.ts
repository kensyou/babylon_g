import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { ResizeService } from '../services/resize.service';
import { DataService } from '../services/data.service';
import { IBuilding } from '../services/stackingPlanModels';
import * as filter from "lodash/fp/filter";
import * as sortBy from "lodash/fp/sortBy";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cb-building3d',
  templateUrl: './building3d.component.html',
  styleUrls: ['./building3d.component.scss']
})
export class Building3dComponent implements OnInit, AfterViewInit {
  @ViewChild('renderCanvas') el: ElementRef;

  private _canvas: HTMLCanvasElement;

  private buildingName$: Observable<string>;
  private buildingNameSubject: Subject<string>;

  constructor(private resizeService: ResizeService, private dataService: DataService) { }

  ngOnInit() {
    this.buildingNameSubject = new Subject<string>();
    this.buildingName$ = this.buildingNameSubject.asObservable();
  }

  ngAfterViewInit() {
    this.dataService.getBuildingData$().subscribe((building: IBuilding) => {
      this.buildingNameSubject.next(building.buildingName);
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
    this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-8, 4.5, -18), this._scene);

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
    groundMaterial.alpha = 0.5;
    ground.material = groundMaterial;



    var materialFloorTexture1 = new BABYLON.StandardMaterial("floorTexture1", this._scene);
    //materialFloorTexture1.diffuseColor = BABYLON.Color3.FromHexString("#b0ff77");
    materialFloorTexture1.backFaceCulling = false;
    materialFloorTexture1.alpha = 0.08

    var materialFloorTexture2 = new BABYLON.StandardMaterial("floorTexture2", this._scene);
    materialFloorTexture2.diffuseColor = BABYLON.Color3.FromHexString("#b0ff77");
    materialFloorTexture2.backFaceCulling = false;
    materialFloorTexture2.alpha = 0.3

    let sortedFloor = sortBy(fo => (fo.floorSortOrder + 0.0001 * (fo.floorSize || fo.estimatedFloorSize || 0)), building.floors)
    sortedFloor.forEach((f, index) => {
      if (!f.floorSortOrder) return;
      let fbox = BABYLON.MeshBuilder.CreateBox(`box_${index}`, { width: 5, depth: 5, height: 1 / 3 }, this._scene);
      fbox.material = (f.floorSortOrder == 17 || f.floorSortOrder == 18) ? materialFloorTexture2 : materialFloorTexture1;
      fbox.position.y = (f.floorSortOrder > 0) ?
        (f.floorSortOrder - 1) / 3 + ((1 / 3) / 2) :
        (f.floorSortOrder + 1) / 3 - ((1 / 3) / 2);
      var sprite = this.makeFloorNumberLabel(this._scene, f.floorName);
      var label = sprite.object;
      var labelWidth = 2.8;
      var labelHeight = sprite.height;

      label.size = labelWidth;
      label.position.x = fbox.position.x - 3.5;
      label.position.y = fbox.position.y - (1 / 6);
      label.position.z = 0;

      // Draw a line frop label to object
      var myLines = BABYLON.Mesh.CreateLines(`fropline_${index}`, [

        // try this line, because of the offset, the line and the label rotate on different planes.
        //new BABYLON.Vector3(label.position.x, label.position.y + 1, label.position.z),

        // With this line they rotate together but the line points (obviously) at the center of the texture
        label.position,
        fbox.getAbsolutePosition().add(new BABYLON.Vector3(0, -(1 / 6), 0))
      ], this._scene);

      // Red
      myLines.color = new BABYLON.Color3(0, 0, 0);
      myLines.alpha = 0.05;

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


  // Just a text-wrapping function
  wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var numberOfLines = 0;

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
        numberOfLines++;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);

    return numberOfLines;
  }
  makeFloorNumberLabel(scene: BABYLON.Scene, floorNumber: string) {
    let dynamicTexture = new BABYLON.DynamicTexture(`floorDynamicTexture_${floorNumber}`, 512, this._scene, false);
    dynamicTexture.hasAlpha = false;

    var textureContext = <any>dynamicTexture.getContext();
    textureContext.save();
    textureContext.textAlign = "center";
    textureContext.font = "40px Calibri";

    // Some magic numbers
    var lineHeight = 40;
    var lineWidth = 60;
    var fontHeight = 30;
    var offset = 5; // space between top/bottom borders and actual text
    var text = floorNumber; // Text to display

    var numberOfLines = 1; // I usually calculate that but for this exmaple let's just say it's 1
    var textHeight = fontHeight + offset;
    var labelHeight = numberOfLines * lineHeight + (2 * offset) + 20;

    // Background for debug
    // textureContext.fillStyle = "red";
    // textureContext.fillRect(dynamicTexture.getSize().width/2, dynamicTexture.getSize().height/2 -lineHeight, lineWidth, labelHeight);

    // text
    textureContext.fillStyle = "black";
    this.wrapText(textureContext, text, dynamicTexture.getSize().width / 2 + lineWidth / 2, dynamicTexture.getSize().height / 2 - lineHeight + textHeight, lineWidth, lineHeight);
    textureContext.restore();

    dynamicTexture.update(false);

    // Create the sprite
    var spriteManager = <any>new BABYLON.SpriteManager(`sm_${floorNumber}`, "", 2, 512, scene);
    spriteManager._spriteTexture = dynamicTexture;
    spriteManager._spriteTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
    spriteManager._spriteTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
    var sprite = new BABYLON.Sprite(`textSprite_${floorNumber}`, spriteManager);

    var result = {
      object: sprite,
      height: labelHeight
    };
    return result;
  }
}