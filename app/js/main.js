/* Main javascript  */

$(function(){
    // Load native UI library
    var gui = require('nw.gui');

    //instantiate markgiu app and bind it to DOM
    var markGiuApp = new markgiu.AppGui();
    markGiuApp.bindChoosers('#choosefile', '#savefileas');
    ko.applyBindings(markGiuApp, $("#wrap")[0]);
    
    //show window
    gui.Window.get().show();
    
});