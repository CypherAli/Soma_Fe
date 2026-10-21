import { bindContentSource } from "@/lib/content/source";
import type { T3 } from "@/lib/homeContent";

export type InformationGroup = "gioi-thieu" | "ho-tro" | "chinh-sach";
export type InformationSection = {
  title: T3;
  paragraphs: T3[];
  links?: { label: T3; href: string; external?: boolean }[];
};
export type InformationPage = {
  group: InformationGroup;
  title: T3;
  intro: T3;
  sections: InformationSection[];
};

export const informationGroups: Record<InformationGroup, T3> = {
  "gioi-thieu": { vi: "Giới thiệu", en: "About Soma", zh: "关于 Soma" },
  "ho-tro": { vi: "Hỗ trợ & hướng dẫn", en: "Help & guides", zh: "帮助与指南" },
  "chinh-sach": { vi: "Chính sách", en: "Policies", zh: "政策" },
};

export const informationPages: Record<string, InformationPage> = bindContentSource("data:src/lib/informationPages.ts#informationPages", {
  "ve-soma-atlas": {
    group: "gioi-thieu",
    title: { vi: "Về Soma Atlas", en: "About Soma Atlas", zh: "关于 Soma Atlas" },
    intro: {
      vi: "Một thư viện giải phẫu số để quan sát cấu trúc, hiểu mối liên hệ và học bằng chính thao tác khám phá.",
      en: "A digital anatomy library for observing structures, understanding relationships and learning through exploration.",
      zh: "通过观察结构、理解相互关系与亲手探索来学习的数字解剖资料库。",
    },
    sections: [
      {
        title: { vi: "Từ hình ảnh phẳng đến không gian ba chiều", en: "From flat images to three dimensions", zh: "从平面图像到三维空间" },
        paragraphs: [{
          vi: "Soma Atlas là đồ án tốt nghiệp về nền tảng học giải phẫu tương tác. Người học có thể xoay, phóng to, chọn cấu trúc và quan sát từng lớp để hình dung vị trí, hình dạng và tương quan giữa các cơ quan.",
          en: "Soma Atlas is a graduation project focused on interactive anatomy learning. Learners can rotate, zoom, select structures and inspect layers to understand the position, shape and relationships of organs.",
          zh: "Soma Atlas 是一个交互式解剖学习平台毕业设计。学习者可旋转、缩放、选择结构并逐层观察，理解器官的位置、形态及毗邻关系。",
        }],
      },
      {
        title: { vi: "Một nơi để quan sát, tra cứu và ôn tập", en: "Observe, look up and revise", zh: "观察、检索与复习" },
        paragraphs: [{
          vi: "Atlas người được tổ chức theo hệ cơ quan, vùng cơ thể và từng bài mô hình. Bên cạnh mô hình 3D là kho tài liệu y khoa, trắc nghiệm, giải phẫu so sánh và trợ lý Soma có liên kết tới nội dung tham khảo. Điều khiển cử chỉ giúp khám phá mô hình bằng webcam trên thiết bị hỗ trợ.",
          en: "Human anatomy is organised by system, region and individual model lesson. The 3D library is accompanied by medical documents, quizzes, comparative anatomy and a Soma assistant with reference links. Gesture control supports model exploration using a compatible webcam and device.",
          zh: "人体图谱按器官系统、身体区域与模型课程组织，同时提供医学资料、测验、比较解剖及附参考链接的 Soma 助手。兼容设备还可通过摄像头手势操作模型。",
        }],
        links: [
          { label: { vi: "Khám phá atlas người", en: "Explore human anatomy", zh: "探索人体解剖" }, href: "/nguoi" },
          { label: { vi: "Học tập & trắc nghiệm", en: "Learning & quizzes", zh: "学习与测验" }, href: "/quiz" },
        ],
      },
      {
        title: { vi: "Dành cho người học y khoa và thú y", en: "For medical and veterinary learners", zh: "面向医学与兽医学习者" },
        paragraphs: [{
          vi: "Soma hướng đến sinh viên y khoa, người học thú y và người cần ôn lại kiến thức giải phẫu. Mô hình là phương tiện hỗ trợ học tập; hãy đối chiếu với giáo trình và nguồn gốc dữ liệu. Nội dung trên nền tảng không thay thế chẩn đoán hay chỉ định điều trị.",
          en: "Soma is intended for medical students, veterinary learners and anyone revising anatomy. Models support learning and should be checked against textbooks and source data. Platform content does not replace clinical diagnosis or treatment decisions.",
          zh: "Soma 面向医学生、兽医学习者及需要复习解剖的人群。模型辅助学习，应结合教材及源数据核对；平台内容不能替代临床诊断或治疗决定。",
        }],
      },
      {
        title: { vi: "Cùng hoàn thiện thư viện", en: "Help improve the library", zh: "共同完善资料库" },
        paragraphs: [{
          vi: "Nếu phát hiện nhãn chưa đúng, thiếu cấu trúc hoặc liên kết không hoạt động, hãy gửi tên mô hình, đường dẫn và mô tả vấn đề tới trinhviethoangawm@gmail.com. Những phần chưa có dữ liệu cần được ghi rõ thay vì dựng thêm cấu trúc không có căn cứ.",
          en: "Report incorrect labels, missing structures or broken links to trinhviethoangawm@gmail.com, including the model name, URL and a description. Missing source data should be stated explicitly instead of filling gaps with unsupported structures.",
          zh: "发现标注错误、结构缺失或链接失效时，请将模型名称、网址及问题描述发送至 trinhviethoangawm@gmail.com。缺少源数据时应明确说明，不能凭空补造结构。",
        }],
      },
    ],
  },
  "su-menh-nguon-goc": {
    group: "gioi-thieu",
    title: { vi: "Sứ mệnh & nguồn gốc", en: "Mission & origins", zh: "使命与缘起" },
    intro: { vi: "Giúp kiến thức giải phẫu dễ tiếp cận hơn bằng quan sát trực tiếp và học liệu có thể kiểm chứng.", en: "Make anatomy more accessible through direct observation and verifiable learning material.", zh: "通过直观观察与可核查的学习资料，让解剖知识更易获取。" },
    sections: [
      {
        title: { vi: "Bắt đầu từ nhu cầu học giải phẫu", en: "Built around anatomy learning", zh: "从解剖学习需求出发" },
        paragraphs: [{ vi: "Một hình vẽ thường chỉ cho thấy một góc nhìn. Soma Atlas được phát triển trong khuôn khổ đồ án tốt nghiệp để người học chủ động thay đổi góc quan sát, tách lớp và nối kiến thức trong giáo trình với cấu trúc trong không gian.", en: "A drawing usually shows one viewpoint. Soma Atlas was developed as a graduation project so learners can change their viewpoint, inspect layers and connect textbook knowledge with spatial structures.", zh: "一幅图通常只展示一个视角。Soma Atlas 作为毕业设计开发，让学习者自主改变视角、观察分层，将教材知识与空间结构联系起来。" }],
      },
      {
        title: { vi: "Ba nguyên tắc xây dựng", en: "Three guiding principles", zh: "三项建设原则" },
        paragraphs: [
          { vi: "Trực quan: bắt đầu từ mô hình, vị trí và tương quan. Có căn cứ: giữ nguồn dữ liệu và ghi công cho tài nguyên sử dụng. Trung thực về giới hạn: cấu trúc chưa có trong bộ dữ liệu phải được nêu rõ.", en: "Visual learning starts with models, positions and relationships. Evidence requires source records and attribution. Honesty about limitations means explicitly identifying structures absent from a dataset.", zh: "直观学习以模型、位置与毗邻关系为起点；有据学习保留来源与署名；诚实说明局限，明确指出数据集中缺失的结构。" },
          { vi: "Dự án kết hợp dữ liệu mở với công cụ tra cứu và ôn tập. Việc sử dụng dữ liệu từ một tổ chức không đồng nghĩa Soma là sản phẩm chính thức hoặc được tổ chức đó bảo trợ.", en: "The project combines open data with search and revision tools. Using an organisation's data does not imply that Soma is its official product or is endorsed by it.", zh: "项目结合开放数据与检索、复习工具。使用某机构的数据并不代表 Soma 是其官方产品或获得其背书。" },
        ],
      },
    ],
  },
  "du-lieu-phuong-phap": {
    group: "gioi-thieu",
    title: { vi: "Dữ liệu & phương pháp", en: "Data & methodology", zh: "数据与方法" },
    intro: { vi: "Từ dữ liệu nguồn đến mô hình học tập: giữ danh tính cấu trúc, tổ chức lại để dễ quan sát và công khai giới hạn.", en: "From source data to learning models: preserve structure identity, organise views for learning and disclose limitations.", zh: "从源数据到学习模型：保留结构标识、组织便于学习的视图并公开数据局限。" },
    sections: [
      {
        title: { vi: "Nguồn hình học và thuật ngữ", en: "Geometry and terminology", zh: "几何数据与术语" },
        paragraphs: [{ vi: "Thư viện người sử dụng các mô hình từ Z-Anatomy và atlas BodyParts3D. Các bài chuyên đề nhóm cấu trúc theo cơ quan hoặc vùng. Tên tiếng Việt được đối chiếu với thuật ngữ giải phẫu; tên nguồn và tên Latin được giữ để hỗ trợ kiểm tra.", en: "The human library uses Z-Anatomy models and the BodyParts3D atlas. Lessons group structures by organ or region. Vietnamese labels are checked against anatomical terminology, while source names and Latin names support verification.", zh: "人体资料库使用 Z-Anatomy 模型与 BodyParts3D 图谱，按器官或区域组织课程。越南语名称对照解剖术语，并保留源名称与拉丁名以便核查。" }],
        links: [{ label: { vi: "Xem nguồn và ghi công atlas", en: "Atlas sources and attribution", zh: "图谱来源与署名" }, href: "/nguon-du-lieu" }],
      },
      {
        title: { vi: "Chuẩn bị mô hình để học trên web", en: "Preparing models for the web", zh: "为网页学习准备模型" },
        paragraphs: [{ vi: "Dữ liệu được chuẩn hóa trục, đơn vị và vị trí; hình học được tối ưu cho trình duyệt. Tên và mã cấu trúc giúp liên kết mô hình với nhãn. Màu theo hệ, lớp ẩn/mờ và nhóm bài học là cách trình bày để quan sát, không phải màu thật của mô sống.", en: "Data axes, units and positions are normalised and geometry is optimised for browsers. Structure identifiers connect geometry to labels. System colours, visibility layers and lesson groups are presentation aids rather than the natural colours of living tissue.", zh: "数据统一坐标轴、单位及位置，并优化几何以适应浏览器。结构标识连接网格与标签；系统配色、隐藏或淡化分层及课程分组是观察辅助，并非活体组织的真实颜色。" }],
      },
      {
        title: { vi: "Tra cứu có dẫn nguồn và giới hạn dữ liệu", en: "References and dataset limitations", zh: "参考依据与数据局限" },
        paragraphs: [{ vi: "Kết quả tra cứu tài liệu có tên nguồn và vị trí trang khi dữ liệu hỗ trợ. Một bộ mô hình tham chiếu không thể đại diện mọi biến thể giải phẫu. Khi thiếu cấu trúc trong atlas toàn thân, bài học có thể dùng mô hình Z-Anatomy riêng; không đổi một bài sang cơ quan khác chỉ để lấp chỗ trống.", en: "Document results include source names and page locations where available. A reference dataset cannot represent every anatomical variation. A separate Z-Anatomy model can cover structures absent from the whole-body atlas; an unrelated organ should not replace the lesson.", zh: "资料检索在数据支持时提供来源名称与页码。参考模型不能覆盖所有解剖变异；全身图谱缺少结构时可使用独立的 Z-Anatomy 模型，不应以无关器官替换课程。" }],
      },
    ],
  },
  "trung-tam-ho-tro": {
    group: "ho-tro",
    title: { vi: "Trung tâm hỗ trợ", en: "Help centre", zh: "帮助中心" },
    intro: { vi: "Tìm hướng dẫn, xử lý vấn đề thường gặp hoặc liên hệ trực tiếp khi bạn cần hỗ trợ.", en: "Find guides, troubleshoot common issues or contact us directly for help.", zh: "查阅指南、处理常见问题，或直接联系我们获取帮助。" },
    sections: [
      {
        title: { vi: "Bắt đầu với Soma", en: "Getting started", zh: "开始使用 Soma" },
        paragraphs: [{ vi: "Mở hướng dẫn để làm quen với atlas, trắc nghiệm, tài liệu và điều khiển cử chỉ. Trang câu hỏi thường gặp giải đáp việc đăng nhập, quyền camera và mô hình không hiển thị.", en: "Use the guide to explore the atlas, quizzes, documents and gesture control. The FAQ covers sign-in, camera access and models that fail to display.", zh: "通过指南了解图谱、测验、资料与手势控制；常见问题涵盖登录、摄像头权限与模型显示问题。" }],
        links: [
          { label: { vi: "Hướng dẫn sử dụng", en: "User guide", zh: "使用指南" }, href: "/ho-tro/huong-dan-su-dung" },
          { label: { vi: "Câu hỏi thường gặp", en: "Frequently asked questions", zh: "常见问题" }, href: "/ho-tro/cau-hoi-thuong-gap" },
        ],
      },
      {
        title: { vi: "Gửi yêu cầu hỗ trợ hoặc báo lỗi", en: "Ask for help or report an issue", zh: "寻求帮助或报告问题" },
        paragraphs: [{ vi: "Gửi email tới trinhviethoangawm@gmail.com hoặc gọi 0848 565 650. Khi báo lỗi, kèm đường dẫn trang, tên mô hình, thao tác vừa thực hiện và ảnh lỗi nếu có. Không gửi mật khẩu hay dữ liệu nhận dạng người bệnh.", en: "Email trinhviethoangawm@gmail.com or call 0848 565 650. Include the page URL, model name, steps you took and a screenshot where available. Do not send passwords or identifiable patient information.", zh: "请发邮件至 trinhviethoangawm@gmail.com 或致电 0848 565 650，并提供页面网址、模型名称、操作步骤及可用的问题截图；请勿发送密码或可识别患者的信息。" }],
        links: [
          { label: { vi: "Gửi email hỗ trợ", en: "Email support", zh: "发送支持邮件" }, href: "mailto:trinhviethoangawm@gmail.com" },
          { label: { vi: "Gọi 0848 565 650", en: "Call 0848 565 650", zh: "致电 0848 565 650" }, href: "tel:0848565650" },
        ],
      },
    ],
  },
  "cau-hoi-thuong-gap": {
    group: "ho-tro",
    title: { vi: "Câu hỏi thường gặp", en: "Frequently asked questions", zh: "常见问题" },
    intro: { vi: "Những điều cần biết khi xem mô hình, ôn tập và sử dụng trợ lý Soma.", en: "What to know about viewing models, studying and using the Soma assistant.", zh: "关于查看模型、复习与使用 Soma 助手的常见疑问。" },
    sections: [
      {
        title: { vi: "Tôi có cần đăng nhập để xem mô hình không?", en: "Do I need to sign in to view models?", zh: "查看模型是否需要登录？" },
        paragraphs: [{ vi: "Các mô hình và học liệu công khai có thể xem trước khi đăng nhập. Tài liệu cá nhân và các công cụ gắn với tài khoản cần đăng nhập tại trang Đăng nhập / Tạo tài khoản.", en: "Public models and materials can be explored before signing in. Personal documents and account-based tools require signing in through the login page.", zh: "公开模型与学习资料可在登录前查看；个人资料与账户相关工具需通过登录页面登录。" }],
      },
      {
        title: { vi: "Vì sao mô hình chưa hiển thị?", en: "Why is a model not displaying?", zh: "为什么模型没有显示？" },
        paragraphs: [{ vi: "Chờ tải xong dữ liệu, kiểm tra kết nối và thử tải lại trang. Nếu vẫn trống, dùng trình duyệt có WebGL và bật tăng tốc đồ họa khi thiết bị hỗ trợ. Gửi đường dẫn cùng tên thiết bị và trình duyệt tới email hỗ trợ nếu lỗi lặp lại.", en: "Allow data to finish loading, check your connection and reload. If the view remains blank, use a WebGL-capable browser with graphics acceleration where supported. Report persistent issues with the URL, device and browser details.", zh: "请等待数据加载、检查连接并刷新页面；若仍空白，请使用支持 WebGL 的浏览器，并在设备支持时启用图形加速。持续出错时请提供网址、设备与浏览器信息。" }],
      },
      {
        title: { vi: "Vì sao một số cấu trúc không có trong atlas?", en: "Why are some structures missing?", zh: "为什么某些结构缺失？" },
        paragraphs: [{ vi: "Mỗi bộ dữ liệu có phạm vi riêng. Atlas toàn thân và mô hình Z-Anatomy không có cùng độ phủ; một bài riêng có thể có chi tiết không hiện trong atlas toàn thân. Phần mô tả bài học cần nêu giới hạn của dữ liệu, không mặc định rằng mọi cấu trúc đều đã có.", en: "Datasets have different coverage. The whole-body atlas and Z-Anatomy models do not contain exactly the same structures; an individual lesson may include details absent from the whole-body atlas. Lesson descriptions should explain these limitations.", zh: "不同数据集的覆盖范围不同，全身图谱与 Z-Anatomy 不含完全相同的结构；独立课程可能包含全身图谱没有的细节，应在课程说明中注明局限。" }],
      },
      {
        title: { vi: "Camera có bắt buộc không?", en: "Is a camera required?", zh: "是否必须使用摄像头？" },
        paragraphs: [{ vi: "Không. Bạn có thể dùng chuột hoặc cảm ứng để xem mô hình. Điều khiển cử chỉ cần bạn cấp quyền camera; khi không cấp quyền, hãy dùng các nút điều khiển thông thường.", en: "No. Models can be explored with a mouse or touch. Gesture control requires camera permission; ordinary model controls remain available without it.", zh: "不需要，可使用鼠标或触控浏览模型。手势控制需要摄像头权限；未授权时仍可使用常规模型控制。" }],
      },
      {
        title: { vi: "Câu trả lời của Soma có thay thế ý kiến bác sĩ không?", en: "Can Soma replace medical advice?", zh: "Soma 能否替代医生意见？" },
        paragraphs: [{ vi: "Không. Trợ lý và nội dung trên Soma phục vụ học tập. Hãy mở nguồn tham khảo đi kèm để kiểm chứng; quyết định chẩn đoán và điều trị thuộc về người có chuyên môn phù hợp.", en: "No. Soma and its assistant support learning. Open the linked references to check answers; diagnosis and treatment decisions belong to appropriately qualified professionals.", zh: "不能。Soma 与其助手用于学习，请打开附带参考资料核查；诊断与治疗决定应由具备相应资质的专业人士作出。" }],
      },
      {
        title: { vi: "Tôi báo lỗi nhãn hoặc yêu cầu xóa email ở đâu?", en: "Where can I report a label or remove my email?", zh: "在哪里报告标注问题或申请删除邮箱？" },
        paragraphs: [{ vi: "Gửi yêu cầu tới trinhviethoangawm@gmail.com. Với lỗi nội dung, ghi rõ tên cấu trúc và đường dẫn. Với đăng ký nhận tin, dùng email đã đăng ký để yêu cầu xóa khỏi danh sách.", en: "Contact trinhviethoangawm@gmail.com. For content issues, include the structure name and URL. To leave the newsletter, send a removal request from the subscribed address.", zh: "请联系 trinhviethoangawm@gmail.com。报告内容问题时提供结构名称与网址；取消订阅请使用已订阅邮箱发送删除请求。" }],
      },
    ],
  },
  "huong-dan-su-dung": {
    group: "ho-tro",
    title: { vi: "Hướng dẫn sử dụng", en: "User guide", zh: "使用指南" },
    intro: { vi: "Bắt đầu từ một mô hình, quan sát cấu trúc rồi kết hợp tài liệu và câu hỏi để ôn tập.", en: "Start with a model, inspect its structures, then use documents and questions to revise.", zh: "从一个模型开始，观察结构，再结合资料与试题复习。" },
    sections: [
      {
        title: { vi: "1. Tìm và mở mô hình", en: "1. Find and open a model", zh: "1. 查找并打开模型" },
        paragraphs: [{ vi: "Vào Giải phẫu người, chọn hệ cơ quan hoặc vùng cơ thể; cũng có thể nhập tên cấu trúc trong ô tìm kiếm. Bấm thẻ mô hình để mở bài. Dùng chuột kéo để xoay và con lăn để phóng to hoặc thu nhỏ.", en: "Open Human anatomy and choose a system or region, or enter a structure name in search. Select a model card to open its lesson. Drag to rotate and use the mouse wheel to zoom.", zh: "进入人体解剖，选择系统或身体区域，也可在搜索框输入结构名称。点击模型卡片打开课程，拖动旋转、滚轮缩放。" }],
        links: [{ label: { vi: "Mở thư viện mô hình", en: "Open the model library", zh: "打开模型库" }, href: "/giai-phau/tat-ca" }],
      },
      {
        title: { vi: "2. Quan sát từng cấu trúc", en: "2. Inspect individual structures", zh: "2. 观察单个结构" },
        paragraphs: [{ vi: "Chọn cấu trúc trên mô hình hoặc trong danh sách nhãn để đọc tên và ghi chú. Dùng ẩn, làm mờ, cô lập hoặc mặt cắt nếu bài đang mở hỗ trợ. Đặt lại giúp khôi phục góc nhìn và trạng thái quan sát của bài.", en: "Select a structure in the model or label list to read its name and notes. Use hide, fade, isolate or clipping where the lesson supports them. Reset restores the lesson's initial view and visibility.", zh: "在模型或标签列表中选择结构以阅读名称与说明；课程支持时可隐藏、淡化、单独显示或切面观察。重置恢复初始视角与显示状态。" }],
      },
      {
        title: { vi: "3. Đọc nguồn và ôn tập", en: "3. Read sources and revise", zh: "3. 阅读来源并复习" },
        paragraphs: [{ vi: "Kho tài liệu y khoa cho phép tra cứu nội dung đã lập chỉ mục và mở trang tài liệu tương ứng. Trong Quiz, chọn bộ đề để luyện tập hoặc thi thử và xem lại câu sai. Công cụ tài liệu cá nhân yêu cầu đăng nhập.", en: "The medical library searches indexed material and opens matching document pages. In Quiz, select a set to practise or take a mock exam and review mistakes. Personal document tools require sign-in.", zh: "医学资料库可检索已索引内容并打开对应文档页；在测验中选择题库练习或模拟考试并复习错题。个人文档工具需要登录。" }],
        links: [
          { label: { vi: "Tra cứu tài liệu", en: "Search documents", zh: "检索文档" }, href: "/tai-lieu-y-khoa" },
          { label: { vi: "Mở Quiz", en: "Open Quiz", zh: "打开测验" }, href: "/quiz" },
        ],
      },
      {
        title: { vi: "4. Dùng cử chỉ và trợ lý", en: "4. Use gestures and the assistant", zh: "4. 使用手势与助手" },
        paragraphs: [{ vi: "Trang Cử chỉ hướng dẫn cấp quyền camera và các thao tác tay được hỗ trợ. Đặt tay trong khung hình, đủ sáng và làm theo chỉ dẫn trên màn hình. Với câu hỏi giải phẫu hoặc cách sử dụng web, mở Trợ lý Soma và kiểm tra các nguồn được dẫn trong câu trả lời.", en: "The Gesture page explains camera access and supported hand actions. Keep your hands in view with adequate lighting and follow the on-screen instructions. For anatomy or product questions, use the Soma assistant and check its referenced sources.", zh: "手势页面说明摄像头授权与支持的手势；请在充足光线下将手保持在画面中并遵循提示。解剖或使用问题可询问 Soma 助手，并核查回答引用的来源。" }],
        links: [
          { label: { vi: "Mở điều khiển cử chỉ", en: "Open gesture control", zh: "打开手势控制" }, href: "/cu-chi" },
          { label: { vi: "Hỏi trợ lý Soma", en: "Ask Soma", zh: "询问 Soma" }, href: "/tro-ly" },
        ],
      },
    ],
  },
  "ban-quyen-giay-phep": {
    group: "chinh-sach",
    title: { vi: "Bản quyền & giấy phép", en: "Copyright & licences", zh: "版权与许可" },
    intro: { vi: "Mỗi nguồn dữ liệu giữ giấy phép riêng. Hãy kiểm tra nguồn của tài nguyên trước khi tải lại, chia sẻ hoặc chỉnh sửa.", en: "Each dataset keeps its own licence. Check the source of an asset before redistributing, sharing or adapting it.", zh: "各数据源保留各自许可；重新分发、分享或修改资源前，请查阅其来源。" },
    sections: [
      {
        title: { vi: "BodyParts3D", en: "BodyParts3D", zh: "BodyParts3D" },
        paragraphs: [{ vi: "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International. Trang giấy phép của DBCLS cập nhật ngày 27/02/2025 công bố CC BY 4.0. Bản ghi công của Soma lưu nguồn hình học và những thay đổi đã thực hiện; không gộp giấy phép này với các mô hình từ nguồn khác.", en: "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International. DBCLS's licence page, updated 27 February 2025, specifies CC BY 4.0. Soma's attribution records geometry sources and adaptations; this licence is separate from those of other model sources.", zh: "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International。DBCLS 于2025年2月27日更新的许可页面规定 CC BY 4.0；Soma 的署名记录保留几何来源与改动，不将其与其他模型来源的许可混同。" }],
        links: [
          { label: { vi: "Giấy phép chính thức DBCLS", en: "Official DBCLS licence", zh: "DBCLS 官方许可" }, href: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html", external: true },
          { label: { vi: "Nguồn và ghi công của Soma", en: "Soma sources and attribution", zh: "Soma 来源与署名" }, href: "/nguon-du-lieu" },
        ],
      },
      {
        title: { vi: "Z-Anatomy và các học liệu khác", en: "Z-Anatomy and other materials", zh: "Z-Anatomy 与其他学习资料" },
        paragraphs: [{ vi: "Các mô hình Z-Anatomy sử dụng giấy phép CC BY-SA theo nguồn dự án. Khi sử dụng lại, giữ tên tác giả, nguồn và thông tin giấy phép; kiểm tra yêu cầu chia sẻ tương tự áp dụng cho bản phái sinh. PDF, giáo trình và hình ảnh có thể có điều kiện riêng; khả năng xem trên Soma không tự cấp quyền tái xuất bản.", en: "Z-Anatomy models use CC BY-SA under the source project's terms. Reuse should retain author, source and licence information and comply with the applicable share-alike terms. PDFs, textbooks and images may have separate conditions; access through Soma does not itself grant republication rights.", zh: "Z-Anatomy 模型按源项目采用 CC BY-SA。重用时需保留作者、来源与许可信息，并遵守适用的相同方式共享要求。PDF、教材与图片可能有独立条件，在 Soma 查看不等于取得再出版许可。" }],
        links: [{ label: { vi: "Nguồn Z-Anatomy", en: "Z-Anatomy source", zh: "Z-Anatomy 来源" }, href: "https://github.com/Z-Anatomy/Models-of-human-anatomy", external: true }],
      },
      {
        title: { vi: "Góp ý về bản quyền", en: "Copyright enquiries", zh: "版权咨询" },
        paragraphs: [{ vi: "Nếu là chủ sở hữu quyền và thấy thiếu ghi công hoặc tài nguyên được sử dụng chưa phù hợp, gửi đường dẫn, tên tài nguyên và thông tin xác minh tới trinhviethoangawm@gmail.com để dự án kiểm tra.", en: "Rights holders can report missing attribution or inappropriate use to trinhviethoangawm@gmail.com, including the URL, asset name and supporting ownership information for review.", zh: "权利人发现署名缺失或使用不当，可将网址、资源名称及权利证明发送至 trinhviethoangawm@gmail.com 以供核查。" }],
      },
    ],
  },
  "cam-ket-su-dung": {
    group: "chinh-sach",
    title: { vi: "Cam kết sử dụng", en: "Usage commitment", zh: "使用承诺" },
    intro: { vi: "Sử dụng Soma để học tập có trách nhiệm, kiểm chứng thông tin và tôn trọng người khác.", en: "Use Soma responsibly for learning, verify information and respect others.", zh: "负责任地使用 Soma 学习、核查信息并尊重他人。" },
    sections: [
      {
        title: { vi: "Đối chiếu trước khi áp dụng", en: "Check before applying", zh: "应用前核对" },
        paragraphs: [{ vi: "Mô hình và trợ lý hỗ trợ hiểu kiến thức giải phẫu. Bạn cần đối chiếu nguồn tham khảo và giáo trình; không dùng câu trả lời tự động làm căn cứ duy nhất cho chẩn đoán, kê đơn hoặc quyết định điều trị.", en: "Models and the assistant support anatomy learning. Cross-check references and textbooks; do not use automated answers as the sole basis for diagnosis, prescribing or treatment decisions.", zh: "模型与助手辅助理解解剖知识，请结合参考资料与教材核对；不能将自动回答作为诊断、处方或治疗决定的唯一依据。" }],
      },
      {
        title: { vi: "Tôn trọng tài khoản và dữ liệu", en: "Respect accounts and data", zh: "尊重账户与数据" },
        paragraphs: [{ vi: "Giữ an toàn thông tin đăng nhập, chỉ tải lên tài liệu bạn có quyền sử dụng và không đưa dữ liệu nhận dạng người bệnh vào câu hỏi hoặc nội dung chia sẻ. Khi phát hiện lỗi, gửi phản hồi kèm nguồn để có thể kiểm tra.", en: "Keep credentials secure, upload only material you are entitled to use and avoid including identifiable patient data in questions or shared content. Report errors with sources so they can be checked.", zh: "请保护登录凭据，仅上传有权使用的资料，并避免在提问或分享内容中包含可识别患者的数据。报告错误时附上来源便于核查。" }],
        links: [{ label: { vi: "Đọc điều khoản sử dụng", en: "Read the terms of use", zh: "阅读使用条款" }, href: "/dieu-khoan" }],
      },
    ],
  },
  "bao-ve-tai-nguyen": {
    group: "chinh-sach",
    title: { vi: "Bảo vệ tài nguyên", en: "Resource protection", zh: "资源保护" },
    intro: { vi: "Giữ nguồn gốc học liệu rõ ràng và bảo đảm thư viện tiếp tục phục vụ việc học.", en: "Preserve material provenance and keep the library useful for learners.", zh: "保留学习资料来源，维护资料库的学习用途。" },
    sections: [
      {
        title: { vi: "Giữ ghi công khi chia sẻ", en: "Keep attribution when sharing", zh: "分享时保留署名" },
        paragraphs: [{ vi: "Khi chia sẻ hình hoặc tài nguyên được giấy phép cho phép, giữ tên bộ dữ liệu, tác giả, liên kết nguồn, giấy phép và ghi chú thay đổi nếu có. Quyền sử dụng tùy tài nguyên; không mặc định mọi nội dung trên website cùng một giấy phép.", en: "When the licence permits sharing an image or asset, retain the dataset, author, source link, licence and adaptation notes where applicable. Rights depend on the asset; do not assume all website content uses one licence.", zh: "在许可允许分享图像或资源时，应保留数据集、作者、来源链接、许可与适用的修改说明。使用权依资源而定，不应假设全站内容采用同一许可。" }],
      },
      {
        title: { vi: "Sử dụng dịch vụ đúng mục đích", en: "Use the service responsibly", zh: "负责任地使用服务" },
        paragraphs: [{ vi: "Không khai thác lỗi để truy cập tài liệu cá nhân của người khác, vượt quyền tài khoản hoặc gây quá tải hệ thống. Nếu cần dữ liệu mở với số lượng lớn, sử dụng kênh tải chính thức của bộ dữ liệu và tuân thủ giấy phép nguồn.", en: "Do not exploit faults to access others' private documents, bypass account permissions or overload the service. For bulk open data, use the dataset's official download channel and follow its licence.", zh: "不得利用漏洞访问他人私人文档、越过账户权限或使服务过载。批量获取开放数据时请使用数据集官方下载渠道，并遵守其许可。" }],
        links: [{ label: { vi: "Bản quyền & giấy phép", en: "Copyright & licences", zh: "版权与许可" }, href: "/chinh-sach/ban-quyen-giay-phep" }],
      },
    ],
  },
});

export function informationHref(slug: string, page: InformationPage) {
  return `/${page.group}/${slug}`;
}

export function informationSlugs(group: InformationGroup) {
  return Object.entries(informationPages).filter(([, page]) => page.group === group).map(([slug]) => ({ slug }));
}
