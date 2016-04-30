# <img src="http://fs5.directupload.net/images/160430/hs83mnct.png" width="30"> ionic-settings 

* [Info](#1-info)
    * [Features](#11-features)
    * [Screenshots](#12-screenshots)
    * [Demo](#13-demo)
    * [License](#14-license)
    * [Versions](#15-versions)
    * [Author](#16-author)
* [Usage](#2-usage)
* [Configuration provider](#3-configuration-provider)
* [Services](#4-services)
* [Directives](#5-directives)

##1. Info
This plugin provides a useful template for your app settings. The keys and values are stored as app preferences on condition that you have installed 
[the app preferences plugin](https://github.com/apla/me.apla.cordova.app-preferences), otherwise they are stored in `localStorage`. 
You can test the plugin via the [ionic view app](http://view.ionic.io/) with the ID **141b234c**.

##1.1 Features 
* 5 setting types: `selection`, `toggle`, `input`, `range` and `pin`
* 2 read-only types: `button` and `text`
* grouping of settings
* including settings into a view or modal view
* customizing of settings appearance (color, icons and button positions)
* storage as app preferences using the above mentioned plugin, otherwise in `localStorage`
* touch id support if the [touch id plugin](https://github.com/leecrossley/cordova-plugin-touchid) is installed

##1.2 Screenshots
<img src="http://fs5.directupload.net/images/160429/8tmii2s9.png" width="200"> <img src="http://fs5.directupload.net/images/160429/yjl9yyip.png" width="200"> <img src="http://fs5.directupload.net/images/160429/apjtcg2q.png" width="200"> <img src="http://fs5.directupload.net/images/160429/g3v52s7t.png" width="200">

##1.3 Demo 
<img src="http://i.giphy.com/3o6oztisWm5VfKIRs4.gif" width="300">

##1.4 License

[MIT](https://github.com/ivandroid/ionic-settings/blob/master/LICENSE)

##1.5 Versions

[CHANGELOG](https://github.com/ivandroid/ionic-settings/blob/master/CHANGELOG.md)

###1.6 Author
* E-Mail: ivan.weber@gmx.de
* Twitter: https://twitter.com/hybrid_app
* Github: https://github.com/ivandroid
* Ionic Market: https://market.ionic.io/user/6540
* Donations: You're welcome to donate. Any amount at any time! :-)

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ivan%2eweber%40gmx%2ede&lc=DE&item_name=GithubRepositories&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHostedGuest)

##2. Usage 
1. Get the files from here or install from bower:

    ```
    bower install ionic-settings
    ``` 
    
2. Include the javascript and css files or the minified versions into your `index.html` file.

    ```html
    <link href="style/css/ionic-settings.min.css" rel="stylesheet">
    <script src="dist/ionic-settings.min.js"></script>
    ```
    
3. Add the module `ionicSettings` to your application dependencies:

    ```javascript
    angular.module('starter', ['ionic', 'ionicSettings'])
    ```
    
4. Settings are defined according to the following pattern: 

    ```javascript
    var settings = {
        label1: 'Group 1', // OPTIONAL GROUP LABEL
        mySelection: { // KEY
            type: 'selection',  // TYPE
            data: ['value 1', 'value 2', 'value 3', 'value 4', 'value 5'],
            label: 'Selection',  // LABEL
            value: 'value 1', // VALUE
            icon: 'ion-checkmark-round' // OPTIONAL ICON
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
        },
        label2: 'Group 2',
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
        myPin: {
            type: 'pin',
            label: 'PIN',
            value: '',
            icon: 'ion-locked'
            onValid: function() { // OPTIONAL ACTION ON VALID PIN
                alert('Success!');
            },
            onInvalid: function() {  // OPTIONAL ACTION ON INVALID PIN
                alert('Fail!');
            }
        }
    };
    ```

5. To initialize the settings invoke the `init()` method of the `$ionicSettings` service (returns promise) passing your settings model object. If you'd like to protect your app with a pin / touch id, make sure to initialize your settings before the main state of your app is loaded like shown below.
    
    ```javascript
    // INITIALIZATION IN CONFIG PHASE (USING PIN)
    angular.module('starter', ['ionic', 'ionicSettings'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                abstract: true,
                templateUrl: 'templates/main.html',
                resolve: {
                    settings: function($ionicSettings, $ionicPopup) {
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
                                icon: 'ion-locked',
                                onValid: function() {
                                    $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Welcome!'
                                    });
                                },
                                onInvalid: function($event, wrongPinValue) {
                                    $ionicPopup.alert({
                                        title: 'Fail',
                                        template: 'Wrong pin: ' + wrongPinValue + '! Try again.'
                                    });
                                }
                            }
                        };
                        return $ionicSettings.init(settings);
                    }
                }
            })
    });
    // INITIALIZATION IN CONTROLLER (WITHOUT PIN)
    angular.module('starter.controllers', [])
    .controller('YourCtrl', function($scope, $ionicSettings) {
        $ionicSettings.init({
            mySelection: {
                type: 'selection',
                data: ['value 1', 'value 2', 'value 3', 'value 4', 'value 5'],
                label: 'Selection',
                value: 'value 1',
                icon: 'ion-checkmark-round'
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
    
6. To include your settings into a view simply use the `ion-settings` directive within the `ion-content` element. To show the settings as modal add the directive `ion-settings-button` to the navigation bar. Pressing this button opens the modal.```html
    <ion-view>    
        <ion-content>
            <ion-settings></ion-settings>
        </ion-content>
    </ion-view>
    <ion-view>
        <ion-nav-buttons side="right">
            <ion-settings-button></ion-settings-button>
        </ion-nav-buttons>
        <ion-content>
        </ion-content>
    </ion-view>
    ```

##3. Configuration provider

Via the `$ionicSettingsConfigProvider` the following options can be set in the configuration phase:

option|description|type|accepted values|default value
---|---|---|---|---
color|color of setting elements|string|ionic color names|*positive*
icon|settings icon|string|ion-icons|*ion-android-settings* for Android and *ion-ios-gear* for iOS
iconClose|close button icon|string|ion-icons|*ion-android-close* for Android and *ion-ios-close-empty* for iOS
iconClosePosition|close button icon position|string|*right, left*|*right*
modalAnimation|modal animation|string|ionic modal animation identifiers|custom animation for Android (ionic-settings.scss) and *slide-in-up* for iOS 
title|settings title|string|text|*Settings*
touchID|touch id support|boolean|*true, false*|*true*

#### Example
##### Code

```javascript
angular.module('starter', ['ionic', 'ionicSettings'])
.config(function($ionicSettingsConfigProvider) {
    $ionicSettingsConfigProvider.setColor('assertive');
    $ionicSettingsConfigProvider.setIcon('ion-wrench');
    $ionicSettingsConfigProvider.setIconClose('ion-close-circled');
    $ionicSettingsConfigProvider.setIconClosePosition('left');
    $ionicSettingsConfigProvider.setModalAnimation('slide-in-up');
    $ionicSettingsConfigProvider.setTitle('My awesome settings');
    $ionicSettingsConfigProvider.setTouchID(false);
});
```

##### Result
<img src="http://i.giphy.com/3o6ozuojr5gpCve7bW.gif" width="300">

##4. Services
### Service `$ionicSettings`

Using this service you have access to the following events and methods:

event|description|return-value
---|---|---
`changed`|Setting changed event|object containing key and value of a changed setting 

#### Example

 ```javascript
angular.module('starter.controllers', [])
.controller('YourCtrl', function($scope, $ionicSettings) {
    $scope.$on($ionicSettings.changed, function($event, changedSetting) {
        alert(changedSetting.key + ' -> ' + changedSetting.value);
    });
});
```

method|description|return-value
---|---|---
`get(key)`|Getting a value by key|value of a given key
`getData()`|Getting all settings keys and values|object containing all key value pairs
`init(modelObject)`|Initializing of settings passing your settings model object|initialized settings model object as promise
`store(key, value)`|Setting a value by key|changed setting value as promise

#### Example

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

##5. Directives

### Directive `ion-settings`

Use this directive to include your settings into a view.

#### Example

```html
<ion-view>    
    <ion-content>
        <ion-settings></ion-settings>
    </ion-content>
</ion-view>
```

### Directive `ion-settings-button`

Use this directive to include the settings button to the navigation bar and use settings as modal.

#### Example

```html
<ion-view>
    <ion-nav-buttons side="right">
        <ion-settings-button></ion-settings-button>
    </ion-nav-buttons>
    <ion-content>
    </ion-content>
</ion-view>
```
