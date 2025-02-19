import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichTextEditor.css';

export default function RichTextEditor(props) {
  return <Editor {...props} />;
}
