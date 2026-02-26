const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// rota para a página html (o cliente)
app.get('/', (req, res) => {
    console.log('Cliente acessou a página principal ');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// rota de comunicação assíncrona
app.get('/audio', (req, res) => {
    console.log('Requisição de áudio recebida!');
    const filePath = path.join(__dirname, 'musica.mp3');

    // verifica se o arquivo existe para não dar erro
    if (!fs.existsSync(filePath)) {
        console.log('Arquivo não encontrado!');
        return res.status(404).send('Arquivo de áudio não encontrado!');
    }

    console.log('Criando stream...');
    const stat = fs.statSync(filePath);

    // avisando ao navegador que estamos enviando um audio e o tamanho dele
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
    console.log('Cabeçalhos HTTP enviados, iniciando envio dos chunks...');

    fs.readFileSync(filePath);

    // ler o arquivo em pedaços e envia (pipe) direto pra a resposta (res)
    const readStream = fs.createReadStream(filePath);

    readStream.on('data', (chunk) => {
        console.log('Enviando pedaço do arquivo de tamanho:', chunk.length);
    });
    readStream.on('end', () => {
        console.log('Envio finalizado!');
    });
    readStream.on('error', (err) => {
        console.log('Erro no streaming:', err);
    });
    readStream.pipe(res);

    console.log('Servidor ainda executando após iniciar o pipe!!! :))');
});

// iniciando o servidor
app.listen(3000, () => {
    console.log('Servidor está rodando em http://localhost:3000');
});

