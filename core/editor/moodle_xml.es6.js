export default function toMoodleXML(state, callback, options = false) {
    console.log(state);
    callback();
    let toLibJson = (exercises) => {
        let out = {};
        let exIds = [];
        Object.keys(exercises).map((navItem, index) => {
            exercises[navItem].exercises.map(exId => {
                exIds.push(exId);

            });
        });
    };
}
