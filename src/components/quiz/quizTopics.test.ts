import assert from 'node:assert/strict';
import { test } from 'node:test';
import { quizExamTitle, sourceDisplayLabel } from './quizTopics';
import { drLamCatalog } from '@/lib/anatomy/drLamBank';

test('source titles stay neutral even when the published catalog contains an older label',()=>{
  const entry={...drLamCatalog.exams[0],id:'custom',title:'Đề ôn tập Dr. Lâm'};
  assert.equal(quizExamTitle(entry),'Đề ôn tập');
  assert.equal(entry.title,'Đề ôn tập Dr. Lâm');
  assert.equal(sourceDisplayLabel('Tài liệu Dr.Lâm.pdf'),'Tài liệu.pdf');
});
