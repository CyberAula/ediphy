// import React from 'react';
// import PropTypes from 'prop-types';
//
// export default class TemplateThumbnailRich extends React.Component {
//     constructor(props) {
//         super(props);
//
//     }
//
//     render() {
//         // return <img className={this.props.className} style={this.props.style} src={this.props.image} onClick={this.props.onClick} />;
//         // Thumbnail generated via HTML instead of SVG
//
//         return (<div className={this.props.className} style={this.props.style} onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick}>
//
//             {this.props.boxes.map((plugin, index)=>{
//                 let { box, thumbnail } = plugin;
//                 // let name = toolbar.name;
//                 // let config = Ediphy.Plugins.get(name).getConfig();
//                 // let icon = config.icon;
//                 // let iconFromUrl = config.iconFromUrl;
//                 let lineHeight = (parseFloat(box.heightTemplate || box.height) / 100 * 80) + 'px';
//
//                 return (<div key={index} style={{ position: 'absolute',
//                     backgroundColor: thumbnail.color,
//                     top: box.y,
//                     left: box.x,
//                     width: box.width,
//                     height: box.heightTemplate || box.height }}>
//                     <span style={{ verticalAlign: 'middle', lineHeight: lineHeight, display: 'inherit', textAlign: 'center' }}>
//                         <i className="material-icons" style={{ color: thumbnail.icon_color, padding: '3px 2px' }} >{thumbnail.icon}</i>
//                     </span>
//                 </div>);
//             })}
//         </div>);
//     }
//
// }
//
// TemplateThumbnailRich.propTypes = {
//     /**
//      * CSS Class to apply
//      */
//     className: PropTypes.string,
//     /**
//      * Object containing all created boxes (by id)
//      */
//     boxes: PropTypes.array,
//     /**
//      * Style object
//      */
//     style: PropTypes.object,
//     /**
//      * Click callback
//      */
//     onClick: PropTypes.func,
//     /**
//      * Double Click callback
//      */
//     onDoubleClick: PropTypes.func,
// };
