import React from 'react';
import { useParams } from "react-router-dom";
import PostWrite from '../component/PostWrite';

function NoticeWrite() {
    let { id } = useParams();

    return (
        <PostWrite
            boardType="공지사항"
            apiEndpoint={`/club/${id}/board/2/posts`}
            navigateBackPath={`/clubs/${id}/noticelist`}
        />
    );
}

export default NoticeWrite;