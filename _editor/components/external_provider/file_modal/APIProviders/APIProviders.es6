import React from 'react';
import MyFilesComponent from './MyFilesComponent';
import UploadComponent from './UploadComponent';
import SearchVishComponent from './SearchVishComponent';
import SoundCloudComponent from './SoundCloudComponent';
import YoutubeComponent from './YoutubeComponent';
import EuropeanaComponent from './EuropeanaComponent';
import FlickrComponent from './FlickrComponent';
import PhetComponent from './PhetComponent';
import OpenClipArtComponent from './OpenClipArtComponent';
import GiphyComponent from './GiphyComponent';

import VISHIcon from './logos/vish.svg';
import FlickrIcon from './logos/flickrsvg.svg';
import EuropeanaIcon from './logos/europeanaalt.svg';
import YoutubeIcon from './logos/youtube.svg';
import SoundCloudIcon from './logos/soundcloud_logo_0.png';
import OpenClipArtIcon from './logos/openclipart.svg';
import GiphyIcon from './logos/giphy.png';

import i18n from 'i18next';

export default function menus(self) {
    let allowedMIME = self.props.visible || "";
    let commonProps = {
        onElementSelected: (name, element, type, id) => { self.setState({ name, element, type, id }); },
        elementSelected: self.state.element,
        idSelected: self.state.id,
    };
    let avatar = self.props.fileModalResult && self.props.fileModalResult.id === "avatar";
    return [
        {
            name: <span><i className="material-icons">file_upload</i>{i18n.t('FileModal.APIProviders.UploadFiles')}</span>,
            show: true,
            component: UploadComponent,
            props: {
                ...commonProps,
                show: allowedMIME,
                isBusy: self.props.isBusy,
                pdfSelected: self.state.pdfSelected,
                closeSideBar: (closeAlsoModal)=>{self.setState({ pdfSelected: false }); if (closeAlsoModal) {self.close();}},
                filesUploaded: self.props.filesUploaded,
                uploadFunction: self.props.uploadFunction,
                onUploadEdiphyResource: self.props.onUploadEdiphyResource,
                onNavItemsAdded: self.props.onNavItemsAdded,
                onIndexSelected: self.props.onIndexSelected,
                onNavItemSelected: self.props.onNavItemSelected,
                navItemsIds: self.props.navItemsIds,
                navItems: self.props.navItems,
                navItemSelected: self.props.navItemSelected,
                containedViews: self.props.containedViews,
                containedViewSelected: self.props.containedViewSelected,
                boxes: self.props.boxes,
                onBoxAdded: self.props.onBoxAdded,
            },
        },
        {
            name: <span><i className="material-icons">perm_media</i>{i18n.t('FileModal.APIProviders.MyFiles')}</span>,
            show: allowedMIME,
            component: MyFilesComponent,
            props: {
                ...commonProps,
                pdfSelected: self.state.pdfSelected,
                filesUploaded: self.props.filesUploaded,
                onNavItemsAdded: self.props.onNavItemsAdded,
                onIndexSelected: self.props.onIndexSelected,
                onNavItemSelected: self.props.onNavItemSelected,
                navItemsIds: self.props.navItemsIds,
                navItems: self.props.navItems,
                navItemSelected: self.props.navItemSelected,
                containedViews: self.props.containedViews,
                containedViewSelected: self.props.containedViewSelected,
                boxes: self.props.boxes,
                deleteFileFromServer: self.props.deleteFileFromServer,
                onBoxAdded: self.props.onBoxAdded,
            },
        },
        {
            name: 'VISH',
            icon: VISHIcon,
            show: !(avatar) ? (allowedMIME) : false,
            component: SearchVishComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Flickr',
            icon: FlickrIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: FlickrComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Europeana',
            icon: EuropeanaIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: EuropeanaComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Youtube',
            icon: YoutubeIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('video')),
            component: YoutubeComponent,
            props: { ...commonProps },
        },
        /* {
            name: 'Phet',
            icon: YoutubeIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('video')),
            component: PhetComponent,
            props: { ...commonProps },
        },*/
        /* {
            name: 'Giphy',
            icon: GiphyIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: GiphyComponent,
            props: { ...commonProps },
        },*/
        /* {
            name: 'SoundCloud',
            icon: SoundCloudIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('video')),
            component: SoundCloudComponent,
            props: { ...commonProps },
        },
        {
            name: 'OpenClipArt',
            icon: OpenClipArtIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: OpenClipArtComponent,
            props: { ...commonProps },
        },*/
    ];
}
