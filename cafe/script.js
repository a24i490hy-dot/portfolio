const stage = document.getElementById('stage');
const light = document.getElementById('light');
let following = false;

function moveLight(x, y) {
  light.style.transform = `translate(${x - 90}px, ${y - 90}px)`;
}

stage.addEventListener('pointermove', e => {
  following = true;
  moveLight(e.clientX, e.clientY);
});
stage.addEventListener('pointerleave', () => { following = false; });

// 触っていない間は光がふわふわ動く
let t = 0;
(function idle() {
  if (!following) {
    t += 0.012;
    moveLight(
      innerWidth / 2 + Math.cos(t) * innerWidth * 0.3,
      innerHeight / 2 + Math.sin(t * 1.3) * innerHeight * 0.25
    );
  }
  requestAnimationFrame(idle);
})();

// タップで弾ませる
document.querySelectorAll('.pill').forEach(pill => {
  const wobble = () => {
    pill.classList.remove('wob');
    void pill.offsetWidth; // アニメーションをリセット
    pill.classList.add('wob');
  };
  pill.addEventListener('pointerdown', wobble);
});

// 時計を動かす
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  document.getElementById('time').textContent = `${hh}:${mm}`;
  document.getElementById('date').textContent =
    `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} · TOKYO`;
}
updateClock();
setInterval(updateClock, 1000); // 1秒ごとに更新

// ===== 紹介文をタイピングのように1文字ずつ出す =====
// 縦書きなので、右の行から順番に、上から下へ文字が打たれていく
const typeText = document.querySelector('.hero2 p');
if (typeText) {
  // ① 文字を1文字ずつ <span> に分けて、最初は全部見えなくしておく
  //    （先に全部並べておくので、打っている途中で文字の位置がずれない）
  const lines = typeText.innerHTML.split(/<br\s*\/?>/i)
    .map(line => line.trim())
    .filter(line => line !== '');
  typeText.innerHTML = lines
    .map(line => [...line].map(ch => `<span class="type-char">${ch}</span>`).join(''))
    .join('<br>');
  const chars = typeText.querySelectorAll('.type-char');

  // ② 1文字ずつ見せていく
  let i = 0;
  function typeNext() {
    if (i >= chars.length) return;              // 全部出たら終わり
    chars.forEach(c => c.classList.remove('now'));
    chars[i].classList.add('show', 'now');       // 今の文字を見せて、カーソルを付ける
    const isLineEnd = chars[i].nextSibling && chars[i].nextSibling.nodeName === 'BR';
    i++;
    setTimeout(typeNext, isLineEnd ? 400 : 70);  // 行の終わりは少し長めに止まる
  }

  // ③ 紹介文が画面に入ってきたら、打ちはじめる
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      typeNext();
      observer.disconnect();                    // 1回だけ動かす
    }
  }, { threshold: 0.3 });
  observer.observe(typeText);
}

