vex.defaultOptions.className = 'vex-theme-default';
$(document).ready(() => {
  $("#forgotForm").on('submit', function(e) {
    console.log("enter forgot handler");
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    const data = JSON.stringify(form);
    console.log(url);
    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: url,
      data: form.serializeArray(),
      success: function(data) {
        window.alert('Chúng tôi đã gửi thông báo đến địa chỉ email. Bạn sẽ được chuyển hướng đến trang đăng nhập !');
        window.location.replace('/login');
      },
      error: function(error){
        const code =  error.responseJSON.error.code;
        switch(code) {
          case 1001:
            window.alert('Email không hợp lệ !');
            break;
          case 1002:
            window.alert('Email là bắt buộc !');
            break;
          case 1010:
            window.alert('Email chưa được đăng ký tài khoản !');
            break;  
        }
    }
    })
  })
});
