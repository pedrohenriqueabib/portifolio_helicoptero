const start = document.querySelector('.start');
const heroe = document.querySelector('#heroe');
const areaTiro = document.querySelector('.area-tiro');
const barra = document.querySelector('.barra');
let pontuacao = document.querySelector('.pontuacao');

let somDisparo = document.getElementById("somDisparo");
let somExplosao = document.getElementById("somExplosao");
let musica = document.getElementById("musica");
let somGameover = document.getElementById("somGameover");
let somPerdido = document.getElementById("somPerdido");
let somResgate = document.getElementById("somResgate");

let up = 10;
let moving = false;
let disparo = 0;
let atirando = false;
let totalVoador = 0;
let moveApache, disparando, moverTiro, enemy, criarVoador;
let moverInimigo1, terra, confirmarColisao, movingFriend;
let totalAmigos = 0, deadfriend;
let energia = 3, totalPontos = 0;

document.addEventListener('keydown', (e)=>{
    if( e.key == 'ArrowUp' || e.key == 'ArrowDown'){
        moving = e.key;
    }
    if( e.key == ' '){
        atirando = true;
    }
})

document.addEventListener('keyup', (e)=>{
    if( e.key == 'ArrowUp' || e.key == 'ArrowDown'){
        moving = false;
    }
    if( e.key == ' '){
        atirando = false;
    }
})

start.addEventListener('click', ()=>{
    start.style.display = 'none';
    heroe.style.display = 'block';
    barra.style.background = `url("../imgs/energia${energia}.png")`;
    moverApache();
    shoot();
    moveShoot();
    criarInimigo1();
    criarInimigo2();
    moverVoador();
    moverTerrestre();
    criarAmigo();
    moverAmigo();
    morteAmigo();
    colisaoApache();
    clearInterval(tocarMusica);
})

function moverApache(){
    moveApache = setInterval(()=>{            
        if( moving == 'ArrowUp' && up > 10){  
            up -= 10;
            heroe.style.top = up + 'px';
        }
        if( moving == 'ArrowDown' && up < 480){  
            up += 10;
            heroe.style.top = up + 'px';
        }
    }, 20);
}

function shoot(){
    disparando = setInterval(()=>{
        if( atirando == true && disparo < 3){
            let projetil = document.createElement('div');
            projetil.classList.add('shoot');
            projetil.style.top = up + 40 + 'px';
            projetil.style.left = '200px';
            areaTiro.appendChild(projetil);
            disparo++;
            somDisparo.play();
        }
    }, 100);
}

function moveShoot(){
    moverTiro = setInterval( ()=>{ 
        let projeteis = document.querySelectorAll('.shoot');
        if( projeteis){
            projeteis.forEach((projetil)=>{
                let range = parseInt( projetil.style.left) + 25;
                projetil.style.left = range + 'px';
                if( range >= 1300){
                    projetil.remove();
                    disparo--;
                }
            })
        }
    }, 10);
}

function criarInimigo1(){
    enemy = setInterval(()=>{
        if( totalVoador <= 2){            
            let voador = document.createElement('div');
            voador.classList.add('inimigo');
            voador.classList.add('voador');
            let topo = Math.random() *(300-10)+10;
            voador.style.top = topo.toFixed() + 'px';
            voador.style.left = '1090px';
            areaTiro.appendChild(voador);
            totalVoador++;
        }
    }, 2000 );
}

function criarInimigo2(){
    criarVoador = setInterval(()=>{
        let terrestre = document.createElement('div');
        terrestre.style.left = '1190px';
        terrestre.style.top = '475px';
        terrestre.classList.add('inimigo');
        terrestre.classList.add('terrestre');
        areaTiro.appendChild(terrestre);
    }, 10000 );
}

function moverVoador(){
    moverInimigo1 = setInterval(()=>{
        let voadores = document.querySelectorAll('.voador');
        if( voadores){
            voadores.forEach((voador)=>{
                let direcao = parseInt(voador.style.left) - 5;
                voador.style.left = direcao + 'px';
                if( direcao <= 0){
                    totalVoador--;
                    voador.remove();
                }
                colisao();
            })
        }
    }, 10);
}

function moverTerrestre(){
    terra = setInterval(()=>{
        let veiculo = document.querySelector('.terrestre');
        if(veiculo){
            let direcao = parseInt(veiculo.style.left) - 5;
            veiculo.style.left = direcao + 'px';
            if( direcao <= 0){
                veiculo.remove();
            }
            colisao();
        }
    }, 20);
}

function colisaoApache(){
    let apacheCollision = setInterval(()=>{
        let inimigos = document.querySelectorAll('.inimigo');
        if(inimigos){
            inimigos.forEach((inimigo)=>{
                let inimigoTop = parseInt(inimigo.style.top);
                let inimigoLeft = parseInt(inimigo.style.left);
                let apacheTop = parseInt(heroe.style.top);
                let apacheLeft = heroe.style.left;
                if( inimigoLeft <= 100 && up >= (inimigoTop - 60) && up <= (inimigoTop + 60)){
                    inimigo.classList.remove('inimigo');
                    inimigo.classList.add('explosao');
                    somExplosao.play();
                    energia--;
                    nivelEnergia(energia);
                    setTimeout(()=>{
                        inimigo.remove();
                    }, 1000)
                }
            })
        }
    }, 10);
}

function colisao(){    
    let projeteis = document.querySelectorAll('.shoot');
    let inimigos = document.querySelectorAll('.inimigo');
    if( projeteis && inimigos){
        projeteis.forEach((projetil)=>{
            inimigos.forEach((inimigo)=>{
                let cInimigo = parseInt(inimigo.style.left);
                let cProjetil = parseInt( projetil.style.left);
                let topoInimigo = parseInt( inimigo.style.top);
                let topoProjetil = parseInt( projetil.style.top);
                if( cProjetil >= cInimigo && topoProjetil >= topoInimigo && topoProjetil <= (topoInimigo + 50)){
                    if( inimigo.classList.contains('voador')){
                        totalVoador--;
                        inimigo.classList.remove('voador');
                    }else{
                        inimigo.classList.remove('terrestre');
                    }
                    inimigo.classList.add('explosao');
                    projetil.remove();
                    disparo--;
                    somExplosao.play();
                    contagemPontos(50);
                    setTimeout(()=>{
                        inimigo.remove();
                    }, 500);                 
                }
            })
        })
    }
}

function contagemPontos(valor){
    totalPontos += valor;
    pontuacao.innerHTML = totalPontos;
}

function criarAmigo(){
    amigoJogo = setInterval((e)=>{
        if( totalAmigos <= 0){
            let amigo = document.createElement('div');
            amigo.classList.add('amigo');
            amigo.style.left = '10px';
            areaTiro.appendChild(amigo);
            totalAmigos++;
        }
    }, 1000);
}

function moverAmigo(){
    movingFriend = setInterval(()=>{
        let amigo = document.querySelector('.amigo');
        if(amigo){
            let distancia = parseInt(amigo.style.left) + 5;
            amigo.style.left = distancia + 'px';
            if( distancia >= 1325){
                amigo.remove();
                somResgate.play();
                totalAmigos--;
                contagemPontos(100);
            }
        }
    }, 100)
}

function morteAmigo(){
    deadfriend = setInterval(()=>{
        let friend = document.querySelector('.amigo');
        let truck = document.querySelector('.terrestre');
        if( friend && truck){
            if( parseInt(friend.style.left) >= parseInt(truck.style.left)){
                friend.classList.remove('amigo');
                friend.classList.add('amigoMorto');
                somPerdido.play();
                setTimeout(()=>{
                    friend.remove();
                    totalAmigos--;
                }, 900)
            }
        }
    }, 100);
}

function gameOver(){
    areaTiro.remove();
    heroe.remove();
    
    let fim = document.querySelector('.gameOver');
    fim.style.display = 'block';
    fim.innerHTML = `<h1>
                        Game Over
                    </h1>
                    <p>${totalPontos}</p>
                    <p id='restart' onclick='location.reload()'>Voltar ao início</p>`;
    somGameover.play();
}

function nivelEnergia(valor){
    barra.style.background = `url('../imgs/energia${valor}.png')`;
    if( valor == 0){
        gameOver();
    }
}

let tocarMusica = setInterval(()=>{
    musica.play();
}, 10);