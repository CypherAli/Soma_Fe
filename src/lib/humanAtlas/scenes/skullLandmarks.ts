import { bindContentSource, contentSourceId } from "@/lib/content/source";
import type { AtlasSceneGroup } from './types';

const skullReference = 'https://www.ncbi.nlm.nih.gov/books/NBK499834/';
const parietalReference = 'https://embryology.med.unsw.edu.au/embryology/index.php?title=Book_-_Buchanan%27s_Manual_of_Anatomy_including_Embryology_5';
type Landmark = NonNullable<AtlasSceneGroup['landmarks']>[number];
function landmark(vi:string,en:string,zh:string,latin:string,noteVi:string,noteEn:string,noteZh:string,source=skullReference):Landmark {
  return {name:{vi,en,zh},latin,note:{vi:noteVi,en:noteEn,zh:noteZh},source};
}

/** Editorial overlay kept separate from the generated mesh catalogue. */
export const skullLandmarks:Record<string,Landmark[]> = {
  'xuong-dinh':[
    landmark('Khớp dọc','Sagittal suture','矢状缝','Sutura sagittalis','Đường khớp có bờ răng cưa giữa hai xương đỉnh, chạy dọc đường giữa vòm sọ. Đây là đường khớp, không phải rãnh mạch máu.','Serrated joint between the two parietal bones along the vault midline; distinguish it from a vascular groove.','两顶骨之间沿颅顶中线的锯齿状骨缝；应与血管沟区分。'),
    landmark('Khớp vành','Coronal suture','冠状缝','Sutura coronalis','Nối bờ trước hai xương đỉnh với xương trán. Quan sát vòm sọ từ trên hoặc phía trước.','Joins the anterior parietal borders to the frontal bone; inspect from above or anteriorly.','连接两顶骨前缘与额骨；从上方或前方观察。'),
    landmark('Khớp lambdoid','Lambdoid suture','人字缝','Sutura lambdoidea','Nối bờ sau hai xương đỉnh với xương chẩm. Không nhầm với khớp dọc ở đường giữa.','Joins the posterior parietal borders to the occipital bone; distinguish it from the midline sagittal suture.','连接两顶骨后缘与枕骨；不要与中线矢状缝混淆。'),
    landmark('Rãnh xoang dọc trên','Groove for superior sagittal sinus','上矢状窦沟','Sulcus sinus sagittalis superioris','Ở mặt trong sát bờ dọc; hai nửa rãnh tạo chỗ cho xoang dọc trên. Cần xoay để nhìn mặt trong xương.','On the inner surface along the sagittal border; opposing half grooves accommodate the superior sagittal sinus. Rotate to inspect the inner surface.','位于内面矢状缘附近；两侧半沟共同容纳上矢状窦。需旋转观察骨内面。',parietalReference),
    landmark('Rãnh mạch màng não','Meningeal vascular grooves','脑膜血管沟','Sulci arteriosi','Các rãnh phân nhánh trên mặt trong xương, liên quan mạch màng não giữa; khác với đường khớp trên bờ xương. Độ sâu rãnh phụ thuộc mẫu và độ phân giải mô hình.','Branching grooves on the inner bone surface associated with middle meningeal vessels; distinguish them from sutures at the bone margins. Their visible depth depends on specimen and mesh resolution.','骨内面的分支状沟与脑膜中血管相关；不同于骨缘的骨缝。可见深度取决于标本及网格分辨率。',parietalReference),
  ],
  'xuong-cham':[
    landmark('Lỗ lớn','Foramen magnum','枕骨大孔','Foramen magnum','Lỗ trung tâm nền sọ ở xương chẩm, nối khoang sọ với ống sống. Quan sát từ dưới hoặc mặt trong nền sọ.','Central opening in the occipital skull base connecting the cranial cavity to the vertebral canal; inspect from below or internally.','枕骨颅底中央开口，连接颅腔与椎管；从下方或颅底内面观察。'),
    landmark('Lồi cầu chẩm','Occipital condyles','枕髁','Condyli occipitales','Hai diện khớp ở hai bên lỗ lớn, tiếp khớp với đốt đội. Cần phân biệt diện khớp với bờ lỗ lớn.','Paired articular prominences beside the foramen magnum that articulate with the atlas; distinguish the joint surfaces from the opening margin.','枕骨大孔两侧的成对关节突起，与寰椎相关节；应区分关节面与大孔边缘。'),
  ],
};

// Actual vertices on the medial vault edges, read from body-12/body-13.
// The label stays attached to its bone when the two bones are exploded.
skullLandmarks['xuong-dinh'][0].separatedName={vi:'Bờ khớp dọc',en:'Sagittal sutural border',zh:'矢状缝缘'};
skullLandmarks['xuong-dinh'][0].anchors = [
  {partId:'FJ3274',position:[-0.0000790681,1.71273124,-0.04170230]},
  {partId:'FJ3380',position:[-0.00233493,1.71008122,-0.04347100]},
];

export function withSkullLandmarks(scene:import('./types').AtlasSceneDef) {
  const owners:Record<string,string[]>={'xuong-dinh':['FJ3274','FJ3380'],'xuong-cham':['FJ3309'],'xuong-buom':['FJ3394'],'xuong-thai-duong':['FJ3281','FJ3386'],'xuong-sang':['FJ3199'],'xuong-ham-duoi':['FJ3289']};
  const enriched = {...scene,groups:scene.groups.map(group=>{
    const references=Object.entries(owners).filter(([,ids])=>ids.some(id=>group.parts.includes(id))).flatMap(([key])=>skullLandmarks[key]??[]);
    const seen=new Set<string>();const landmarks=[...(group.landmarks??[]),...references].filter(entry=>{if(seen.has(entry.latin))return false;seen.add(entry.latin);return true;});
    return landmarks.length?{...group,landmarks}:group;
  })};
  const id=contentSourceId(scene);
  return id?bindContentSource(id,enriched):enriched;
}

// Descriptions paraphrased from the supplied HMU textbook, chapter 39.
// These are reference entries until a position is verified on this mesh.
const bookFeature=(vi:string,en:string,zh:string,latin:string,notes:[string,string,string],page:number):Landmark=>({name:{vi,en,zh},latin,note:{vi:notes[0],en:notes[1],zh:notes[2]},source:`/tai-lieu-y-khoa?file=${encodeURIComponent('Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf')}&page=${page}`,sourceTitle:`Giải phẫu người — Y Hà Nội · Chương 39 · PDF ${page}`});
skullLandmarks['xuong-buom']=[
  bookFeature('Ống thị giác','Optic canal','视神经管','Canalis opticus',['Giữa thân và cánh nhỏ xương bướm; thần kinh thị giác (II) và động mạch mắt đi qua.','Between the sphenoid body and lesser wing; transmits the optic nerve (II) and ophthalmic artery.','位于蝶骨体与小翼之间；视神经（II）及眼动脉通过。'],394),
  bookFeature('Lỗ tròn','Foramen rotundum','圆孔','Foramen rotundum',['Trên cánh lớn, sau đầu trong khe ổ mắt trên; thần kinh hàm trên (V2) đi qua.','In the greater wing, behind the medial end of the superior orbital fissure; transmits the maxillary nerve (V2).','位于大翼、眶上裂内侧端后方；上颌神经（V2）通过。'],394),
  bookFeature('Lỗ bầu dục','Foramen ovale','卵圆孔','Foramen ovale',['Sau và ngoài lỗ tròn; thần kinh hàm dưới (V3) đi qua. Phân biệt với lỗ bầu dục của tim thai.','Posterolateral to the foramen rotundum; transmits the mandibular nerve (V3). Distinguish it from the fetal cardiac foramen ovale.','位于圆孔后外侧；下颌神经（V3）通过。应与胎心卵圆孔区分。'],394),
  bookFeature('Lỗ gai','Foramen spinosum','棘孔','Foramen spinosum',['Sau và ngoài lỗ bầu dục; động mạch màng não giữa đi qua.','Posterolateral to the foramen ovale; transmits the middle meningeal artery.','位于卵圆孔后外侧；脑膜中动脉通过。'],394),
  bookFeature('Hố tuyến yên','Hypophyseal fossa','垂体窝','Fossa hypophysialis',['Trên mặt trên thân xương bướm, chứa tuyến yên; lưng yên tạo thành phía sau của hố.','On the superior sphenoid body, housing the pituitary; the dorsum sellae forms its posterior wall.','位于蝶骨体上面，容纳垂体；鞍背构成其后壁。'],394),
  bookFeature('Mỏm chân bướm','Pterygoid processes','翼突','Processus pterygoidei',['Đi xuống từ chỗ nối thân với cánh lớn. Mảnh trong và mảnh ngoài giới hạn hố chân bướm; đầu dưới mảnh trong có móc chân bướm.','Descend from the body–greater wing junction. Medial and lateral plates enclose the pterygoid fossa; the medial plate ends in a hamulus.','自体与大翼交界处向下；内外侧板围成翼突窝，内侧板下端有翼钩。'],395),
];
skullLandmarks['xuong-thai-duong']=[
  bookFeature('Ống động mạch cảnh','Carotid canal','颈动脉管','Canalis caroticus',['Trong phần đá xương thái dương, cho động mạch cảnh trong đi qua. Lỗ ngoài ở mặt dưới; lỗ trong ở đỉnh phần đá.','Traverses the petrous temporal bone for the internal carotid artery. External opening is inferior; internal opening is at the petrous apex.','位于颞骨岩部，颈内动脉通过；外口在下面，内口在岩尖。'],393),
  bookFeature('Lỗ trâm–chũm','Stylomastoid foramen','茎乳孔','Foramen stylomastoideum',['Giữa mỏm trâm và mỏm chũm; thần kinh mặt (VII) ra khỏi sọ tại đây.','Between the styloid and mastoid processes; the facial nerve (VII) exits the skull here.','位于茎突与乳突之间；面神经（VII）由此出颅。'],393),
  bookFeature('Ống tai trong','Internal acoustic meatus','内耳道','Meatus acusticus internus',['Ở mặt sau phần đá, nơi các thần kinh VII và VIII đi qua.','On the posterior petrous surface; carries cranial nerves VII and VIII.','位于岩部后面；颅神经VII与VIII通过。'],393),
  bookFeature('Hố hàm dưới và củ khớp','Mandibular fossa and articular tubercle','下颌窝与关节结节','Fossa mandibularis · Tuberculum articulare',['Phía dưới mỏm gò má; tiếp khớp với chỏm hàm dưới trong khớp thái dương–hàm.','Below the zygomatic process; articulate with the mandibular head in the temporomandibular joint.','位于颧突下方；与下颌头构成颞下颌关节。'],394),
];
skullLandmarks['xuong-cham'].push(
  bookFeature('Ống thần kinh hạ thiệt','Hypoglossal canal','舌下神经管','Canalis nervi hypoglossi',['Ở phần bên xương chẩm; thần kinh hạ thiệt (XII) đi qua.','In the lateral occipital part; transmits the hypoglossal nerve (XII).','位于枕骨侧部；舌下神经（XII）通过。'],394),
  bookFeature('Rãnh xoang ngang và xoang sigma','Transverse and sigmoid sinus grooves','横窦沟与乙状窦沟','Sulcus sinus transversi · Sulcus sinus sigmoidei',['Trên mặt trong vùng chẩm; các rãnh chứa xoang tĩnh mạch màng cứng tương ứng. Xoay mô hình để quan sát mặt trong.','On the internal occipital region; accommodate the corresponding dural venous sinuses. Rotate to view the internal surface.','位于枕部内面；容纳相应硬脑膜静脉窦。旋转模型观察内面。'],394),
);
skullLandmarks['xuong-sang']=[
  bookFeature('Mảnh sàng và lỗ sàng','Cribriform plate and foramina','筛板与筛孔','Lamina cribrosa',['Ngăn hố sọ trước với ổ mũi; các sợi thần kinh khứu đi qua các lỗ nhỏ trên mảnh sàng.','Separates the anterior cranial fossa from the nasal cavity; olfactory nerve filaments pass through its small foramina.','分隔颅前窝与鼻腔；嗅神经纤维通过筛板小孔。'],395),
  bookFeature('Mào gà và mảnh thẳng đứng','Crista galli and perpendicular plate','鸡冠与垂直板','Crista galli · Lamina perpendicularis',['Mào gà nhô lên giữa mặt trên mảnh sàng. Mảnh thẳng đứng đi xuống, góp phần tạo vách mũi.','Crista galli projects above the cribriform plate midline. The perpendicular plate descends into the nasal septum.','鸡冠自筛板上面中线突出；垂直板向下构成部分鼻中隔。'],395),
];
skullLandmarks['xuong-ham-duoi']=[
  bookFeature('Lỗ hàm dưới và ống hàm dưới','Mandibular foramen and canal','下颌孔与下颌管','Foramen mandibulae · Canalis mandibulae',['Lỗ ở mặt trong ngành hàm, là cửa vào ống hàm dưới cho thần kinh và mạch huyệt răng dưới.','The foramen on the medial ramus opens into the mandibular canal for the inferior alveolar nerve and vessels.','下颌支内面孔通入下颌管，下牙槽神经及血管通过。'],396),
  bookFeature('Mỏm vẹt, mỏm lồi cầu và khuyết hàm','Coronoid process, condylar process and notch','冠突、髁突与下颌切迹','Processus coronoideus · Processus condylaris · Incisura mandibulae',['Mỏm vẹt ở trước, mỏm lồi cầu ở sau; khuyết hàm dưới nằm giữa. Chỏm lồi cầu tiếp khớp với xương thái dương.','Coronoid process is anterior, condylar process posterior, with the mandibular notch between them. The condylar head articulates with the temporal bone.','冠突在前、髁突在后，二者之间为下颌切迹；髁头与颞骨相关节。'],396),
  bookFeature('Đường hàm–móng và các hố tuyến','Mylohyoid line and gland fossae','下颌舌骨线与腺窝','Linea mylohyoidea',['Ở mặt trong thân hàm. Hố dưới lưỡi ở trên đoạn trước của đường; hố dưới hàm ở dưới đoạn sau.','On the medial mandibular body. The sublingual fossa lies above the anterior line; the submandibular fossa below its posterior segment.','位于下颌体内面；舌下腺窝在前段上方，下颌下腺窝在后段下方。'],396),
];
