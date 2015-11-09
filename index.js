var request = require("request");
var Service, Characteristic;
var exec = require('child_process').exec;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-lirc", "lirc", GenericLircDeviceAccessory);
}

function GenericLircDeviceAccessory(log, config) {
  this.log          = log;
  this.id           = config["id"];
  this.name         = config["name"];
  this.model_name   = config["model_name"];
  this.manufacturer = config["manufacturer"];
  this.on_command   = config["on_command"];
  this.off_command  = config["off_command"];
  this.power_state  = config["initial_state"];
}

GenericLircDeviceAccessory.prototype = {
  setPowerState: function(powerOn, callback) {
    var that        = this;
    var command     = powerOn ? that.on_command : that.off_command;
    if (this.power_state == "off" && powerOn) {
      this.power_state = "on"
      exec(this.on_command, function(error, stdout, stderr) {
        // command output is in stdout
      });
    } else if (this.power_state == "on" && !powerOn) {
      this.power_state = "off"
      exec(this.on_command, function(error, stdout, stderr) {
        // command output is in stdout
      });
    }
    callback()
  },

  getServices: function() {
    var switchService = new Service.Switch(this.name);
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model_name)
      .setCharacteristic(Characteristic.SerialNumber, this.id);

    switchService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));

    return [informationService, switchService];
  }
}
