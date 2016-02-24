var BasicPills = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'BasicPills',
                category: 'text',
                needsConfigModal: true,
                needsTextEdition: false
            };
        },
        getToolbar: function(){
            return [
               /* { 
                    name: 'opacity',
                    humanName: 'Opacityewre',
                    type: 'number',
                    value: 1,
                    min: 0,
                    max: 1,
                    step: 0.1
                },
                {
                    name: 'borderSize',
                    humanName: 'Border Size',
                    type: 'number',
                    value: 0,
                    min: 0,
                    max: 10,
                    autoManaged: false,
                },
                {
                    name: 'test',
                    humanName: 'Test',
                    type: 'text',
                    isAttribute: true
                }*/
                ]
            },
            getInitialState: function(){
                return {number: 0, titles: [], texts: [], colors: []};
            },
            getConfigTemplate: function(state){
                //console.log('EDITANdo');
                //console.log(state);
                //console.log(BasicPills.getState());

                var editorBox = '';
                var number = state.number;
                var auxTitles = state.titles;
                var auxTexts = state.texts;
                var auxColors = state.colors;
                var d = new Date();
                var n = d.getTime();

                for(var i = 0; i < number ; i++){
               // if(i==0){
                if(auxTitles[i]){
                    //console.log(auxTitles[i]);
                }else{
                    auxTitles.push('title'+i);
                }
                if(auxTexts[i]){
                    //console.log(auxTexts[i]);
                }else{
                    auxTexts.push('text'+i); 
                }
                if(auxColors[i]){
                    //console.log(auxColors[i]);
                }else{
                    auxColors.push('#FFFF00'); 
                }


                        editorBox += '\
                        <div class="col-xs-12 text-center"><hr><br><h2>Pill'+i+'</h2></div>\n\
                        <div class="col-xs-12 col-sm-6">Titulo:\n\
                          <input onchange="BasicPills.setTitle('+i+')" type="text" autofocus id="title'+i+'" value= '+ auxTitles[i] +'></div>\n\
                        <div class="col-xs-12 col-sm-6">Color:\n\
                          <input onchange="BasicPills.setColor('+i+')" type="color" name="favcolor" id="color'+i+'" value="'+auxColors[i]+'"> </div>\n\
                        <div class="col-xs-12 well textEditable" onfocus="BasicPills.ponerCKEditor('+i+','+n+')" onblur="BasicPills.setText('+i+')" contentEditable id="text'+i+'">'+auxTexts[i]+'</div>';
                        /*
                         <script>\n\
                          CKEDITOR.disableAutoInline = true;\n\
                          var editId = "text'+i+'n'+n+'editor";\n\
                          console.log(editId);
                          var cajaEdit = document.getElementById(editId);\n\
                          CKEDITOR.inline(cajaEdit);\n\
                        </script>';*/

                        //BasicPills.ponerCKEditor(i,n);

                    }

                    BasicPills.setState('titles',auxTitles);
                    BasicPills.setState('texts',auxTexts);
                     BasicPills.setState('colors',auxColors);
//onclick="BasicPills.ponerCKEditor('+i+','+n+')" onkeyup="BasicPills.setText('+i+')" 
                    //$('#configuradores').html(editorBox);



                    return "\
                    <div>Número de pestañas \n\
                      <input type=\"number\" onchange='BasicPills.showPreview()' autofocus id=\"BasicPills_input\" value=\"" + state.number + "\">\n\
                    </div>\n\
                    <div id=\"fdsf\" class='row'></div>\n\
                    <div id=\"configuradores\" class=\"row\">"+editorBox+"</div>";
            // <button onclick=\"BasicPills.showPreview()\">Show preview</button></div>"
            /*return "<div> Url: 
            <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\">
            <br>
            <button onclick=\"BasicImage.showPreview()\">Show preview</button>
            <img id=\"BasicImage_preview\" src=\"" + state.url + "\"style=\"width: 100px; height: 100px; visibility: " + state.thumbnailVisibility + ";\" onclick=\"BasicImage.imageClick()\" />
            </div>";*/
        },
        getRenderTemplate: function(state){
            var number = state.number;
            var auxTitles = state.titles;
            var auxTexts = state.texts;
             var auxColors = state.colors;
            //console.log(auxTitles);
            //console.log(auxTexts);
            //console.log(auxColors);
            var auxNavPills = '';
            var auxTextsPills = '';

            var ancho = 12/number;
            var d = new Date();
            var n = d.getTime();
            var resto = 12%number;
            //console.log(resto);


            for(var i = 0; i < number ; i++){


                if(i==0){
                    //auxTitles.push('title'+i); 
                    //auxTexts.push('text'+i); 
                    auxNavPills += '\
                        <li id="li'+n+'" style="padding:0%; background-color: '+auxColors[i]+';"\n\
                          class="col-xs-'+ ancho+' active collapsed"\n\
                          aria-controls="Text'+i+'Pill'+n+'" href="#Text'+i+'Pill'+n+'"\n\
                          aria-expanded="true" data-toggle="collapse" role="button"\n\
                          onClick="BasicPills.handleSelect('+i+','+n+','+number+')">'+auxTitles[i]+'</li>';

                    auxTextsPills += '\
                        <div class="Pill'+n+' row collapse in" id="Text'+i+'Pill'+n+'"\n\
                          style="border:'+auxColors[i]+';border-style: solid;border-radius: 0.5em;margin-top: 1%;" >\n\
                            <p>'+auxTexts[i]+'</p>\n\
                        </div>';
                }else{
                    //auxTitles.push('title'+i); 
                    //auxTexts.push('text'+i); 
                    auxNavPills +=  '\
                        <li class="col-xs-'+ancho+' collapsed"\n\
                          aria-controls="Text'+i+'Pill'+n+'" href="#Text'+i+'Pill'+n+'"\n\
                          aria-expanded="false" data-toggle="collapse" role="button"\n\
                          style="padding:0%;background-color: '+auxColors[i]+';margin: 0%"\n\
                          onClick="BasicPills.handleSelect('+i+','+n+','+number+')">'+auxTitles[i]+'</li>';
                    auxTextsPills += '\
                        <div class="Pill'+n+' row collapse" id="Text'+i+'Pill'+n+'"\n\
                          style="border:'+auxColors[i]+';border-style: solid;border-radius: 0.5em;margin-top: 1%" >\n\
                            <p>'+auxTexts[i]+'</p>\n\
                        </div>';
                }
            }
/*
            if(12%number > 0 ){
                console.log('impar');
                $('#li'+n).addClass('col-xs-offset-1');
            }*/
            //BasicPills.setState('titles',auxTitles);
            //BasicPills.setState('texts',auxTexts);


            

            // 1 --> 12
            // 2 --> 6
            // 3 --> 4
            // 4 --> 3
            //**** 5 --> 12 [1,2*5,1]
            // 6 --> 2
            //coger el estado.number y sacar el número de colúmnas y construir el string a renderizar

            //crear el array de titles y de textos predefinidos
            //state.titles
            //state.texts

             /* <div style="padding:0%" class="col-xs-6">\n\
                            <li style="padding:0%; background-color: red;" class="active" onClick="BasicPills.handleSelect(1)">'+number+' ' + ancho +'</li>\n\
                        </div>\n\
                         <div class="col-xs-6">\n\
                            <li style="padding:0%"  onClick="BasicPills.handleSelect(2)">asdad</li>\n\
                            </div>\n\*/


                            return '\
                            <div style="padding: 0% 5% 0% 5%">\n\
                            </br>\n\
                            <div class="text-center row">\n\
                            <ul class="nav nav-pills nav-justified">'+auxNavPills+'</ul>\n\
                            </div>'+auxTextsPills+'</div>'
            //"<ul class='nav nav-pills'><li>a</li><li>c</li><li>b</li></ul>"


            //<Nav className='pills' activeKey={1} onSelect={BasicPills.handleSelect()}><NavItem eventKey={1} href='/home'>NavItem 1 content</NavItem><NavItem eventKey={2} title='Item'>NavItem 2 content</NavItem><NavItem eventKey={3} disabled>NavItem 3 content</NavItem></Nav>";
        },
        handleSelect: function (selectedKey, idTime, number) {
            var clase = '.Pill'+idTime;
            //var id = '#Text'+i+'Pill'+idTime;

console.log("BBBBBB************************BBBBBBB");
            for(var i = 0; i < number; i++){
                  var id = '#Text'+i+'Pill'+idTime;
                if(i != selectedKey){
                    console.log("No es el que seleccione"+i);
                    if($(clase).hasClass("in")){
                       console.log("No es el que seleccione"+i+" Y además tiene clase in");
                       console.log(id);
                       $(id).css('height','6px');
                       $(id).removeClass('in');
                       console.log("Done en "+i);
                        //$(clase).css('display','none');
                    }
            
                }else{
                    console.log("Es el que seleccione"+i)
                    if($(clase).hasClass("in")){
                       console.log("Es el que seleccione"+i+" Y además tiene clase in");
                        //$(clase).css('display','none');
                    }
            

            }
            }

           /* $(clase).css('display','block');
            //$(clase).removeClass('display','block');
            console.log("BBBBBB");*/
          /*  for(var i = 0; i < number; i++){
                var id = '#Text'+i+'Pill'+idTime;
               //  $(id).css('display','block');
                if(i != selectedKey){
                    var id = '#Text'+i+'Pill'+idTime;

                    console.log('no'+id);
                    $(id).css('display','block');
                }else{
                    $(id).css('display','block');
                    console.log('si'+id);
                    if($(clase).hasClass("in")){
                        console.log('si clas'+id);
                        $(clase).css('display','none');
                    }
                }
            }*/
            /*for(var i = 0; i < number; i++){
                var id = '#Text'+i+'Pill'+idTime;
               //  $(id).css('display','block');
                if(i != selectedKey){
                    var id = '#Text'+i+'Pill'+idTime;

                    console.log('no'+id);
                    $(id).css('display','block');
                }else{
                    $(id).css('display','block');
                    console.log('si'+id);
                    if($(clase).hasClass("in")){
                        console.log('si clas'+id);
                        $(clase).css('display','none');
                    }
                }
            }*/
            /*var clase = '.Pill'+idTime;
            var id = '#Text'+selectedKey+'Pill'+idTime;
            $(clase).css('display','none');
            $(id).css('display','block');*/
          //alert('selected ' + selectedKey);
        },
        handleToolbar: function(name, value){
            if(name === 'borderSize')
                BasicImage.setState('borderSize', value);
        },
        showPreview: function(){
            var state = BasicPills.getState();
            var input = $('#BasicPills_input');
            BasicPills.setState('number',input.val());

            var number = input.val();
            //console.log(state);
            var auxTitles = state.titles;
            var auxTexts = state.texts;
            var auxColors = state.colors;
            //console.log("ada"+ state.colors);
            var editorBox = '';

            //console.log(number);
            for(var i = 0; i < number ; i++){
                   // if(i==0){
                    if(auxTitles[i]){
                        //console.log(auxTitles[i]);
                    }else{
                        auxTitles.push('title'+i);
                    }
                    if(auxTexts[i]){
                        //console.log(auxTitles[i]);
                    }else{
                        auxTexts.push('text'+i);
                    }
                    if(auxColors[i]){
                        //console.log(auxColors[i]);
                    }else{
                        auxColors.push('#ff0000');
                    }

                            editorBox += '\
                            <div class="col-xs-12 text-center"><hr><br><h2>Pill'+i+'</h2></div>\n\
                            <div class="col-xs-12 col-sm-6">Titulo:<input onchange="BasicPills.setTitle('+i+')" type="text" autofocus id="title'+i+'" value= '+ auxTitles[i] +'></div>\n\
                            <div class="col-xs-12 col-sm-6">Color: <input onchange="BasicPills.setColor('+i+')" type="color" name="favcolor" id="color'+i+'" value="'+auxColors[i]+'"> </div>\n\
                            <div class="col-xs-12">Texto</div>';
                        }

                        BasicPills.setState('titles',auxTitles);
                        BasicPills.setState('texts',auxTexts);
                        BasicPills.setState('colors',auxColors);

                        $('#configuradores').html(editorBox);
                    },
                    setTitle: function(id){
                        var state = BasicPills.getState();
                        var idT = '#title'+id;
                        var input = $(idT);
                        auxTitles = state.titles;
                        auxTitles[id] = input.val();
                        BasicPills.setState('titles',auxTitles);
                    },
                      setText: function(id){
                        //alert("Hola");
                        //console.log("texto");
                        var state = BasicPills.getState();

                        var idT = 'text'+id;
                        var input = document.getElementById(idT).innerHTML;
                        auxTexts = state.texts;
                        auxTexts[id] = input;
                        console.log(input);
                       // BasicPills.setState('texts',auxTexts);
                    },
                    setColor: function(id){
                        var state = BasicPills.getState();
                        var idT = '#color'+id;
                        var input = $(idT);
                        //console.log(input.val())
                        auxColors = state.colors;
                        auxColors[id] = input.val();
                        //console.log(auxColors[id]);
                        BasicPills.setState('colors',auxColors);
                    },
                    imageClick: function() {
                        alert("Miau!");
                    },
                    ponerCKEditor: function(id,time){
                        CKEDITOR.disableAutoInline = true;
                        var editId = 'text'+id;
                        //+'n'+time+'editor';
                        var cajaEdit = document.getElementById(editId);
                        console.log(cajaEdit);
                        CKEDITOR.inline(cajaEdit);
                    }
                });
    })();