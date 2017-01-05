function GoogleDrive() {
  this.dist = 0;
  this.mpg = 0;
  this.time = 0;
  this.year = 0;
  this.make = "";
  this.model = "";
  this.origin = "";
  this.destination = "";
};

GoogleDrive.prototype.getCost = function () {
  var dist = this.dist;
  var mpg = this.mpg;
  return ((dist*2.342)/mpg);
};

exports.driveModule = GoogleDrive;
