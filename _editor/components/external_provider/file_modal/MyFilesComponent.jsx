import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ExternalDropzone from '../external_uploader_modal/ExternalDropzone';
import { WithContext as ReactTags } from 'react-tag-input';
import './../../nav_bar/global_config/_reactTags.scss';
import './_fileModal.scss';

export class MyFilesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: undefined,
            filter: "",
            extensionFilter: "",
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
        let files = this.props.filesUploaded.filter(file=>
            ((file.name && file.name.match(this.state.filter)) || (file.mimetype && file.mimetype.match(this.state.filter))) // Matches written filter
        && (this.props.show === "*" || (file.mimetype && file.mimetype.match(this.props.show))) // Matches extension filter
        );
        return(<div>

            <ExternalDropzone ref="dropZone" accept={this.props.show} callback={this.dropHandler}/>
            {this.state.file ? <FormGroup >
                <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
                <ReactTags tags={keywords}
                    placeholder={i18n.t('global_config.keyw.Add_tag')}
                    delimiters={[188, 13]}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} />
            </FormGroup> : null}
            <Button disabled={!this.state.file} onClick={this.uploadHandler}>UPLOAD</Button>
            <hr/>
            <FormGroup >
                <ControlLabel>{i18n.t('Filtrar:')}</ControlLabel><br/>
                <FormControl type="text"
                    value={this.state.filter}
                    placeholder=""
                    onChange={e => {this.setState({ filter: e.target.value });}}/>
            </FormGroup>
            <Row className="myFilesRow">
                {files.map(file=>{
                    return (<Col className="myFile" xs={12} sm={6} md={4} lg={3}>
                        <div className="myFileContent">{file.name}</div>
                    </Col>);
                })}
            </Row>
        </div>);
    }
    dropHandler(file) {
        console.log(file);
        this.setState({ file });
    }

    uploadHandler() {
        let keywordsArray = this.state.keywords.map(key=>{return key.text;});
        let keywords = keywordsArray.join(",");
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

MyFilesComponent.propTypes = {
    /**
   * Boolean that shows/hide the file upload modal
   */
    callback: PropTypes.func,
};
