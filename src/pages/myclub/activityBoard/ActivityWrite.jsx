import React from 'react';
import { useParams } from "react-router-dom";
import PostWrite from '../component/PostWrite';

function ActivityWrite() {
    let { id } = useParams();

    return (
        <PostWrite
            boardType="활동 게시판"
            apiEndpoint={`/board/3/club/${id}/posts`}
            navigateBackPath={`/clubs/${id}/activityList`}
        />
    );
}

export default ActivityWrite;