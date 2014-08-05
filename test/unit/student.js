/* jshint  expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var kermit, chet, gloria;

describe('Student', function(){
  before(function(done){
    dbConnect('students-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      var a = {name: 'Kermit', color: 'coral'};
      var b = {name: 'Chet', color: 'cornflowerblue'};
      var c = {name: 'Gloria', color: 'mediumseagreen'};
      kermit = new Student(a);
      chet = new Student(b);
      gloria = new Student(c);

      kermit.save(function(){
        chet.save(function(){
          gloria.save(function(){
            done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new student', function(){
      var a = {name: 'Kermit', color: 'coral'};
      kermit = new Student(a);

      expect(kermit).to.be.instanceof(Student);
      expect(kermit.name).to.equal('Kermit');
      expect(kermit.color).to.equal('coral');
      expect(kermit._gpa).to.equal(0);
      expect(kermit._suspended).to.be.false;
      expect(kermit._honorRoll).to.be.false;
      expect(kermit.tests).to.have.length(0);
    });
  });

  describe('#save', function(){
    it('should save an student to the database', function(done){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.save(function(){
        expect(kermit._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#addTest', function(){
    it('should add a test to student', function(done){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.save(function(){
        zune.addTest(92, function(){
          expect(zune.tests).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('.all', function(){
    it('should get all items from database', function(){
      Student.all(function(students){
        expect(students).to.have.length(3);
        expect(students[0]).to.respondTo('grade');
      }); 
    });
  });

  describe('.findById', function(){
    it('should find an student by its id', function(done){
      Student.findById(kermit._id.toString(), function(student){
        expect(student.name).to.equal('Kermit');
        expect(student).to.respondTo('grade');
        done();
      });
    });
  });

  describe('#grade', function(){
    it('should average the test scores', function(done){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.tests.push(83,90,99);
      zune.grade();
        expect(zune.tests).to.have.length(3);
        expect(zune.avg).to.be.closeTo(91, 0.5);
        done();
    });
  });

  describe('#isSuspended', function(){
    it('should tell if the student is suspended', function(){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.avg = 40;
      zune.isSuspended();
        expect(zune._suspended).to.be.true;
    });

    it('should tell if the student is NOT suspended', function(){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);

      zune.avg = 70;
      zune.isSuspended();
        expect(zune._suspended).to.be.false;
    });
  });

  describe('#isHonorRoll', function(){
    it('should tell if the student is on the honor roll', function(){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.avg = 98;
      zune.isHonorRoll();
        expect(zune._honorRoll).to.be.true;
    });

    it('should tell if the student is NOT on the honor roll', function(){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.avg = 70;
      zune.isHonorRoll();
        expect(zune._honorRoll).to.be.false;
    });
  });
  describe('#letterGrade', function(){
    it('should give a letter based on avg grade', function(){
      var g = {name: 'Zune', color: 'purple'};
      var zune = new Student(g);
      zune.avg = 70;
        expect(zune.letterGrade()).to.equal('C');
    });
  });
});
