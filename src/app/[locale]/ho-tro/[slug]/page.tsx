import { renderInformationPage, informationMetadata, type InformationParams } from "@/components/information/InformationPage";
import { informationSlugs } from "@/lib/informationPages";

export const generateStaticParams = () => informationSlugs("ho-tro");
export const generateMetadata = ({ params }: { params: InformationParams }) => informationMetadata("ho-tro", params);
export default function Page({ params }: { params: InformationParams }) {
  return renderInformationPage("ho-tro", params);
}
