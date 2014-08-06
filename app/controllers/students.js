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
    res.render('students/students', {students:students});
  });
};

exports.details = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/detail', {student:student});
  });
};

exports.test = function(req, res){
  Student.findById(req.params.id, function(student){
    res.render('students/test', {id:student._id, student:student});
  });
};

exports.addTest = function(req, res){
  Student.findById(req.params.id, function(student){
    student.addTest(req.body.score, function(){
      res.redirect('students/detail', {student:student});
    });
  });
};
