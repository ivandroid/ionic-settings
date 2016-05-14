/*!
 * Copyright 2016 Ivan Weber
 *
 * ionic-settings, v1.0.2
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

/* global ionic, key, touchid, property */

(function(angular) {
    
    angular.module("ionicSettings.constants", [])
        .constant("IONIC_SETTINGS_BUTTON", "button")
        .constant("IONIC_SETTINGS_PIN", "pin")
        .constant("IONIC_SETTINGS_PIN_EMPTY", "\u25CB")
        .constant("IONIC_SETTINGS_PIN_FILLED", "\u25CF")
        .constant("IONIC_SETTINGS_SELECTION", "selection")
        .constant("IONIC_SETTINGS_TEXT", "text");

    angular.module("ionicSettings.directives", [])
        .directive("ionSettings", [
            "$ionicSettings", 
            "$ionicSettingsConfig",
            "IONIC_SETTINGS_PIN", function(
            $ionicSettings, 
            $ionicSettingsConfig,
            IONIC_SETTINGS_PIN) {
            return {
                restrict: "E",
                scope: true,
                template:   '<div ng-repeat="(key, item) in data">' +
                                '<div class="item item-divider" ng-if="!item.type">{{item}}</div>' +
                                '<div ng-if="item.type">' +
                                    '<ion-item class="item-icon-right"' + 
                                              'ng-class="{\'item-icon-left\': item.icon}"' +
                                              'ng-if="item.type == \'selection\' || item.type == \'button\' || item.type == \'text\'"' +
                                              'ng-click="doAction(key)">' +
                                        '<div class="ionic-settings-left">{{item.label}}</div>' +
                                        '<div class="ionic-settings-right ionic-settings-ios" ng-if="!isAndroid && item.type !== \'button\' && item.type !== \'text\'">{{item.value}}</div>' +
                                        '<div class="ionic-settings-android" ng-if="isAndroid && item.type !== \'button\' && item.type !== \'text\'">{{item.value}}</div>' +
                                        '<i class="icon {{elementColor}} ionic-settings-icon-smaller {{item.icon}}" ng-if="item.icon"></i>' +
                                        '<i class="icon {{elementColor}} icon-accessory ion-chevron-right" ng-hide="isAndroid || item.type === \'button\'"></i>' +
                                    '</ion-item>' +
                                    '<ion-toggle ng-class="{\'item-icon-left\': item.icon}"' + 
                                                'toggle-class="toggle-{{color}}"' + 
                                                'ng-if="item.type === \'toggle\'"' +
                                                'ng-model="item.value">' + 
                                        '{{item.label}}' +
                                        '<i class="icon ionic-settings-icon-smaller {{elementColor}} {{item.icon}}" ng-if="item.icon"></i>' +
                                    '</ion-toggle>' +
                                    '<ion-toggle ng-class="{\'item-icon-left\': item.icon}"' + 
                                                'toggle-class="toggle-{{color}}"' + 
                                                'ng-if="item.type === \'pin\'"' +
                                                'ng-change="doAction(key)"' +
                                                'ng-init="pin.active = item.value.length === 4"' +
                                                'ng-model="pin.active">' + 
                                        '{{item.label}}' +
                                        '<i class="icon ionic-settings-icon-smaller {{elementColor}} {{item.icon}}" ng-if="item.icon"></i>' +
                                    '</ion-toggle>' +
                                    '<div class="item item-icon-left" ng-if="item.type === \'input\' && item.icon">' +
                                        '<i class="icon {{elementColor}} ionic-settings-icon-smaller {{item.icon}}" ng-if="item.icon"></i>' +
                                        '<label class="item item-borderless item-input">' +
                                            '<span class="input-label" style="margin-left: -13px;">{{item.label}}</span>' +
                                            '<input type="{{item.inputType}}" ng-model="item.value">' +
                                        '</label>' +
                                    '</div>' +
                                    '<label class="item item-input" ng-if="item.type === \'input\' && !item.icon">' +
                                        '<span class="input-label">{{item.label}}</span>' +
                                        '<input type="{{item.inputType}}" ng-model="item.value">' +
                                    '</label>' +
                                    '<label class="item" ng-if="item.type === \'range\'">' +
                                        '<div class="item-content">{{item.label}}</div>' +
                                        '<div class="range range-{{color}}">' + 
                                            '<i class="icon ionic-settings-icon-smaller {{elementColor}} {{item.iconLeft}}"></i>' +
                                            '<input type="range" name="volume" min="{{item.min}}" max="{{item.max}}" ng-model="item.value">' +
                                            '<i class="icon ionic-settings-icon-smaller {{elementColor}} {{item.iconRight}}"></i>' +
                                        '</div>' +
                                    '</label>' +
                                '</div>' + 
                            '</div>',
                link: function($scope) {
                    var active = {};
                    var modals = {};
                    
                    $scope.data = $ionicSettings.getData();
                    $scope.isAndroid = $ionicSettingsConfig.isAndroid;
                    $scope.iconClose = $ionicSettingsConfig.iconClose;
                    $scope.iconClosePosition = $ionicSettingsConfig.iconClosePosition;
                    $scope.iconSelected = $ionicSettingsConfig.isAndroid ? "ion-android-done" : "ion-ios-checkmark-empty";
                    $scope.pin = {
                        active: false
                    };
                    $scope.showing = false;
                    $scope.color = $ionicSettingsConfig.color;
                    $scope.elementColor = $scope.color === "stable" || $scope.color === "default" || $scope.color === "light" ? "dark" : $scope.color;
                    $scope.barColor = "bar-" + $scope.color;
                    
                    angular.forEach($scope.data, function(item, key) {
                        modals[key] = $ionicSettings.createModal($scope, key);

                        $scope.$watch("data." + key + ".value", function(newValue, oldValue) {
                            if (angular.isDefined(newValue) && newValue !== oldValue) {
                                $ionicSettings.store(key, newValue).then(function() {
                                    $scope.$root.$broadcast($ionicSettings.changed, {
                                        key: key, 
                                        value: newValue
                                    });
                                }, function() {
                                    $scope.data[key].value = oldValue;
                                });
                            }
                        });
                    });
                    
                    $scope.addValue = function(value) {
                        if ($scope.value.length === 4) {
                            $scope.value = "";
                        }
                        $scope.value += value;
                    };

                    $scope.clear = function() {
                        $scope.value = "";
                    };
                    
                    $scope.dismiss = function() {
                        if (active.item.type === IONIC_SETTINGS_PIN) {
                            if ($scope.value.length === 0 || $scope.value.length === 4) {
                                active.item.value = $scope.value;
                            }
                            $scope.pin.active = $scope.value.length === 4;
                        }
                        active.modal.hide().then(function() {
                            active = {};
                        });
                    };
                    
                    $scope.hidePin = function() {
                        $scope.showing = false;
                    };
                    
                    $scope.doAction = function(key) {
                        active.modal = modals[key];
                        active.item = $scope.data[key];
                        if (active.modal) {
                            if (active.item.type === IONIC_SETTINGS_PIN) {
                                if (active.item.value.length === 4) {
                                    active.item.value = "";
                                } else {
                                    $scope.value = active.item.value;
                                    active.modal.show();
                                }
                            } else  {
                                active.modal.show();
                            }
                        } else {
                            if (angular.isFunction(active.item.onClick)) {
                                active.item.onClick();
                            }
                        }
                    };
                    
                    $scope.select = function(value) {
                        active.item.value = value;
                        $scope.dismiss();
                    };
                    
                    $scope.showPin = function() {
                        $scope.showing = true;
                    };
                    
                    $scope.$on("$destroy", function() {
                        for (key in modals) {
                            if (modals[key]) {
                                modals[key].remove();
                            }
                        }
                    });
                }
            };
        }])
        .directive("ionSettingsButton", [
            "$ionicSettingsConfig", 
            "$ionicSettings", function(
            $ionicSettingsConfig, 
            $ionicSettings) {
            return {
                template: '<button class="button button-icon icon {{icon}}" ng-click="settingsModal.show()"></button>',
                $scope: true,
                link: function($scope) {
                    $scope.barColor = "bar-" + $ionicSettingsConfig.color;
                    $scope.icon = $ionicSettingsConfig.icon;
                    $scope.iconClose = $ionicSettingsConfig.iconClose;
                    $scope.iconClosePosition = $ionicSettingsConfig.iconClosePosition;
                    $scope.settingsModal = $ionicSettings.createModal($scope);
                    $scope.title = $ionicSettingsConfig.title;
                    
                    $scope.dismiss = function() {
                        $scope.settingsModal.hide();
                    };
                }
            };
        }])
        .directive("ngTouchstart", function () {
            return {
                controller: ["$scope", "$element", function ($scope, $element) {
                    $element.bind("touchstart", onTouchStart);
                    function onTouchStart(event) {
                        var method = $element.attr("ng-touchstart");
                        $scope.$event = event;
                        $scope.$apply(method);
                    }

                }]
            };
        })
        .directive("ngTouchend", function () {
            return {
                controller: ["$scope", "$element", function ($scope, $element) {
                    $element.bind("touchend", onTouchEnd);
                    function onTouchEnd(event) {
                        var method = $element.attr("ng-touchend");
                        $scope.$event = event;
                        $scope.$apply(method);
                    }

                }]
            };
        });
    
    angular.module("ionicSettings.providers", []).provider("$ionicSettingsConfig", function() {
        var android = ionic.Platform.isAndroid();
        var color = "positive";
        var icon = android ? "ion-android-settings" : "ion-ios-gear";
        var iconClose = android ? "ion-android-close" : "ion-ios-close-empty";
        var iconClosePosition = "right";
        var modalAnimation = android ? "ionic-settings-animate-modal-android" : "slide-in-up";
        var title = "Settings";
        var touchID = true;
        return {
            setAndroid: function(_android) {
                android = _android;
            },
            setIcon: function(_icon) {
                icon = _icon;
            },
            setIconClose: function(_iconClose) {
                iconClose = _iconClose;
            },
            setIconClosePosition: function(_iconClosePosition) {
                iconClosePosition = _iconClosePosition;
            },
            setModalAnimation: function(_modalAnimation) {
                modalAnimation = _modalAnimation;
            },
            setColor: function(_color) {
                color = _color;
            },
            setTitle: function(_title) {
                title = _title;
            },
            setTouchID: function(_touchID) {
                touchID = _touchID;
            },
            $get: function() {
                return {
                    color: color,
                    icon: icon,
                    iconClose: iconClose,
                    iconClosePosition: iconClosePosition,
                    isAndroid: android,
                    modalAnimation: modalAnimation,
                    title: title,
                    touchID: touchID
                };
            }
        };
    });

    angular.module("ionicSettings.services", [])
        .factory("$ionicSettings", [
            "$ionicSettingsConfig",
            "$ionicModal",
            "$q",
            "$rootScope",
            "$window",
            "IONIC_SETTINGS_PIN",
            "IONIC_SETTINGS_SELECTION",
            "IONIC_SETTINGS_TEXT", function(
            $ionicSettingsConfig,
            $ionicModal,
            $q,
            $rootScope,
            $window,
            IONIC_SETTINGS_PIN,
            IONIC_SETTINGS_SELECTION,
            IONIC_SETTINGS_TEXT) {
            var self = this;
            var data = {};
            var pin;
            var $cordovaSplashscreenOn = true;
            
            self.changed = "$ionicSettings.changed";
            self.onInvalidPin = "$ionicSettings.onInvalidPin";
            self.onValidPin = "$ionicSettings.onValidPin";
            
            self.createModal = function($scope, key) {
                var html;
                if (key) {
                    var item = data[key];
                    switch(item.type) {
                        case IONIC_SETTINGS_SELECTION:
                            html =  
                            '<ion-modal-view>' +
                                '<ion-header-bar ng-class="barColor">' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'left\'" ng-click="dismiss()"></button>' +
                                    '<h1 class="title">' + item.label + '</h1>' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'right\'" ng-click="dismiss()"></button>' +
                                '</ion-header-bar>' +
                                '<ion-content>' +
                                    '<ion-item class="item-icon-right" ng-class="{\'active\': data.'+key+'.value === value}" ng-repeat="value in data.'+key+'.values" ng-click="select(value)">' +
                                        '{{value}}' +
                                        '<i class="icon ion-ios-checkmark-empty positive" ng-show="data.'+key+'.value === value"></i>' +
                                    '</ion-item>' +
                                '</ion-content>' +
                            '</ion-modal-view>';
                            break;
                        case IONIC_SETTINGS_PIN:
                            html = 
                            '<ion-modal-view>' +
                                '<ion-header-bar ng-class="barColor">' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'left\'" ng-click="dismiss()"></button>' +
                                    '<h1 class="title">' + item.label + '</h1>' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'right\'" ng-click="dismiss()"></button>' +
                                '</ion-header-bar>' +
                                '<ion-content class="center-vertical">' +
                                    '<div class="ionic-settings-numbers">' +  
                                        '<div class="ionic-settings-numbers-row">' +
                                            '<i class="icon ionic-settings-numbers-dot" ng-repeat="$index in [1,2,3,4]" ng-if="!showing" ng-class="{\'ion-ios-circle-outline\': value.length <= $index, \'ion-ios-circle-filled\': value.length > $index}"></i>' +
                                            '<span class="ionic-settings-numbers-value" ng-repeat="$index in [1,2,3,4]" ng-if="showing">{{value[$index]}}</span>' +
                                        '</div>' +
                                        '<div class="ionic-settings-numbers-row" ng-repeat="row in [0,1,2]">' +
                                            '<button class="button button-outline button-{{color}} ionic-settings-numbers-button"' +
                                                    'ng-repeat="col in [1,2,3]"' +
                                                    'ng-click="addValue(row * 3 + col)">' +
                                                '{{row * 3 + col}}' +
                                            '</button>' +
                                        '</div>' +
                                        '<div class="ionic-settings-numbers-row">' +
                                            '<button class="button button-outline button-{{color}} ionic-settings-numbers-button" ng-hide="start" ng-click="clear()">C</button>' +
                                            '<button class="button button-outline button-{{color}} ionic-settings-numbers-button" ng-click="addValue(0)">0</button>' +
                                            '<button class="button button-outline button-{{color}} ionic-settings-numbers-button icon ion-eye"' + 
                                                    'ng-hide="start"' +
                                                    'ng-disabled="value.length !== 4"' +
                                                    'ng-mousedown="showPin()"' +
                                                    'ng-mouseup="hidePin()"' +
                                                    'ng-touchstart="showPin()"' + 
                                                    'ng-touchend="hidePin()">' +
                                            '</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</ion-content>' +
                            '</ion-modal-view>';
                            break;
                        case IONIC_SETTINGS_TEXT:
                            html =
                            '<ion-modal-view>' +
                                '<ion-header-bar ng-class="barColor">' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'left\'" ng-click="dismiss()"></button>' +
                                    '<h1 class="title">' + item.label + '</h1>' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'right\'" ng-click="dismiss()"></button>' +
                                '</ion-header-bar>' +
                                '<ion-content>' + item.value + '</ion-content>' +
                            '</ion-modal-view>';
                            break;
                    }     
                } else {
                    html = '<ion-modal-view>' +
                                '<ion-header-bar ng-class="barColor">' + 
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'left\'" ng-click="dismiss()"></button>' +
                                    '<h1 class="title">{{title}}</h1>' +
                                    '<button class="button button-icon {{iconClose}}" ng-if="iconClosePosition === \'right\'" ng-click="dismiss()"></button>' +
                                '</ion-header-bar>' +
                                '<ion-content>' + 
                                    '<ion-settings></ion-settings>' + 
                                '</ion-content>' +
                            '</ion-modal-view>';
                }
                if (html) {
                    return $ionicModal.fromTemplate(html, {
                        scope: $scope,
                        animation: $ionicSettingsConfig.modalAnimation
                    }); 
                }
            };
            
            self.fetch = function(key) {
                var q = $q.defer();
                if ($window.plugins) {
                    $window.plugins.appPreferences.fetch(key).then(function(value) {
                        if (value === null) {
                            q.reject(value);
                        } else {
                            q.resolve({key: key, value: value});
                        }
                    }, function(error) {
                        q.reject(new Error(error));
                    });
                } else {
                    var value = localStorage[key];
                    if (value === undefined) {
                        q.reject(value);
                    } else {
                        if (value === "true" || value === "false") {
                            value = value === "true";
                        }
                        q.resolve({key: key, value: value});
                    }
                }
                return q.promise;
            };
            
            self.fetchAll = function() {
                var fetching = [];
                for (key in data) {
                    var item = data[key];
                    if (angular.isObject(item)) {
                        fetching.push(self.fetch(key));
                    }
                }
                return $q.all(fetching).then(function(result) {
                    for (var i in result) {
                        var resultItem = result[i];
                        var key = resultItem.key;
                        var value = resultItem.value;
                        
                        var item = data[key];
                        item.value = value;
                        if (item.type === IONIC_SETTINGS_PIN) {
                            pin = {
                                key: key,
                                value: value
                            };
                        }
                    }
                    return data;
                });
            };
            
            self.get = function(key) {
                return data[key].value;
            };

            self.getData = function() {
                return data;
            };

            self.init = function(_data) {
                data = _data;
                
                var q = $q.defer();
                
                self.fetchAll().then(function(result) {
                    if (pin && pin.value.length === 4) {
                        var $scope = $rootScope.$new();
                        var pinModal = self.createModal($scope, pin.key);
                        
                        $scope.color = $ionicSettingsConfig.color;
                        $scope.barColor = "bar-" + $scope.color;
                        $scope.start = true;
                        $scope.value = "";
                        $scope.valid = false;
                        
                        var pinItem = data[pin.key];
                        if (pinItem.onValid) {
                            $scope.$on(self.onValidPin, pinItem.onValid);
                        }
                        if (pinItem.onInvalid) {
                            $scope.$on(self.onInvalidPin, pinItem.onInvalid);
                        }
                        
                        $scope.addValue = function(value) {
                            $scope.value += value;
                            if ($scope.value.length === 4) {
                                $scope.valid = $scope.value === pin.value;
                                if ($scope.valid) {
                                    pinModal.remove().then(function() {
                                        q.resolve(result);
                                        $rootScope.$broadcast(self.onValidPin);
                                        if ($cordovaSplashscreenOn) {
                                            try {
                                                navigator.splashscreen.show();
                                            } catch(e) {}
                                        }
                                    });
                                } else {
                                    $rootScope.$broadcast(self.onInvalidPin, $scope.value);
                                    $scope.clear();
                                }
                            }
                            if ($scope.value.length > 4) {
                                $scope.clear();
                                $scope.value += value;
                            }
                        };
                        
                        $scope.clear = function() {
                            $scope.value = "";
                        };  
                        
                        pinModal.show().then(function() {
                            try {
                                navigator.splashscreen.hide();
                            } catch(e) {
                                $cordovaSplashscreenOn = false;
                            }
                            if ($ionicSettingsConfig.touchID) {
                                try {
                                    touchid.checkSupport(function() {
                                        touchid.authenticate(function() {
                                            q.resolve(result);
                                        }, function() {
                                        }, "Touch ID");
                                    });
                                } catch(e) {}
                            }
                        });
                    } else {
                        q.resolve(result);
                    }
                }, function() {
                    self.storeAll(_data).then(function(result) {
                        q.resolve(result);
                    });
                });
                
                return q.promise;
            };
            
            self.set = function(key, value) {
                data[key].value = value;
            };

            self.store = function(key, value) {
                var q = $q.defer();
                if ($window.plugins) {
                    $window.plugins.appPreferences.store(key, value).then(function(value) {
                        q.resolve(value);
                    }, function(error) {
                        q.reject(new Error(error));
                    });
                } else {
                    localStorage[key] = value;
                    q.resolve(localStorage[key]);
                }
                return q.promise;
            };
            
            self.setSelectionValues = function(key, values) {
                angular.copy(values, data[key].values);
            };
            
            self.storeAll = function() {
                var storing = [];
                for (key in data) {
                    var item = data[key];
                    if (angular.isObject(item)) {
                        storing.push(self.store(key, item.value));
                    }
                }
                return $q.all(storing);
            };

            return self;
        }]);

    // App
    angular.module("ionicSettings", [
        "ionicSettings.constants",
        "ionicSettings.directives",
        "ionicSettings.providers",
        "ionicSettings.services"
    ]);
})(angular);
