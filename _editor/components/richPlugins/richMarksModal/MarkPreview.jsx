import React from "react";
import i18n from 'i18next';
import FormGroup from "react-bootstrap/lib/FormGroup";
import flowerMark from "./../../../../dist/images/flower_mark.png";

export function MarkPreview(props) {
    return (
        <FormGroup>
            <h4>{i18n.t("marks.preview")}</h4>
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                {getPreviewContent(props)}
            </div>
        </FormGroup>
    );
}

function getPreviewContent(props) {
    let previewContent = null;
    let canvasSize = props.state.svg?.canvasSize ?? props.props.currentRichMark?.content?.svg?.canvasSize ?? { width: 100, height: 100 };
    switch (props.state.markType) {
    case 'area':
        let path = props.props.markCursorValue?.svgPath ?? props.props.currentRichMark?.content?.svg?.svgPath ?? false;
        previewContent = path ? (
            <div style={{ width: '100%' }}>
                <svg
                    viewBox={`0 0 ${canvasSize.width ?? 0} ${canvasSize.height ?? 0}`}
                    style={{ pointerEvents: 'none' }}
                    height={'100%'} width={'100%'}
                    preserveAspectRatio="none">
                    <path d={path} strokeDasharray="5,5" stroke={props.state.secretArea ? 'black' : 'transparent' } fill={props.state.color || '#000000'}/>
                </svg>
            </div>
        ) : i18n.t("marks.should_draw");
        break;
    case 'image':
        let originalDimensions = props.state.originalDimensions;
        let previewSize = {};
        let selectedPluginAspectRatio = 1;
        let imageSize = (props.state.size / 100);
        if (props.props.boxesById[props.props.boxSelected] && document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id)) {
            let y = document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id).getBoundingClientRect().height;
            let x = document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id).getBoundingClientRect().width;
            selectedPluginAspectRatio = x / y;
            previewSize.height = x > y ? String(15 / selectedPluginAspectRatio) + "em" : "15em";
            previewSize.width = x > y ? "15em" : String(15 * selectedPluginAspectRatio) + "em";
            previewSize.aspectRatio = selectedPluginAspectRatio;
        }
        let width = previewSize.height < previewSize.width ? 100 * imageSize : (100 * imageSize / previewSize.aspectRatio * originalDimensions.aspectRatio);

        let source = props.state.image ? props.state.image : flowerMark;
        previewContent = (<div style={{
            height: previewSize.height,
            width: previewSize.width,
            border: "1px dashed grey",
        }}>
            <img width={ originalDimensions.aspectRatio > selectedPluginAspectRatio ? String(width) + "%" : 'auto' }
                height={ originalDimensions.aspectRatio > selectedPluginAspectRatio ? 'auto' : String(width) + "%" }
                onLoad={props.onImgLoad} src={source}/>
        </div>);
        break;
    case 'icon':
        let icon = props.state.selectedIcon ?? 'room';
        previewContent = <i className="material-icons" style={{
            color: (props.state.color || "black"),
            fontSize: (props.state.size / 10) + "em",
            paddingLeft: "7%",
        }}>{icon}</i>;
        break;
    default:
        break;
    }
    return previewContent;
}
