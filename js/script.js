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

// 콘솔(개발자 도구)에서 확인할 수 있는 환영 메시지
// 브라우저에서 F12 키를 눌러 Console 탭을 열면 아래 문구가 보여요.
console.log("Runa Cafe 홈페이지에 오신 것을 환영합니다! 🌙");
