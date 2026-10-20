const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const packages = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8')).packages;
let checks = 0;
for (const key of Object.keys(packages)) {
  const folder = path.join(root, key);
  if (!key || !fs.existsSync(path.join(folder, 'package.json'))) continue;
  const { name, version } = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
  if (name === 'braces' && version === '3.0.3') {
    const braces = require(folder);
    assert.deepEqual(braces.expand('file-{a,b}.js'), ['file-a.js', 'file-b.js']);
    const nested = '{'.repeat(200) + 'x,y' + '}'.repeat(200);
    assert.throws(() => braces(nested), /nesting exceeds/);
    let ast = { type: 'text', value: 'x' };
    for (let i = 0; i < 200; i++) ast = { type: 'brace', nodes: [ast] };
    for (const method of ['compile', 'expand', 'stringify']) assert.throws(() => braces[method](ast), /AST exceeds/);
    checks++;
  }
  if (name === 'node-forge' && version === '1.4.0') {
    const forge = require(folder), asn1 = forge.asn1;
    const keys = forge.pki.rsa.generateKeyPair({ bits: 1024, e: 65537 });
    const md = forge.md.sha256.create().update('Soma security regression');
    const digest = md.digest().getBytes();
    assert.equal(keys.publicKey.verify(digest, keys.privateKey.sign(md)), true);
    const create = (type, constructed, value) => asn1.create(asn1.Class.UNIVERSAL, type, constructed, value);
    const algorithm = create(asn1.Type.SEQUENCE, true, [create(asn1.Type.OID, false, asn1.oidToDer(forge.oids.sha256).getBytes()), create(asn1.Type.NULL, false, ''), create(asn1.Type.OCTETSTRING, false, 'unexpected')]);
    const malformed = asn1.toDer(create(asn1.Type.SEQUENCE, true, [algorithm, create(asn1.Type.OCTETSTRING, false, digest)])).getBytes();
    const signature = keys.privateKey.sign(malformed, 'NONE');
    assert.throws(() => keys.publicKey.verify(digest, signature), /DigestInfo/);
    checks++;
  }
  if (name === 'decode-uri-component' && version === '0.2.2') {
    const decode = require(folder);
    assert.equal(decode('gi%E1%BA%A3i+ph%E1%BA%ABu'), 'giải phẫu');
    assert.equal(decode('%C2'), '\uFFFD');
    const malformed = '%FF'.repeat(1000);
    assert.equal(decode(malformed), malformed);
    assert.equal(decode('%E0%A4%A'), '%E0%A4%A');
    checks++;
  }
  if (name === 'sprintf-js' && version === '1.0.3') {
    const { sprintf } = require(folder);
    assert.equal(sprintf('%.2f', 1.234), '1.23');
    assert.throws(() => sprintf('%1000000000s', 'x'), /exceeds 10000/);
    assert.throws(() => sprintf('%.1000000000f', 1), /exceeds 10000/);
    checks++;
  }
}
console.log(`PASS: ${checks} installed dependency security mitigations and ordinary input cases.`);
