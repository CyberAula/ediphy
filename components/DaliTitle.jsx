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
                   <h3> <Breadcrumb style={{ margin: 0, backgroundColor: 'inherit'}}>
                        {titles.map((item, index) => {
                             if(index!=0) return (<BreadcrumbItem key={index}>{item}</BreadcrumbItem>);
                        })}
                    </Breadcrumb></h3> 
                    <h4 style={{margin: 0}}>{actualTitle}</h4>
                </div>
            );

        } else if (currentstatus=='expanded') {
         
            let titlesComponents = "";
            this.props.titles.map((text, index) =>{
                if (index == 0) {
                    unidad=text;
                } else {
                    let nivel = index+2;
                    if (nivel > 6){  nivel = 6;}
                    titlesComponents += "<h" + (nivel) + " style=\"margin-top: 16px\">" + text + "</h" + (nivel) + ">";
                }    
            });

            content = (
                <div dangerouslySetInnerHTML={{__html: titlesComponents}}></div>
            )
        } 
    
        
        let nextstatus ;

        if (currentstatus == 'hidden') {
            nextstatus = 'expanded'; 
        } else if (currentstatus == 'expanded') {
            nextstatus = 'reduced';
        } else {
            nextstatus = 'hidden';

        }
        let icons = {'reduced':'fa fa-minus',
                    'expanded':'fa fa-plus',
                    'hidden': 'fa fa-eye-slash'};

        let currenticon = icons[nextstatus];
            return (
                <div className="title" style={{ visibility: currentstatus=='hidden'? 'hidden':'inherit'}}>
                    <div className="caja">
                        <div className="cab" style={{backgroundColor: 'transparent'}}>
                            <div className="cabtabla_numero">1</div>
                            <div className="tit_ud_cap">
                               <h1>Título Curso</h1>
                               <h2>{unidad}</h2>
                            </div>
                            <div className="cabtabla_lapiz">            
                                <Button className="buttonTitle" style={{visibility: (this.props.showButton && !hideButton)? 'visible' : 'hidden'}} onClick={() => {
                                     this.props.titleModeToggled(this.props.navItemId, nextstatus);
                                 }}>
                                     <i className={currenticon}></i>
                                </Button>
                                <img style={{visibility: currentstatus=='hidden'? 'hidden':'inherit'}} src="images/ico_alumno.gif" alt="Alumno"/><div id="alumno2"> Alumno</div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="contenido" style={{backgroundColor: 'transparent'}}>
                            {content}
                        </div>
                    </div>
                    <br style={{clear:'both'}}/>
                </div>
            );

       
    }
}
