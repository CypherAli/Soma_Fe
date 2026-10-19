
import { bindContentSource } from "@/lib/content/source";
import type { T3 } from "./homeContent";

/**
 * Nhãn của khu tài khoản (`/cai-dat`).
 *
 * Chỉ đặt ở đây những mục có API thật bên `soma_be`. Nhãn cho chức năng chưa
 * tồn tại còn tệ hơn là không có nhãn: người dùng bấm vào rồi không có gì xảy ra.
 */
export const settingsContent = bindContentSource("data:src/lib/settingsContent.ts#settingsContent", {
  title: { vi: "Tài khoản", en: "Account", zh: "账户" } as T3,
  subtitle: {
    vi: "Hồ sơ, bảo mật và tuỳ chọn hiển thị của bạn trên Soma 3D.",
    en: "Your profile, security and display preferences on Soma 3D.",
    zh: "你在 Soma 3D 的资料、安全与显示偏好。",
  } as T3,
  loading: { vi: "Đang tải…", en: "Loading…", zh: "加载中…" } as T3,
  signInTitle: { vi: "Cần đăng nhập để xem khu này", en: "Sign in to view this area", zh: "需要登录才能查看" } as T3,
  signInBody: {
    vi: "Hồ sơ, tài liệu và tiến độ học đều gắn với tài khoản.",
    en: "Profile, documents and study progress all belong to an account.",
    zh: "资料、文档与学习进度都属于账户。",
  } as T3,
  signInCta: { vi: "Đăng nhập", en: "Sign in", zh: "登录" } as T3,
  save: { vi: "Lưu", en: "Save", zh: "保存" } as T3,
  saving: { vi: "Đang lưu…", en: "Saving…", zh: "保存中…" } as T3,
  saved: { vi: "Đã lưu.", en: "Saved.", zh: "已保存。" } as T3,
  cancel: { vi: "Huỷ", en: "Cancel", zh: "取消" } as T3,

  tabs: {
    profile: { vi: "Hồ sơ", en: "Profile", zh: "资料" } as T3,
    profileNote: { vi: "Tên, ảnh, gói", en: "Name, photo, plan", zh: "姓名、头像、套餐" } as T3,
    security: { vi: "Bảo mật", en: "Security", zh: "安全" } as T3,
    securityNote: { vi: "Mật khẩu, thiết bị", en: "Password, devices", zh: "密码、设备" } as T3,
    connections: { vi: "Kết nối", en: "Connections", zh: "关联" } as T3,
    connectionsNote: { vi: "Google, GitHub, Facebook", en: "Google, GitHub, Facebook", zh: "Google、GitHub、Facebook" } as T3,
    docs: { vi: "Tài liệu", en: "Documents", zh: "文档" } as T3,
    docsNote: { vi: "PDF bạn tải lên", en: "PDFs you uploaded", zh: "你上传的 PDF" } as T3,
    prefs: { vi: "Tuỳ chọn", en: "Preferences", zh: "偏好" } as T3,
    prefsNote: { vi: "Giao diện, ngôn ngữ, dữ liệu", en: "Theme, language, data", zh: "主题、语言、数据" } as T3,
    library: { vi: "Thư viện", en: "Library", zh: "图书馆" } as T3,
  },

  plan: {
    free: { vi: "Gói thường", en: "Free plan", zh: "普通套餐" } as T3,
    pro: { vi: "Gói Pro", en: "Pro plan", zh: "Pro 套餐" } as T3,
    freeShort: { vi: "Thường", en: "Free", zh: "普通" } as T3,
    proShort: { vi: "Pro", en: "Pro", zh: "Pro" } as T3,
    heading: { vi: "Gói tài khoản", en: "Plan", zh: "套餐" } as T3,
    freeBody: {
      vi: "Gói thường dùng được toàn bộ mô hình, quiz và tài liệu cá nhân. Hạn mức hỏi trợ lý SomaBot tính theo ngày.",
      en: "The free plan covers every model, quiz and personal document. SomaBot questions are capped per day.",
      zh: "普通套餐可使用全部模型、测验与个人文档，SomaBot 提问按天限量。",
    } as T3,
    proBody: {
      vi: "Gói Pro sẽ mở hạn mức hỏi trợ lý và các tính năng học sâu hơn. Chưa mở bán — tài khoản của bạn đang ở gói thường.",
      en: "Pro will lift the assistant quota and unlock deeper study features. Not on sale yet — your account is on the free plan.",
      zh: "Pro 将放宽助手额度并解锁更多学习功能。尚未开放购买 — 你的账户目前为普通套餐。",
    } as T3,
    proActive: {
      vi: "Tài khoản đang ở gói Pro.",
      en: "This account is on the Pro plan.",
      zh: "该账户为 Pro 套餐。",
    } as T3,
    soon: { vi: "Sắp có", en: "Coming soon", zh: "即将推出" } as T3,
  },

  profile: {
    heading: { vi: "Hồ sơ", en: "Profile", zh: "资料" } as T3,
    photo: { vi: "Ảnh đại diện", en: "Profile photo", zh: "头像" } as T3,
    photoNote: {
      vi: "PNG, JPEG hoặc WEBP. Ảnh được cắt vuông và thu nhỏ về 256px ngay trên máy bạn.",
      en: "PNG, JPEG or WEBP. Cropped square and resized to 256px in your browser.",
      zh: "支持 PNG、JPEG 或 WEBP，将在浏览器内裁成方形并缩至 256px。",
    } as T3,
    upload: { vi: "Chọn ảnh", en: "Choose photo", zh: "选择图片" } as T3,
    removePhoto: { vi: "Gỡ ảnh", en: "Remove photo", zh: "移除头像" } as T3,
    name: { vi: "Tên hiển thị", en: "Display name", zh: "显示名称" } as T3,
    nameNote: {
      vi: "Tên này hiện trên thanh điều hướng và trong bảng xếp hạng học tập.",
      en: "Shown in the navigation bar and in study rankings.",
      zh: "显示于导航栏与学习榜单。",
    } as T3,
    nameTooShort: { vi: "Tên hiển thị phải có ít nhất 2 ký tự.", en: "Display name needs at least 2 characters.", zh: "显示名称至少 2 个字符。" } as T3,
    email: { vi: "Email", en: "Email", zh: "电子邮件" } as T3,
    emailNote: {
      vi: "Email là định danh đăng nhập, máy chủ chưa cho đổi.",
      en: "Email is the sign-in identity; the server does not allow changing it yet.",
      zh: "邮箱为登录标识，服务器暂不支持更改。",
    } as T3,
    role: { vi: "Vai trò", en: "Role", zh: "角色" } as T3,
    roleUser: { vi: "Người học", en: "Learner", zh: "学习者" } as T3,
    roleStaff: { vi: "Quản trị nội dung", en: "Content staff", zh: "内容管理" } as T3,
    joined: { vi: "Tham gia", en: "Joined", zh: "加入时间" } as T3,
  },

  security: {
    heading: { vi: "Mật khẩu", en: "Password", zh: "密码" } as T3,
    current: { vi: "Mật khẩu hiện tại", en: "Current password", zh: "当前密码" } as T3,
    next: { vi: "Mật khẩu mới", en: "New password", zh: "新密码" } as T3,
    confirm: { vi: "Nhập lại mật khẩu mới", en: "Repeat new password", zh: "再次输入新密码" } as T3,
    rule: { vi: "Ít nhất 8 ký tự.", en: "At least 8 characters.", zh: "至少 8 个字符。" } as T3,
    mismatch: { vi: "Hai lần nhập không khớp.", en: "The two entries do not match.", zh: "两次输入不一致。" } as T3,
    tooShort: { vi: "Mật khẩu mới phải có ít nhất 8 ký tự.", en: "New password must be at least 8 characters.", zh: "新密码至少 8 个字符。" } as T3,
    submit: { vi: "Đổi mật khẩu", en: "Change password", zh: "修改密码" } as T3,
    submitting: { vi: "Đang đổi…", en: "Changing…", zh: "修改中…" } as T3,
    changed: {
      vi: "Đã đổi mật khẩu. Mọi thiết bị khác đã bị đăng xuất.",
      en: "Password changed. Every other device has been signed out.",
      zh: "密码已修改，其他设备均已退出。",
    } as T3,
    noPassword: {
      vi: "Tài khoản này đăng nhập bằng nhà cung cấp bên ngoài nên chưa có mật khẩu. Máy chủ chưa có API đặt mật khẩu lần đầu, hãy tiếp tục đăng nhập bằng liên kết ở mục Kết nối.",
      en: "This account signs in through an external provider and has no password. The server has no API to set a first password yet — keep using the linked provider under Connections.",
      zh: "该账户通过外部服务登录，尚无密码。服务器暂无首次设置密码的接口，请继续使用「关联」中的登录方式。",
    } as T3,
    devicesHeading: { vi: "Thiết bị đang đăng nhập", en: "Signed-in devices", zh: "已登录设备" } as T3,
    devicesNote: {
      vi: "Mỗi lần đăng nhập tạo một phiên sống 30 ngày. Thấy thiết bị lạ thì cắt phiên đó rồi đổi mật khẩu.",
      en: "Each sign-in creates a 30-day session. If a device looks unfamiliar, revoke it and change your password.",
      zh: "每次登录会创建 30 天的会话。若设备陌生，请注销该会话并修改密码。",
    } as T3,
    thisDevice: { vi: "Thiết bị này", en: "This device", zh: "当前设备" } as T3,
    lastSeen: { vi: "Hoạt động", en: "Last active", zh: "最近活动" } as T3,
    since: { vi: "Đăng nhập", en: "Signed in", zh: "登录于" } as T3,
    revoke: { vi: "Cắt phiên", en: "Revoke", zh: "注销" } as T3,
    revokeOthers: { vi: "Cắt mọi phiên khác", en: "Revoke all other sessions", zh: "注销其他所有会话" } as T3,
    revokeOthersAsk: {
      vi: "Cắt mọi phiên khác? Các thiết bị đó sẽ phải đăng nhập lại.",
      en: "Revoke every other session? Those devices will have to sign in again.",
      zh: "注销其他所有会话？这些设备需要重新登录。",
    } as T3,
    revoked: { vi: "Đã cắt phiên.", en: "Session revoked.", zh: "会话已注销。" } as T3,
    onlyOne: { vi: "Chỉ có phiên hiện tại.", en: "Only this session is active.", zh: "仅当前会话在线。" } as T3,
    signOut: { vi: "Đăng xuất khỏi thiết bị này", en: "Sign out of this device", zh: "从此设备退出" } as T3,
  },

  connections: {
    heading: { vi: "Đăng nhập bằng dịch vụ khác", en: "External sign-in", zh: "第三方登录" } as T3,
    note: {
      vi: "Liên kết thêm để đăng nhập nhanh. Soma 3D chỉ đọc tên và email, không đăng gì lên các dịch vụ này.",
      en: "Link an account for faster sign-in. Soma 3D reads only your name and email and never posts anything.",
      zh: "关联后可快速登录。Soma 3D 仅读取姓名与邮箱，不会发布任何内容。",
    } as T3,
    connected: { vi: "Đã liên kết", en: "Connected", zh: "已关联" } as T3,
    notConnected: { vi: "Chưa liên kết", en: "Not connected", zh: "未关联" } as T3,
    connect: { vi: "Liên kết", en: "Connect", zh: "关联" } as T3,
    disconnect: { vi: "Gỡ", en: "Disconnect", zh: "解除" } as T3,
    disconnectAsk: {
      vi: "Gỡ liên kết dịch vụ này khỏi tài khoản?",
      en: "Disconnect this service from your account?",
      zh: "将该服务从账户解除关联？",
    } as T3,
    lastMethod: {
      vi: "Đây là cách đăng nhập duy nhất — đặt mật khẩu hoặc liên kết dịch vụ khác trước khi gỡ.",
      en: "This is your only sign-in method — set a password or link another service first.",
      zh: "这是唯一的登录方式 — 请先设置密码或关联其他服务。",
    } as T3,
    linkedJust: { vi: "Đã liên kết xong.", en: "Connected.", zh: "关联完成。" } as T3,
    passwordMethod: { vi: "Mật khẩu", en: "Password", zh: "密码" } as T3,
    passwordSet: { vi: "Đã đặt", en: "Set", zh: "已设置" } as T3,
    passwordUnset: { vi: "Chưa đặt", en: "Not set", zh: "未设置" } as T3,
  },

  docs: {
    heading: { vi: "Tài liệu đã tải lên", en: "Uploaded documents", zh: "已上传文档" } as T3,
    intro: {
      vi: "PDF bạn tải lên ở trang Trắc nghiệm để dựng bộ đề riêng. Tệp gốc không được giữ lại trên máy chủ, chỉ câu hỏi bóc ra được lưu.",
      en: "PDFs uploaded on the Quiz page to build your own question bank. The server keeps only the extracted questions, not the file.",
      zh: "你在测验页上传、用于生成个人题库的 PDF。服务器只保留提取出的题目，不保存原文件。",
    } as T3,
    empty: { vi: "Chưa có tài liệu nào.", en: "No documents yet.", zh: "还没有文档。" } as T3,
    upload: { vi: "Tải PDF lên ở trang Trắc nghiệm", en: "Upload a PDF on the Quiz page", zh: "在测验页上传 PDF" } as T3,
    colFile: { vi: "Tệp", en: "File", zh: "文件" } as T3,
    colPages: { vi: "Trang", en: "Pages", zh: "页数" } as T3,
    colQuestions: { vi: "Câu hỏi", en: "Questions", zh: "题目" } as T3,
    colStatus: { vi: "Trạng thái", en: "Status", zh: "状态" } as T3,
    approved: { vi: "đã duyệt", en: "approved", zh: "已审核" } as T3,
    ready: { vi: "Sẵn sàng", en: "Ready", zh: "就绪" } as T3,
    processing: { vi: "Đang xử lý", en: "Processing", zh: "处理中" } as T3,
    failed: { vi: "Lỗi", en: "Failed", zh: "失败" } as T3,
    remove: { vi: "Xoá", en: "Delete", zh: "删除" } as T3,
    removeAsk: {
      vi: "Xoá tài liệu này? Mọi câu hỏi sinh ra từ nó cũng mất.",
      en: "Delete this document? Every question generated from it is removed too.",
      zh: "删除该文档？由它生成的题目也会一并删除。",
    } as T3,
  },

  prefs: {
    themeHeading: { vi: "Giao diện", en: "Appearance", zh: "外观" } as T3,
    themeNote: { vi: "Lưu trên trình duyệt này.", en: "Saved in this browser.", zh: "保存在此浏览器。" } as T3,
    light: { vi: "Sáng", en: "Light", zh: "浅色" } as T3,
    dark: { vi: "Tối", en: "Dark", zh: "深色" } as T3,
    langHeading: { vi: "Ngôn ngữ", en: "Language", zh: "语言" } as T3,
    langNote: {
      vi: "Đổi cả đường dẫn trang (ví dụ /vi/quiz → /en/quiz).",
      en: "Also changes the page URL (e.g. /vi/quiz → /en/quiz).",
      zh: "同时改变页面路径（例如 /vi/quiz → /en/quiz）。",
    } as T3,
    dataHeading: { vi: "Dữ liệu học tập", en: "Study data", zh: "学习数据" } as T3,
    clearPath: { vi: "Xoá lộ trình ôn tập", en: "Delete study path", zh: "删除复习路径" } as T3,
    clearPathNote: {
      vi: "Xoá kế hoạch ôn đang lưu. Lịch sử làm bài và điểm số giữ nguyên.",
      en: "Removes the saved study plan. Attempt history and scores are kept.",
      zh: "删除已保存的复习计划，答题记录与成绩保留。",
    } as T3,
    clearPathAsk: { vi: "Xoá lộ trình ôn tập đang lưu?", en: "Delete the saved study path?", zh: "删除已保存的复习路径？" } as T3,
    clearChat: { vi: "Xoá hội thoại với SomaBot", en: "Clear SomaBot conversation", zh: "清除 SomaBot 对话" } as T3,
    clearChatNote: {
      vi: "Xoá lịch sử trò chuyện ở cả máy chủ lẫn trình duyệt này.",
      en: "Deletes the chat history on the server and in this browser.",
      zh: "同时删除服务器与本浏览器中的聊天记录。",
    } as T3,
    clearChatAsk: { vi: "Xoá toàn bộ hội thoại với SomaBot?", en: "Clear the whole SomaBot conversation?", zh: "清除全部 SomaBot 对话？" } as T3,
    done: { vi: "Đã xoá.", en: "Deleted.", zh: "已删除。" } as T3,
  },
});
