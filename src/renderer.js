let count = 0;
async function createText(comment) {
    let div_text = document.createElement('div');
    count++;
    div_text.id = "text" + count; //アニメーション処理で対象の指定に必要なidを設定
    div_text.style.color = 'white'
    div_text.style.fontSize = '40px'
    div_text.style.fontFamily = 'HiraKakuProN-W6, Arial Black'
    div_text.style.position = 'fixed'; //テキストのは位置を絶対位置にするための設定
    div_text.style.textShadow = '2px 0 0 black, 0 2px 0 black, -2px 0 0 black, 0 -2px 0 black'
    div_text.style.whiteSpace = 'nowrap' //画面右端での折り返しがなく、画面外へはみ出すようにする
    div_text.style.left = (document.documentElement.clientWidth) + 'px'; //初期状態の横方向の位置は画面の右端に設定
    const random = Math.round(Math.random() * document.documentElement.clientHeight);
    div_text.style.top = random + 'px';  //初期状態の縦方向の位置は画面の上端から下端の間に設定（ランダムな配置に）
    div_text.appendChild(document.createTextNode(comment)); //画面上に表示されるテキストを設定
    document.body.appendChild(div_text); //body直下へ挿入

    await gsap.to(
        "#" + div_text.id,
        { 
            duration: 7, 
            x: -1 * (document.documentElement.clientWidth + div_text.clientWidth)
        }
    );

    div_text.parentNode.removeChild(div_text); //画面上の移動終了後に削除
}

window.electronAPI.handleCounter((event, value) => {
    createText(value);
    event.sender.send('counter-value', value)
})
