import React, {useEffect, useState} from "react";
import axios from "axios";
import './written_post.css'
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import written_post_data from "./written_post_data.jsx";
import member_info_data from "../../../data/member_info_data.jsx";

function Written_post() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    // 임의로 설정한 memberId의 member, member가 작성한 글 조회 -> 나중에 삭제
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));
    const [list] = useState(written_post_data.filter(post => post.author === parseInt(memberId, 10)));

//    const [member, setMember] = useState(null);  // 회원 정보를 저장할 상태
//    const [list, setList] = useState([]);  // 작성한 글 목록을 저장할 상태

    // 회원 정보와 작성한 글 목록을 가져오는 API
//    useEffect(() => {
//        // 회원 정보를 조회
//        axios.get(`/members/${memberId}`)
//            .then(response => {
//                setMember(response.data);
//            })
//            .catch(error => {
//                console.error('Error fetching member data:', error);
//            });
//
//        // 작성한 글 목록을 조회
//        axios.get(`/posts/${memberId}`)
//             .then(response => {
//                 setList(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching posts data:', error);
//             });
//    }, [memberId]);

    return (
        <div className="Written_post">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>작성한 글 보기</p>
            </div>
            <div className="written_post_list">
                {
                    list.map((a, i) => {
                        return (
                            <List key={i} title={a.title} content={a.content} date={a.date} link={a.link} />
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({title, content, date, link}) {
    const navigate = useNavigate();
    return (
        <div className="post_list" onClick={() => navigate(link)}>
            <p className="title">{title}</p>
            <p className="content">{content}</p>
            <p className="date">{date}</p>
        </div>
    )
}

export default Written_post;