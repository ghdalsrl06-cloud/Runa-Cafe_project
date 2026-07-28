/*
  script.js : 홈페이지에 "동작"을 넣는 파일입니다.
  JavaScript는 클릭, 스크롤 같은 사용자의 행동에 반응하는 기능을 만듭니다.
  지금은 간단한 기능 하나만 넣어뒀어요. 익숙해지면 하나씩 추가해보세요!
*/

// 스크롤을 내리면 상단 메뉴바에 그림자를 진하게 주는 효과
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  // 화면을 50px 이상 내렸는지 확인
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.15)";
  } else {
    navbar.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.08)";
  }
});

// ===== 모바일 햄버거 메뉴 =====
// 작은 화면에서 ☰ 버튼을 누르면 메뉴가 열리고 닫히는 기능
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {
  // classList.toggle : "open" 클래스가 없으면 붙이고, 있으면 뗀다
  // CSS에서 .nav-links.open 일 때만 메뉴가 보이도록 만들어뒀어요
  navLinks.classList.toggle("open");
});

// 메뉴 링크를 누르면 메뉴가 자동으로 닫히게 하기
// (안 닫히면 메뉴가 화면을 계속 가려서 불편해요)
document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

// =========================================================
// 픽업 주문 & 좌석 예약 (데모 버전)
// ---------------------------------------------------------
// GitHub Pages에는 서버가 없어서, 입력한 내용은 방문자의
// 브라우저 저장소(localStorage)에만 기록됩니다.
// localStorage : 브라우저가 제공하는 작은 저장 공간.
//   - localStorage.getItem("이름")  → 저장된 값 꺼내기
//   - localStorage.setItem("이름", 값) → 값 저장하기
//   - 문자열만 저장할 수 있어서 JSON.stringify / JSON.parse 로
//     배열·객체를 문자열로 바꿨다가 되돌려서 사용해요.
// =========================================================

// ----- 1) 장바구니 준비 -----
// 페이지를 새로 열어도 이전에 담아둔 게 남아있도록 localStorage에서 불러옴
const cart = JSON.parse(localStorage.getItem("runa_cart") || "[]");

function saveCart() {
  localStorage.setItem("runa_cart", JSON.stringify(cart));
}

// ----- 2) 모든 메뉴 카드에 "담기" 버튼 자동 생성 -----
// HTML을 일일이 고치지 않고, JS가 카드마다 버튼을 만들어 붙입니다.
document.querySelectorAll(".menu-card").forEach(function (card) {
  const name = card.querySelector("h3").textContent;
  const priceText = card.querySelector(".price").textContent; // 예: "4,000원"
  const price = Number(priceText.replace(/[^0-9]/g, "")); // 숫자만 남김 → 4000

  const btn = document.createElement("button");
  btn.className = "add-btn";
  btn.textContent = "담기";
  btn.addEventListener("click", function () {
    addToCart(name, price);
    // 담겼다는 걸 버튼 글자로 잠깐 알려주기
    btn.textContent = "담았어요 ✓";
    setTimeout(function () {
      btn.textContent = "담기";
    }, 800);
  });
  card.appendChild(btn);
});

// ----- 3) 장바구니에 담기 -----
function addToCart(name, price) {
  // 이미 담긴 메뉴면 수량만 +1, 처음이면 새로 추가
  const found = cart.find(function (item) {
    return item.name === name;
  });
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  saveCart();
  renderCart();
}

// ----- 4) 장바구니 화면 그리기 -----
function renderCart() {
  const list = document.getElementById("cart-list");
  const totalEl = document.getElementById("cart-total");
  list.innerHTML = ""; // 일단 비우고 처음부터 다시 그림

  if (cart.length === 0) {
    list.innerHTML =
      '<li class="cart-empty">아직 담은 메뉴가 없어요. 메뉴에서 "담기"를 눌러보세요!</li>';
    totalEl.textContent = "";
    return;
  }

  let total = 0;
  cart.forEach(function (item, i) {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      "<span>" + item.name + " × " + item.qty + "</span>" +
      "<span>" + (item.price * item.qty).toLocaleString() + "원 " +
      '<button class="qty-btn" data-i="' + i + '" data-d="1">＋</button>' +
      '<button class="qty-btn" data-i="' + i + '" data-d="-1">－</button></span>';
    list.appendChild(li);
  });
  totalEl.textContent = "합계 : " + total.toLocaleString() + "원";

  // ＋/－ 버튼 동작 연결
  list.querySelectorAll(".qty-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      const i = Number(b.dataset.i); // 몇 번째 메뉴인지
      cart[i].qty += Number(b.dataset.d); // +1 또는 -1
      if (cart[i].qty <= 0) {
        cart.splice(i, 1); // 0개가 되면 목록에서 제거
      }
      saveCart();
      renderCart();
    });
  });
}
renderCart(); // 페이지가 열리면 저장돼 있던 장바구니를 바로 보여줌

// ----- 5) 안내 메시지 보여주기 (성공/실패 공용) -----
function showMessage(id, text, isSuccess) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = "form-message " + (isSuccess ? "success" : "error");
  el.hidden = false;
}

// ----- 6) 픽업 주문 접수 -----
document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막음

  if (cart.length === 0) {
    showMessage("order-message", "먼저 메뉴를 담아주세요!", false);
    return;
  }

  const name = document.getElementById("order-name").value;
  const time = document.getElementById("order-time").value;
  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  // 주문 기록을 브라우저에 저장 (데모)
  const orders = JSON.parse(localStorage.getItem("runa_orders") || "[]");
  orders.push({
    name: name,
    phone: document.getElementById("order-phone").value,
    pickupTime: time,
    items: cart.slice(), // 장바구니 내용 복사해서 저장
    total: total,
    orderedAt: new Date().toLocaleString(),
  });
  localStorage.setItem("runa_orders", JSON.stringify(orders));

  // 장바구니 비우고 완료 메시지
  cart.length = 0;
  saveCart();
  renderCart();
  this.reset(); // 입력칸 비우기
  showMessage(
    "order-message",
    name + "님, " + time + " 픽업 주문이 접수되었습니다! 합계 " +
      total.toLocaleString() + "원 (데모)",
    true
  );
});

// ----- 7) 좌석 예약 접수 -----
document.getElementById("reserve-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("reserve-name").value;
  const date = document.getElementById("reserve-date").value;
  const time = document.getElementById("reserve-time").value;
  const people = document.getElementById("reserve-people").value;

  // 예약 기록을 브라우저에 저장 (데모)
  const reservations = JSON.parse(localStorage.getItem("runa_reservations") || "[]");
  reservations.push({
    name: name,
    phone: document.getElementById("reserve-phone").value,
    date: date,
    time: time,
    people: people,
    reservedAt: new Date().toLocaleString(),
  });
  localStorage.setItem("runa_reservations", JSON.stringify(reservations));

  this.reset();
  showMessage(
    "reserve-message",
    name + "님, " + date + " " + time + " " + people + " 예약이 접수되었습니다! (데모)",
    true
  );
});

// 예약 날짜는 오늘 이후만 고를 수 있게 제한
const today = new Date().toISOString().split("T")[0]; // 예: "2026-07-28"
document.getElementById("reserve-date").setAttribute("min", today);

// 콘솔(개발자 도구)에서 확인할 수 있는 환영 메시지
// 브라우저에서 F12 키를 눌러 Console 탭을 열면 아래 문구가 보여요.
console.log("Runa Cafe 홈페이지에 오신 것을 환영합니다! 🌙");
