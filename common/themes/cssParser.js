
export function translatePxToEm(line) {
    return line.replace(/(\d+\.?\d*)\s?px/g, (a, b)=>{
        let em = parseFloat(b) / 14;
        em = Math.round(em * 100) / 100;
        return em + 'em';
    });
}
