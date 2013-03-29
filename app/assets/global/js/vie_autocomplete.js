var enableVieAutocomplete = function(item){
    var $item = $(item);
            
    $item.typeahead({
        minLength : 3,
        source : function(query, process){
            var t = this;
            t.recordsMap = {};
            t.recordsList = [];
            $.ajax({
                type : 'GET',
                url : '/viario/via_autocomplete/',
                data : { q: query },
                dataType : 'json',
                success: function(response){
                    for(var i=0, n=response.length;i<n;i++){
                        var item = response[i];
                        var label = item.nome;
                        t.recordsList.push(label);
                        t.recordsMap[label] = item;
                    }
                    process(t.recordsList);
                }
            
            });
        },
        sorter : function(items){
            return items.sort();
        },
        updater : function(item){
            var targetId = $item.attr('data-via-input');
            var targetElement= $("#"+targetId);
            var labelTargetId = $item.attr('data-via-label');
            var labelTargetElement= $("#"+labelTargetId);
            var deleteTargetId = $item.attr('data-via-delete');
            var deleteTargetElement= $("#"+deleteTargetId);
            
            var idVia = this.recordsMap[item].id_ord;
            targetElement.val(idVia);
            labelTargetElement.html(item);
            labelTargetElement.show();
            deleteTargetElement.show();
            return item;
        },
        highlighter : function(item){
            return item;
            
        },
        items : 20
    
    });
    
};

var enableAllAutocompleteVia = function(){
    $('input.ajax-search-via').each(function(index, item){
        enableVieAutocomplete(item);
    });

};

var addNewForm = function(element, idx, numFormsTarget){

    var newElement = $('<div>').append($(element).clone()).html();
    newElement = $(newElement);
    updateElementIndex(newElement, idx);
    newElement.find("*").each(function(index, item){
        updateElementIndex($(item), idx);
    });

    //resetting inputs
    $("input", newElement).val('');
    var deleteContainerTargetElement= $(".delete-via-checkbox-container", newElement);
    $("input", deleteContainerTargetElement).attr('checked', false);
    $(".delete-via", newElement).hide().click(onDeleteClick);    
    
    //resetting label
    var labelTargetElement = $('.ajax-via-label', newElement);
    labelTargetElement.html('');
    labelTargetElement.hide();
    
    //appending to target
    var target = $(element).parent();
    target.append(newElement);
    var numForms = parseInt(numFormsTarget.val())
    numFormsTarget.val(numForms +1 );
    
    
    $('input.ajax-search-via', newElement).each(function(index, item){
        enableVieAutocomplete(item);
    });

    return newElement;

};


var updateElementIndex = function(elem, idx) {
        
    var idRegex = new RegExp('(-\\d+)'),
        replacement =  "-"+idx;

    var arr = [];
    for (var i=0, attrs=elem[0].attributes, l=attrs.length; i<l; i++){
        arr.push(attrs.item(i).nodeName);
    }
    for(var i=0,n=arr.length;i<n;i++){
        var a = arr[i];
        elem.attr(a, elem.attr(a).replace(idRegex, replacement));
    }
    return elem;
};


var onDeleteClick = function(e){
    e.preventDefault();
    var $this = $(this);

    //var targetId = $this.attr('data-via-input');
    //var targetElement= $("#"+targetId);
    //targetElement.val("");

    var labelTargetId = $this.attr('data-via-label');
    var labelTargetElement= $("#"+labelTargetId);
    //labelTargetElement.html('');
    //labelTargetElement.hide();

    //var searchTargetId = $this.attr('data-via-search');
    //var searchTargetElement= $("#"+searchTargetId);
    //searchTargetElement.val('');
    
    var deleteContainerTargetId = $this.attr('data-via-delete-container');
    var deleteContainerTargetElement= $("#"+deleteContainerTargetId);
    $("input", deleteContainerTargetElement).attr('checked', true);
    
    var dataViaContainerTargetId = $this.attr('data-via-form-container');
    var dataViaContainerTargetElement =$("#"+dataViaContainerTargetId);

    var idx = $('.vie-form').length;
    var element = addNewForm(dataViaContainerTargetElement, idx, $("#id_viarichiesta_set-TOTAL_FORMS"));
    
    dataViaContainerTargetElement.hide()
    $this.hide();
  
};


$(document).ready(function() {

    //tasto di delete commentato per ora
    //$(".delete-via").click(onDeleteClick);
    
    $("#add-via-form").click(function(e){
        e.preventDefault();
        var vieForms = $('.vie-form');
        var idx = vieForms.length;
        var templateElement = vieForms[idx-1];
        var element = addNewForm(templateElement, idx, $("#id_viarichiesta_set-TOTAL_FORMS"));
    });
    
    enableAllAutocompleteVia();
    

});
