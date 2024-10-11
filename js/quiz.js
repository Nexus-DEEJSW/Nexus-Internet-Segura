const questions = [
    { question: "O que é phishing?", answers: ["Roubo de dados", "Spam", "Anúncio", "Propaganda"], correct: 0 },
    { question: "O que fazer se alguém pedir seus dados pessoais?", answers: ["Compartilhar", "Ignorar", "Bloquear e denunciar", "Responder educadamente"], correct: 2 },
    { question: "Qual é o risco de usar redes Wi-Fi públicas?", answers: ["Intercepção de dados", "Melhorar a conexão", "Aumentar a privacidade", "Aumentar a velocidade"], correct: 0 },
    { question: "Como proteger sua identidade online?", answers: ["Usar senhas fracas", "Não compartilhar informações pessoais", "Evitar autenticação em duas etapas", "Confiar em todos os sites"], correct: 1 },
    { question: "O que pode acontecer com seus dados pessoais?", answers: ["Eles podem ser vendidos", "Eles são sempre seguros", "Nunca são coletados", "Eles são excluídos automaticamente"], correct: 0 },
    { question: "Qual é uma prática recomendada para criar senhas?", answers: ["Usar combinações de letras e números", "Usar a mesma senha para todos os sites", "Usar datas de nascimento", "Evitar senhas longas"], correct: 0 },
    { question: "O que deve ser feito se você receber um e-mail suspeito?", answers: ["Abrir e clicar em todos os links", "Excluir imediatamente", "Responder ao remetente", "Reportar como spam"], correct: 1 },
    { question: "O que é cyberbullying?", answers: ["Apoio emocional online", "Ameaças e assédio na internet", "Promoção de eventos", "Jogar jogos online"], correct: 1 },
    { question: "Qual é a melhor maneira de proteger suas contas?", answers: ["Usar autenticação em duas etapas", "Compartilhar senhas com amigos", "Escrever senhas em um papel", "Nunca alterar senhas"], correct: 0 },
    { question: "O que é grooming?", answers: ["Um tipo de jogo online", "Manipulação de jovens por adultos mal-intencionados", "Um programa de segurança", "Um aplicativo de mensagens"], correct: 1 },
    { question: "Como a desinformação pode afetar você?", answers: ["Promovendo conhecimento", "Causando pânico e confusão", "Melhorando a segurança", "Aumentando a comunicação"], correct: 1 },
    { question: "O que é um vírus de computador?", answers: ["Um programa que melhora o desempenho", "Um software malicioso que danifica dados", "Um aplicativo útil", "Um tipo de rede social"], correct: 1 },
    { question: "Como você deve reagir a um caso de cyberbullying?", answers: ["Ignorar e não contar a ninguém", "Contar a um adulto ou denunciar", "Responder com raiva", "Aumentar o comportamento agressivo"], correct: 1 },
    { question: "Qual é uma boa prática para gerenciar suas senhas?", answers: ["Alterar as senhas regularmente", "Usar senhas simples", "Reutilizar senhas", "Esquecer senhas antigas"], correct: 0 },
    { question: "Por que é importante proteger suas informações em redes sociais?", answers: ["Para evitar fraudes e assédio", "Porque todos estão seguros", "Para ganhar mais seguidores", "Para compartilhar mais dados"], correct: 0 },
];


let currentQuestion = 0;
let correctAnswers = 0;
let startTime = Date.now();
let timeLeft = 15;
let timerInterval;
let ranking = [];

function showRules() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('rules-screen').style.display = 'block';
}

function startQuiz() {
    document.getElementById('rules-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
    startTimer();
}

function showQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById('question').textContent = questions[currentQuestion].question;
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach((button, index) => {
            button.textContent = questions[currentQuestion].answers[index];
            button.disabled = false;  // Permitir clicar
        });
        timeLeft = 15;
        document.getElementById('time').textContent = timeLeft;
    } else {
        endQuiz();
    }
}

function selectAnswer(index) {
    if (index === questions[currentQuestion].correct) {
        correctAnswers++;
    }
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(button => button.disabled = true);  // Desabilitar respostas após seleção
    currentQuestion++;
    clearInterval(timerInterval);  // Parar temporizador da pergunta
    setTimeout(showQuestion, 1000);  // Esperar 1 segundo antes de ir para a próxima pergunta
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            selectAnswer(-1);  // Se o tempo acabar, passa para a próxima pergunta
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('timer').textContent = `Tempo: ${totalTime} segundos | Acertos: ${correctAnswers}`;
    document.getElementById('final-section').style.display = 'block';
}

function saveResults() {
    const name = document.getElementById('name').value;
    const totalTime = Math.floor((Date.now() - startTime) / 1000);

    const result = {
        name: name,
        correctAnswers: correctAnswers,
        time: totalTime
    };

    console.log('Resultados a serem salvos:', result); // Adicionei esta linha

    // Enviar resultados para o backend
    fetch('http://localhost:3000/save-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Resultados salvos com sucesso!') {
            alert(data.message);  // Exibir mensagem de sucesso
            goBack();  // Voltar para a tela inicial após salvar os resultados
        } else {
            alert('Erro ao salvar os resultados');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar resultados:', error);
    });
}

function showRank() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('rules-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('rank-screen').style.display = 'block';

    // Buscar o ranking no backend
    fetch('http://localhost:3000/get-ranking')
        .then(response => response.json())
        .then(ranking => {
            const rankList = document.getElementById('rank-list');
            rankList.innerHTML = '';  // Limpar lista antes de adicionar os resultados

            ranking.forEach((result, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${result.name} - Acertos: ${result.correctAnswers}, Tempo: ${result.time}s`;
                rankList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar o ranking:', error);
        });
}

function goBack() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('rules-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('rank-screen').style.display = 'none';
}
