import { Button, Col, ControlLabel, Form, FormGroup } from "react-bootstrap";
import SearchComponent from "../common/SearchComponent";
import i18n from "i18next";
import ImageComponent from "../common/ImageComponent";
import React from "react";

export const ImagesPreview = (self) => {
    return(
        <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{self.props.icon ? <img className="fileMenuIcon" src={self.props.icon } alt=""/> : self.props.name}
                    <SearchComponent query={self.state.value} onChange={(e)=>{self.setState({ query: e.target.value });}} onSearch={self.onSearch} /></h5>
                <hr />

                <FormGroup>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {
                            self.onSearch(self.state.query);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <Form className={"ExternalResults"}>
                {self.state.results.length > 0 ?
                    (
                        <FormGroup>
                            <ControlLabel>{ self.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                            <br />
                            {self.state.results.map((item) => {
                                return (<ImageComponent item={item} title={item.title} url={item.url} thumbnail={item.thumbnail} onElementSelected={self.props.onElementSelected} isSelected={item.url === self.props.elementSelected} />
                                );
                            })}
                        </FormGroup>
                    ) :
                    (
                        <FormGroup>
                            <ControlLabel id="serverMsg">{self.state.msg}</ControlLabel>
                        </FormGroup>
                    )
                }
            </Form>
        </div>
    );
};
