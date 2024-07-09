const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

let member_info_data = [
    {
        memberId: 1,
        img: images("./member1.png"),
        name: "도라에몽",
        studentNum: 2021000001,
        major: "컴퓨터공학부",
        role: "회장",
        phone: "010-0000-0001",
        password: 1234
    },
    {
        memberId: 2,
        img: images("./member2.png"),
        name: "진구",
        studentNum: 2021000002,
        major: "컴퓨터공학부",
        role: "부회장",
        phone: "010-0000-0002",
        password: 1234
    },
    {
        memberId: 3,
        img: images("./member3.png"),
        name: "퉁퉁이",
        studentNum: 2021100003,
        major: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0003",
        password: 1234
    },
    {
        memberId: 4,
        img: images("./member4.png"),
        name: "비실이",
        studentNum: 2021100004,
        major: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0004",
        password: 1234
    }
];

export default member_info_data;