export function setNoScalableViewport(currentWindow) {
  const currentDocument = currentWindow.document;
  const isMobile = currentWindow.innerWidth < 640 || currentWindow.innerHeight < 510;
  const metaContent = isMobile
    ? 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no'
    : 'width=device-width,initial-scale=1';
  const meta = currentDocument.querySelector('meta[name="viewport"]');
  const oldMetaContent = meta && meta.content;

  if (meta) {
    meta.setAttribute('content', metaContent);
    meta.dataset.oldMetaContent = oldMetaContent;

    return;
  }

  const newMeta = currentDocument.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', metaContent);
  currentDocument.head.appendChild(newMeta);
}

export function unsetNoScalableViewport(currentWindow) {
  const currentDocument = currentWindow.document;
  const meta = currentDocument.querySelector('meta[name="viewport"]');

  if (meta && meta.dataset) {
    meta.setAttribute('content', meta.dataset.oldMetaContent || '');
  }
}
