using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using aspangularfirst.Controllers.Resources;
using aspangularfirst.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Vega.Controllers.Resources;
using Vega.Core;
using Vega.Models;

namespace Vega.Controllers
{
  [Route("api/vehicles")]
  public class VehiclesController : Controller
  {
    private readonly IMapper mapper;
    private readonly IVehicleRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public VehiclesController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork)
    {
      this.unitOfWork = unitOfWork;
      this.repository = repository;
      this.mapper = mapper;
    }

    [HttpGet]
    public async Task<IEnumerable<VehicleResource>> GetVehicles(VehicleQueryResource vehicleQueryResource)
    {
      var vehicleQuery = mapper.Map<VehicleQueryResource, VehicleQuery>(vehicleQueryResource);
      var vehicles = await repository.GetVehicles(vehicleQuery);
      return mapper.Map<IEnumerable<Vehicle>, IEnumerable<VehicleResource>>(vehicles);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
    {
      if (!ModelState.IsValid)
      {
        return new BadRequestObjectResult(ModelState);
      }

      var vehicle = mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);
      vehicle.LastUpdate = DateTime.Now;

      repository.Add(vehicle);
      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetVehicle(vehicle.Id);

      var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

      return new OkObjectResult(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
    {
      if (!ModelState.IsValid)
      {
        return new BadRequestObjectResult(ModelState);
      }

      var vehicle = await repository.GetVehicle(id);

      if (vehicle == null)
      {
        return NotFound();
      }

      mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
      vehicle.LastUpdate = DateTime.Now;

      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetVehicle(vehicle.Id);
      var result = mapper.Map<Vehicle, VehicleResource>(vehicle);

      return new OkObjectResult(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
      var vehicle = await repository.GetVehicle(id, includeRelated: false);

      if (vehicle == null)
      {
        return NotFound();
      }

      repository.Remove(vehicle);
      await unitOfWork.CompleteAsync();

      return new OkObjectResult(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
      var vehicle = await repository.GetVehicle(id);

      if (vehicle == null)
      {
        return NotFound();
      }

      var vehicleResource = mapper.Map<Vehicle, VehicleResource>(vehicle);

      return new OkObjectResult(vehicleResource);
    }
  }
}