/**
 * Google Apps Script - 銷售頁生成器使用者驗證串接
 * 
 * 部署步驟：
 * 1. 開啟您的試算表：https://docs.google.com/spreadsheets/d/1KOLbxQvhTo1wbMWnG_bW5YmhOYNwJ27VsYwy9NiKVkA/edit?gid=86038572#gid=86038572
 * 2. 點選選單的「擴充功能」 > 「Apps Script」。
 * 3. 將下方的程式碼全部貼上到專案編輯器中（覆蓋原有內容）。
 * 4. 點選右上角的「部署」 > 「新增部署」。
 * 5. 選擇類型為「網頁應用程式」（Web App）。
 * 6. 設定「將存取權授與所有人」（Anyone）。
 * 7. 按下「部署」，複製產生的「網頁應用程式 URL」。
 * 8. 將該 URL 貼至前端 App.jsx 的 GAS_WEB_APP_URL 變數中。
 */

function doPost(e) {
  // 設定 CORS 回應標頭，允許跨域請求
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    var name = "";
    var email = "";
    
    // 嘗試解析 JSON 格式 payload
    if (e && e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      name = data.name || data.姓名;
      email = data.email || data.信箱;
    } else if (e && e.parameter) {
      // 嘗試解析 Form URL-encoded 參數
      name = e.parameter.name || e.parameter["姓名 OR 暱稱"];
      email = e.parameter.email || e.parameter["信箱"];
    }

    if (!name || !email) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "姓名或信箱欄位不可為空！" 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }

    // 開啟特定的試算表
    var sheetId = "1KOLbxQvhTo1wbMWnG_bW5YmhOYNwJ27VsYwy9NiKVkA";
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheets()[0]; // 寫入第一個工作表

    // 寫入欄位資料：姓名 OR 暱稱, 信箱
    sheet.appendRow([name, email]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "驗證登錄成功！" 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// 處理 OPTIONS 預檢請求
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

// 處理 GET 請求以供測試
function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script 串接服務運作中！")
    .setMimeType(ContentService.MimeType.TEXT);
}
