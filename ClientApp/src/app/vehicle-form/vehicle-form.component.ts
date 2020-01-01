import * as _ from "underscore";
import { Vehicle } from "../models/vehicle.model";
import { SaveVehicle } from "../models/save-vehicle.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";

import { VehicleService } from "../services/vehicle.service";
import { Make } from "../models/make.model";
import { KeyValuePair } from "../models/key-value-pair.model";

@Component({
  selector: "app-vehicle-form",
  templateUrl: "./vehicle-form.component.html",
  styleUrls: ["./vehicle-form.component.css"]
})
export class VehicleFormComponent implements OnInit {
  makes: Make[];
  models: KeyValuePair[];
  features: KeyValuePair[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: "",
      email: "",
      phone: ""
    }
  };
  vehicleId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {
    this.route.params.subscribe(params => {
      this.vehicleId = +params["id"];
    });
  }

  ngOnInit() {
    if (this.vehicleId) {
      forkJoin([
        this.vehicleService.getMakes(),
        this.vehicleService.getFeatures(),
        this.vehicleService.getVehicle(this.vehicleId)
      ]).subscribe(
        data => {
          this.makes = data[0];
          this.features = data[1];
          this.setVehicle(data[2]);
          this.populateModel();
        },
        err => {
          if (err.status == 404) {
            this.router.navigate([""]);
          }
        }
      );
    } else {
      forkJoin([
        this.vehicleService.getMakes(),
        this.vehicleService.getFeatures()
      ]).subscribe(
        data => {
          this.makes = data[0];
          this.features = data[1];
        },
        err => {
          if (err.status == 404) {
            this.router.navigate([""]);
          }
        }
      );
    }
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, "id");
  }

  onMakeChange() {
    this.populateModel();
    delete this.vehicle.modelId;
  }

  private populateModel() {
    let selectedMake = this.makes.find(make => make.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: number, $event) {
    if ($event.target.checked) {
      this.vehicle.features.push(featureId);
    } else {
      let index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index);
    }
  }

  onDelete() {
    this.vehicleService
      .delete(this.vehicle.id)
      .subscribe(() =>
        console.log("Vehicle: (" + this.vehicle.id + ") deleted")
      );
  }

  onSubmit() {
    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle).subscribe(data => {
        console.log(data);
      });
    } else {
      this.vehicleService
        .create(this.vehicle)
        .subscribe(data => console.log(data));
    }
  }
}
