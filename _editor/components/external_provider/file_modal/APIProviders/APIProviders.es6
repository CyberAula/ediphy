import React from 'react';
import MyFilesComponent from './MyFilesComponent';
import SearchVishComponent from './SearchVishComponent';
import SoundCloudComponent from './SoundCloudComponent';
import AudioBlocksComponent from './AudioBlocksComponent';
import YoutubeComponent from './YoutubeComponent';
import EuropeanaComponent from './EuropeanaComponent';
import FlickrComponent from './FlickrComponent';
import VISHIcon from './logos/vish.svg';
import FlickrIcon from './logos/flickrsvg.svg';
import EuropeanaIcon from './logos/europeanaalt.svg';
import YoutubeIcon from './logos/youtube.svg';
import SoundCloudIcon from './logos/soundcloud_logo_0.png';
import AudioBlocksIcon from './logos/storyblocks-ab-alt.svg';
import UploadComponent from './UploadComponent';
import i18n from 'i18next';

export default function menus(self) {
    let allowedMIME = self.props.visible || "";
    let commonProps = {
        onElementSelected: (name, element, type, id) => { self.setState({ name, element, type, id }); },
        elementSelected: self.state.element,
        idSelected: self.state.id,
    };
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
            name: <span><i className="material-icons">attach_file</i>{i18n.t('FileModal.APIProviders.MyFiles')}</span>,
            show: true,
            component: MyFilesComponent,
            props: {
                ...commonProps,
                show: allowedMIME,
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
            show: (allowedMIME === "*" || allowedMIME.match('image')),
            component: SearchVishComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Flickr',
            icon: FlickrIcon,
            show: (allowedMIME === "*" || allowedMIME.match('image')),
            component: FlickrComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Europeana',
            icon: EuropeanaIcon,
            show: (allowedMIME === "*" || allowedMIME.match('image')),
            component: EuropeanaComponent,
            props: { ...commonProps,
            },
        },
        {
            name: 'Youtube',
            icon: YoutubeIcon,
            show: (allowedMIME === "*" || allowedMIME.match('video')),
            component: YoutubeComponent,
            props: { ...commonProps },
        },
        {
            name: 'SoundCloud',
            icon: SoundCloudIcon,
            show: (allowedMIME === "*" || allowedMIME.match('audio')),
            component: SoundCloudComponent,
            props: { ...commonProps },
        },
        /* {
            name: 'AudioBlocks',
            icon: AudioBlocksIcon,
            show: (allowedMIME === "*" || allowedMIME.match('audio')),
            component: AudioBlocksComponent,
            props: { ...commonProps },
        },*/
    ];
}
