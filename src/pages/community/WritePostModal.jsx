import React, { useState } from 'react';
import './community_styles/writepostmodal.css';

function WritePostModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (title && content) {
            onSubmit({ title, content });
            setTitle('');
            setContent('');
        }
    };

    return (
        <div className="post-edit-overlay">
            <div className="post-edit">
                <header className="edit-header">
                    <span onClick={onClose} className="edit-cancel">X</span>
                    <h2 className="edit-title">글쓰기</h2>
                    <span onClick={handleSubmit} className="edit-save">✓</span>
                </header>
                <hr style={{ marginTop: '-30px' }}/>
                <div className="edit-form">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <hr/>
                    <textarea
                        placeholder="내용을 입력하세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', height: 'calc(100vh - 200px)', padding: '5px' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default WritePostModal;