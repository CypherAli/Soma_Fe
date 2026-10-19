import { withSkullLandmarks } from "./skullLandmarks";
/**
 * Danh mục scene chuyên đề đã dựng lại trên atlas BodyParts3D.
 *
 * Route `/giai-phau/mo-hinh/[slug]` tra ở đây TRƯỚC: có thì dùng bộ dựng hình
 * atlas, không có thì lùi về SceneModule (Z-Anatomy) như cũ. Nhờ vậy chuyển
 * từng scene một được, không phải chuyển hết mới chạy.
 */
import type { AtlasSceneDef } from "./types";
import { heartScene } from "./heart";
import { liverScene } from "./liver";
import { brainScene } from "./brain";
import { skullScene } from "./skull";
import { spineScene } from "./spine";
import { thoraxScene } from "./thorax";
import { upperLimbScene } from "./upper-limb";
import { handScene } from "./hand";
import { footScene } from "./foot";
import { teethScene } from "./teeth";
import { aortaScene } from "./aorta";
import { willisScene } from "./willis";
import { armArteriesScene } from "./arm-arteries";
import { legArteriesScene } from "./leg-arteries";
import { cavalPortalScene } from "./caval-portal";
import { legVeinsScene } from "./leg-veins";
import { coronaryScene } from "./coronary";
import { mesentericScene } from "./mesenteric";
import { urinaryScene } from "./urinary";
import { kidneyScene } from "./kidney";
import { maleReproScene } from "./male-repro";
import { pancreasSpleenScene } from "./pancreas-spleen";
import { larynxScene } from "./larynx";
import { eyeScene } from "./eye";
import { limbicScene } from "./limbic";
import { visualScene } from "./visual";
import { orbitScene } from "./orbit";
import { armMusclesScene } from "./arm-muscles";
import { thighMusclesScene } from "./thigh-muscles";
import { shoulderScene } from "./shoulder";
import { digestiveScene } from "./digestive";
import { stomachScene } from "./stomach";
import { bowelScene } from "./bowel";
import { biliaryScene } from "./biliary";
import { cervicalSpineScene } from "./cervical-spine";
import { iliotibialScene } from "./iliotibial";
import { mediastinumScene } from "./mediastinum";
import { pelvicFloorScene } from "./pelvic-floor";
import { diaphragmScene } from "./diaphragm";
import { armVeinsScene } from "./arm-veins";
import { bladderProstateScene } from "./bladder-prostate";
import { retroperitoneumScene } from "./retroperitoneum";
import { lumbarSpineScene } from "./lumbar-spine";
import { heartFullScene } from "./heart-full";
import { abdomenSectionScene } from "./abdomen-section";
import { glutealScene } from "./gluteal";
import { maleGenitalScene } from "./male-genital";
import { oesophagusScene } from "./oesophagus";
import { forearmScene } from "./forearm";
import { handDetailScene } from "./hand-detail";
import { legScene } from "./leg";
import { nuchalScene } from "./nuchal";
import { neckScene } from "./neck";
// Đợt 4A — chi trên (gen-scene-batch-a.mjs)
import { armRegionScene } from "./arm-region";
import { shoulderGirdleScene } from "./shoulder-girdle";
import { rotatorCuffScene } from "./rotator-cuff";
import { scapularAnastomosisScene } from "./scapular-anastomosis";
import { cubitalFossaScene } from "./cubital-fossa";
import { elbowJointScene } from "./elbow-joint";
import { carpalTunnelScene } from "./carpal-tunnel";
import { palmarArchesScene } from "./palmar-arches";
// Đợt 4B — chi dưới và chậu hông (gen-scene-batch-b.mjs)
import { kneeJointScene } from "./knee-joint";
import { genicularAnastomosisScene } from "./genicular-anastomosis";
import { poplitealFossaScene } from "./popliteal-fossa";
import { ankleJointScene } from "./ankle-joint";
import { tarsalTunnelScene } from "./tarsal-tunnel";
import { hipJointScene } from "./hip-joint";
import { adductorsScene } from "./adductors";
import { femoralTriangleScene } from "./femoral-triangle";
import { footBonesDorsumScene } from "./foot-bones-dorsum";
import { hamstringsScene } from "./hamstrings";
import { legAnteriorLateralScene } from "./leg-anterior-lateral";
import { plantarLayersScene } from "./plantar-layers";
import { iliopsoasScene } from "./iliopsoas";
import { sacroiliacScene } from "./sacroiliac";
import { pelvicVeinsScene } from "./pelvic-veins";
// Đợt 4C — mạch não, nhân nền, vỏ não, mép, cơ móng (gen-scene-batch-c.mjs)
import { acaScene } from "./aca";
import { mcaScene } from "./mca";
import { pcaScene } from "./pca";
import { deepPerforatorsScene } from "./deep-perforators";
import { vertebrobasilarScene } from "./vertebrobasilar";
import { basalNucleiScene } from "./basal-nuclei";
import { cortexGyriScene } from "./cortex-gyri";
import { commissuresScene } from "./commissures";
import { hyoidMusclesScene } from "./hyoid-muscles";
// Đợt 4D — đầu, cổ, thần kinh trung ương (gen-scene-batch-d.mjs)
import { headOverviewScene } from "./head-overview";
import { brainstemScene } from "./brainstem";
import { cerebellumScene } from "./cerebellum";
import { ventriclesScene } from "./ventricles";
import { skullBaseScene } from "./skull-base";
import { noseSinusesScene } from "./nose-sinuses";
import { oralCavityScene } from "./oral-cavity";
import { pharynxLarynxScene } from "./pharynx-larynx";
import { salivaryScene } from "./salivary";
import { neckTrianglesScene } from "./neck-triangles";
import { carotidSystemScene } from "./carotid-system";
import { ophthalmicNerveScene } from "./ophthalmic-nerve";
import { lacrimalScene } from "./lacrimal";
// Đợt 4E — thân mình (gen-scene-batch-e.mjs)
import { trunkOverviewScene } from "./trunk-overview";
import { endocrineScene } from "./endocrine";
import { adrenalScene } from "./adrenal";
import { abdominalWallScene } from "./abdominal-wall";
import { erectorSpinaeScene } from "./erector-spinae";
import { backSuperficialScene } from "./back-superficial";
import { chestWallScene } from "./chest-wall";
import { sternoclavicularScene } from "./sternoclavicular";
import { thoracicSpineScene } from "./thoracic-spine";
import { celiacScene } from "./celiac";
import { colicVesselsScene } from "./colic-vessels";
import { lymphoidOrgansScene } from "./lymphoid-organs";
import { azygosScene } from "./azygos";
import { pectoralRegionScene } from "./pectoral-region";
import { pulmonarySegmentsScene } from "./pulmonary-segments";
import { bronchialTreeScene } from "./bronchial-tree";
import { lungRootScene } from "./lung-root";
// Đợt 4F — sáu slug cuối (gen-scene-batch-f.mjs)
import { upperLimbOssificationScene } from "./upper-limb-ossification";
import { lowerLimbOssificationScene } from "./lower-limb-ossification";
import { denseConnectiveScene } from "./dense-connective";
import { prevertebralScene } from "./prevertebral";
import { pancreaticoduodenalScene } from "./pancreaticoduodenal";
import { thoracicOutletScene } from "./thoracic-outlet";
// Bài BỘ PHẬN học theo lớp (gen-scene-parts.mjs)
import { partKneeScene } from "./part-knee";
import { partShoulderScene } from "./part-shoulder";
import { partElbowScene } from "./part-elbow";
import { partHandScene } from "./part-hand";
import { partHipScene } from "./part-hip";
import { partFootScene } from "./part-foot";
import { partHeartScene } from "./part-heart";
import { partLiverScene } from "./part-liver";
import { partBrainScene } from "./part-brain";
import { partEyeScene } from "./part-eye";
import { partSkullScene } from "./part-skull";
import { partLarynxScene } from "./part-larynx";
import { partStomachScene } from "./part-stomach";
import { partArmScene } from "./part-arm";
import { partForearmScene } from "./part-forearm";
import { partThighScene } from "./part-thigh";
import { partLegScene } from "./part-leg";
import { partCervicalScene } from "./part-cervical";
import { partLumbarScene } from "./part-lumbar";
import { partThoraxScene } from "./part-thorax";
import { partPelvisScene } from "./part-pelvis";
import { partDiaphragmScene } from "./part-diaphragm";
import { partLungScene } from "./part-lung";
import { partKidneyScene } from "./part-kidney";
import { partPancreasScene } from "./part-pancreas";
import { partOrbitScene } from "./part-orbit";
import { partBladderScene } from "./part-bladder";

/** Old saved links remain usable without listing a duplicate lesson. */
export const atlasSceneAliases: Record<string,string> = { 'tieu-nao-day-du':'hoi-vo-dai-nao' };

export const atlasScenes: Record<string, AtlasSceneDef> = Object.fromEntries(
  [
    heartScene,
    liverScene,
    brainScene,
    skullScene,
    spineScene,
    thoraxScene,
    upperLimbScene,
    handScene,
    footScene,
    teethScene,
    aortaScene,
    willisScene,
    armArteriesScene,
    legArteriesScene,
    cavalPortalScene,
    legVeinsScene,
    coronaryScene,
    mesentericScene,
    urinaryScene,
    kidneyScene,
    maleReproScene,
    pancreasSpleenScene,
    larynxScene,
    eyeScene,
    limbicScene,
    visualScene,
    orbitScene,
    armMusclesScene,
    thighMusclesScene,
    shoulderScene,
    digestiveScene,
    stomachScene,
    bowelScene,
    biliaryScene,
    cervicalSpineScene,
    iliotibialScene,
    mediastinumScene,
    pelvicFloorScene,
    diaphragmScene,
    armVeinsScene,
    bladderProstateScene,
    retroperitoneumScene,
    lumbarSpineScene,
    heartFullScene,
    abdomenSectionScene,
    glutealScene,
    maleGenitalScene,
    oesophagusScene,
    forearmScene,
    handDetailScene,
    legScene,
    nuchalScene,
    neckScene,
    armRegionScene,
    shoulderGirdleScene,
    rotatorCuffScene,
    scapularAnastomosisScene,
    cubitalFossaScene,
    elbowJointScene,
    carpalTunnelScene,
    palmarArchesScene,
    kneeJointScene,
    genicularAnastomosisScene,
    poplitealFossaScene,
    ankleJointScene,
    tarsalTunnelScene,
    hipJointScene,
    adductorsScene,
    femoralTriangleScene,
    footBonesDorsumScene,
    hamstringsScene,
    legAnteriorLateralScene,
    plantarLayersScene,
    iliopsoasScene,
    sacroiliacScene,
    pelvicVeinsScene,
    acaScene,
    mcaScene,
    pcaScene,
    deepPerforatorsScene,
    vertebrobasilarScene,
    basalNucleiScene,
    cortexGyriScene,
    commissuresScene,
    hyoidMusclesScene,
    headOverviewScene,
    brainstemScene,
    cerebellumScene,
    ventriclesScene,
    skullBaseScene,
    noseSinusesScene,
    oralCavityScene,
    pharynxLarynxScene,
    salivaryScene,
    neckTrianglesScene,
    carotidSystemScene,
    ophthalmicNerveScene,
    lacrimalScene,
    trunkOverviewScene,
    endocrineScene,
    adrenalScene,
    abdominalWallScene,
    erectorSpinaeScene,
    backSuperficialScene,
    chestWallScene,
    sternoclavicularScene,
    thoracicSpineScene,
    celiacScene,
    colicVesselsScene,
    lymphoidOrgansScene,
    azygosScene,
    pectoralRegionScene,
    pulmonarySegmentsScene,
    bronchialTreeScene,
    lungRootScene,
    upperLimbOssificationScene,
    lowerLimbOssificationScene,
    denseConnectiveScene,
    prevertebralScene,
    pancreaticoduodenalScene,
    thoracicOutletScene,
    partKneeScene,
    partShoulderScene,
    partElbowScene,
    partHandScene,
    partHipScene,
    partFootScene,
    partHeartScene,
    partLiverScene,
    partBrainScene,
    partEyeScene,
    partSkullScene,
    partLarynxScene,
    partStomachScene,
    partArmScene,
    partForearmScene,
    partThighScene,
    partLegScene,
    partCervicalScene,
    partLumbarScene,
    partThoraxScene,
    partPelvisScene,
    partDiaphragmScene,
    partLungScene,
    partKidneyScene,
    partPancreasScene,
    partOrbitScene,
    partBladderScene,
  ].map((s) => [s.slug, withSkullLandmarks(s)]),
);

export type { AtlasSceneDef };
