import { SaveVehicle } from "./../models/save-vehicle.model";
import { KeyValuePair } from "./../models/key-value-pair.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Make } from "../models/make.model";
import { Vehicle } from "../models/vehicle.model";

@Injectable({ providedIn: "root" })
export class VehicleService {
  constructor(private http: HttpClient) {}

  getMakes() {
    return this.http.get<Make[]>("api/makes");
  }

  getFeatures() {
    return this.http.get<KeyValuePair[]>("api/features");
  }

  create(vehicle: SaveVehicle) {
    return this.http.post("api/vehicles", vehicle);
  }

  update(vehicle: SaveVehicle) {
    return this.http.put("api/vehicles/" + vehicle.id, vehicle);
  }

  delete(id: number) {
    return this.http.delete("api/vehicles/" + id);
  }

  getVehicles(filter) {
    return this.http.get<Vehicle[]>(
      "api/vehicles" + "?" + this.toQueryString(filter)
    );
  }

  private toQueryString(obj) {
    let parts = [];

    for (let property in obj) {
      let value = obj[property];
      if (value != null && value != undefined) {
        parts.push(
          encodeURIComponent(property) + "=" + encodeURIComponent(value)
        );
      }
    }

    return parts.join("&");
  }

  getVehicle(id: number) {
    return this.http.get<Vehicle>("api/vehicles/" + id);
  }
}
