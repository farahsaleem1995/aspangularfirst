import { KeyValuePair } from "./../models/key-value-pair.model";
import { Vehicle } from "./../models/vehicle.model";
import { Component, OnInit } from "@angular/core";
import { VehicleService } from "../services/vehicle.service";
import { Router } from "@angular/router";
import { Make } from "../models/make.model";

@Component({
  selector: "app-vehicle-list",
  templateUrl: "./vehicle-list.component.html",
  styleUrls: ["./vehicle-list.component.css"]
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[];
  allVehicles: Vehicle[];
  makes: Make[];
  models: KeyValuePair[];
  query: any = {};
  columns = [
    { title: "Id" },
    { title: "Make", key: "make", isSortable: true },
    { title: "Model", key: "model", isSortable: true },
    { title: "contactName", key: "contactName", isSortable: true },
    {}
  ];

  constructor(private router: Router, private vehicleService: VehicleService) {}

  ngOnInit() {
    this.populateVehicles();

    this.vehicleService.getMakes().subscribe(data => {
      this.makes = data;
    });
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query).subscribe(data => {
      this.vehicles = this.allVehicles = data;
    });
  }

  onViewVehicle(id: number) {
    this.router.navigate(["vehicles", id]);
  }

  onFilterChange(event) {
    if (event.target.id == "make") {
      this.query.modelId = null;
    }
    this.populateVehicles();
    this.populateModel();
  }

  private populateModel() {
    let selectedMake = this.makes.find(make => make.id == this.query.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onReset() {
    this.query = {};
    this.onFilterChange(null);
  }

  onSortBy(columnName) {
    if (this.query.sortBy == columnName) {
      this.query.IsSortAscending = !this.query.IsSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.IsSortAscending = true;
    }
    this.populateVehicles();
  }
}
