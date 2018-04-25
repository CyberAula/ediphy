import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ExternalDropzone from './ExternalDropzone';
import { WithContext as ReactTags } from 'react-tag-input';
import { extensions } from '../FileHandlers/FileHandlers';
import '../../../nav_bar/global_config/_reactTags.scss';
export default class UploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: undefined,
            filter: "",
            extensionFilter: this.props.show,
            keywords: [],
        };
        this.uploadHandler = this.uploadHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);

    }
    render() {
        let keywords = this.state.keywords;

        let file = this.state.file;
        let currentExtension = this.props.show;
        currentExtension = currentExtension === '*' ? '' : currentExtension;
        let aux = currentExtension;
        let icon = "attach_file";
        for (let e in extensions) {
            let ext = extensions[e];
            if (file && file.type && file.type.match && file.type.match(ext.value)) {
                aux = ext.value;
                icon = ext.icon || icon;
            }
        }
        return(<div className="uploadComponent">
            <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}</h5>
            <hr />
            {this.state.file ? null :
                <ExternalDropzone ref="dropZone" accept={this.props.show} callback={this.dropHandler}/> }
            {this.state.file ? <Row>
                <Col xs={12} sm={6}>
                    <FormGroup >
                        <div id="fileNameTitle">
                            <span>{this.state.file.name}</span><br/><br/>
                            <Button onClick={(e)=>{this.setState({ file: undefined });}}><i className="material-icons">delete</i> DELETE</Button>
                            <Button disabled={!this.state.file} onClick={this.uploadHandler}><i className="material-icons">file_upload</i> UPLOAD</Button>
                        </div>
                        {/* <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
          <ReactTags tags={keywords}
                     placeholder={i18n.t('global_config.keyw.Add_tag')}
                     delimiters={[188, 13]}
                     handleDelete={this.handleDelete}
                     handleAddition={this.handleAddition}
                     handleDrag={this.handleDrag} />*/}

                    </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                    <div style={{ backgroundImage: aux === 'Rimage' ? ("url(" + file.url + ")") : "" }} className={"preview" + ((file.url === this.props.elementSelected) ? " active" : "")}>
                        {aux === 'Rimage' ? "" : <i className="material-icons">{icon || "attach_file"}</i>}
                    </div>
                </Col>
            </Row> : null}

        </div>);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ extensionFilter: nextProps.show });
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if ((nextProps.filesUploaded && this.props.filesUploaded && nextProps.filesUploaded.length !== this.props.filesUploaded.length)
        /* || nextState.filter !== this.state.filter || nextState.extensionFilter !== this.state.extensionFilter*/) {
            // this.props.onElementSelected( undefined, undefined, undefined);
        }
    }
    dropHandler(file) {
        this.setState({ file });
    }

    uploadHandler() {
        let keywordsArray = this.state.keywords.map(key=>{return key.text;});
        let keywords = keywordsArray.join(",");
        console.log(this.state.file, this.state);

        if(process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') { // VISH production
            this.props.onUploadVishResource(this.state.file, keywords);
        } else if (process.env.DOC === 'doc') { // Docs
            alert('En la demo no se puede'); // TODO Poner bien en un modal alert
        } else { // Ediphy Development (with ediphy_server)
            this.props.onUploadEdiphyResource(this.state.file, keywords);
        }
        this.setState({ keywords: [], file: undefined });
    }

    /** *
   * Keyword deleted callback
   * @param i position of the keyword
   */
    handleDelete(i) {
        let tags = Object.assign([], this.state.keywords);
        tags.splice(i, 1);
        this.setState({ keywords: tags });
    }

    /**
   * Keyword added callback
   * @param tag Keyword name
   */
    handleAddition(tag) {
        let tags = Object.assign([], this.state.keywords);
        tags.push({
            id: tags.length + 1,
            text: tag,
        });
        this.setState({ keywords: tags });
    }

    /**
   * Keyword moved callback
   * @param tag Tag moving
   * @param currPos Current position
   * @param newPos New position
   */
    handleDrag(tag, currPos, newPos) {
        let tags = Object.assign([], this.state.keywords);

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
        // re-render
        this.setState({ keywords: tags });
    }

}

UploadComponent.propTypes = {
    /**
   * Boolean that shows/hide the file upload modal
   */
    callback: PropTypes.func,
};
