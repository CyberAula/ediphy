import VideoPlugin from './../components/VideoPlugin.js';

export function EnrichedVideo(base) {
    return {
        getRenderTemplate: function (state) {
            return (
                /* jshint ignore:start */
                <VideoPlugin state={state}></VideoPlugin>
                /* jshint ignore:end */
            );
        }
    };
}