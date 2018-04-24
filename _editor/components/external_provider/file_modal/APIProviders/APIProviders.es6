import React from 'react';
import MyFilesComponent from './MyFilesComponent';
import SearchVishComponent from './SearchVishComponent';
import SoundCloudComponent from './SoundCloudComponent';
import YoutubeComponent from './YoutubeComponent';
import EuropeanaComponent from './EuropeanaComponent';
import FlickrComponent from './FlickrComponent';
import VISHIcon from './logos/vish.svg';
import FlickrIcon from './logos/flickrsvg.svg';
import EuropeanaIcon from './logos/europeanaalt.svg';
import YoutubeIcon from './logos/youtube.svg';
import SoundCloudIcon from './logos/soundcloud_logo_0.png';

export default function menus(self) {
    let allowedMIME = self.props.visible || "";
    let commonProps = {
        onElementSelected: (name, element, type) => { self.setState({ name, element, type }); },
        elementSelected: self.state.element,
    };
    return [
        {
            name: <span><i className="material-icons">file_upload</i>{'My Files'}</span>,
            show: true,
            component: MyFilesComponent,
            props: {
                ...commonProps,
                show: allowedMIME,
                pdfSelected: self.state.pdfSelected,
                closeSideBar: (closeAlsoModal)=>{self.setState({ pdfSelected: false }); if (closeAlsoModal) {self.props.close();}},
                filesUploaded: self.props.filesUploaded,
                onUploadVishResource: self.props.onUploadVishResource,
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
            name: 'VISH',
            icon: VISHIcon,
            show: (allowedMIME === "*" || allowedMIME.match('image')),
            component: SearchVishComponent,
            props: { ...commonProps,
                onFetchVishResources: self.props.onFetchVishResources,
                fetchResults: self.props.fetchResults,
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
            show: (allowedMIME === "*" || allowedMIME.match('video')),
            component: SoundCloudComponent,
            props: { ...commonProps },
        },
    ];
}
