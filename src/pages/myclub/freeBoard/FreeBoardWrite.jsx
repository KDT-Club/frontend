import React from 'react';
import { useParams } from "react-router-dom";
import PostWrite from '../component/PostWrite';

function FreeBoardWrite() {
    let { id } = useParams();

    return (
        <PostWrite
            boardType="자유게시판"
            apiEndpoint={`/club/${id}/board/4/posts`}
            navigateBackPath={`/clubs/${id}/freeboardlist`}
        />
    );
}

export default FreeBoardWrite;