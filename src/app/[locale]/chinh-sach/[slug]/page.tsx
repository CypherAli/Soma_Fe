import { renderInformationPage, informationMetadata, type InformationParams } from "@/components/information/InformationPage";
import { informationSlugs } from "@/lib/informationPages";

export const generateStaticParams = () => informationSlugs("chinh-sach");
export const generateMetadata = ({ params }: { params: InformationParams }) => informationMetadata("chinh-sach", params);
export default function Page({ params }: { params: InformationParams }) {
  return renderInformationPage("chinh-sach", params);
}
