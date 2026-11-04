// ===== ページを横にスライドして切り替える =====
// data-slide="left"  … 今の画面が左へ出ていく（次のページへ進む）
// data-slide="right" … 今の画面が右へ出ていく（前のページへ戻る）

document.querySelectorAll('a[data-slide]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();                 // すぐにページが変わらないように止める
    const dir = link.dataset.slide;     // left か right
    sessionStorage.setItem('slideFrom', dir === 'left' ? 'right' : 'left'); // 次のページがどっちから入ってくるか
    document.body.classList.add('slide-out-' + dir);
    setTimeout(() => { location.href = link.href; }, 500); // アニメーションが終わったら移動
  });
});

// ページを開いたとき、横からすべり込んでくる
let from = null;
try { from = sessionStorage.getItem('slideFrom'); sessionStorage.removeItem('slideFrom'); } catch (e) {}
if (from) document.body.classList.add('slide-in-' + from);

// 戻るボタンで戻ってきたとき、出ていった状態のままにならないようにする
addEventListener('pageshow', () => {
  document.body.classList.remove('slide-out-left', 'slide-out-right');
});
