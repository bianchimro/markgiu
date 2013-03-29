var ajaxutils = ajaxutils || {};
ajaxutils.targetSelector =  "#ajaxutils-console-message";


ajaxutils.alertMessage = function(message, cssClass){

    var target = $(ajaxutils.targetSelector);
    var div = $("<div class='alert'><button type='button' class='close' data-dismiss='alert'>&times;</button><p>"+message+"</p></div>");
    
    if(cssClass){
        div.addClass(cssClass)
    
    }
    
    target.empty();
    target.append(div);
    

};

//#todo: add a modal alert

ajaxutils.openModals = {};

ajaxutils.openModal = function(modalName, options){
    var options = options || {};
    var body = options.body || '';
    var head = options.head || '';
    
    var closable = (options.closable === true);
    var closeMarkup = '';
    if(closable){
        closeMarkup = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
    }
    
    //var manager = $('body').modalmanager('loading');
    //console.log("man", manager);
    var tmpl = [
        // tabindex is required for focus
        '<div id="modal-dialog-'+ modalName+'" class="modal hide fade" tabindex="-1">',
          '<div class="modal-header">'+closeMarkup+head,
          '</div>',
          '<div class="modal-body">'+body,
          '</div>',
          '<div class="modal-footer">',
          '</div>',
        '</div>'
      ].join('');
      
      var tmp = $(tmpl);
      tmp.modal();
      //$(body).append(tmp);

     ajaxutils.openModals[modalName] = true;
     return tmp;
}

ajaxutils.closeModal = function(modalName){
    $('#modal-dialog-'+ modalName).modal('hide');
    delete ajaxutils.openModals[modalName];

    //delete div!
    //$('#modal-dialog-'+ modalName).remove();
}