const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

let member_info_data = [
    {
        memberId: 101,
        img: images("./member1.png"),
        name: "도라에몽",
        studentNum: 2021000001,
        major: "컴퓨터공학부",
        role: "회장",
        phone: "010-0000-0001",
        password: 1234,
        content: "지원 동기 1",
        link: "/clubs/:id/joinRequest/101"
    },
    {
        memberId: 102,
        img: images("./member2.png"),
        name: "진구",
        studentNum: 2021000002,
        major: "컴퓨터공학부",
        role: "부회장",
        phone: "010-0000-0002",
        password: 1234,
        content: "지원 동기 2",
        link: "/clubs/:id/joinRequest/102"
    },
    {
        memberId: 103,
        img: images("./member3.png"),
        name: "퉁퉁이",
        studentNum: 2021100003,
        major: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0003",
        password: 1234,
        content: "지원 동기 3",
        link: "/clubs/:id/joinRequest/103"
    },
    {
        memberId: 104,
        img: images("./member4.png"),
        name: "비실이",
        studentNum: 2021100004,
        major: "컴퓨터공학부",
        role: "일반",
        phone: "010-0000-0004",
        password: 1234,
        content: "지원 동기 4",
        link: "/clubs/:id/joinRequest/104"
    }
];

export default member_info_data;