const $ = (id) => document.getElementById(id);
let img = null, processedBlob = null, processedUrl = null, processedName = 'picfit-image';
function refreshStatus(){
  $('statusBar').textContent = 'Free version: unlimited downloads for now. A Pro plan will be added later.';
}
$('fileInput').addEventListener('change', (e) => {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f);
  img = new Image();
  img.onload = () => { $('origInfo').textContent = 'Original: ' + img.naturalWidth + ' x ' + img.naturalHeight + ' px, ' + Math.round(f.size/1024) + ' KB'; };
  img.src = url; processedName = f.name.replace(/\.[^.]+$/, '') || 'picfit-image';
});
$('quality').addEventListener('input', (e) => { $('qVal').textContent = e.target.value + '%'; });
$('processBtn').addEventListener('click', () => {
  if (!img) { alert('Please upload an image first.'); return; }
  let w = img.naturalWidth, h = img.naturalHeight;
  const preset = parseInt($('preset').value, 10) || 0;
  const custom = parseInt($('customWidth').value, 10) || 0;
  const target = custom > 0 ? custom : preset;
  if (target > 0 && w > target) { h = Math.round(h * target / w); w = target; }
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(img, 0, 0, w, h);
  const fmt = $('format').value; const q = parseInt($('quality').value, 10) / 100;
  c.toBlob((b) => {
    if (!b) { alert('Could not process this image. Try JPG or PNG.'); return; }
    processedBlob = b;
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    processedUrl = URL.createObjectURL(b);
    $('previewImg').src = processedUrl;
    const ext = fmt === 'image/png' ? 'png' : (fmt === 'image/webp' ? 'webp' : 'jpg');
    $('procInfo').textContent = 'Ready: ' + w + ' x ' + h + ' px, ' + Math.round(b.size/1024) + ' KB, format ' + ext.toUpperCase();
    $('previewCard').hidden = false;
    $('previewCard').scrollIntoView({behavior:'smooth'});
  }, fmt, q);
});
$('downloadBtn').addEventListener('click', () => {
  if (!processedBlob) { alert('Please click “Make it ready” first.'); return; }
  const a = document.createElement('a'); a.href = processedUrl;
  const fmt = $('format').value; const ext = fmt === 'image/png' ? 'png' : (fmt === 'image/webp' ? 'webp' : 'jpg');
  a.download = processedName + '-picfit.' + ext; document.body.appendChild(a); a.click(); a.remove();
});
refreshStatus();
