# Markgiu

Markgiu is a very simple markdown editor, based on [node-webkit](https://github.com/rogerwang/node-webkit).

This is my first experiment with node-webkit, and it leverages some popular js
libraries that I commonly use in the browser, client side.

The code is very simple, it is based on a couple of [knockoutjs](http://knockoutjs.com/)
View-Models (less than 500 lines of js+css+html code for the whole app, assets excluded).

See "powered by" section down here for a full listing of used libraries.

Markgiu has no native node dependencies, so it should be usable on any platform
supported by node-webkit itself.

Features so far:

* open and save files from local filesystem
* html preview 
* multiple documents
* detects content changes
* basic support for adding a document with a wiki-style syntax

This README was created and edited with Markgiu :)


## Disclaimer
This project does not aim to be a full-featured markdown editor.
Use it at your own risk and abuse the code base at your wish.

## Screenshot  
![Open file](screenshots/screenshot1.png)

## Installation and usage
This is a node webkit-app, see:
https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps

In short:

* Download the source of node-webkit or a binary distribution for your platform from
 [https://github.com/rogerwang/node-webkit](https://github.com/rogerwang/node-webkit)   

* clone this repo:
   
        git clone https://github.com/bianchimro/markgiu.git

* run on Mac:
        
        open -n -a node-webkit markgiu/app

* run on Linux or Windows:
        
        nw markgiu/app



## Contributing
Pull requests welcome :)

A main concern is that testing is totally uncovered,
suggestions and contributions are welcome.

## Powered by

* [node-webkit](https://github.com/rogerwang/node-webkit) for delivering to your Desktop
  and accessing your filesystem
* the ubiquitous [jquery](http://jquery.com/) for DOM magic
* [knockoutjs](http://knockoutjs.com/) for ui bindings
* Twitter [bootstrap](http://twitter.github.com/bootstrap/) for css/js ui
* [Font-awesome](https://github.com/FortAwesome/Font-Awesome) iconic font by Dave Gandy
* [bootbox](http://bootboxjs.com/) for bootstrap themed js dialogs
* [ace editor](http://ace.ajax.org/) a full-featured code editor for the web
* [showdown.js](https://github.com/coreyti/showdown) for markdown generation

## License
This code is released under the MIT license, see the file LICENSE.md.

## Credits
[Mauro bianchi](https://github.com/bianchimro)

[Marco Rivadeneyra](https://github.com/marcorivm)

## Contact
bianchimro@gmail.com
