//동아리 공지사항 - 글 목록
import React, {useState, useEffect} from 'react';
import '../DetailHeader/myclubheader.css'
import './notice.css';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import {Link, useNavigate, useParams} from "react-router-dom";

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function NoticeList(){
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    //공지사항 리스트 API 조회
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch(`http://3.36.56.20:8080/clubs/${id}/board/2/posts`);
                if (response.ok) {
                    const data = await response.json();

                    // 작성자 정보 가져옴
                    const noticesWithAuthors = await Promise.all(
                        data.map(async (notice) => {
                            // 각 postId를 사용하여 상세 정보 API를 호출
                            const detailResponse = await fetch(`http://3.36.56.20:8080/clubs/${id}/board/2/posts/${notice.postId}`);
                            if (detailResponse.ok) {
                                const detailData = await detailResponse.json();
                                return {
                                    ...notice,
                                    authorName: detailData.member.name, // 작성자 이름 추가
                                    authorId: detailData.member.id // 작성자 ID 추가
                                };
                            } else {
                                console.error(`게시글 ${notice.postId}의 상세 정보 조회 실패`, detailResponse.status);
                                return notice; // 실패 시 기존 데이터 유지
                            }
                        })
                    );
                    setList(noticesWithAuthors);
                } else {
                    console.error("공지사항 리스트 조회 실패", response.status);
                }
            } catch (error) {
                console.error('공지사항 리스트 가져오는 중 에러 발생', error);
            }
        };
        fetchNotices();
    }, [id]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/noticelist/noticewrite`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>공지사항</div>
                <FiEdit
                    onClick={handleWriteClick}
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                />
            </div>
            <div className="scrolll-container">
                <div className="notice_list">
                    {list.length > 0 ? (
                        list.map((notice, index) => (
                            <div key={index} className="post">
                                <Link to={`/clubs/${id}/board/2/posts/${notice.postId}?memberId=${notice.authorId}`}>
                                    <p className="title">{notice.title}</p>
                                    <p className="content">{notice.content}</p>
                                    <p className="createdAt">{notice.authorName} | {formatDate(notice.createdAt)}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>작성된 공지사항이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NoticeList;
