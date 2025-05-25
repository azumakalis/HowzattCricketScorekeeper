function saveTeams() {
    localStorage.clear();
    const team1 = document.getElementById("firstteam").value;
    const team2 = document.getElementById("secondteam").value;
    const tossWinner = document.getElementById("tossWinner").value;
    const tossChoice = document.getElementById("tossChoice").value;
    let batteam, bowlteam;
    if (tossWinner === "1" && tossChoice === "1") {
        batteam = team1;
        bowlteam = team2;
    }
    else if (tossWinner === "2" && tossChoice === "1") {
        batteam = team2;
        bowlteam = team1;
    }
    else if (tossWinner === "1" && tossChoice === "2") {
        batteam = team2;
        bowlteam = team1;
    }
    else if (tossWinner === "2" && tossChoice === "2") {
        batteam = team1;
        bowlteam = team2;
    }
    localStorage.setItem("batteam", batteam);
    localStorage.setItem("bowlteam", bowlteam);
    window.location.href = "../live_match/live.html";
    const bat1 = prompt("Enter name of the opener: ");
    const bat2 = prompt("Enter name of the non-striker");
    const bowler = prompt("Enter name of the bowler");
    localStorage.setItem("bat1", bat1);
    localStorage.setItem("bat2", bat2);
    localStorage.setItem("bowler", bowler);
}

function createRowFromObject(obj) {
    const row = document.createElement("tr");
    let count = 0;
    for (const key in obj) {
        if (count >= 6) break;
        const cell = document.createElement("td");
        const value = obj[key];
        if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                cell.textContent = value;
            } else {
                cell.textContent = value.toFixed(2);
            }
        } else {
            cell.textContent = value;
        }
        row.appendChild(cell);
        count++;
    }
    return row;
}

class batsman {
    constructor(name, runs=0, balls=0, fours=0, sixes=0, strikeRate=0.00) {
        this.name = name;
        this.runs = runs;
        this.balls = balls;
        this.fours = fours;
        this.sixes = sixes;
        this.strikeRate = strikeRate;
    }
}

class bowlerman {
    constructor(name, overs=0, maidens=0, conruns=0, wicks=0, econ=0.00, balls=0) {
        this.name = name;
        this.overs = overs;
        this.maidens = maidens;
        this.conruns = conruns;
        this.wicks = wicks;
        this.econ = econ;
        this.balls = balls;
    }
}

let batsman1, batsman2, bowlsman;
let batter1, batter2, bowlman;
let wicketTaken, overEnded;
let secondInnings = false;

window.addEventListener("DOMContentLoaded", () => {
    if ((window.location.pathname).includes("live.html")) {
        document.getElementById("otherteam").style.display = "none";
        document.getElementById("RRR").style.display = "none";
        document.getElementById("batteam").innerHTML = localStorage.getItem("batteam");
        document.getElementById("bowlteam").innerHTML = localStorage.getItem("bowlteam");
        batter1 = localStorage.getItem("bat1");
        batter2 = localStorage.getItem("bat2");
        bowlman = localStorage.getItem("bowler");
        document.getElementById("bat1").innerHTML = batter1;
        document.getElementById("bat2").innerHTML = batter2;
        document.getElementById("bowler").innerHTML = bowlman;
        batsman1 = new batsman(batter1);
        batsman2 = new batsman(batter2);
        bowlsman = new bowlerman(bowlman);
        addRuns();
        addWickets();
        addExtras();
    }
    if ((window.location.pathname).includes("scorecard.html")) {
        const scoreTable1 = document.getElementById("scoreTable1");
        const bowlTable1 = document.getElementById("bowlTable1");
        if (!secondInnings) {
            for (let i = 1; i <= 36; i++) {
                const batsmanData = localStorage.getItem(`batsman${i}`);
                if (!batsmanData) continue;
                const obj = JSON.parse(batsmanData);
                const row = createRowFromObject(obj);
                scoreTable1.appendChild(row);
            }
            for (let i = 1; i <= 4; i++) {
                const bowlsmanData = localStorage.getItem(`bowlsman${i}`);
                if (!bowlsmanData) continue;
                const obj = JSON.parse(bowlsmanData);
                const row = createRowFromObject(obj);
                bowlTable1.appendChild(row);
            }
        }
    }
    if ((window.location.pathname).includes("summary.html")) {
        const winner = localStorage.getItem("winner");
        const diff = localStorage.getItem("diff");
        const rorw = localStorage.getItem("rorw");
        if (rorw == "wickets" ) {
            const balldiff = localStorage.getItem("bdiff");
            const span = document.createElement("span");
            span.textContent = "(" + `${balldiff}` + " balls left)";
            document.getElementById("result").appendChild(span);
        }
        document.getElementById("winningTeam").innerHTML = `${winner}`;
        document.getElementById("diff").innerHTML = `${diff}`;
        document.getElementById("rorw").innerHTML = `${rorw}`;
    }
})

let totalRuns = 0;
let totalOvers = 0;
let totalWickets = 0;
let striker = 1;
let target = -1;

let bowlIndex = 1;
let strikeIndex1 = 1;
let strikeIndex2 = 2;

let noRunCounter = 0;

function addRuns() {
    const runButtons = document.querySelectorAll(".runs");
    runButtons.forEach(button => {
        button.addEventListener("click", () => {
            const runs = parseInt(button.id);
            if (runs === 0) {
                noRunCounter += 1;
            }
            totalRuns += runs;
            totalOvers += 0.1;
            bowlsman.conruns += runs;
            bowlsman.overs += 0.1;
            bowlsman.balls += 1;
            bowlsman.econ = (bowlsman.conruns/bowlsman.balls)*6;
            if (Math.round((totalOvers*10)%10) === 6){
                totalOvers = Math.floor(totalOvers) + 1;
                bowlsman.overs = Math.floor(bowlsman.overs) + 1;
            }
            if (striker === 1) {
                batsman1.runs += runs;
                batsman1.balls += 1;
                batsman1.strikeRate = (batsman1.runs/batsman1.balls)*100;
                if (runs === 1 || runs === 3) striker = striker === 1 ? 2 : 1;
                else if (runs === 4) batsman1.fours += 1;
                else if (runs === 6) batsman1.sixes += 1;
                document.getElementById("run1").innerHTML = batsman1.runs;
                document.getElementById("ball1").innerHTML = batsman1.balls;
                document.getElementById("four1").innerHTML = batsman1.fours;
                document.getElementById("six1").innerHTML = batsman1.sixes;
                document.getElementById("sr1").innerHTML = batsman1.strikeRate.toFixed(2);
                localStorage.setItem("batsman"+strikeIndex1, JSON.stringify(batsman1));
            }
            else {
                batsman2.runs += runs;
                batsman2.balls += 1;
                batsman2.strikeRate = (batsman2.runs/batsman2.balls)*100;
                if (runs === 1 || runs === 3) striker = striker === 1 ? 2 : 1;
                else if (runs === 4) batsman2.fours += 1;
                else if (runs === 6) batsman2.sixes += 1;
                document.getElementById("run2").innerHTML = batsman2.runs;
                document.getElementById("ball2").innerHTML = batsman2.balls;
                document.getElementById("four2").innerHTML = batsman2.fours;
                document.getElementById("six2").innerHTML = batsman2.sixes;
                document.getElementById("sr2").innerHTML = batsman2.strikeRate.toFixed(2);
                localStorage.setItem("batsman"+strikeIndex2, JSON.stringify(batsman2));
            }
            document.getElementById("econ1").innerHTML = bowlsman.econ.toFixed(2);
            document.getElementById("conrun1").innerHTML = bowlsman.conruns;
            document.getElementById("over1").innerHTML = bowlsman.overs.toFixed(1);
            document.getElementById("currentruns").innerHTML = totalRuns;
            document.getElementById("currentovers").innerHTML = totalOvers.toFixed(1);
            localStorage.setItem("bowlsman"+bowlIndex, JSON.stringify(bowlsman));
            if (secondInnings && totalRuns >= target) endMatch(); 
            if (totalWickets >= 10 || totalOvers >= 2.0) {
                if (secondInnings) endMatch();
                else endInnings();
            }
            if (Math.round((totalOvers*10)%10) === 0) endOvers();
            calculateCurrentRunRate();
            calculateRequiredRunRate();
        })
    })
}

function addWickets() {
    const wickets = document.querySelectorAll(".wickets");
    wickets.forEach( button => {
        button.addEventListener("click", () => {
            wicketTaken = true;
            let batsnext = prompt("Enter name of the next batsman: ", "");
            noRunCounter += 1;
            totalWickets += 1;
            totalOvers += 0.1;
            bowlsman.wicks += 1;
            bowlsman.overs += 0.1;
            bowlsman.econ = (bowlsman.conruns/bowlsman.balls)*6;
            if (Math.round((totalOvers*10)%10) === 6){
                totalOvers = Math.floor(totalOvers) + 1;
                bowlsman.overs = Math.floor(bowlsman.overs) + 1;
            }
            if (striker === 1) {
                batsman1.balls += 1;
                batsman1.strikeRate = (batsman1.runs/batsman1.balls)*100;
                localStorage.setItem("batsman"+strikeIndex1, JSON.stringify(batsman1));
                batsman1 = new batsman(batsnext);
                strikeIndex1+=2;
                document.getElementById("bat1").innerHTML = batsman1.name;
                document.getElementById("run1").innerHTML = batsman1.runs;
                document.getElementById("six1").innerHTML = batsman1.sixes;
                document.getElementById("four1").innerHTML = batsman1.fours;
                document.getElementById("ball1").innerHTML = batsman1.balls;
                document.getElementById("sr1").innerHTML = batsman1.strikeRate;
                localStorage.setItem("batsman"+strikeIndex1, JSON.stringify(batsman1));
            }
            else {
                batsman2.balls += 1;
                batsman2.strikeRate = (batsman2.runs/batsman2.balls)*100;
                localStorage.setItem("batsman"+strikeIndex2, JSON.stringify(batsman2));
                batsman2 = new batsman(batsnext);
                strikeIndex2+=2;
                document.getElementById("bat2").innerHTML = batsman2.name;
                document.getElementById("run2").innerHTML = batsman2.runs;
                document.getElementById("six2").innerHTML = batsman2.sixes;
                document.getElementById("four2").innerHTML = batsman2.fours;
                document.getElementById("ball2").innerHTML = batsman2.balls;
                document.getElementById("sr2").innerHTML = batsman2.strikeRate;
                localStorage.setItem("batsman"+strikeIndex2, JSON.stringify(batsman2));
            }
            document.getElementById("econ1").innerHTML = bowlsman.econ.toFixed(2);
            document.getElementById("conrun1").innerHTML = bowlsman.conruns;
            document.getElementById("over1").innerHTML = bowlsman.overs.toFixed(1);
            document.getElementById("wick1").innerHTML = bowlsman.wicks;
            document.getElementById("currentovers").innerHTML = totalOvers.toFixed(1);
            document.getElementById("currentwickets").innerHTML = totalWickets;
            localStorage.setItem("bowlsman"+bowlIndex, JSON.stringify(bowlsman));
            if (totalWickets >= 10 || totalOvers >= 2.0) {
                if (secondInnings) endMatch();
                else endInnings();
            }
            if (Math.round((totalOvers*10)%10) === 0) endOvers();
            calculateCurrentRunRate();
            calculateRequiredRunRate();
        })
    })
}

function addExtras() {
    const extras = document.querySelectorAll(".extras");
    extras.forEach ( button => {
        button.addEventListener( "click", () => {
            totalRuns += 1;
            document.getElementById("currentruns").innerHTML = totalRuns;
            calculateCurrentRunRate();
            calculateRequiredRunRate();
        })
    })
}

function calculateRequiredRunRate() {
    if (secondInnings){
        let rundiff = target - totalRuns;
        const oversBowled = Math.floor(totalOvers) + (totalOvers % 1) * (10/6);
        let RRR = (rundiff/(2.0-oversBowled));
        document.getElementById("requiredRunRate").innerHTML = RRR.toFixed(2);
    }
}

function calculateCurrentRunRate() {
    const oversBowled = Math.floor(totalOvers) + (totalOvers % 1) * (10/6);
    let CRR = (totalRuns/oversBowled);
    if (totalOvers >= 0.1) document.getElementById("currentRunRate").innerHTML = CRR.toFixed(2);
}

function endInnings() {
    const bait1 = prompt("Enter the name of next opener: ");
    const bait2 = prompt("Enter the name of next non-striker: ");
    document.getElementById("prevruns").innerHTML = totalRuns;
    document.getElementById("prevwickets").innerHTML = totalWickets;
    document.getElementById("prevovers").innerHTML = totalOvers.toFixed(1);
    document.getElementById("batteam").innerHTML = localStorage.getItem("bowlteam");
    document.getElementById("bowlteam").innerHTML = localStorage.getItem("batteam");
    target = totalRuns + 1;
    totalOvers = 0.0;
    totalRuns = 0;
    totalWickets = 0;
    secondInnings = true;
    striker = 1;
    let strikeIndexer = strikeIndex1;
    strikeIndex1 += strikeIndex2 + 2;
    strikeIndex2 += strikeIndexer + 3;
    document.getElementById("currentruns").innerHTML = totalRuns;
    document.getElementById("currentwickets").innerHTML = totalWickets;
    document.getElementById("currentovers").innerHTML = totalOvers.toFixed(1);
    document.getElementById("otherteam").style.display = "inline";
    document.getElementById("RRR").style.display = "inline";
    document.getElementById("currentRunRate").innerHTML = "--.--";
    batsman1 = new batsman(bait1);
    batsman2 = new batsman(bait2);
    document.getElementById("bat1").innerHTML = `${bait1}`;
    document.getElementById("bat2").innerHTML = `${bait2}`;
    document.getElementById("run1").innerHTML = batsman1.runs;
    document.getElementById("ball1").innerHTML = batsman1.balls;
    document.getElementById("sr1").innerHTML = "0.00";
    document.getElementById("four1").innerHTML = batsman1.fours;
    document.getElementById("six1").innerHTML = batsman1.sixes;
    document.getElementById("run2").innerHTML = batsman2.runs;
    document.getElementById("ball2").innerHTML = batsman2.balls;
    document.getElementById("sr2").innerHTML = "0.00";
    document.getElementById("four2").innerHTML = batsman2.fours;
    document.getElementById("six2").innerHTML = batsman2.sixes;
    document.getElementById("econ1").innerHTML = bowler1.econ;
    document.getElementById("over1").innerHTML = bowler1.overs;
    document.getElementById("conrun1").innerHTML = bowler1.runs;
    document.getElementById("wick1").innerHTML = bowler1.wickets;
}

let isMatchNotEnding = false;

function endOvers() {
    overEnded = true;
    if (noRunCounter === 6) bowlsman.maidens += 1;
    noRunCounter = 0;
    localStorage.setItem("bowlsman"+bowlIndex, JSON.stringify(bowlsman));
    bowlIndex += 1;
    striker = striker === 1 ? 2 : 1;
    let bowlnext;
    if (!isMatchNotEnding) bowlnext = prompt("Enter name of the next bowler: ", "");
    bowlsman = new bowlerman(bowlnext);
    document.getElementById("econ1").innerHTML = bowlsman.econ.toFixed(2);
    document.getElementById("over1").innerHTML = bowlsman.overs.toFixed(1);
    document.getElementById("wick1").innerHTML = bowlsman.wicks;
    document.getElementById("conrun1").innerHTML = bowlsman.conruns;
    document.getElementById("bowler").innerHTML = bowlsman.name;
    localStorage.setItem("bowlsman"+bowlIndex, JSON.stringify(bowlsman));
}

function endMatch() {
    isMatchNotEnding = true;
    let rundiff = target - totalRuns;
    let wicketdiff = 10 - totalWickets;
    let oversBowled = Math.floor(totalOvers) + (totalOvers % 1) * (10/6);
    let balldiff = Math.round((2.0 - oversBowled)*6);
    let winner;
    if (wicketdiff === 0) {
        winner = localStorage.getItem("batteam");
        localStorage.setItem("diff", rundiff);
        localStorage.setItem("rorw", "runs");
    }
    else if (totalRuns >= target) {
        winner = localStorage.getItem("bowlteam");
        localStorage.setItem("diff", wicketdiff);
        localStorage.setItem("bdiff", balldiff);
        localStorage.setItem("rorw", "wickets");
    }
    else {
        winner = localStorage.getItem("batteam");
        localStorage.setItem("diff", rundiff);
        localStorage.setItem("rorw", "runs");
    }
    localStorage.setItem("winner", winner);
    window.location.href = "../summary/summary.html";
}

function resetMatch() {
    localStorage.clear();
    window.location.href = "../setup_page/setup.html";
}

function scorecard() {
    window.open("../scorecard/scorecard.html", "_blank");
}

function backLive() {
    window.close();
}