vex.defaultOptions.className = 'vex-theme-default';
$(document).ready(() => {
  $("#loginForm").on('submit', function(e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    
    $.ajax({
      type: 'POST',
      url: url,
      data: $('form').serialize(),
      success: function(data) {
        const user = data.data;
        // window.user = data;
        window.location.replace('/?fullname=' + user.fullname + '&token=' + user.token + '&email=' + user.email);
      },
      error: function(error){
        const code =  error.responseJSON.error.code;
        switch(code) {
          case 1012:
            window.alert('Email hoặc mật khẩu đã nhập không khớp');
            break;
        }
    }
    })
  })
});
