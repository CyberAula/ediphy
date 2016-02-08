import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';

export default class DaliTitle extends Component {
    render() {
        let content;
        if(this.props.isReduced) {
            let titles = this.props.titles;
            let actualTitle = titles.pop();
            content = (
                <div>
                    <Breadcrumb style={{margin: 0, backgroundColor: 'inherit'}}>
                        {
                            titles.map((item, index) => {
                                return <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
                            })
                        }
                    </Breadcrumb>

                    <h1 style={{margin: 0}}>{actualTitle}</h1>
                </div>
            );
        }else {
            let titlesComponents = "";
            this.props.titles.map((text, index) =>{
                titlesComponents += "<h" + (index + 1) + " style=\"margin-top: 16px\">" + text + "</h" + (index + 1) + ">";
            });

            content = (
                <div dangerouslySetInnerHTML={{__html: titlesComponents}}></div>
            )
        }

        return (
            <div style={{marginLeft: 30, paddingTop: 10, position: 'relative'}}>
                <Button style={{position: 'absolute', right: 20, top: 20}} onClick={() => {
                    this.props.titleModeToggled(this.props.navItemId, !this.props.isReduced);
                }}>
                    <i className={this.props.isReduced ? "fa fa-plus" : "fa fa-minus"}></i>
                </Button>
                {content}
            </div>
        );
    }
}
