  /**
	*************************************************************
	*	Tool Auto ĐK Học      									*
	*	Author: Nguyen Linh UET									*
	*	Facebook: https://www.facebook.com/kenny.nguyen.153		*
	*	Last Change: 25/12/2018									*
	*************************************************************
   */
   
//Kiểm tra số môn
var monhocArr;
var coursespos = 0;
var loginButton;
var userArea;
var passArea;
var thongBaolbl;
//Chuyển alert vào console giúp xử lí khi alert hiện lên mà không bấm ok thì code không chạy tiếp 
window.alert = function (text){
	console.log('Trạng thái: ' + text);
	if(text.includes("Server đang tải lại dữ liệu"))
		location.reload();
	logMess(text); //ghi log bằng alert label bootstrap
	return true;
};
   
// Overider some function in html DOM//
	
//Khi một môn được chọn thì update danh sách môn đã chọn
function toDKSelectedChange_callback2(data) {
    var resArr = data.value.split("|");
    if (resArr[1] != "")// xet song hanh
	{
        alert(resArr[1]);
    }
    document.getElementById("divKQ").innerHTML = resArr[0];
    document.body.disabled = "";
    document.body.style.cursor = "default";
    isProcessing = false;
	coursespos++;
	alert("Đã chọn môn học thứ " + coursespos);
	try {
		if(coursespos<monhocArr.length){
			fastDKOSB(monhocArr[coursespos]);
		}else{
			if($("#tudongluudk")[0].checked==true)
				LuuDanhSachDangKy();
			else
				alert("Đã chọn tất cả các môn! Bấm lưu đăng kí thật nhanh nào!");
		}
	} catch (err) {};
}

function LuuDanhSachDangKy_HopLe_callback(monHetCho) {
	document.body.style.cursor = 'default';
    var arr = monHetCho.value.split("||");
    if (arr.length == 1) {
            alert(monHetCho.value);
			return false;
    }
    if (arr[0] != "" && arr[0] != null) {
		if (arr[0] == "false") {
            alert(serverBusy);
            return false;
        }
        else {
            document.body.style.cursor = 'default';
            alert(arr[0]);
			if(!arr[0].includes("Ngoài thời gian")){
				alert("Lưu kết quả thành công");
				window.open("Default.aspx?page=xemhocphi","_self");
			}
        }
    }
}

// Bỏ check song hành: check auto đăng kí
function LuuDanhSachDangKy_callback(songhanh) {
    EduSoft.Web.UC.DangKyMonHoc.LuuDanhSachDangKy_HopLe(true, false, LuuDanhSachDangKy_HopLe_callback);
}

//Vì có một số môn không hiện trong TKB nên cho vào trong try để tích các môn đăng kí có trong thời khóa biểu!
function toggleSelectRow(maDK, isSelect) {
	try{
		var chk = document.getElementById("chk_" + maDK);
		chk.checked = isSelect;
		var row = chk.parentNode.parentNode;
		row.style.backgroundColor = (isSelect ? "#CCCCCC" : "White");
	}
	catch(err){
	}
}

//Bỏ check điều kiện đăng kí tự động, kiểm tra môn tiên quyết
function toDKSelectedChange_callback(res) {
    if (res.value == "") {
		window.open("default.aspx?page=dkmonhoc",'_blank');
    } else {
        var isValidCoso = false;
        var isValidTKB = false;

        var resArr = res.value.split("|");
        var maDK = resArr[1];
        if (resArr.length == 2) {
            alert(resArr[0]);
            toggleSelectRow(maDK, false);
            document.body.disabled = "";
            document.body.style.cursor = "default";
            isProcessing = false;
        } else {

            var isChecked = true;
            var oldMaDK = resArr[4];
            var isVuotTC = resArr[5];
            var isVuotTCNganh2 = resArr[34];
            var isMHDangKyCungKhoiSV = resArr[35];
            var MonTQ = resArr[6];
            var MonSH = resArr[7];
            var MonDPH = resArr[8];
            var isTGDK = resArr[28];
            var xetDienDK = resArr[29];
            var chuyenNganh1HopLe = resArr[30];
            var chuyenNganh2HopLe = resArr[31];
            var monHocRangBuocSTC = resArr[32];
            var HopLeSTCDuocPhepThayDoi = resArr[33];
            var hopLeNhomMHTuChon = resArr[36];

            if (resArr[0] == 'dhmxhetx') {
                if (confirm('Môn học học trực tuyến, tiếp tục đăng ký?')) {
                    isValidTKB = true;
                    toggleSelectRow(maDK, isChecked);
                    if (oldMaDK)
                        toggleSelectRow(oldMaDK, false);
                    EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
					
				}
            } else if (chuyenNganh1HopLe == 0) {
                alert(errorChuyenNganhChinh);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (chuyenNganh2HopLe == 0) {
                alert(errorChuyenNganhChuyenSau);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (monHocRangBuocSTC == 0) {
                alert(errorGioiHanSTC + maDK);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (HopLeSTCDuocPhepThayDoi == 0) {
                alert(errorGioiHanSoTCThayDoi);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (hopLeNhomMHTuChon == 0) {
                alert("Không được đăng ký môn học thuộc nhóm tự chọn khác nhóm " + resArr[37].toString());
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (resArr[21] == 1 && resArr[22] == 0) // co phai la mon hoc cai thien, neu cai thien, co phai la mon cai thien hop le 
            {
                var mess = resArr[23] == "0" ? errorCaiThienDiemD : errorCaiThienHocKy + resArr[23];
                alert(mess);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (xetDienDK) {
                alert(xetDienDK);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (MonDPH) //xem co phai la mon duoc phep hoc theo chương trinh dao tao he nganh hoac khoi lop
            {
                alert(MonDPH);
                toggleSelectRow(maDK, false);
                document.body.disabled = "";
                document.body.style.cursor = "default";
                isProcessing = false;
            } else if (resArr[9] == 1) // xet trung thoi khoa bieu
            {
                if (resArr[17] == 1 || resArr[17] == 3) // canh bao khi trung thoi khoa bieu
                {
                    var strAlert;
                    if (resArr[17] == 3) // bao luon ca so tiet bi trung
                    {
                        strAlert = errorMucDoTrungTKB0 + resArr[19] + ", " + resArr[20] + "% " + errorMucDoTrungTKB1;
                    } else {
                        strAlert = trungTKBChoPhep;
                    }
                    if (confirm(strAlert)) {
                        isValidTKB = true;
                        toggleSelectRow(maDK, true);
                        if (oldMaDK)
                            toggleSelectRow(oldMaDK, false);
                        EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
						
					} else {
                        toggleSelectRow(maDK, false);
                        document.body.disabled = "";
                        document.body.style.cursor = "default";
                        isProcessing = false;
                    }
                } else // cam khong cho trung tkb
                {
                    alert(trungTKBKChoPhep);
                    toggleSelectRow(maDK, false);
                    document.body.disabled = "";
                    document.body.style.cursor = "default";
                    isProcessing = false;
                }
            } else if (resArr[10]) // Warning co so
            {
                if (resArr[11]) // Xet khac co so, 0 la chi canh bao
                {
                    if (confirm(resArr[10])) {
                        isValidCoso = true;
                        toggleSelectRow(maDK, true);
                        EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
					
					} else {
                        toggleSelectRow(maDK, false);
                        document.body.disabled = "";
                        document.body.style.cursor = "default";
                        isProcessing = false;
                    }
                } else if (resArr[11] == "1") // 1 la cam dang ky ko cho luu
                {
                    toggleSelectRow(maDK, false);
                    alert(resArr[10]);
                    document.body.disabled = "";
                    document.body.style.cursor = "default";
                    isProcessing = false;
                }
            }
            // edit 26.7.2010
            else if (resArr[24] != "") // trung thoi khoa bieu trong lich thi
            {
                if (resArr[24] == "khongchotrung") {
                    alert(errorTrungLichThiCam);
                    toggleSelectRow(maDK, false);
                    document.body.disabled = "";
                    document.body.style.cursor = "default";
                    isProcessing = false;
                } else if (resArr[24] == "choluachon") {
                    var strAlert = errorTrungLichThiLuaChon;
                    if (confirm(strAlert)) {
                        toggleSelectRow(maDK, true);
                        if (oldMaDK)
                            toggleSelectRow(oldMaDK, false);
                        EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
						
					} else {
                        toggleSelectRow(maDK, false);
                        document.body.disabled = "";
                        document.body.style.cursor = "default";
                        isProcessing = false;
                    }
                } else {

                    alert(errorTrungLichThiVuot + resArr[24]);
                    toggleSelectRow(maDK, false);
                    document.body.disabled = "";
                    document.body.style.cursor = "default";
                    isProcessing = false;
                }
            }else {
                if (resArr[0] == 0) {
                    if (MonSH) {
                        alert(MonSH);
                    }
                    toggleSelectRow(maDK, isChecked);
                    EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
					
				} else {
                    toggleSelectRow(maDK, true);
                    toggleSelectRow(oldMaDK, false);
                    EduSoft.Web.UC.DangKyMonHoc.LuuVaoKetQuaDangKy(isValidCoso, isValidTKB, resArr[1], resArr[12], resArr[13], resArr[14], resArr[15], resArr[16], isChecked.toString(), oldMaDK, resArr[25], resArr[26], resArr[27], isMHDangKyCungKhoiSV, toDKSelectedChange_callback2);
					
				}
            }
        }
    }
}

function toDKSelectedChange(o) {
    document.body.disabled = "false";
    document.getElementById("IDchk_all").checked = false;
    var arr = o.value.split("|");
    EduSoft.Web.UC.DangKyMonHoc.DangKySelectedChange(true, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5],arr[6], arr[7], arr[8], arr[9], arr[10], arr[11], arr[12],toDKSelectedChange_callback);
}

function ShowTatCaTDK_callback(doituongTDK) {
		try{
			document.body.style.cursor = 'default';
			if (doituongTDK == null)
				document.getElementById("divTDK").innerHTML = textKhongMoMH;
			else
				document.getElementById("divTDK").innerHTML = doituongTDK.value;
			var monHocLoc = document.getElementById("txtMaMH1");
			monHocLoc.value = "";
			var txtKhoa = document.getElementById("txtKhoa");
			if (txtKhoa != null)
				txtKhoa.value = "";
			var txtLop = document.getElementById("txtLop");
			if (txtLop != null)
				txtLop.value = "";
			}
		catch(err){
		}
		appendGuiAutoDK(); //Sau khi lọc môn học thì thêm element copy vào #divTDK
}

// End overide some function in html DOM//

function appendGuiAutoDK(){
	try{
		if($("#pnlDSMonhocDK")[0]){
			$("table.title-table")[0].getElementsByTagName("tbody")[0].childNodes[0].getElementsByTagName("td")[0].setAttribute("width","50px");
			if($("#AUTODK")[0]==null){
				$('#pnlDSMonhocDK')['append']('<div style="margin-top: 5px"><div><span class="d-block p-2 bg-success text-white" id="AUTODK" style="font-size:14px;font-weight:bold;">AUTO ĐĂNG KÍ</span></div><div><span style="width:110px;margin-left:5px;font-size:15px">Điền Value môn học:</span></div><div><textarea class="form-control" placeholder="Nhập vào đây value của các môn học, mỗi môn một dòng" style="margin-left:5px; width: 600px; height: 100px; resize: both;font-size:12px" id="subject" rows="4"></textarea></div> <div style="margin-left:5px;margin-top:5px"> <input type="checkbox" id="tudongluudk" checked=""> <label>Tự động lưu kết quả khi chọn xong tất cả các môn</label> </div><div><button type="button" style="margin-left:5px;margin-top:2px" class="btn btn-success btn-sm" data-toggle="tooltip" data-placement="top" title="Bấm để chọn môn nhanh" id="btndangkymon" onclick="coursespos=0;fastDK()">Chọn môn</button><button type="button" style="margin-top:2px;margin-left:2px" class="btn btn-warning btn-sm" data-toggle="tooltip" data-placement="top" title="Bấm để lưu kết quả đăng kí" id="btnluumon" onclick="LuuDanhSachDangKy()">Lưu kết quả</button></div><div style="margin-top:2px;margin-left:5px;font-size:14px">Hướng dẫn: Nhấn nút copy trước môn học cần đăng kí để sao chép value môn học rồi dán vào ô Điền Value môn học mỗi môn một dòng sau đó nhấn chọn môn để tool tự động chọn môn, kiểm tra danh sách môn đã chọn đã cập nhật hết số môn chưa, nếu rồi thì nhấn nút lưu để chọn môn.</div><div><span style="margin-left:5px;font-size:14px">Cần hỗ trợ liên hệ: </span><a style="font-size:14px" href="https://www.facebook.com/kenny.nguyen.153" target="_blank">Nguyễn Linh</a></div><div id="trangthai"></div></div>');	
			}
			if(document.getElementsByClassName("btnCopyValuethis").length==0){
				$('input').each(function() {
					if ($(this).attr('disabled')) {
					$(this).removeAttr('disabled');
					}
				});
				var tableTDK = $("#divTDK")[0];
				var allChBox = tableTDK.querySelectorAll('input[type=checkbox]');
				var i;
				for (i = 0; i < allChBox.length; i++) {
					//Create button copyValue
					var copySelect = document.createElement("input");
					copySelect.setAttribute("onclick","copyValueThis(this)");
					copySelect.setAttribute("class","btn btn-primary btn-sm btnCopyValuethis");
					copySelect.setAttribute("style","margin-top:2px");
					copySelect.setAttribute("type","button");
					copySelect.setAttribute("value","Copy");
					
					//Add button before checkbox
					allChBox[i].parentNode.append(copySelect);
				}
			}
		}
	} catch(err){
	}
}

function logMess(msg){
	try{
		var msgSplit = msg.split(" ");
		$('#trangthai').prepend("<div class=\"alert alert-primary alert-dismissible fade show\" role=\"alert\"><strong>Trạng thái: </strong>"+msg+"<button onclick=\"this.parentElement.remove()\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span> </button> </div>");
	} catch(err){
	}
}

function copyValueThis(object){
	try{
		var textArea = document.createElement("textarea");
		var checkBox = object.parentNode.firstChild;
		textArea.value = checkBox.value;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("Copy");
		textArea.remove();
		alert("Đã copy giá trị môn học");
	}catch(err){
	}
}

function vuotCaptcha(){
	if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_lblquenmk")!=null){ //Vì thi thoảng nó không hiện captcha để nhập mà chỉ hiện element có id này
		if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_txtCaptcha")!=null){ //Nếu nó không hiện captcha thì chuyển hướng sang 1 trang khác ở đây lấy trang dkmonhoc thì sẽ hiện lại
			try{
				var labelCapt = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_lblCapcha");
				document.getElementById("ctl00_ContentPlaceHolder1_ctl00_txtCaptcha").value = labelCapt.innerText;
				var vaoWebsite = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_btnXacNhan");
				vaoWebsite.click();
			}catch(err){
				
			}
		}	
		else{
			window.open("Default.aspx?page=dkmonhoc","_self");
		}
	}
	else if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_lblquenmk")!=null){ //Vì thi thoảng nó không hiện captcha để nhập mà chỉ hiện element có id này
		if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtCaptcha")!=null){ //Nếu nó không hiện captcha thì chuyển hướng sang 1 trang khác ở đây lấy trang dkmonhoc thì sẽ hiện lại
			try{
				var labelCapt = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_lblCapcha");
				document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtCaptcha").value = labelCapt.innerText;
				var vaoWebsite = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnXacNhan");
				vaoWebsite.click();
			}catch(err){
				
			}
		}	
		else{
			window.open("Default.aspx?page=dkmonhoc","_self");
		}
	}
}

function getLoginForm(){
	//Vì id user area và pass area khác nhau ở một số trang nên check id button đăng nhập để điền user và pass
	if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_btnDangNhap")!=null){
		userArea = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_txtTaiKhoa");
		passArea = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_txtMatKhau");
		loginButton = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_btnDangNhap");
	}
	else if(document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap")!=null){
		userArea = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtTaiKhoa");
		passArea = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_txtMatKhau");
		loginButton = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_btnDangNhap");
	}
	if(document.getElementById("ctl00_Header1_Logout1_lbtnLogOut")!=null){
		thongBaolbl = document.getElementById("ctl00_Header1_Logout1_lbtnThongBao");
		buttonLogout = document.getElementById("ctl00_Header1_Logout1_lbtnLogOut");
	}else{
		thongBaolbl = document.getElementById("ctl00_Header1_ucLogout_lbtnThongBao");
		buttonLogout = document.getElementById("ctl00_Header1_ucLogout_lbtnLogOut");
	}
}

function autoLogin(){
	if(loginButton!=null){
		try{
			setTimeout(function(){
				loginButton.removeAttribute("onclick");
				userArea.value = localStorage.getItem("userKey");
				passArea.value = localStorage.getItem("passKey");
				loginButton.click();
			},300);
		}
		catch(err){
		}
	}
}

function fastDK() {
    monhocArr = $('#subject')['val']()['split']('\n');
	var mamonhoc = monhocArr[coursespos].split("|")[1];
	//kiểm tra đã chọn được môn chưa.
	if($("#divKQ")[0].outerHTML.includes(mamonhoc)){
		if(coursespos<monhocArr.length){
			coursespos++;
			alert("Bỏ qua môn thứ " + coursespos);
			fastDK();
		}
		else{
			alert("Bỏ qua môn thứ " + (coursespos+1));
			if($("#tudongluudk")[0].checked==true)
				LuuDanhSachDangKy();
			else
				alert("Đã chọn tất cả các môn! Bấm lưu đăng kí thật nhanh nào!");
		}
	}
	else{
		try {
			fastDKOSB(monhocArr[coursespos]);
		} catch (err) {
			alert('Lỗi khi chọn môn đầu tiên');
		}
	}
}

function fastDKOSB(valueMon) {
	var mamonhoc = monhocArr[coursespos].split("|")[1];
	if($("#divKQ")[0].outerHTML.includes(mamonhoc)){
		if(coursespos<monhocArr.length-1){
			coursespos++;
			alert("Bỏ qua môn thứ " + coursespos);
			fastDK();
		}
		else{
			alert("Bỏ qua môn thứ " + (coursespos+1));
			if($("#tudongluudk")[0].checked==true)
				LuuDanhSachDangKy();
			else
				alert("Đã chọn tất cả các môn! Bấm lưu đăng kí thật nhanh nào!");
		}
	}
	else{
		var arr = valueMon.split("|");
		EduSoft.Web.UC.DangKyMonHoc.DangKySelectedChange(true, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10], arr[11], arr[12], toDKSelectedChange_callback);
	}
}

function showSaveUser(){
	if(thongBaolbl==null){
		if(localStorage.getItem("userKey")==null){
			alert("Bạn chưa lưu tài khoản để thực hiện auto đăng nhập, đăng nhập lần đầu để lưu tài khoản!");
		}
		else{
			autoLogin();
		}
	}
}

function saveUser(){
	if(userArea.value.trim()!=""&&passArea.value.trim()!=""){
		localStorage.setItem("userKey",userArea.value);
		localStorage.setItem("passKey",passArea.value);
		alert("Đã lưu tài khoản và mật khẩu! Chỉ sử dụng được ở cửa sổ này!");
	}else{
		alert("Không được để trống tài khoản và mật khẩu");
	}
}

function resetUser(){
	localStorage.removeItem("userKey");
	localStorage.removeItem("passKey");
}

if(document.title.includes("Failed to load viewstate")){
	window.open("Default.aspx?page=dangnhap","_self");
}

if(window.location.href.includes("efault.aspx?page=delete")){
	resetUser();
	alert("Đã reset!");
	window.open("Default.aspx?page=dkmonhoc","_self");
}
getLoginForm();
showSaveUser();
appendGuiAutoDK();
vuotCaptcha();
try{
	buttonLogout.setAttribute("onclick","resetUser();"); //set Logout action
}
catch(err){
	console.log("Không thể set action cho button logout");
}
try{
	loginButton.setAttribute('onclick', "saveUser();"); // set Login action
}
catch(err){
	console.log("Không thể set action cho button login");
}
