
import { ContentSurface } from "@/components/content/ContentProvider";
import type { Loc } from '@/lib/homeContent';
import IconSprite from '../home/IconSprite';
import HomeNav from '../home/HomeNav';
import LibraryResults from './LibraryResults';
import '../../app/home.css';
import './library.css';
export default function LibraryPage({locale}:{locale:Loc}){
  return <ContentSurface scope="src/components/library/LibraryPage.tsx"><div className="bd"><IconSprite/><HomeNav/><LibraryResults locale={locale}/></div></ContentSurface>;
}
