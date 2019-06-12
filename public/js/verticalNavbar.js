$(document).ready(function () {
  const tokenName = "RRHHtoken";

  const clearToken = document.querySelector("#clearToken")
  if (clearToken) {
    document.querySelector("#btningresar").remove();
    clearToken.addEventListener('click', () => {
      window.localStorage.removeItem(tokenName);
      window.location.href = "/api/auth/login";
    });
  }

  const linkbtns = document.querySelectorAll(".addToken");
  const token = window.localStorage.getItem(tokenName);

  linkbtns.forEach(btn => {
    let url = btn.getAttribute('href');
    btn.setAttribute("href", `${url + "?token=" + token}`);
  });

  const logoutBtn = document.querySelector("#logout");

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      bootbox.confirm("Estas seguro de que desea salir", (result) => {
        if (result) {
          window.localStorage.removeItem('RRHHtoken');
          window.location.href = "/api/auth/login";
        }
      });
    });
  }

  var toggleBtn = $("#menu-toggle");
  var wrapper = $("#wrapper");
  var sidebar = $(".sidebar-nav");

  toggleBtn.click(function (e) {
    e.preventDefault();
    wrapper.toggleClass("menu-hide");
    sidebar.children("li").has('ul').removeClass('active-menu-item');
    sidebar.children("li").has('ul').children("ul").slideUp();
    console.log("ok click")
  });

  sidebar.children('li').has('ul').click(function () {
    var li = $(this);
    var uls = sidebar.children('li').has('ul').find('ul');
    var lis = sidebar.children('li').has('ul');

    if (li.hasClass('active-menu-item')) {
      li.removeClass('active-menu-item');
      li.children('ul').slideUp();
      li.children('a').children('i.icon-right').removeClass('fa-chevron-up').addClass('fa-chevron-down');

    } else {
      uls.slideUp();

      lis.children('a').children('i.icon-right').removeClass('fa-chevron-up').addClass('fa-chevron-down');
      lis.removeClass('active-menu-item');

      li.addClass('active-menu-item');
      li.children('ul').slideDown();
      li.children('a').children('i.icon-right').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }

  });

  sidebar.click(function (e) {
    e.stopPropagation();
  });


});