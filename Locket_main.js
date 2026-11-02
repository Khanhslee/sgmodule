/***********************************************
 * Locket Gold - Main Response Handler
 * By KhanhLN (Khanhslee)
 * 
 * Mô tả: Xử lý response từ RevenueCat API
 * để inject thông tin subscription Gold.
 * Dùng cho: Shadowrocket / Surge / LanceX
 ***********************************************/

const version = 'V2.0.0';

// ========= App ID Mapping ========= //
// Format: { 'User-Agent keyword': ['entitlement_id', 'subscription_id (optional)'] }
const mapping = {
  'Locket': ['Gold']
};

// ========= Subscription Template (đầy đủ fields) ========= //
const subscriptionTemplate = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-07-28T01:04:18Z",
  purchase_date: "2024-07-28T01:04:17Z",
  store: "app_store",
  product_identifier: "com.locket.Locket.Gold.1y",
  product_plan_identifier: "locket-gold-1y-2999-1w0",
  auto_resume_date: null,
  refunded_at: null,
  original_purchase_date_url: "https://apps.apple.com/account/subscriptions",
  period_type: "normal"
};

// ========= Entitlement Template ========= //
const entitlementTemplate = {
  grace_period_expires_date: null,
  purchase_date: "2024-07-28T01:04:17Z",
  product_identifier: "com.locket.Locket.Gold.1y",
  expires_date: "2099-12-18T01:04:17Z"
};

// ========= Price Info ========= //
const priceInfo = {
  price: 399800,
  currency: "VND"
};

// ========= Main Logic ========= //
try {
  var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || '';
  var obj = JSON.parse($response.body);

  // Thông báo
  obj.Attention = "Locket Gold Activated by Khanhslee! Vui lòng không chia sẻ!";

  // Tạo bản sao để tránh reference issues
  var NMS = JSON.parse(JSON.stringify(subscriptionTemplate));
  var locketGold = JSON.parse(JSON.stringify(entitlementTemplate));

  // Tìm app match từ User-Agent
  const match = Object.keys(mapping).find(key => ua.includes(key));

  if (match) {
    let [entitlementId, subscriptionId] = mapping[match];

    if (subscriptionId) {
      // Nếu có subscription ID riêng
      locketGold.product_identifier = subscriptionId;
      obj.subscriber.subscriptions[subscriptionId] = NMS;
    } else {
      // Dùng default subscription ID
      obj.subscriber.subscriptions["com.locket.Locket.Gold.1y"] = NMS;
    }

    // Set entitlement
    obj.subscriber.entitlements[entitlementId] = locketGold;
  } else {
    // Fallback: set default cho mọi app
    obj.subscriber.subscriptions["com.locket.Locket.Gold.1y"] = NMS;
    obj.subscriber.entitlements["Gold"] = locketGold;
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log("[Locket_main] Error: " + e.message);
  $done({});
}
