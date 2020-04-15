const hgt = window.innerHeight;
const wdt = window.innerWidth;
const pieces = ['king', 'queen', 'bishop', 'knight', 'rook', 'pawn'];
const w_pieces = [new Image(), new Image(), new Image(), new Image, new Image(), new Image()];
const b_pieces = [new Image(), new Image(), new Image(), new Image, new Image(), new Image()];
const p_order = [4, 3, 2, 1, 0, 2, 3, 4];
const empty = new Image();
const row = document.createElement('div');
const col = document.createElement('div');
const mov = document.createElement('div');
const cap = document.createElement('div');
row.setAttribute('class', 'row');
col.setAttribute('class', 'col');
mov.setAttribute('class', 'hlt_mov');
cap.setAttribute('class', 'hlt_cap');

let blocks, images, players = [];

empty.src = './assets/empty.png';
for(let i = 0;i != 6; i++) {
    w_pieces[i].src = `./assets/${pieces[i]}_w.png`;
    b_pieces[i].src = `./assets/${pieces[i]}_b.png`;
}

const exists = (i, j) => {
    if(i < 0 || j < 0 || i > 7 || j > 7)
        return false;
    return true;
}

const isEmpty = (i, j) => {
    let piece = blocks[i].children[j].children[2].src.match(/\/(assets)\/.*/gi)[0].replace(/(\/assets\/)|(.png)/g, '');
    if(piece === 'empty')
        return true;
    return false;
}

const p_color = (i, j) => {
    let piece = blocks[i].children[j].children[2].src.match(/\/(assets)\/.*/gi)[0].replace(/(\/assets\/)|(.png)/g, '');
    let color = piece.match(/_[wb]/g)[0];
    return color;
};

const rotate = turn => {
    if(turn == 1) {
        document.querySelector('.table').style.transform = 'rotateZ(180deg)';
        for(let p of images) p.style.transform = 'rotateZ(180deg)';
    }
    else {
        document.querySelector('.table').style.transform = 'rotateZ(0deg)';
        for(let p of images) p.style.transform = 'rotateZ(0deg)';
    }
};

const BeginGame = () => {
    let movs = [], caps = [], currPiece = [], turn = 0, ended = false;
    
    const updateTracks = () => {
        for(let i of movs)
            blocks[i[0]].children[i[1]].children[0].style.visibility = 'visible';
        for(let i of caps)
            blocks[i[0]].children[i[1]].children[1].style.visibility = 'visible';
    };

    const clearTracks = () => {
        for(let i of movs)
            blocks[i[0]].children[i[1]].children[0].style.visibility = 'hidden';
        for(let i of caps)
            blocks[i[0]].children[i[1]].children[1].style.visibility = 'hidden';
        movs = [];
        caps = [];
    };

    for(let i = 0;i != 8; i++) {
        let rowI = blocks[i];
        for(let j = 0;j != 8; j++) {
            let colI = rowI.children[j];
            colI.addEventListener('click', () => {
                if(ended) return;
                if(colI.children[0].style.visibility == 'visible') {
                    colI.children[2].src = blocks[currPiece[0]].children[currPiece[1]].children[2].src;
                    blocks[currPiece[0]].children[currPiece[1]].children[2].src = empty.src;
                    clearTracks();
                    turn = (turn+1)%2;
                    rotate(turn);
                    return;
                }
                if(colI.children[1].style.visibility == 'visible') {
                    if(colI.children[2].src.match(/\/(assets)\/.*/gi)[0].replace(/(\/assets\/)|(.png)/g, '').replace(/_[wb]/g, '') == 'king')
                        ended = true;
                    colI.children[2].src = blocks[currPiece[0]].children[currPiece[1]].children[2].src;
                    blocks[currPiece[0]].children[currPiece[1]].children[2].src = empty.src;
                    clearTracks();
                    if(ended) alert(`PLayer ${turn+1} won the game`);
                    turn = (turn+1)%2;
                    rotate(turn);
                    return;
                }
                let piece = colI.children[2].src.match(/\/(assets)\/.*/gi)[0].replace(/(\/assets\/)|(.png)/g, '');
                let type = piece.replace(/(_w)|(_b)/g, '');
                clearTracks();
                currPiece = [i, j];
                if(piece === 'empty')
                    return;
                let color = piece.match(/_[wb]/g)[0];
                if((turn == 1 && color == '_w') || (turn == 0 && color == '_b')) return;
                if(type === 'pawn') {
                    if(color === '_w') {
                        if(exists(i-1, j-1) && !isEmpty(i-1, j-1) && p_color(i-1, j-1) == '_b') caps.push([i-1, j-1]);
                        if(exists(i-1, j+1) && !isEmpty(i-1, j+1) && p_color(i-1, j+1) == '_b') caps.push([i-1, j+1]);
                        if(exists(i-1, j) && isEmpty(i-1, j)) {
                            movs.push([i-1, j]);
                            if(i === 6 && exists(i-2, j)) movs.push([i-2, j]);
                        }
                    }
                    if(color === '_b') {
                        if(exists(i+1, j-1) && !isEmpty(i+1, j-1) && p_color(i+1, j-1) == '_w') caps.push([i+1, j-1]);
                        if(exists(i+1, j+1) && !isEmpty(i+1, j+1) && p_color(i+1, j+1) == '_w') caps.push([i+1, j+1]);
                        if(exists(i+1, j) && isEmpty(i+1, j)) {
                            movs.push([i+1, j]);
                            if(i === 1 && exists(i+2, j)) movs.push([i+2, j]);
                        }
                    }
                }
                else if(type === 'rook') {
                    for(let s of [-1, 1]) {
                        for(let p_i = i+s;p_i < 8 && p_i >= 0; p_i += s) {
                            if(!isEmpty(p_i, j)) {
                                if(p_color(p_i, j) != color) caps.push([p_i, j]);
                                break;
                            }
                            movs.push([p_i, j]);
                        }
                        for(let p_j = j+s;p_j < 8 && p_j >= 0; p_j += s) {
                            if(!isEmpty(i, p_j)) {
                                if(p_color(i, p_j) != color) caps.push([i, p_j]);
                                break;
                            }
                            movs.push([i, p_j]);
                        }
                    }
                }
                else if(type === 'knight') {
                    for(let p_i = 1;p_i != 3; p_i++) {
                        for(let s of [-1, 1]) {
                            let p_j = 3-p_i;
                            if(exists(i+p_i, j+s*p_j)) {
                                if(isEmpty(i+p_i, j+s*p_j)) movs.push([i+p_i, j+s*p_j]);
                                else if(p_color(i+p_i, j+s*p_j) != color) caps.push([i+p_i, j+s*p_j]);
                            }
                            if(exists(i-p_i, j+s*p_j)) {
                                if(isEmpty(i-p_i, j+s*p_j)) movs.push([i-p_i, j+s*p_j]);
                                else if(p_color(i-p_i, j+s*p_j) != color) caps.push([i-p_i, j+s*p_j]);
                            }
                        }
                    }
                }
                else if(type === 'bishop') {
                    for(let s of [-1, 1]) {
                        for(let p_i = i+s, p_j = j+s; (p_i < 8 && p_i >= 0) && (p_j < 8 && p_j >= 0); p_i+=s, p_j+=s) {
                            if(!isEmpty(p_i, p_j)) {
                                if(p_color(p_i, p_j) != color) caps.push([p_i, p_j]);
                                break;
                            }
                            movs.push([p_i, p_j]);
                        }
                        for(let p_i = i+s, p_j = j-s; (p_i < 8 && p_i >= 0) && (p_j < 8 && p_j >= 0); p_i+=s, p_j-=s) {
                            if(!isEmpty(p_i, p_j)) {
                                if(p_color(p_i, p_j) != color) caps.push([p_i, p_j]);
                                break;
                            }
                            movs.push([p_i, p_j]);
                        }
                    }
                }
                else if(type === 'queen') {
                    for(let s of [-1, 1]) {
                        for(let p_i = i+s, p_j = j+s; (p_i < 8 && p_i >= 0) && (p_j < 8 && p_j >= 0); p_i+=s, p_j+=s) {
                            if(!isEmpty(p_i, p_j)) {
                                if(p_color(p_i, p_j) != color) caps.push([p_i, p_j]);
                                break;
                            }
                            movs.push([p_i, p_j]);
                        }
                        for(let p_i = i+s, p_j = j-s; (p_i < 8 && p_i >= 0) && (p_j < 8 && p_j >= 0); p_i+=s, p_j-=s) {
                            if(!isEmpty(p_i, p_j)) {
                                if(p_color(p_i, p_j) != color) caps.push([p_i, p_j]);
                                break;
                            }
                            movs.push([p_i, p_j]);
                        }
                        for(let p_i = i+s;p_i < 8 && p_i >= 0; p_i += s) {
                            if(!isEmpty(p_i, j)) {
                                if(p_color(p_i, j) != color) caps.push([p_i, j]);
                                break;
                            }
                            movs.push([p_i, j]);
                        }
                        for(let p_j = j+s;p_j < 8 && p_j >= 0; p_j += s) {
                            if(!isEmpty(i, p_j)) {
                                if(p_color(i, p_j) != color) caps.push([i, p_j]);
                                break;
                            }
                            movs.push([i, p_j]);
                        }
                    }
                }
                else if(type === 'king') {
                    let positions = [[i-1, j-1], [i+1, j+1], [i-1, j+1], [i+1, j-1], [i-1, j], [i, j-1], [i+1, j], [i, j+1]];
                    for(let p of positions) {
                        if(!exists(p[0], p[1])) continue;
                        if(!isEmpty(p[0], p[1])) {
                            if(p_color(p[0], p[1]) != color) caps.push([p[0], p[1]]);
                            continue;
                        }
                        movs.push([p[0], p[1]]);
                    }                  
                }
                updateTracks();
            });
        }
    }
}

window.onload = () => {
    let colWidth = (hgt < wdt)?hgt:wdt;
    colWidth /= 8;
    colWidth -= 4;
    let table = document.querySelector('.table');
    table.style.left = `calc( 50% - ${(colWidth*8+4)/2}px )`;
    for(let i = 0;i != 8; i++) {
        let rowI = row.cloneNode();
        for(let j = 0;j != 8; j++) {
            let colI = col.cloneNode();
            let imgI;
            colI.appendChild(mov.cloneNode());
            colI.appendChild(cap.cloneNode());
            if(i == 6) imgI = w_pieces[5].cloneNode();
            else if(i == 1) imgI = b_pieces[5].cloneNode();
            else if(i == 0) imgI = b_pieces[p_order[j]].cloneNode();
            else if(i == 7) imgI = w_pieces[p_order[j]].cloneNode();
            else imgI = empty.cloneNode();
            imgI.setAttribute('class', 'pieces');
            colI.style.height = `${colWidth}px`;
            colI.style.width = `${colWidth}px`;
            colI.appendChild(imgI);
            if((i+j)%2 == 0)
                colI.style.backgroundColor = '#fff'
            rowI.appendChild(colI);
        }
        table.appendChild(rowI);
    }
    blocks = document.querySelectorAll('.row');
    images = document.querySelectorAll('.pieces');
    BeginGame();
};
