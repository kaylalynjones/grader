'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');


function Student(obj){
  this.name = obj.name;
  this.color = obj.color;
  this._gpa = parseInt(0);
  this._suspended = false;
  this._honorRoll = false;
  this.tests = [];
  this.avg = 0;
}

Object.defineProperty(Student, 'collection', {
  get:function(){
    return global.mongodb.collection('students');
  }
});

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.prototype.addTest = function(score, cb){
  score = parseInt(score);
  this.tests.push(score);
  Student.collection.save( this , cb);
};

Student.all = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(obj){
      return changePrototype(obj);
    });

    cb(students);
  });
};

Student.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:_id}, function(err, obj){
    var student = changePrototype(obj);

    cb(student);
  });
};

Student.prototype.grade = function(){
  var sum = 0;
  for(var i=0; i<this.tests.length; i++){
    sum += parseInt(this.tests[i]);
  }
  this.avg = (sum/this.tests.length).toFixed(0);
  return this.avg;
};

Student.prototype.isSuspended = function(){
  if(this._suspended){return;}
  if(this.avg < 60){
    this._suspended = true;
  } else {
    this._suspended = false;
  }
};

Student.prototype.isHonorRoll = function(){
  if(this.avg > 95){
    this._honorRoll = true;
  } else {
    this._honorRoll = false;
  }
};

Student.prototype.letterGrade = function(){
  var letterGrade;
  if(this.avg >= 90) {
    letterGrade = 'A';
  } else if(this.avg >= 80) {
    letterGrade = 'B';
  } else if(this.avg >= 70) {
    letterGrade = 'C';
  } else if(this.avg >= 60) {
    letterGrade = 'D';
  } else if(this.avg <= 59) {
    letterGrade = 'F';
  }
  return letterGrade;
};

//Private function
function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}

module.exports = Student; 

