/* global expect */

"use strict";


describe("modules", function() {
    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {
        module = angular.module("ionicSettings");
        dependencies = module.requires;
    });
    
    it("should load constants module", function() {
        expect(hasModule("ionicSettings.constants")).toBeTruthy();
    });
    
    it("should load directives module", function() {
        expect(hasModule("ionicSettings.directives")).toBeTruthy();
    });
    
    it("should load providers module", function() {
        expect(hasModule("ionicSettings.providers")).toBeTruthy();
    });
    
    it("should load services module", function() {
        expect(hasModule("ionicSettings.services")).toBeTruthy();
    });
});