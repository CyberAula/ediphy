import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

export default class DaliTitle extends Component {

    render() {
        let content;
        let unidad = "";

        let currentstatus = this.props.isReduced;
        let hideButton = (this.props.titles.length <= 1 && !this.props.isReduced || this.props.titles.length === 0 && currentstatus);

        if(currentstatus=='reduced') {
    
            let titles = this.props.titles;
            let actualTitle = titles.pop();
            unidad=titles[0];
            content = (
                <div>
                   <h3> 
                        <Breadcrumb style={{ margin: 0, backgroundColor: 'inherit'}}>
                            {
                                titles.map((item, index) => {
                                     if(index!=0){
                                        return (<BreadcrumbItem key={index}>{item}</BreadcrumbItem>);
                                     }
                                })
                            }
                        </Breadcrumb>
                    </h3>
                    <h4 style={{margin: 0}}>{actualTitle}</h4>
                </div>
            );

        } else if(currentstatus=='expanded') {
         
            let titlesComponents = "";
            this.props.titles.map((text, index) =>{

                if (index == 0) {
                    unidad=text;
                } else {
                    let nivel = index+2
                    if(nivel > 6)  nivel = 6;
                    titlesComponents += "<h" + (nivel) + " style=\"margin-top: 16px\">" + text + "</h" + (nivel) + ">";
                }    
            });

            content = (
                <div dangerouslySetInnerHTML={{__html: titlesComponents}}></div>
            )
        } 
    
        
        let nextstatus ;

        if (currentstatus == 'reduced') {
            nextstatus = 'expanded'; 
        } else if (currentstatus == 'expanded') {
            nextstatus = 'hidden'
        } else {
            nextstatus = 'reduced'

        }
        let icons = {'reduced':'fa fa-minus','expanded':'fa fa-plus','hidden': 'fa fa-eye-slash'}
        let currenticon = icons[nextstatus]



        if (currentstatus != 'hidden'){
           
            return (
                <div style={{marginLeft: 30, marginRight: 30, paddingTop: 10, position: 'relative'}}>
                    <div className="caja">
                        <div className="cab"> 
                            <div className="cabtabla_numero">1</div>
                            <div className="tit_ud_cap">
                               <h1>Título Curso</h1>
                               <h2>{unidad}</h2>
                            </div>
                            <div className="cabtabla_lapiz">            
                                <Button style={{border: 0, backgroundColor: '#eee', visibility: (this.props.showButton && !hideButton)? 'visible' : 'hidden', position: 'absolute', top:20, right:75}} onClick={() => {
                                     this.props.titleModeToggled(this.props.navItemId, nextstatus);
                                 }}>
                                     <i className={currenticon}></i>
                                </Button>
                                <img src="images/ico_alumno.gif" alt="Alumno"/><div id="alumno2"> Alumno</div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="contenido">
                            {content}
                        </div>
                    </div>
                    <br style={{clear:'both'}}/>
                </div>
            );

        } else {

            return (
                <div style={{marginLeft: 30, marginRight: 30, paddingTop: 10, height:'55px', position: 'relative'}}>
                    <div className="caja">
                        <div className="cab"> 
                            <div className="cabtabla_lapiz">          
                                <Button style={{marginRight:'80px', border: 0, backgroundColor: '#eee', visibility: (this.props.showButton && !hideButton)? 'visible' : 'hidden'}} onClick={() => {
                                             this.props.titleModeToggled(this.props.navItemId, nextstatus);
                                         }}>
                                     <i className={currenticon}></i>
                                </Button>
                            </div>
                            <div className="clear"></div>
                        </div><br style={{clear:'both'}}/>
                    </div>
                </div>
                            
            )
        }
    }
}
