import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function BrandSignature() {
  return (
    <Link href="/" className="brand-signature" aria-label="Soma Atlas — giải phẫu 3D">
      <span className="brand-signature-emblem" aria-hidden="true">
        <Image src="/brand/soma-emblem-light.png" alt="" width={64} height={64} priority unoptimized />
      </span>
      <span className="brand-signature-copy">
        <strong>Soma <i>Atlas</i></strong>
        <small>Giải phẫu tương tác · 3D</small>
      </span>
    </Link>
  );
}
