//
//  Wikikink extension
//  [[pagename]]   ->  <a href="pagename.md" data-wiki="1">Pagename</a>
//

(function(){
    /*
    var wikilink = function(converter) {
        return [
            {
              // strike-through
              // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
              type    : 'lang',
              regex   : '/(\[){2}(\w+)?(\]{2})',
              replace : function(text) {
                  console.log("ww", match, prefix, content, suffix);
                  return '<a data-wiki="1" href="' +content+'.md">' + content + '</a>';
              }
            }
        ];
    };
    */

    var wikilink = function(converter) {
        return [
            {
              // strike-through
              // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
              type    : 'lang',
              filter : function(text){
                //var regex =  /\B(\[){2}([\w\s\|\.]+)(\]){2}\B/g;
                var regex =  /\B(\[){2}([A-Z]{1}[a-z]+)+(\]){2}\B/g;
                var occ = text.match(regex);
                if(!occ){
                    return text;
                }
                
                for(var i=0,n=occ.length;i<n;i++){
                    var item=occ[i];
                    item = item.replace("[[", '').replace("]]", '');
                    text = text.replace(occ[i], '<a class="wikilink" href="'+item+'.md" data-wiki="1">' + item+'</a>');
                }
                
                return text;
                
              }
              
            }
        ];
    };



    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.wikilink = wikilink; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = wikilink;
}());