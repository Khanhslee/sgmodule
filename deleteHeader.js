/***********************************************
 * Locket Gold - Delete/Modify Request Headers
 * By KhanhLN (Khanhslee)
 * 
 * Mô tả: Xóa ETag header trong request tới 
 * RevenueCat API để buộc server trả response 
 * đầy đủ (không cache 304).
 * Dùng cho: Shadowrocket / Surge / LanceX
 ***********************************************/

const version = 'V2.0.0';

/**
 * Set hoặc xóa giá trị header, xử lý cả 
 * trường hợp header key lowercase và original case.
 */
function setHeaderValue(headers, key, value) {
  var lowerKey = key.toLowerCase();
  if (lowerKey in headers) {
    headers[lowerKey] = value;
  } else {
    headers[key] = value;
  }
}

var modifiedHeaders = $request.headers;

// === Xóa ETag để buộc server trả response đầy đủ ===
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");

$done({ headers: modifiedHeaders });
