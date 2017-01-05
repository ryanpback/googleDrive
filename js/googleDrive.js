function GoogleDrive() {
  this.dist = 0;
  this.mpg = 0;
};

GoogleDrive.prototype.getCost = function () {
  var dist = this.dist;
  var mpg = this.mpg;
  return (((dist/ 1.609344)/mpg)*2.342);
};

exports.driveModule = GoogleDrive;
