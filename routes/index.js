
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.create = function(req, res){
  res.render('create');
};

exports.join = function(req, res){
  res.render('join');
};

exports.room = function(req, res){
  res.render('room');
};