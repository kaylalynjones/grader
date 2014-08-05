'use strict';

var Student = require('../models/student');

exports.init = function(req, res){
  res.render('students/index');
};

exports.create = function(req, res){
  var student = new Student(req.body);
  student.save(function(){
    res.redirect('/students');
  });
};

exports.students = function(req, res){
  Student.all(function(students){
    res.render('students/students');
  });
};

exports.details = function(){
  Student.findByID(req.params.id, function(student){
    res.render('students/detail', {student:student});
  });
};

