import React from "react";
import '../../styles/mypage.css';
import { CiViewList } from "react-icons/ci";
import { TbUserEdit } from "react-icons/tb";
import { FiUserPlus, FiUserX } from "react-icons/fi";

function Mypage() ㅇ
    let list = ["가입한 동아리", "작성한 글 보기", "정보 수정", "동아리 만들기", "회원 탈퇴"];
    let icon = [<CiViewList />, <CiViewList />, <TbUserEdit />, <FiUserPlus />, <FiUserX />];
    return (
        <div className="Mypage">
            <div className="propyl">
                <div className="title">
                    <p>내 프로필</p>
                    <button>로그아웃</button>
                </div>
                <img src='https://w7.pngwing.com/pngs/384/868/png-transparent-person-profile-avatar-user-basic-ui-icon.png'/>
                <div className="info">
                    <p style={{paddingTop:"5px", fontSize:"20px"}}>치약은 달다</p>
                    <p style={{fontSize:"17px", marginLeft:"2px"}}>2020000000</p>
                </div>
            </div>
            <div className="list">
                {
                    list.map((a, i) => {
                        return (
                            <List list={list[i]} icon={icon[i]}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

function List(props) {
    return (
        <div className="join_club">
            {props.icon}
            <p>{props.list}</p>
        </div>
    )
}

export default Mypage;