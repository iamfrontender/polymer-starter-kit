/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.settings = {
    hosts: {
      local: localStorage.getItem('localhost') || 'http://192.168.0.12:8080',
      remote: localStorage.getItem('remotehost') || 'https://api.evrythng.net',
      wsServer: localStorage.getItem('wsServer') || 'wss://ws-test.evrythng.net:443/mqtt'
    },
    appApiKey: localStorage.getItem('apikey') ||
    'Ni7oQCVhZExJFFEmhonrrwady2jf41y8T2FgaMl5MJBYbs6aIjo3uqXXjcsiE5SigF5OZjwZwfBg7BLx',
    pollingPeriod: localStorage.getItem('polling') || 0
  };

  app.properties = {
    device: {
      type: Object,
      notify: true
    }
  };

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered

  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = Polymer.dom(document).querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.hubApp.scrollToTop(true);
  };

  app.notifyListResize = function() {
    Array.prototype.slice.call(document.querySelectorAll('iron-list')).forEach(function(list) {
      list.notifyResize()
    })
  };

  app.hasDevice = function() {
    return app.device !== null;
  };

  app.isThisDeviceLoaded = function(id) {
    return app.hasDevice() && app.device.id === id;
  };

  app.loadDevice = function(id) {
    var devices = document.querySelector('evt-thng-list').thngs;
    var device = _.find(devices, {
      id: id
    });

    if (device) {
      app.device = device;
    } else {
      app.$.toast.text = 'Cannot find device with ' + id + ' id';
      app.$.toast.show();

      page.redirect('/');
    }
  };

  app.init = function() {

    EVT.use(EVT.WS);

    EVT.WS.setup({
      apiUrl: this.settings.hosts.wsRemote,
      localhostUrl: this.settings.hosts.wsLocal
    });

    EVT.setup({
      apiUrl: this.settings.hosts.remote,
      localhostUrl: this.settings.hosts.local,
      timeout: 1000
    });

    // EVT App init
    app.evt = new EVT.App({
      apiKey: app.settings.appApiKey
      //facebook: true
    });

    app.evt.$init.then(function (result) {
      //$this.user = result.user;

      app.user = new EVT.User({
        id: 'UDwVcpeRsBpa2KtCXRtN3cWa',
        apiKey: 'LbL3NUSn0AQ6uwOtEfKd0GH1Th6fGxZL5Xr9Bz8f7G6f7PMCroULw6px5uzuxDsYEVySTcTsBzlAOgbp'
      }, app.evt);

      app.user.facebook = {
        photo: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p50x50/11903934_' +
        '1481002198887411_373819594593573577_n.jpg?oh=9b0ab86f4a93e7b4add3fbc8fd2fd073&oe=569603A0&' +
        '__gda__=1449019403_106e2cc807bdeb3167e57f498dd1e9ef',
        first_name: 'George',
        last_name: 'Generic'
      };
    }, function (err) {
      app.$.toast.text = 'Error: ' + err.message;
      app.$.toast.show();
    });
  };

  app.init();


})(document);
