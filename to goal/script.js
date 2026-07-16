let exp = 0;
let maxExp = 100;
let age = 0;

let goalHours = 0;

let selectedCharacter = "";

let coins = 0;
let level = 1;

let energy = 100;

let totalStudySeconds = 0;
let sessionSeconds = 0;

let studyTimer = null;
let studying = false;

let currentLocation = "집";
let currentSubject = "";

// ======================
// 캐릭터
// ======================

const characters = {

    "여우": {
        front:"assets/characters/fox_front.png.png",
        study:"assets/characters/fox_study.png.png",
        sleep:"assets/characters/fox_sleep.png.png"
    },

    "원숭이": {
        front:"assets/characters/monkey_front.png.png",
        study:"assets/characters/monkey_study.png.png",
        sleep:"assets/characters/monkey_sleep.png.png"
    },

    "토끼": {
        front:"assets/characters/rabbit_front.png.png",
        study:"assets/characters/rabbit_study.png.png",
        sleep:"assets/characters/rabbit_sleep.png.png"
    },

    "수달": {
        front:"assets/characters/otter_front.png.png",
        study:"assets/characters/otter_study.png.png",
        sleep:"assets/characters/otter_sleep.png.png"
    },

    "오리": {
        front:"assets/characters/duck_front.png.png",
        study:"assets/characters/duck_study.png.png",
        sleep:"assets/characters/duck_sleep.png.png"
    },

    "호랑이": {
        front:"assets/characters/tiger_front.png.png",
        study:"assets/characters/tiger_study.png.png",
        sleep:"assets/characters/tiger_sleep.png.png"
    }
};

// ======================
// 시작
// ======================

function saveStartInfo(){

    age =
    Number(
        document.getElementById("ageInput").value
    );

    goalHours =
    Number(
        document.getElementById("goalHourInput").value
    );

    localStorage.setItem(
        "goalHours",
        goalHours
    );

    document.getElementById(
        "startScreen"
    ).style.display="none";

    document.getElementById(
        "characterScreen"
    ).style.display="block";
}

// ======================
// 캐릭터 선택
// ======================

function selectCharacter(name){

    selectedCharacter = name;

    document.getElementById(
        "characterImage"
    ).src =
    characters[name].front;

    document.getElementById(
        "characterScreen"
    ).style.display="none";

    document.getElementById(
        "gameScreen"
    ).style.display="block";

    document.getElementById(
        "goalText"
    ).innerText =
    "오늘 목표 : " + goalHours + "시간";

    updateUI();

    changeLocation("집");
}

// ======================
// 현재 시간
// ======================

setInterval(()=>{

    const now =
    new Date();

    const current =
    now.toLocaleTimeString("ko-KR");

    const target =
    document.getElementById("currentTime");

    if(target){
        target.innerText=current;
    }

},1000);

// ======================
// 시간 변환
// ======================

function formatTime(seconds){

    const h =
    String(
        Math.floor(seconds/3600)
    ).padStart(2,"0");

    const m =
    String(
        Math.floor(
            (seconds%3600)/60
        )
    ).padStart(2,"0");

    const s =
    String(
        seconds%60
    ).padStart(2,"0");

    return `${h}:${m}:${s}`;
}

// ======================
// UI
// ======================

function updateUI(){

    document.getElementById(
        "coinText"
    ).innerText =
    "코인 : " + coins;

    document.getElementById(
        "levelText"
    ).innerText =
    "레벨 : " + level;

    document.getElementById(
        "expText"
    ).innerText =
    "경험치 : " +
    exp +
    " / " +
    maxExp;

    document.getElementById(
        "expBar"
    ).style.width =
    (exp/maxExp*100)+"%";

    document.getElementById(
        "energyText"
    ).innerText =
    "에너지 : " +
    energy +
    " / 100";

    document.getElementById(
        "energyBar"
    ).style.width =
    energy + "%";

    document.getElementById(
        "totalStudyText"
    ).innerText =
    "총 공부시간 : " +
    formatTime(
        totalStudySeconds
    );
}

// ======================
// 장소 이동
// ======================

function changeLocation(place){

    currentLocation = place;

    document.getElementById(
        "locationText"
    ).innerText =
    "현재 위치 : " + place;

    const bg =
    document.getElementById(
        "backgroundArea"
    );

    if(place==="집"){

        bg.style.backgroundImage =
        "url('assets/backgrounds/home.png.png')";
    }

    if(place==="학교"){

        bg.style.backgroundImage =
        "url('assets/backgrounds/school.png.png')";
    }

    if(place==="도서관"){

        bg.style.backgroundImage =
        "url('assets/backgrounds/library.png.png')";
    }

    if(place==="공원"){

        bg.style.backgroundImage =
        "url('assets/backgrounds/park.png.png')";

        energy += 20;

        if(energy>100){
            energy=100;
        }

        document.getElementById(
            "message"
        ).innerText =
        "🌳 공원에서 휴식했습니다.";

        updateUI();
    }
}

// ======================
// 공부 시작
// ======================

function startStudy(){

    currentSubject =
    document.getElementById(
        "subjectSelect"
    ).value;

    if(currentSubject===""){

        alert(
            "과목을 선택하세요!"
        );

        return;
    }

    if(
        currentLocation==="집" ||
        currentLocation==="공원"
    ){

        alert(
            "학교 또는 도서관에서만 공부할 수 있습니다!"
        );

        return;
    }

    if(energy<=0){

        alert(
            "에너지가 없습니다!"
        );

        return;
    }

    if(studying)return;

    studying=true;

    document.getElementById(
        "characterImage"
    ).src =
    characters[
        selectedCharacter
    ].study;

    studyTimer =
    setInterval(()=>{

        sessionSeconds++;

        totalStudySeconds++;

        document.getElementById(
            "timerText"
        ).innerText =
        formatTime(
            sessionSeconds
        );

        updateUI();

    },1000);
}

// ======================
// 공부 종료
// ======================

function endStudy(){

    if(!studying)return;

    clearInterval(
        studyTimer
    );

    studying=false;

    const hours =
    sessionSeconds / 3600;

    coins +=
    Math.floor(
        hours * 10
    );

    exp +=
    Math.floor(
        hours * 50
    );

    energy -=
    Math.ceil(
        hours * 10
    );

    if(energy<0){
        energy=0;
    }

    while(
        exp>=maxExp
    ){

        exp -= maxExp;

        level++;

        document.getElementById(
            "message"
        ).innerText =
        "🎉 레벨업!";
    }

    sessionSeconds=0;

    document.getElementById(
        "timerText"
    ).innerText =
    "00:00:00";

    document.getElementById(
        "characterImage"
    ).src =
    characters[
        selectedCharacter
    ].front;

    checkGoal();

    saveData();

    updateUI();
}

// ======================
// 잠자기
// ======================

function sleepCharacter(){

    if(
        currentLocation!=="집"
    ){

        alert(
            "집에서만 잠을 잘 수 있습니다!"
        );

        return;
    }

    energy=100;

    document.getElementById(
        "characterImage"
    ).src =
    characters[
        selectedCharacter
    ].sleep;

    updateUI();

    saveData();
}

// ======================
// 목표 달성
// ======================

function checkGoal(){

    const goalSeconds =
    goalHours*3600;

    if(
        totalStudySeconds>=goalSeconds
    ){

        document.getElementById(
            "message"
        ).innerText =
        "🎯 목표 달성!";

    }
}

// ======================
// 일기
// ======================

function openDiary(){

    if(
        currentLocation!=="집"
    ){

        alert(
            "집에서만 일기를 작성할 수 있습니다!"
        );

        return;
    }

    document.getElementById(
        "gameScreen"
    ).style.display="none";

    document.getElementById(
        "diaryScreen"
    ).style.display="block";
}

function closeDiary(){

    document.getElementById(
        "diaryScreen"
    ).style.display="none";

    document.getElementById(
        "gameScreen"
    ).style.display="block";
}

function saveDiary(){

    const diary =
    document.getElementById(
        "diaryInput"
    ).value;

    const diaries =
    JSON.parse(
        localStorage.getItem(
            "diaries"
        )
    ) || [];

    diaries.push({

        date:
        new Date()
        .toLocaleDateString(),

        subject:
        currentSubject,

        studyTime:
        formatTime(
            totalStudySeconds
        ),

        diary
    });

    localStorage.setItem(
        "diaries",
        JSON.stringify(
            diaries
        )
    );

    alert(
        "저장 완료!"
    );
}

function showDiaryList(){

    const diaries =
    JSON.parse(
        localStorage.getItem(
            "diaries"
        )
    ) || [];

    let html="";

    diaries.forEach(item=>{

        html += `
        <div class="diaryItem">
        <h3>${item.date}</h3>
        <p>과목 : ${item.subject}</p>
        <p>공부시간 : ${item.studyTime}</p>
        <p>${item.diary}</p>
        </div>
        `;
    });

    document.getElementById(
        "diaryList"
    ).innerHTML=html;
}

// ======================
// 저장
// ======================

function saveData(){

    localStorage.setItem(
        "coins",
        coins
    );

    localStorage.setItem(
        "energy",
        energy
    );

    localStorage.setItem(
        "level",
        level
    );

    localStorage.setItem(
        "exp",
        exp
    );

    localStorage.setItem(
        "totalStudySeconds",
        totalStudySeconds
    );
}

// ======================
// 불러오기
// ======================

window.onload=function(){

    coins =
    Number(
        localStorage.getItem(
            "coins"
        )
    ) || 0;

    energy =
    Number(
        localStorage.getItem(
            "energy"
        )
    ) || 100;

    level =
    Number(
        localStorage.getItem(
            "level"
        )
    ) || 1;

    exp =
    Number(
        localStorage.getItem(
            "exp"
        )
    ) || 0;

    totalStudySeconds =
    Number(
        localStorage.getItem(
            "totalStudySeconds"
        )
    ) || 0;

    updateUI();
}
