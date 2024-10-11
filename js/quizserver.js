// Importando bibliotecas necessárias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Criando uma instância do Express
const app = express();

// Middleware para habilitar CORS e analisar JSON
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
mongoose.connect('mongodb+srv://samuelmarley:samuelmarley753402@cluster0.poglb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado ao MongoDB');
})
.catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Definindo o Schema e o Modelo para Resultados
const resultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    correctAnswers: { type: Number, required: true, min: 0 },
    time: { type: Number, required: true, min: 0 }
});

const Result = mongoose.model('Result', resultSchema);

// Endpoint para salvar os resultados
app.post('/save-results', (req, res) => {
    const { name, correctAnswers, time } = req.body;

    const result = new Result({
        name,
        correctAnswers,
        time
    });

    result.save()
        .then(() => {
            res.json({ message: 'Resultados salvos com sucesso!' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Erro ao salvar os resultados.', error: err });
            console.error('Erro ao salvar resultados:', err);
        });
});

// Endpoint para obter o ranking
app.get('/get-ranking', (req, res) => {
    Result.find().sort({ correctAnswers: -1, time: 1 }).limit(10)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro ao buscar o ranking.' });
            console.error(err);
        });
});

// Iniciando o servidor
const PORT = 3000; // Defina a porta do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
