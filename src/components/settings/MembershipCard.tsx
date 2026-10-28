"use client";

import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT } from "@/lib/auth";
import { getProfile, type AccountProfile } from "@/lib/account";
import { createPremiumOrder, getMembership, getPremiumOrder, simulatePremiumOrder, MEMBERSHIP_CHANGED_EVENT, type Membership, type PremiumOrder } from "@/lib/membership";
import type { Loc } from "@/lib/homeContent";
import { Card, errorText, formatDate, Notice } from "./parts";

export default function MembershipCard({ locale, onChange }: { locale: Loc; onChange: (user: AccountProfile) => void }) {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [order, setOrder] = useState<PremiumOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const t = (vi: string, en: string, zh: string) => locale === "vi" ? vi : locale === "en" ? en : zh;

  useEffect(() => {
    const controller = new AbortController();
    let generation = 0;
    function load() {
      const current = ++generation;
      void getMembership(controller.signal).then(status => { if (!controller.signal.aborted && current === generation) setMembership(status); }).catch(cause => { if (!controller.signal.aborted && current === generation) setError(errorText(cause)); });
    }
    load(); window.addEventListener(MEMBERSHIP_CHANGED_EVENT, load);
    const returnedOrder = new URLSearchParams(window.location.search).get("premiumOrder") ?? sessionStorage.getItem("soma_pending_premium");
    if (returnedOrder) void getPremiumOrder(returnedOrder, controller.signal).then(async latest => {
      const current = await getMembership(controller.signal);
      if (controller.signal.aborted) return;
      if (Boolean(latest.sandbox) !== Boolean(current.sandbox)) { sessionStorage.removeItem("soma_pending_premium"); return; }
      if (latest.status === "paid") sessionStorage.removeItem("soma_pending_premium");
      setOrder(latest);
      if (latest.status === "paid") void getProfile().then(profile => { if (!controller.signal.aborted) { onChange(profile); window.dispatchEvent(new Event(AUTH_CHANGED_EVENT)); } });
    }).catch(cause => { if (!controller.signal.aborted) setError(errorText(cause)); });
    return () => { controller.abort(); window.removeEventListener(MEMBERSHIP_CHANGED_EVENT, load); };
  }, [onChange]);

  useEffect(() => {
    if (!order || order.status === "paid") return;
    const id = order.id, controller = new AbortController(); let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const latest = await getPremiumOrder(id, controller.signal);
        if (controller.signal.aborted) return;
        if (latest.status === "paid") {
          const [status, profile] = await Promise.all([getMembership(controller.signal), getProfile()]);
          if (controller.signal.aborted) return;
          setOrder(latest); setMembership(status); onChange(profile); setError("");
          sessionStorage.removeItem("soma_pending_premium");
          window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
          return;
        }
      } catch (cause) { if (!controller.signal.aborted) setError(errorText(cause)); }
      if (!controller.signal.aborted) timer = setTimeout(() => void poll(), 4000);
    }
    timer = setTimeout(() => void poll(), 4000);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [order, onChange]);

  async function checkout() {
    setBusy(true); setError("");
    try { const created = await createPremiumOrder(); setOrder(created); sessionStorage.setItem("soma_pending_premium", created.id); }
    catch (cause) { setError(errorText(cause)); }
    finally { setBusy(false); }
  }

  async function simulate() {
    if (!order) return;
    setBusy(true); setError("");
    try { await simulatePremiumOrder(order.id); }
    catch (cause) { setError(errorText(cause)); }
    finally { setBusy(false); }
  }

  return <Card title={t("Gói tài khoản", "Account plan", "账户套餐")}>
    {membership?.sandbox && <p className="st-test-mode">{t("Chế độ thử nghiệm · Chưa nhận thanh toán thật", "Test mode · Live payments are not active", "测试模式 · 尚未启用真实付款")}</p>}
    {membership && <div className="st-quota" role="status">
      <strong>{membership.plan === "pro" ? "Premium" : t("Thường", "Standard", "普通")} · {membership.remaining}/{membership.limit} {t("câu còn lại tháng này", "questions left this month", "本月剩余提问")}</strong>
      <progress className="st-usage" max={membership.limit} value={membership.used} aria-label={t("Lượt hỏi đã dùng", "Questions used", "已用提问次数")} />
      <p>{t("Làm mới hạn mức vào", "Quota resets on", "额度重置日期")} {formatDate(membership.resetsAt, locale)}.</p>
      {membership.plan === "pro" && membership.premiumUntil && <p>{t("Premium có hiệu lực đến", "Premium active until", "Premium 有效期至")} {formatDate(membership.premiumUntil, locale)}.</p>}
    </div>}
    <div className="st-plans">
      <section><h3>{t("Thường", "Standard", "普通")}</h3><p className="st-plan-price">0đ</p><p>10 {t("câu hỏi/tháng", "questions/month", "次提问/月")}</p><p>{t("Toàn bộ mô hình, quiz và tài liệu cá nhân.", "All models, quizzes and personal documents.", "全部模型、测验和个人文档。")}</p></section>
      <section><h3>Premium</h3><p className="st-plan-price">25.000đ <small>/{t("tháng", "month", "月")}</small></p><p>30 {t("câu hỏi/tháng", "questions/month", "次提问/月")}</p><p>{t("Giữ lượt đã dùng khi nâng cấp. Không tự động gia hạn.", "Used questions carry over on upgrade. No automatic renewal.", "升级保留已使用次数，不自动续费。")}</p>
        <button type="button" className="st-btn primary" disabled={busy || !membership?.paymentEnabled || order?.status === "pending"} onClick={() => void checkout()}>{busy ? t("Đang tạo đơn…", "Creating order…", "正在创建订单…") : membership?.plan === "pro" ? t("Gia hạn Premium", "Renew Premium", "续费 Premium") : t("Nâng cấp · 25.000đ", "Upgrade · 25,000 VND", "升级 · 25,000 越南盾")}</button>
        {membership && !membership.paymentEnabled && <p>{t("Thanh toán đang được thiết lập.", "Payments are being set up.", "支付正在设置中。")}</p>}
      </section>
    </div>
    <p className="st-note">{t("Tóm tắt có sẵn không trừ lượt hỏi.", "Prepared summaries do not use your question quota.", "已有摘要不消耗提问额度。")}</p>
    {order?.status === "pending" && <section className="st-checkout" aria-label={t("Thanh toán Premium", "Premium payment", "Premium 支付")}>
      <header className="st-payment-head"><p className="st-payment-label">{order.sandbox ? t("Thanh toán thử nghiệm", "Test payment", "测试付款") : t("Chuyển khoản ngân hàng", "Bank transfer", "银行转账")}</p><h3>Premium soma · 25.000đ</h3><p>{order.sandbox ? t("Mã minh họa — không dùng ứng dụng ngân hàng để quét hoặc chuyển tiền.", "Demonstration only — do not scan with a banking app or send money.", "仅为演示，请勿使用银行应用扫码或转账。") : t("Quét bằng ứng dụng ngân hàng. Số tiền đã được điền sẵn.", "Scan with your banking app. The amount is already filled in.", "使用银行应用扫码，金额已填好。")}</p></header>
      {order.checkout && !order.qrUrl && <form action={order.checkout.url} method="POST">
        {Object.entries(order.checkout.fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={String(value)} />)}
        <p>{order.sandbox ? t("Mở trang thử nghiệm của SePay để mô phỏng thanh toán 25.000đ.", "Open SePay Sandbox to simulate a 25,000 VND payment.", "打开 SePay 沙盒模拟支付 25,000 越南盾。") : t("Tiếp tục đến SePay để quét QR thanh toán 25.000đ.", "Continue to SePay to pay 25,000 VND by QR.", "前往 SePay 扫码支付 25,000 越南盾。")}</p>
        <button className="st-btn primary" type="submit">{t("Tiếp tục đến SePay", "Continue to SePay", "前往 SePay")}</button>
      </form>}
      {order.qrUrl && <figure className={`st-qr-frame${order.sandbox ? " is-test" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Preserve provider QR pixels. */}
        <img src={order.qrUrl} alt={order.sandbox ? t("QR minh họa, không thanh toán thật", "Demonstration QR, not a live payment", "演示二维码，非真实支付") : t("Mã QR chuyển khoản 25.000đ", "QR for a 25,000 VND transfer", "25,000 越南盾转账二维码")} width={260} height={260} />
        <figcaption>{order.sandbox ? t("SePay Sandbox · QR minh họa", "SePay Sandbox · Demo QR", "SePay 沙盒 · 演示二维码") : "VietQR · SePay"}</figcaption>
      </figure>}
      {(!order.checkout || order.qrUrl) && <dl><div><dt>{t("Ngân hàng", "Bank", "银行")}</dt><dd>{order.bank}</dd></div><div><dt>{t("Tài khoản", "Account", "账户")}</dt><dd>{order.account}</dd></div><div><dt>{t("Người nhận", "Recipient", "收款人")}</dt><dd>{order.holder}</dd></div><div><dt>{t("Số tiền", "Amount", "金额")}</dt><dd>25.000đ</dd></div><div><dt>{t("Nội dung", "Reference", "附言")}</dt><dd><code>{order.transferContent ?? order.code}</code></dd></div></dl>}
      {order.sandbox && order.qrUrl && <><p>{t("QR minh họa Sandbox; không chuyển tiền thật. Bấm giả lập để thử kích hoạt Premium ngay tại đây.", "Sandbox demonstration QR. Do not send money; simulate payment here to test Premium.", "沙盒演示二维码，请勿真实转账，可在此模拟支付。")}</p><button type="button" className="st-btn primary" disabled={busy} onClick={() => void simulate()}>{busy ? t("Đang xác nhận…", "Confirming…", "确认中…") : t("Giả lập thanh toán", "Simulate payment", "模拟支付")}</button></>}
      {order.checkoutUrl && <a className="st-payment-fallback" href={order.checkoutUrl} target="_blank" rel="noopener noreferrer">{t("Mở trang SePay ↗", "Open SePay ↗", "打开 SePay ↗")}</a>}
      <p role="status">{order.sandbox ? t("Đang chờ xác nhận thử nghiệm. Premium sẽ tự cập nhật trong khung này.", "Waiting for test confirmation. Premium updates here automatically.", "等待测试确认，Premium 将在此自动更新。") : t("Đang chờ ngân hàng xác nhận. Giữ đúng số tiền và nội dung chuyển khoản; Premium sẽ tự cập nhật khi nhận được tiền.", "Waiting for bank confirmation. Keep the exact amount and reference; Premium updates automatically after payment arrives.", "等待银行确认，请保留准确金额和附言，收款后自动开通 Premium。")}</p>
    </section>}
    {order?.status === "paid" && <Notice kind="ok">{t("Thanh toán thành công. Premium đã được kích hoạt.", "Payment confirmed. Premium is active.", "付款成功，Premium 已开通。")}</Notice>}
    {error && <Notice kind="error">{error}</Notice>}
  </Card>;
}
