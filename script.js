const typingText = document.querySelector('.typing-text p');
const input = document.querySelector('.input-field');
const time = document.querySelector('.time span b');
const mistakes = document.querySelector('.mistake span');
const wpm = document.querySelector('.wpm span');
const cpm = document.querySelector('.cpm span');
const btn = document.querySelector('button');
const resultScreen = document.querySelector('.result');
const resultWpm = document.querySelector('#result-wpm');
const resultCpm = document.querySelector('#result-cpm');
const resultMistakes = document.querySelector('#result-mistakes');
const restartBtn = document.querySelector('#restart-btn');

let timer;
let maxTime = 15; 
let timeLeft = maxTime;
let charIndex = 0;
let mistake = 0;
let isTyping = false;

function loadParagraph() {
    const paragraphs = [
        "In the digital age, effective communication is paramount. The ability to type swiftly and accurately enhances productivity in various fields. Mastering typing skills can significantly improve one's professional and personal life.",
        "Many individuals underestimate the importance of typing speed. However, it plays a crucial role in meeting deadlines and facilitating collaboration. By investing time in practicing typing, anyone can boost their confidence and efficiency.",
        "Typing is not just about speed; it's also about accuracy. A single mistake can lead to miscommunication and errors in documents. Therefore, focusing on both aspects is essential for effective typing",
        "There are numerous resources available to help individuals improve their typing skills. Online courses, typing games, and practice tests can make the learning process engaging and fun. Consistency in practice is key to achieving proficiency.",
        "Ultimately, becoming a proficient typist opens up new opportunities. Whether for academic purposes or professional tasks, strong typing skills are invaluable. Embrace the journey of learning to type better and watch your productivity soar."
    ];

    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = '';
    for (const char of paragraphs[randomIndex]) {
        typingText.innerHTML += `<span>${char}</span>`;
    }
    typingText.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => input.focus());
    typingText.addEventListener("click", () => input.focus());
}

function initTyping() {
    const char = typingText.querySelectorAll('span');
    const typedChar = input.value.charAt(charIndex);

    if (charIndex < char.length && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTime, 1000);
            isTyping = true;
        }

        if(typedChar) {
            if (char[charIndex].innerText === typedChar) {
                char[charIndex].classList.add('correct');
            } else {
                mistake++;
                char[charIndex].classList.add('incorrect');
            }
            charIndex++;
        }

        if (charIndex < char.length) {
            char[charIndex].classList.add('active');
        }
        
        mistakes.innerText = mistake;
        cpm.innerText = charIndex - mistake;
    }

    if (charIndex >= char.length) {
        clearInterval(timer);
        input.value = '';
        showResult();
    }
}

function initTime() {
    if (timeLeft > 0) {
        timeLeft--;
        time.innerText = timeLeft;

        let wpmVal = Math.round(((charIndex - mistake) / 5) / (maxTime - timeLeft) * 60);
        wpm.innerText = wpmVal;
    } else {
        clearInterval(timer);
        showResult();
    }
}

function showResult() {
    document.querySelector('.content-box').style.display = 'none';
    resultScreen.style.display = 'block';
    resultWpm.innerHTML = `<b>WPM:</b> ${wpm.innerText}`;
    resultCpm.innerHTML = `<b>CPM:</b> ${cpm.innerText}`;
    resultMistakes.innerHTML = `<b>Mistakes:</b> ${mistakes.innerText}`;
}

function reset() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    time.innerText = timeLeft;
    input.value = '';
    charIndex = 0;
    mistake = 0;
    isTyping = false;
    wpm.innerText = 0;
    cpm.innerText = 0;
    mistakes.innerText = 0;
    document.querySelector('.content-box').style.display = 'block';
    resultScreen.style.display = 'none';
}

input.addEventListener("input", initTyping);
btn.addEventListener("click", reset);
restartBtn.addEventListener("click", reset);

loadParagraph();
