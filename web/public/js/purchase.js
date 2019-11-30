vex.defaultOptions.className = 'vex-theme-default';
$(document).ready(() => {
  $("#paymentForm").on('submit', function(e) {
    console.log("enter register handler");
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
        window.alert('Giao dịch thành công, bạn sẽ được chuyển hướng đến trang quản lý dịch vụ !');
        window.location.replace('/service');
      },
      error: function(error){
        const code = error.responseJSON.error.code;
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
            window.alert('Tên là yêu cầu bắt buộc !');
            break;  
          case 1005:
            window.alert('Tên chủ thẻ là bắt buộc !');
            break;  
          case 1004:
            window.alert('Tên chủ thẻ tối thiểu là 2 ký tự, tối đa 50 ký tự !');
            break; 
          case 1007:
            window.alert('Số điện thoại không hợp lệ !');
            break; 
          case 1006:
            window.alert('Số điện thoại là bắt buộc !');
            break; 
          case 1011:
            window.alert('Số hiệu thẻ phải có 16 chữ số !');
            break; 
          case 1012:
            window.alert('Số hiệu thẻ là bắt buộc !');
            break; 
          case 1013:
            window.alert('CVV phải có 3 chữ số !');
            break; 
          case 1014:
            window.alert('CVV là bắt buộc !');
            break; 
            case 1015:
            window.alert('Thẻ đã hết hạn !');
            break; 
          case 1016:
            window.alert('Thời hạn thẻ là bắt buộc !');
            break; 
        }
      }
    })
  })
});
