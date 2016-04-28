# ionic-settings

This plugin provides a useful template for your app settings. The keys and values are stored as app preferences on condition that you use the 
[corresponding plugin](https://github.com/apla/me.apla.cordova.app-preferences), otherwise they are stored in `localStorage`. 

## Demo 
![demo1](http://i.giphy.com/26AHvh5QyvcKmmPMA.gif)

## Features 
* 5 setting types: `selection`, `toggle`, `input`, `range` and `pin`
* 2 additional types: `button` and `text`
* grouping of settings
* including settings into a view or show them as modal
* customizing of settings appearance (color, icons and button positions)
* storage as app preferences using the above mentioned plugin, otherwise in `localStorage`
* touch id support if the [plugin](https://github.com/leecrossley/cordova-plugin-touchid) is installed

## Usage 
1. [Download](https://gumroad.com/l/lQUJ#)  the zip file including the plugin and an example app. 
    
2. Include the javascript and css files or the minified versions into your `index.html` file.

    ```html
    <link href="style/css/ionic-settings.min.css" rel="stylesheet">
    <script src="dist/ionic-settings.min.js"></script>
    ```
    
3. Add the module `ionicSettings` to your application dependencies:

    ```javascript
    angular.module('starter', ['ionic', 'ionicSettings'])
    ```
    
4. Settings are defined according to the following patterns: 

    ```javascript
    var settingsWithoutGrouping = {
        mySelection: { // UNIQUE KEY
            type: 'selection',  // TYPE
            data: ['value 1', 'value 2', 'value 3', 'value 4', 'value 5'], // SELECTION ARRAY
            label: 'Selection',  // LABEL
            value: 'value 1', // VALUE
            icon: 'ion-checkmark-round' // ICON (OPTIONAL)
        },
        myToggle: {
            type: 'toggle',
            label: 'Toggle',
            value: true,
            icon: 'ion-toggle'
        },
        myInput: {
            type: 'input',
            label: 'Input',
            inputType: 'text',
            value: 'Hello World!',
            icon: 'ion-edit'
        },
        myRange: {
            type: 'range',
            label: 'Range',
            iconLeft: 'ion-minus-circled',
            iconRight: 'ion-plus-circled',
            min: 0,
            max: 100,
            value: 50
        }
        myPin: {
            type: 'pin',
            label: 'PIN',
            value: '',
            icon: 'ion-locked'
        },
        myButton: {
            type: 'button',
            label: 'Button',
            icon: 'ion-disc',
            onClick: function() {
                alert('Hello world!');
            }
        },
        myText: {
            type: 'text',
            label: 'Text',
            icon: 'ion-document-text',
            value: '<p class="padding">Hello World!</p>'
        }
    };
    var settingsWithGrouping = {
        group1: {
            label: 'Group 1', // GROUP LABEL (OPTIONAL)
            mySelection: { // UNIQUE KEY
                type: 'selection',
                data: ['value 1', 'value 2', 'value 3', 'value 4', 'value 5'],
                label: 'Selection',
                value: 'value 1',
                icon: 'ion-clipboard'
            },
            myToggle: {
                type: 'toggle',
                label: 'Toggle',
                value: true,
                icon: 'ion-toggle'
            }
        },
        group2: {
            label: 'Group 2',
            myButton: {
                type: 'button',
                label: 'Button',
                icon: 'ion-disc',
                onClick: function() {
                    alert('Hello world!');
                }
            },
            myText: {
                type: 'text',
                label: 'Text',
                icon: 'ion-document-text',
                value: '<p class="padding">Hello World!</p>'
            }
        }
    };
    ```

5. To initialize your app settings invoke the `init()` method of the `$ionicSettings` service (returns promise) passing your settings model object. If you'd like to protect your app with a pin, make sure to initialize your settings before the main state of your app is loaded like shown below. Use the `$ionicSettings.onValidPin` / `$ionicSettings.onInvalidPin` event if you want to provide an action on entering valid / invalid pin.
    
    ```javascript
    // INITIALIZATION IN CONFIG PHASE
    angular.module('starter', ['ionic', 'ionicSettings'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                resolve: {
                    settings: function($rootScope, $ionicSettings, $ionicPopup) {
                    // PIN INPUT EVENTS
                    $rootScope.$on($ionicSettings.onInvalidPin, function($event, value) {
                        $ionicPopup.alert({
                            title: 'Fail',
                            template: 'Wrong pin: ' + value + '. Try again.'
                        });
                    });
                    $rootScope.$on($ionicSettings.onValidPin, function() {
                        $ionicPopup.alert({
                            title: 'Success',
                            template: 'Welcome!'
                        });
                    });
                    // INITIALIZING SETTINGS
                    var settings = {
                        myButton: {
                            type: 'button',
                            label: 'Button',
                            onClick: function() {
                                alert('Hello world!');
                            }
                            icon: 'ion-disc'
                        },
                        myPin: {
                            type: 'pin',
                            label: 'PIN',
                            value: '',
                            icon: 'ion-locked'
                        }
                    };
                    return $ionicSettings.init(settings);
                    }
                }
            })
    });
    // INITIALIZATION IN CONTROLLER
    angular.module('starter.controllers', [])
    .controller('InfoCtrl', function($scope, $ionicSettings) {
        $ionicSettings.init({
            mySelection: {
                type: 'selection',
                data: ['value 1', 'value 2', 'value 3', 'value 4', 'value 5'],
                label: 'Selection',
                value: 'value 1',
                icon: 'ion-clipboard'
            },
            myToggle: {
                type: 'toggle',
                label: 'Toggle',
                value: true,
                icon: 'ion-toggle'
            }
        });
    });
    ```
    
6. To include your settings into a view simply use the `ion-settings` directive within the `ion-content` element.

    ```html
    <ion-view>    
        <ion-content>
            <ion-settings></ion-settings>
        </ion-content>
    </ion-view>
    ```

    To use settings as modal add the directive `ion-settings-button` to the navigation bar. Pressing this button opens the modal.

    ```html
    <ion-view>
        <ion-nav-buttons side="right">
            <ion-settings-button></ion-settings-button>
        </ion-nav-buttons>
        <ion-content>
        </ion-content>
    </ion-view>
    ```
7. You can listen to the `$ionicSettings.changed` event to get the key value pair of a currently changed setting. 
    
    ```javascript
    angular.module('starter.controllers', [])
    .controller('YourCtrl', function($scope, $ionicSettings) {
        $scope.$on($ionicSettings.changed, function($event, changedSetting) {
            alert(changedSetting.key + ' -> ' + changedSetting.value);
        });
    });
    ```
    
8. Get and set setting values using `get()` and `store()` methods of the `$ionicSettings` service.

    ```javascript
    angular.module('starter.controllers', [])
    .controller('YourCtrl', function($scope, $ionicSettings) {
        $scope.store = function(key, value) {
            $ionicSettings.store(key, value).then(function() {
                // 
            });
        };
        $scope.get = function(key) {
            alert($ionicSettings.get(key));
        };
    });
    ```

## Configuration provider

There is a provider named `$ionicSettingsConfigProvider`. The following options can be set in the configuration phase:

option|description|type|accepted values|default value
---|---|---|---|---
iconClose|close button icon|string|ion-icons|*ion-android-close* for Android and *ion-ios-close-empty* for iOS
iconClosePosition|close button icon position|string|right, left|*right*
iconSettings|settings icon|string|ion-icons|*ion-android-settings* for Android and *ion-ios-gear* for iOS
modalAnimation|modal animation|string|ionic modal animation identifiers|custom animation for Android and *slide-in-up* for iOS 
theme|settings theme|string|ionic color names|*positive*
title|settings title|string|text|*Settings*

#### Example
##### Code

```javascript
angular.module('starter', ['ionic', 'ionicSettings'])
.config(function($ionicSettingsConfigProvider) {
    $ionicSettingsConfigProvider.setIconClose('ion-close-circled');
    $ionicSettingsConfigProvider.setIconClosePosition('left');
    $ionicSettingsConfigProvider.setIconSettings('ion-wrench');
    $ionicSettingsConfigProvider.setModalAnimation('slide-in-up');
    $ionicSettingsConfigProvider.setTheme('assertive');
    $ionicSettingsConfigProvider.setTitle('My awesome settings');
});
```

##### Result
![demo3](http://i.giphy.com/l3V0E8kPbCY5p7ngc.gif)

### Service `$ionicSettings`

Using this service you have access to the following events and methods:

event|description|return value
---|---|---
`changed`|Settings changed event|key value pair of a changed setting 
`onValidPin`|Entered correct pin event|wrong entered pin
`onInvalidPin`|Entered wrong pin event|none

method|description|return-value
---|---|---
`get(key)`|Getting a value by key|value of a given key
`getData()`|Retrieval of all settings keys and values|object containing all key value pairs
`store(key, value)`|Setting a value by key|promise

## Author

☟|☟
---|---
email|ivan.weber@gmx.de
twitter|https://twitter.com/hybrid_app
github|https://github.com/ivandroid
ionic market|https://market.ionic.io/user/6540
