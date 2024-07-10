import React, {useState} from "react";
import './written_post.css'
import {Link, useNavigate} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import written_post_data from "./written_post_data.jsx";

function Written_post() {
    const navigate = useNavigate();
    let [list] = useState(written_post_data);

    return (
        <div className="Written_post">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer' }}
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
    return (
        <div className="post">
            <Link to={link}>
                <p className="title">{title}</p>
                <p className="content">{content}</p>
                <p className="date">{date}</p>
            </Link>
        </div>
    )
}

export default Written_post;