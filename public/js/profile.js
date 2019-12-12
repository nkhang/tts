vex.defaultOptions.className = 'vex-theme-default';
$(document).ready(() => {
  $("#infoForm").on('submit', function(e) {
    console.log("enter change info handler");
    e.preventDefault();
    let form = $(this);
    let url = form.attr('action');
    const data = JSON.stringify(form);
    console.log(url);
    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: url,
      data: form.serializeArray(),
      success: function(data) {
        window.alert('Thông tin đã được thay đổi');
        window.location.replace('/profile');
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
          case 1008:
            window.alert('Tên có tối thiểu là 2 ký tự, tối đa 50 ký tự !');
            break;  
          case 1009:
            window.alert('Tên là yêu cầu bắt buộc!');
            break;
          case 1007:
            window.alert('Số điện thoại không hợp lệ !');
            break; 
          case 1006:
            window.alert('Số điện thoại là bắt buộc !');
            break; 
          case 1010:
            window.alert('Email đã tồn tại !');
            break;  
        }
      }
    })
  });

  $("#passForm").on('submit', function(e) {
    console.log("enter change password handler");
    e.preventDefault();
    let form = $(this);
    let url = form.attr('action');
    const data = JSON.stringify(form);
    console.log(url);
    $.ajax({
      type: 'POST',
      crossDomain: true,
      url: url,
      data: form.serializeArray(),
      success: function(data) {
        window.alert('Mật khẩu đã được thay đổi');
        window.location.replace('/profile');
      },
      error: function(error){
        const code =  error.responseJSON.error.code;
        switch(code) {
          case 1005:
            window.alert('Mật khẩu phải lớn hơn 6 ký tự!');
            break;  
          case 1004:
            window.alert('Mật khẩu là bắt buộc !');
            break;
        }
      }
    })
  });
});
