const grades = {
    'shinzzang':24,
    'chulsu':98,
    'yuri':75,
    'maengu':90,
    'huni':60,
}

const sortedGrades = Object.entries(grades).sort((a,b)=>b[1]-a[1]);
const winner = Object.entries(grades).sort((a,b)=>b[1]-a[1])[0];

console.log(sortedGrades);
console.log(winner);