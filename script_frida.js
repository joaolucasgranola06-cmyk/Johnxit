
// script_frida.js
Java.perform(function() {
    var View = Java.use('android.view.View');
        
            View.dispatchTouchEvent.implementation = function(event) {
                    // Modificar eventos de toque aqui
                            return this.dispatchTouchEvent(event);
                                };
                                });