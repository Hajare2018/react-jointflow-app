import React from 'react';
import {
  convertFromHTML as draftConvertFromHTML,
  convertToHTML as draftConvertToHTML,
} from 'draft-convert';

export const convertFromHTML = draftConvertFromHTML({
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a') {
      return createEntity('LINK', 'MUTABLE', { url: node.href, targetOption: node.target });
    }
  },
});

export const convertToHTML = draftConvertToHTML({
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return (
        <a
          target={entity.data.targetOption || '_self'}
          href={entity.data.url}
        >
          {originalText}
        </a>
      );
    }
    return originalText;
  },
});
