import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ModelBuilder } from './stackingPlanBuilder';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  getBuildingData$() {
    return this.http.get("/assets/MeijiYasuda.json")
      .map(res => {
        let body = res.json();
        let building = ModelBuilder.createBuilding(body);
        return building || {};
      });
  }

}
