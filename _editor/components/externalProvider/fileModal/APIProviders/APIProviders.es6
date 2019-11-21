import React from 'react';
import MyFilesComponent from './providers/Files/MyFilesComponent';
import UploadComponent from './providers/Files/UploadComponent';
import SearchVishComponent from './providers/Vish/SearchVishComponent';
import SoundCloudComponent from './providers/SoundCloud/SoundCloudComponent';
import DropboxComponent from './providers/Dropbox/DropboxComponent';
import YoutubeComponent from './providers/Youtube/YoutubeComponent';
import EuropeanaComponent from './providers/Europeana/EuropeanaComponent';
import FlickrComponent from './providers/Flickr/FlickrComponent';
import PolyComponent from './providers/Poly/PolyComponent';
import LogoComponent from './providers/LogoComponent';
// import GoogleDriveComponent from './providers/GoogleDriveComponent';
// import AudioBlocksComponent from './AudioBlocksComponent';
// import PhetComponent from './PhetComponent';
import OpenClipArtComponent from './providers/OpenClipArt/OpenClipArtComponent';
// import GiphyComponent from './providers/GiphyComponent';
import PixabayComponent from './providers/Pixabay/PixabayComponent';

import VISHIcon from './logos/vish.svg';
import FlickrIcon from './logos/flickrsvg.svg';
import EuropeanaIcon from './logos/europeanaalt.svg';
import YoutubeIcon from './logos/youtube.svg';
import SoundCloudIcon from './logos/soundcloud_logo_0.png';
import DropboxIcon from './logos/Dropboxlogo.png';
// import AudioBlocksIcon from './logos/storyblocks-ab-alt.svg';
import PolyIcon from './logos/PolyLogo.png';
import OpenClipArtIcon from './logos/openclipart.svg';
// import GiphyIcon from './logos/giphy.png';
import LogoIcon from './logos/avatar-gallery.png';
import PixabayIcon from './logos/PixabayLogo.svg';

import i18n from 'i18next';
export default function menus(self) {
    let allowedMIME = self.props.showFileUpload || "";
    let commonProps = {
        onElementSelected: (name, element, type, id, options = {}) => {
            self.setState({ name, element, type, id, options }); },
        elementSelected: self.state.element,
        idSelected: self.state.id,
    };
    let avatar = self.props.fileModalResult && self.props.fileModalResult.id === "avatar";
    return [
        {
            name: <span><i className="material-icons">file_upload</i>{i18n.t('FileModal.APIProviders.UploadFiles')}</span>,
            show: (allowedMIME),
            component: UploadComponent,
            props: {
                ...commonProps,
                isBusy: self.props.isBusy,
                closeSideBar: (closeAlsoModal)=>{self.setState({ pdfSelected: false }); if (closeAlsoModal) {self.close();}},
                pdfSelected: self.state.pdfSelected,
                filesUploaded: self.props.filesUploaded,
                uploadFunction: self.props.handleExportImport.uploadFunction,
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
                elementSelectedType: self.state.type,
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
                deleteFileFromServer: self.props.handleExportImport.deleteFileFromServer,
                onBoxAdded: self.props.onBoxAdded,
            },
        },
        {
            name: 'VISH',
            icon: VISHIcon,
            show: !(avatar) ? ((allowedMIME && allowedMIME !== 'csv') ? allowedMIME : false) : false,
            component: SearchVishComponent,
            props: { ...commonProps, elementSelectedType: self.state.type,
            },
        },
        {
            name: 'Dropbox',
            icon: DropboxIcon,
            show: !(avatar) ? ((allowedMIME) ? allowedMIME : false) : false,
            component: DropboxComponent,
            props: {
                ...commonProps,
                isBusy: self.props.isBusy,
                elementSelectedType: self.state.type,
                allowedMIME,
                pdfSelected: self.state.pdfSelected,
                filesUploaded: self.props.filesUploaded,
                uploadFunction: self.props.handleExportImport.uploadFunction,
            },
        },
        /* {
         name: 'Google',
         icon: SoundCloudIcon,
         show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
         component: GoogleDriveComponent,
         props: { ...commonProps },
         },*/
        {
            name: 'Youtube',
            icon: YoutubeIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('video')),
            component: YoutubeComponent,
            props: { ...commonProps },
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
        /* {
            name: 'Phet',
            icon: YoutubeIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('video')),
            component: PhetComponent,
            props: { ...commonProps },
        },*/
        /*      {
            name: 'Giphy',
            icon: GiphyIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: GiphyComponent,
            props: { ...commonProps },
        },*/
        {
            name: 'SoundCloud',
            icon: SoundCloudIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('audio')),
            component: SoundCloudComponent,
            props: { ...commonProps },
        },
        // {
        //     name: 'AudioBlocks',
        //     icon: AudioBlocksIcon,
        //     show: (allowedMIME === "*" || allowedMIME.match('audio')),
        //     component: AudioBlocksComponent
        // },
        {
            name: 'OpenClipArt',
            icon: OpenClipArtIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: OpenClipArtComponent,
            props: { ...commonProps },
        },
        /* {
          name: 'Thingiverse',
          icon: ThingiverseIcon,
          show: (allowedMIME === "*" || allowedMIME.match('application')),
          component: ThingiverseComponent,
          props: { ...commonProps },
      }*/
        {
            name: 'Google Poly',
            icon: PolyIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('webapp')),
            component: PolyComponent,
            props: { ...commonProps },
        },
        {
            name: 'Avatar',
            icon: LogoIcon,
            show: (avatar),
            component: LogoComponent,
            props: { ...commonProps },
        },
        {
            name: 'Pixabay',
            icon: PixabayIcon,
            show: !(avatar) && (allowedMIME === "*" || allowedMIME.match('image')),
            component: PixabayComponent,
            props: { ...commonProps },
        },
    ];
}
