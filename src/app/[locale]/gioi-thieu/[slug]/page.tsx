import { renderInformationPage, informationMetadata, type InformationParams } from "@/components/information/InformationPage";
import { informationSlugs } from "@/lib/informationPages";

export const generateStaticParams = () => informationSlugs("gioi-thieu");
export const generateMetadata = ({ params }: { params: InformationParams }) => informationMetadata("gioi-thieu", params);
export default function Page({ params }: { params: InformationParams }) {
  return renderInformationPage("gioi-thieu", params);
}
