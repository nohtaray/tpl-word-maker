const ts = new Tsuikyo({
  flex: 'flex',
  prevent: false,
  im: 'roma',
});

const makeTPLFile = (kanas, romas) => {
  const BOM = '\uFEFF';
  let contents = BOM + `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Words xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Statistics time="0001-01-01T00:00:00" key1="0" key2="0" key3="0" bestSec2="9.99" bestKpm2="0" bestKpm3="0" try2="0" try3="0"/>
  <Ranking2/>
  <Ranking3/>
`;
  for (let i = 0; i < kanas.length; i++) {
    // 英語は roman に全部入れないと c/k 打ち分けできたり最後の n を2個打たないといけなくなる
    const kana = kanas[i].match(/^[\x20-\x7E]*$/) ? '' : kanas[i];
    contents += `<Word word="${kana}" roman="${romas[i]}" best1="0" best2="0" best3="0" star="0" try="0"/>` + '\n';
  }
  contents += '</Words>';

  return new Blob([contents], { 'type': 'application/xml' });
};

document.querySelector('#submit').addEventListener('click', () => {
  const kanas = document.querySelector('#kana').value.split(/\n+/).filter(s => s.length);
  const romas = kanas.map(k => ts.make(k).kstr()).map(r => {
    let ret = r;
    if (document.querySelector('#lowercase').checked) ret = ret.toLowerCase();
    if (document.querySelector('#remove-spaces').checked) ret = ret.replace(/\s/g, '');
    return ret;
  });

  const a = document.createElement('a');
  a.download = 'xxx.tpl';
  a.href = window.URL.createObjectURL(makeTPLFile(kanas, romas));
  a.click();
}, false);
