import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup, Button } from 'react-bootstrap';
import i18n from 'i18next';
import GooglePicker from 'react-google-picker';
export default class GoogleDriveComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            msg: i18n.t("FileModal.APIProviders.no_files"),
        };
    }
    render() {
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                </h5>
                <hr />

                <FormGroup>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {
                            this.onSearch(this.state.query);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <div className={"ExternalResults"}>
                <GooglePicker clientId={'854542748878-51e02udhsu2q2cp512fg7kalbplkim6j.apps.googleusercontent.com'}
                    developerKey={'AIzaSyDbKOqlWXUmWCRcjtY4gSBld8Qspey-yRY'}
                    scope={['https://www.googleapis.com/auth/drive.readonly']}
                    onChange={data => data /* console.log('on change:', data)*/}
                    onAuthFailed={data => data /* console.log('on auth failed:', data)*/}
                    multiselect={false}
                    navHidden={false}
                    authImmediate={false}
                    mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                    viewId={'DOCS'}>
                    <button>SEARCH</button>
                </GooglePicker>
            </div>
        </div>;
    }

}

GoogleDriveComponent.propTypes = {
    // /**
    //  * Selected Element
    //  */
    // elementSelected: PropTypes.any,
    // /**
    //  * Select element callback
    //  */
    // onElementSelected: PropTypes.func.isRequired,
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,
};
