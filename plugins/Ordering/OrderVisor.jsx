import React from 'react';
import VisorPluginPlaceholder from '../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { generateCustomColors } from "../../common/themes/theme_loader";
/* eslint-disable react/prop-types */
export default class OrderVisor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: this.generateRandomPositions(this.props.state.nBoxes),
        };
    }
    render() {
        let { state, props } = this.props;
        let content = [];
        let attempted = props.exercises && props.exercises.attempted;
        let score = props.exercises.score || 0;
        score = Math.round(score * 100) / 100;
        score = (props.exercises.weight === 0) ? i18n.t("Ordering.notCount") : ((score) + "/" + (props.exercises.weight));
        let showFeedback = attempted && state.showFeedback;

        let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        let positions = attempted ? props.exercises.currentAnswer : this.state.positions;
        for (let j in positions) {
            let i = positions[j];
            // eslint-disable-next-line
            let correct = attempted && i == j;
            // eslint-disable-next-line
            let incorrect = attempted && (j != i);

            content.push(
                <div key={j + 1} data-id={i} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        <div className={"answer_letter"}>{parseInt(j, 10) + 1}</div>
                    </div>
                    <div className={"col-xs-10 answerCol"} >
                        <div data-id={i} className="orderable">
                            <i className="material-icons order-drag-handle btnDrag">swap_vert</i>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} /></div>
                    </div>
                    {(correct) ? <i className={ "material-icons correct"}>done</i> : null}
                    {(incorrect) ? <i className={ "material-icons incorrect"}>clear</i> : null}
                </div>);

        }

        let feedbackText = props.toolbars[props.boxes[props.id].sortableContainers['sc-Feedback'].children[0]].state.__text;
        let checkEmptyFeedback = !props.boxes[props.id].sortableContainers['sc-Feedback'].children ||
            props.boxes[props.id].sortableContainers['sc-Feedback'].children.length === 0 ||
            feedbackText === "<p>" + i18n.t("text_here") + "</p>" ||
            feedbackText === encodeURI("<p>" + i18n.t("text_here") + "</p>") ||
            feedbackText === encodeURI("<p>" + i18n.t("text_here") + "</p>\n") ||
            feedbackText === encodeURI('<p>' + i18n.t("Ordering.FeedbackMsg") + '</p>\n') ||
            feedbackText === '<p>' + i18n.t("Ordering.FeedbackMsg") + '</p>';

        let exClassName = "exercisePlugin orderingPlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "");
        return (<div className={ exClassName } style={ customStyle }>
            <div className={"row"} key={0} >
                <div className={"col-xs-12"}>
                    <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                </div>
            </div>
            <div id={props.id + "-" + "sortable"}>
                {content}
            </div>
            {checkEmptyFeedback ? null : <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                <div className={"col-xs-12 feedback"}>
                    <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                </div>
            </div>}

            <div className={"exerciseScore"}>{score}</div>
            <style dangerouslySetInnerHTML={{
                __html: `
                            .orderingPlugin input[type="radio"]  {
                              background-color: transparent;
                            }
                           .orderingPlugin input[type="radio"]:checked:after {
                              background-color: var(--themeColor1);
                            }
                          `,
            }} />
        </div>);

    }
    shuffle(array) {
        let tmp, current, top = array.length;
        if(top) {while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }}
        return array;
    }
    generateRandomPositions(N) {
        let a = [];
        for (let i = 0; i < N; ++i) {a[i] = i;}
        return this.shuffle(a);
    }
    componentDidUpdate(nextProps, nextState) {
        let id = this.props.props.id + "-" + "sortable";
        let list = $("#" + id);
        // list.sortable("refresh");
        let prevAttempted = nextProps.props.exercises && nextProps.props.exercises.attempted;
        let attempted = this.props.props.exercises && this.props.props.exercises.attempted;
        if (!prevAttempted && attempted && list && list.sortable("instance")) {
            list.sortable("destroy");
        }
    }
    componentDidMount() {

        let attempted = this.props.props.exercises && this.props.props.exercises.attempted;

        if (!attempted) {
            let id = this.props.props.id + "-" + "sortable";
            let list = $("#" + id);
            setTimeout(()=>{
                list.sortable({
                    handle: '.order-drag-handle',
                    items: '.answerRow',
                    // revert: true,
                    over: function() {
                        $(this).addClass('hoveringOrder');
                    },
                    out: function() {
                        $(this).removeClass('hoveringOrder');
                    },
                    stop: (event, ui) => {
                        let indexes = [];
                        let children = list.find(".answerRow");
                        for (let i = 0; i < children.length; i++) {
                            let index = parseInt(children[i].getAttribute("data-id"), 10);
                            indexes.push(index);
                        }
                        if (indexes.length !== 0) {
                            this.setState({ positions: indexes });
                            this.props.props.setAnswer(this.state.positions);
                        }
                        list.sortable('cancel');
                        let ev = document.createEvent('Event');
                        ev.initEvent('resize', true, true);
                        window.dispatchEvent(ev);
                    },
                });
                this.props.props.setAnswer(this.state.positions);
            }, 50);

        }

    }
    componentWillUnmount() {
        let id = this.props.props.id + "-" + "sortable";
        let list = $("#" + id);
        let attempted = this.props.props.exercises && this.props.props.exercises.attempted;
        if (!attempted && list && list.sortable("instance")) {
            this.setState({ initializedSortable: false });

        }
    }
}

/* eslint-enable react/prop-types */
