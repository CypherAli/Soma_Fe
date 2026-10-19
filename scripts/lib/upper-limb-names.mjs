// Exact source-name translations only. Original English names/IDs remain visible.
// This glossary supplies names, never function/insertion/innervation claims.
const muscles={
 'extensor carpi ulnaris':'cơ duỗi cổ tay trụ',
 'flexor carpi ulnaris':'cơ gấp cổ tay trụ',
 'pronator teres':'cơ sấp tròn',
 'flexor digitorum superficialis':'cơ gấp các ngón nông',
 'triceps brachii':'cơ tam đầu cánh tay',
 'biceps brachii':'cơ nhị đầu cánh tay',
 'abductor pollicis longus':'cơ dạng ngón cái dài',
 'extensor carpi radialis brevis':'cơ duỗi cổ tay quay ngắn',
 'extensor carpi radialis longus':'cơ duỗi cổ tay quay dài',
 'extensor digiti minimi':'cơ duỗi ngón út',
 'extensor digitorum':'cơ duỗi các ngón',
 'extensor indicis':'cơ duỗi ngón trỏ',
 'extensor pollicis brevis':'cơ duỗi ngón cái ngắn',
 'extensor pollicis longus':'cơ duỗi ngón cái dài',
 'flexor carpi radialis':'cơ gấp cổ tay quay',
 'flexor digitorum profundus':'cơ gấp các ngón sâu',
 'flexor pollicis longus':'cơ gấp ngón cái dài',
 'palmaris longus':'cơ gan tay dài',
 'pronator quadratus':'cơ sấp vuông',
 'abductor pollicis brevis':'cơ dạng ngón cái ngắn',
 'flexor pollicis brevis':'cơ gấp ngón cái ngắn',
 'adductor pollicis':'cơ khép ngón cái',
 'opponens pollicis':'cơ đối ngón cái',
 'abductor digiti minimi':'cơ dạng ngón út',
 'flexor digiti minimi brevis':'cơ gấp ngón út ngắn',
 'opponens digiti minimi':'cơ đối ngón út',
 'set of dorsal interossei':'nhóm cơ gian cốt mu tay',
 'set of palmar interossei':'nhóm cơ gian cốt gan tay',
};
export function upperLimbName(name){
 name=name.replace(/^(Abductor digiti minimi|Flexor digiti minimi brevis|Opponens digiti minimi|Set of dorsal interossei|Set of palmar interossei) of (left|right) hand$/,(_,muscle,side)=>side+' '+muscle.toLowerCase());
 const match=name.match(/^(?:(Humeral|Ulnar|Lateral|Long|Medial|Oblique|Transverse|Superficial|Deep) head of )?(Left|Right|left|right) (.+)$/);
 if(!match||!muscles[match[3]])return null;
 const heads={Humeral:'Đầu cánh tay',Ulnar:'Đầu trụ',Lateral:'Đầu ngoài',Long:'Đầu dài',Medial:'Đầu trong',Oblique:'Đầu chéo',Transverse:'Đầu ngang',Superficial:'Đầu nông',Deep:'Đầu sâu'};
 const muscle=muscles[match[3]];
 return (match[1]?heads[match[1]]+' — '+muscle:muscle[0].toUpperCase()+muscle.slice(1))+(match[2].toLowerCase()==='left'?' (trái)':' (phải)');
}
