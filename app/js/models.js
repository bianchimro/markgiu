var markgiu = markgiu || {};


markgiu.fs = require('fs');
markgiu.converter = new Showdown.converter({ extensions: ['github', 'wikilink', 'table'] });

        
markgiu.DocumentPanel = function(options){
    
    var options = options || {};
    var self = this;
    
    self.id = options.id;
    self.content = ko.observable(options.content||'');
    self.initialContent = options.content||'';
    
    self.editor = null;
    self.element = null;
    self.rootElement = null;
    self.previewElement = null;
    
    self.filepath = ko.observable(options.filepath || '');
    self.dirty = ko.observable(options.dirty || false);
    
    
    self.getBasePath = function(path){
        if(!path){ return '';}
        var p = path.split("/")
        p.pop()
        out = p.join("/") + "/";
        return out;
    }
    

    self.convertedContent = ko.computed(function(){
        var content = self.content();
        if (content){
            var cnt = markgiu.converter.makeHtml(content);
            var p = self.filepath();
            var bp = self.getBasePath(p);
            cnt = cnt.replace('img src="', 'img src="'+bp);
            return cnt;
        }
        return null;     
    }, this);
    
    
    self.label = ko.computed(function(){
        var fn = self.filepath();
        if(fn){
            var p = fn.split("/")
            return p[p.length -1 ];
        }
        return "untitled-" + self.id;
    });
    
    
    self.addLinksBehaviour = function(createCallback, openCallback){
    
        $("a.wikilink", self.previewElement).unbind().click(function(e){
            var href=$(this).attr("href");
            var path = self.getBasePath(self.filepath()) + href;
            markgiu.fs.readFile(path, 'utf8', function (err,data) {
                if (err) {
                    //FILE NOT EXISTING --- PROPOSE CREATION
                    bootbox.confirm("This page does not exist. Do you want to create it?",
                        function(resp){
                            if(resp){
                                console.log("and here we should CREATE the page....");
                                createCallback(path);
                            }
                        }
                    );
                } else {
                    openCallback(path);
                }
            }); 
            return false;
        });
    
    };
    

    self.cancelLinksBehaviour = function(){
        $("a.wikilink", self.previewElement).unbind();
    };
  
  
    self.activateEditor = function(element){

        self.editor = ace.edit(element);
        self.element = element;
        self.editor.setTheme("ace/theme/twilight");
        self.editor.getSession().setMode("ace/mode/markdown");
        if(self.content()){
            self.editor.setValue(self.content());
            self.editor.clearSelection();
        }
        
        self.rootElement = $("#"+self.id);
        self.previewElement = $(".editor-preview .edit", self.rootElement);
        
        self.editor.on("change", function(){
            var content = self.editor.getValue();
            self.content(content);
            self.dirty(true);
        });    

        self.editor.focus();
        
    };    
      
        
    self.checkDirty = function(){
        var ct = self.editor.getValue();
        if(ct == self.initialContent){
            self.dirty(false);
        } else {
            self.dirty(true);
        }
    };
    
    
    self.saveFile=function(){
        var path = self.filepath();
        if(!path){
            return;
        }
        
        markgiu.fs.writeFileSync(path, self.content());
        self.initialContent = self.content();
        self.dirty(false);
        bootbox.alert("file saved!");
    };
    
    
    self.destroy = function(){
        //console.log("destroy");
    };
    
};



markgiu.AppGui = function(){

    var self = this;
    self.tabs = ko.observableArray([]);
    self.tabsDict = {};
    self.currentTab = ko.observable(null);
    self.dirtyHandler = null;
    self.nextIdx = 0;
    
    self.getNewIdx = function(){
        
        self.nextIdx += 1;
        return self.nextIdx;
    
    };
    
    self.addTab = function(options){
        var options = options || {};
        
        var idx = self.getNewIdx();
        idx = idx.toString();
        
        var tab = ko.observable(new markgiu.DocumentPanel({
            id : idx,
            content:options.content,
            filepath:options.filepath,
            dirty:options.dirty||false }));
        
        self.tabsDict[idx] = tab;
        self.tabs.push(tab);
        
        var element = $("#"+idx + " .editor-markup .editor")[0]
        tab().activateEditor(element);
        self.selectTab(tab());       
        
    };
    
    
    self.addTabNew = function(){
        self.addTab();
    };
    

    self.getCurrentTab = ko.computed(function(){
        var ct = self.currentTab();
        if(ct){
            return self.tabsDict[ct];
        }
        return null;
    });
    
    
    self.closeTab = function(tab){
        tab.checkDirty();
        
        var afterConfirm = function(conf){
            if(!conf){
                return;
            }
            tab.destroy();
            delete self.tabsDict[tab.id];
            
            var newTabs = [];
            for(var x in self.tabsDict){
                if(x != tab.id){
                    newTabs.push(self.tabsDict[x]);
                }
            }
            self.tabs(newTabs);
            
            //set last tab as active
            if(newTabs.length){
                self.selectTab(newTabs[newTabs.length-1]());
            }
            
        };
        
        if(tab.dirty()){
            bootbox.confirm("Content changed, really close?", afterConfirm);
        } else {
            afterConfirm(true);
        };
        
    };
    
    
    self.currentTabChange = function(tab){
    
        tab.addLinksBehaviour(
            function(path){
                self.addTab({filepath:path, dirty:true});
            },
            
            function(path){
                self.openFile(path);
            }
        );
    };
    
    
    self.selectTab = function(tab){
    
        var ct = self.getCurrentTab()
        if(ct){
            ct().cancelLinksBehaviour();
        }

        if (self.sub){
            self.sub.dispose();
        }
    
        if(self.dirtyHandler){
            clearInterval(self.dirtyHandler);
        }

        self.currentTab(tab.id);        
        tab.editor.resize();
        
        self.currentTabChange(tab);   
        self.sub = tab.content.subscribe(function(newVal){
            self.currentTabChange(tab); 
        });
        
        self.dirtyHandler = setInterval(function(){
            tab.checkDirty();
        }, 1000);     
    };
    
    
    self.bindChoosers = function(cname, sname) {
        var chooser = $(cname);
        self.chooser = chooser;    
        self.chooser.change(function(evt) {
            var path = $(this).val();
            if(!path){
                return;
            }
            self.openFile(path);
            self.chooser.val(null);
        });
        
        var schooser = $(sname);
        self.saveChooser = schooser;    
        self.saveChooser.change(function(evt) {
            var path = $(this).val();
            if(!path){
                return;
            }
            self.saveFileAs(path);
            self.saveChooser.val(null);
        });
    };
    
    
    self.chooseFileToOpen = function(){
        self.chooser.trigger('click');
    };
    
    
    self.chooseFileToSaveAs = function(){
        self.saveChooser.trigger('click');
    };
    
       
    self.openFile = function(path){
        markgiu.fs.readFile(path, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            self.addTab({content:data, filepath:path});
        });
    };
    
    
    self.saveFileAs = function(path){
        var ct = self.currentTab();
        var ctab = self.tabsDict[ct]();
        ctab.filepath(path);
        ctab.saveFile();    
    };  
    
};
